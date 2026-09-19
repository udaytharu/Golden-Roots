import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { calculateOrder } from './catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(__dirname, '..', 'data');
const ordersFile = path.join(dataDirectory, 'orders.json');
const paymentProofsDirectory = path.join(dataDirectory, 'payment-proofs');
const productsFile = path.join(dataDirectory, 'products.json');
const promosFile = path.join(dataDirectory, 'promos.json');
const adminTokenFile = path.join(dataDirectory, 'admin-token.json');
const app = express();
const port = Number(process.env.PORT) || 4000;
const fallbackAdminToken = process.env.ADMIN_TOKEN || 'golden-roots-admin';

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '7mb' }));
app.use('/api/payment-proofs', express.static(paymentProofsDirectory));

app.get('/', (_request, response) => {
  response.json({
    service: 'Golden Roots API',
    status: 'running',
    endpoints: ['/api/health', '/api/products', '/api/promos/validate', '/api/orders'],
  });
});

async function readOrders() {
  try {
    return JSON.parse(await fs.readFile(ordersFile, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeOrders(orders) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
}

async function readProducts() {
  return JSON.parse(await fs.readFile(productsFile, 'utf8'));
}

async function writeProducts(products) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
}

async function readPromos() {
  return JSON.parse(await fs.readFile(promosFile, 'utf8'));
}

async function writePromos(promos) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(promosFile, JSON.stringify(promos, null, 2));
}

async function readAdminToken() {
  try {
    const saved = JSON.parse(await fs.readFile(adminTokenFile, 'utf8'));
    return saved.token || fallbackAdminToken;
  } catch (error) {
    if (error.code === 'ENOENT') return fallbackAdminToken;
    throw error;
  }
}

async function writeAdminToken(token) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(adminTokenFile, JSON.stringify({ token }, null, 2));
}

async function requireAdmin(request, response, next) {
  if (request.get('x-admin-token') !== await readAdminToken()) {
    return response.status(401).json({ error: 'Admin authentication required' });
  }
  return next();
}

function customerFrom(body) {
  const customer = body.customer || {};
  const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province'];
  for (const field of required) {
    if (typeof customer[field] !== 'string' || !customer[field].trim()) {
      throw new Error(`${field} is required`);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    throw new Error('Enter a valid email');
  }
  return Object.fromEntries(
    [...required, 'postal', 'landmark', 'orderNotes'].map((field) => [field, String(customer[field] || '').trim()])
  );
}

async function savePaymentProof(paymentProof, orderId) {
  if (!paymentProof) return null;
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(paymentProof.data || ''));
  if (!match) throw new Error('Payment proof must be a JPG, PNG, or WebP image');
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) {
    throw new Error('Payment proof must be smaller than 5 MB');
  }
  const extension = match[1].split('/')[1].replace('jpeg', 'jpg');
  await fs.mkdir(paymentProofsDirectory, { recursive: true });
  const fileName = `${orderId}.${extension}`;
  await fs.writeFile(path.join(paymentProofsDirectory, fileName), buffer);
  return `/api/payment-proofs/${fileName}`;
}

function normalizeProduct(body, existingId = null) {
  const name = String(body?.name || '').trim();
  const id = existingId || String(body?.id || '').trim().toLowerCase();
  const price = Number(body?.price);
  const stock = Number(body?.stock ?? 0);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Product ID must use lowercase letters, numbers, and hyphens');
  if (!name) throw new Error('Product name is required');
  if (!Number.isFinite(price) || price < 0) throw new Error('Price must be a positive number');
  if (!Number.isInteger(stock) || stock < 0) throw new Error('Stock must be a whole number');
  return {
    id,
    name,
    desc: String(body?.desc || '').trim(),
    longDesc: String(body?.longDesc || body?.desc || '').trim(),
    img: String(body?.img || '/images/products/packets.jpeg').trim(),
    tag: String(body?.tag || '').trim(),
    category: ['best', 'new', 'normal'].includes(body?.category) ? body.category : 'normal',
    rating: Number(body?.rating) || 0,
    reviews: Number(body?.reviews) || 0,
    features: Array.isArray(body?.features) ? body.features.map(String).filter(Boolean) : [],
    stock,
  };
}

function normalizePromo(body, existingCode = null) {
  const code = existingCode || String(body?.code || '').trim().toUpperCase();
  const discount = Number(body?.discount);
  if (!/^[A-Z0-9]+$/.test(code)) throw new Error('Promo code must use letters and numbers only');
  if (!Number.isFinite(discount) || discount <= 0 || discount > 1) throw new Error('Discount must be between 1% and 100%');
  return { code, discount, label: String(body?.label || `${discount * 100}% off`).trim(), active: body?.active !== false };
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'golden-roots-api' });
});

app.get('/api/products', async (_request, response) => {
  response.json({ products: await readProducts() });
});

app.post('/api/promos/validate', (request, response) => {
  const code = String(request.body?.code || '').trim().toUpperCase();
  return readPromos().then((promos) => {
    const promo = promos.find((entry) => entry.code === code && entry.active);
    if (!promo) return response.status(400).json({ error: 'Invalid promo code' });
    return response.json(promo);
  });
});

