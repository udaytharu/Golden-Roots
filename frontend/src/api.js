import { PRODUCTS } from './data/products';

const configuredBase = String(import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
export const API_BASE_URL = configuredBase || '';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const responseText = response.status === 204 ? '' : await response.text();
  let body = null;
  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      throw new Error('The API returned an invalid response. Check the backend URL and deployment.');
    }
  }
  if (!response.ok) throw new Error(body?.error || 'Request failed');
  return body;
}

export async function fetchProducts() {
  try {
    const result = await apiRequest('/products');
    return { products: result.products, fromApi: true };
  } catch {
    return { products: PRODUCTS, fromApi: false };
  }
}