import type { Product } from './types';

const API_BASE_URL = '/api';

// This function can be called from client components to fetch a single product.
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch product' }));
      throw new Error(errorData.details || errorData.error || 'Failed to fetch product');
    }
    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    // Re-throw or handle as appropriate for the client-side context
    throw error;
  }
}

export async function addProduct(productData: Omit<Product, 'id' | 'related_products'>): Promise<{ productId: string }> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.details || errorBody.error || 'Failed to create product');
  }
  return response.json();
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.details || errorBody.error || 'Failed to update product');
  }
  return response.json();
}
