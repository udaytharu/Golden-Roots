export const SHIPPING_COST = 0;
export const TAX_RATE = 0;

export function getProduct(id, products) {
  return products.find((product) => product.id === id);
}

export function calculateOrder(items, promoCode, products, promos) {
  const normalizedItems = items.map(({ id, qty }) => {
    const product = getProduct(id, products);
    const quantity = Number(qty);

    if (!product) throw new Error(`Unknown product: ${id}`);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error(`Invalid quantity for ${id}`);
    }
    if (quantity > product.stock) throw new Error(`${product.name} is out of stock`);

    return {
      id: product.id,
      name: product.name,
      qty: quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
    };
  });

  if (!normalizedItems.length) throw new Error('Order must contain at least one item');

  const code = String(promoCode || '').trim().toUpperCase();
  const promo = promos.find((entry) => entry.code === code && entry.active);
  const discountRate = promo?.discount || 0;
  if (code && !discountRate) throw new Error('Invalid promo code');

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = Math.round(subtotal * discountRate);
  const total = Math.max(0, subtotal - discount);

  return {
    items: normalizedItems,
    promoCode: code || null,
    subtotal,
    discount,
    shipping: SHIPPING_COST,
    tax: 0,
    total,
  };
}
