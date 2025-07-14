import type { Product } from './types';
import { getDB } from '@/lib/db';

export async function getProducts(query?: string): Promise<Product[]> {
  const db = await getDB();
  let selectQuery = 'SELECT id, name, sku, series, description, images, specifications, documentation, standard_features, compliance, related_products FROM products';
  const queryParams: string[] = [];

  if (query) {
    selectQuery += ' WHERE name ILIKE $1 OR sku ILIKE $1 OR description ILIKE $1';
    queryParams.push(`%${query}%`);
  }

  const result = await db.query(selectQuery, queryParams);
  return result.rows;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDB();
  const result = await db.query('SELECT id, name, sku, series, description, images, specifications, documentation, standard_features, compliance, related_products FROM products WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function addProduct(productData: Omit<Product, 'id' | 'relatedProducts'>): Promise<{productId: string}> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || 'Failed to create product');
  }
  return response.json();
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to update product');
    }
    return response.json();
}

export async function clearProducts(): Promise<{ message: string }> {
  const response = await fetch('/api/products/all', {
    method: 'DELETE',
  });

   if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || 'Failed to clear products');
  }
  return response.json();
}