app.post('/api/orders', async (request, response) => {
  try {
    const { items, promoCode, payment, paymentProof } = request.body || {};
    if (!['cod', 'esewa', 'khalti'].includes(payment)) throw new Error('Invalid payment method');
    if (!Array.isArray(items)) throw new Error('items must be an array');
    if (payment !== 'cod' && !paymentProof?.data) throw new Error('Payment screenshot is required');

    const customer = customerFrom(request.body);
    const pricing = calculateOrder(items, promoCode, await readProducts(), await readPromos());
    const order = {
      id: `GR-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customer,
      payment,
      ...pricing,
    };
    order.paymentProof = await savePaymentProof(paymentProof, order.id);

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);
    return response.status(201).json({ order });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (request, response) => {
  const orders = await readOrders();
  const order = orders.find((entry) => entry.id === request.params.id);
  if (!order) return response.status(404).json({ error: 'Order not found' });
  return response.json({ order });
});

app.get('/api/admin/summary', requireAdmin, async (_request, response) => {
  const orders = await readOrders();
  const soldOrders = orders.filter((order) => !['pending', 'cancelled'].includes(order.status));
  const sales = soldOrders.reduce((summary, order) => {
    summary.revenue += order.total || 0;
    summary.orders += 1;
    summary.items += order.items.reduce((count, item) => count + item.qty, 0);
    return summary;
  }, { revenue: 0, orders: 0, items: 0 });
  const byStatus = orders.reduce((summary, order) => {
    summary[order.status] = (summary[order.status] || 0) + 1;
    return summary;
  }, {});
  const salesByDay = Array.from({ length: 7 }, (_item, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: soldOrders.filter((order) => order.createdAt.slice(0, 10) === key).reduce((sum, order) => sum + order.total, 0),
    };
  });
  response.json({ totalOrders: orders.length, sales, byStatus, salesByDay });
});

app.get('/api/admin/orders', requireAdmin, async (_request, response) => {
  const orders = await readOrders();
  response.json({ orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

app.patch('/api/admin/orders/:id', requireAdmin, async (request, response) => {
  const allowedStatuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
  const status = String(request.body?.status || '').toLowerCase();
  if (!allowedStatuses.includes(status)) return response.status(400).json({ error: 'Invalid order status' });
  const orders = await readOrders();
  const order = orders.find((entry) => entry.id === request.params.id);
  if (!order) return response.status(404).json({ error: 'Order not found' });
  order.status = status;
  await writeOrders(orders);
  return response.json({ order });
});

app.patch('/api/admin/token', requireAdmin, async (request, response) => {
  const nextToken = String(request.body?.token || '').trim();
  if (nextToken.length < 8) return response.status(400).json({ error: 'Admin token must be at least 8 characters' });
  await writeAdminToken(nextToken);
  return response.json({ ok: true });
});

app.get('/api/admin/products', requireAdmin, async (_request, response) => {
  response.json({ products: await readProducts() });
});

app.get('/api/admin/promos', requireAdmin, async (_request, response) => {
  response.json({ promos: await readPromos() });
});

app.post('/api/admin/promos', requireAdmin, async (request, response) => {
  const promos = await readPromos();
  const promo = normalizePromo(request.body);
  if (promos.some((entry) => entry.code === promo.code)) return response.status(409).json({ error: 'Promo code already exists' });
  promos.push(promo);
  await writePromos(promos);
  return response.status(201).json({ promo });
});

app.put('/api/admin/promos/:code', requireAdmin, async (request, response) => {
  const promos = await readPromos();
  const index = promos.findIndex((entry) => entry.code === request.params.code.toUpperCase());
  if (index === -1) return response.status(404).json({ error: 'Promo code not found' });
  const promo = normalizePromo(request.body, promos[index].code);
  promos[index] = promo;
  await writePromos(promos);
  return response.json({ promo });
});

app.delete('/api/admin/promos/:code', requireAdmin, async (request, response) => {
  const promos = await readPromos();
  const nextPromos = promos.filter((entry) => entry.code !== request.params.code.toUpperCase());
  if (nextPromos.length === promos.length) return response.status(404).json({ error: 'Promo code not found' });
  await writePromos(nextPromos);
  return response.status(204).end();
});

app.post('/api/admin/products', requireAdmin, async (request, response) => {
  const products = await readProducts();
  const product = normalizeProduct(request.body);
  if (products.some((entry) => entry.id === product.id)) {
    return response.status(409).json({ error: 'Product ID already exists' });
  }
  products.push(product);
  await writeProducts(products);
  return response.status(201).json({ product });
});

app.put('/api/admin/products/:id', requireAdmin, async (request, response) => {
  const products = await readProducts();
  const index = products.findIndex((entry) => entry.id === request.params.id);
  if (index === -1) return response.status(404).json({ error: 'Product not found' });
  const product = normalizeProduct(request.body, request.params.id);
  products[index] = product;
  await writeProducts(products);
  return response.json({ product });
});

app.delete('/api/admin/products/:id', requireAdmin, async (request, response) => {
  const products = await readProducts();
  const nextProducts = products.filter((entry) => entry.id !== request.params.id);
  if (nextProducts.length === products.length) return response.status(404).json({ error: 'Product not found' });
  await writeProducts(nextProducts);
  return response.status(204).end();
});

app.use((_request, response) => response.status(404).json({ error: 'Route not found' }));

app.listen(port, () => {
  console.log(`Golden Roots API listening on http://localhost:${port}`);
});
