import type { Product } from './types';
import { getDB } from '@/lib/db';
import { Pool } from 'pg';
import { sanitizeProduct } from './sanitize';

// Note: This function is now directly manipulating the DB, not calling fetch.
export async function addProduct(productData: Omit<Product, 'id' | 'related_products'>): Promise<Product> {
  const db = await getDB();
  const result = await db.query(
    'INSERT INTO products (name, sku, series, description, standard_features, images, specifications, documentation, compliance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [
      productData.name,
      productData.sku,
      productData.series,
      productData.description || '',
      productData.standard_features || '',
      productData.images || [], // Ensure array
      JSON.stringify(productData.specifications || []), // Ensure array and stringify
      JSON.stringify(productData.documentation || []), // Ensure array and stringify
      JSON.stringify(productData.compliance || []),   // Ensure array and stringify
    ]
  );
  return sanitizeProduct(result.rows[0]);
}


// Note: This function is now directly manipulating the DB, not calling fetch.
export async function updateProduct(id: string, productData: Partial<Product>): Promise<any | null> {
    const db = await getDB();

    const fields = [];
    const values = [];
    let fieldIndex = 1;

    for (const [key, value] of Object.entries(productData)) {
      if (key !== 'id') {
        fields.push(`${key} = $${fieldIndex}`);
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        fieldIndex++;
      }
    }
    
    if (fields.length === 0) {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    }
    
    values.push(id);
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${fieldIndex} RETURNING *`;

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}

export async function deleteProduct(id: string): Promise<any | null> {
  const db = await getDB();
  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
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
