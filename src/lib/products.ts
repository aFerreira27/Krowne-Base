import type { Product } from './types';
import { getDB } from '@/lib/db';
import { Pool } from 'pg';
import { sanitizeProduct } from './sanitize';

// This function interacts directly with the database to add a product.
// It returns the raw database row. Sanitization happens at the API boundary.
export async function addProduct(productData: Omit<Product, 'id' | 'related_products'>): Promise<any> {
  const db = await getDB();
  const result = await db.query(
    'INSERT INTO products (name, sku, series, description, standard_features, images, specifications, documentation, compliance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [
      productData.name,
      productData.sku,
      productData.series,
      productData.description || null,
      productData.standard_features || null,
      productData.images && productData.images.length > 0 ? productData.images : null,
      productData.specifications && productData.specifications.length > 0 ? JSON.stringify(productData.specifications) : null,
      productData.documentation && productData.documentation.length > 0 ? JSON.stringify(productData.documentation) : null,
      productData.compliance && productData.compliance.length > 0 ? JSON.stringify(productData.compliance) : null,
    ]
  );
  return result.rows[0];
}


// This function interacts directly with the database to update a product.
// It returns the raw database row. Sanitization happens at the API boundary.
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
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    
    values.push(id);
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${fieldIndex} RETURNING *`;

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}

// This function interacts directly with the database to delete a product.
export async function deleteProduct(id: string): Promise<any | null> {
  const db = await getDB();
  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
}

// Gets a single product directly from the database.
// This is a server-only function.
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = await getDB();
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    const product = sanitizeProduct(result.rows[0]);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id} from DB:`, error);
    // In a real app, you might want more sophisticated error handling or logging
    throw new Error('Failed to fetch product from database.');
  }
}

// Gets all products, with an optional search query.
// This is a server-only function.
export async function getProducts(query?: string): Promise<Product[]> {
    try {
        const db = await getDB();
        let selectQuery = 'SELECT * FROM products';
        const queryParams: string[] = [];

        if (query) {
            selectQuery += ' WHERE name ILIKE $1 OR sku ILIKE $1 OR description ILIKE $1';
            queryParams.push(`%${query}%`);
        }
        
        selectQuery += ' ORDER BY name';

        const result = await db.query(selectQuery, queryParams);
        const products = result.rows.map(sanitizeProduct);
        
        return products;
    } catch (error) {
        console.error('Error fetching products from DB:', error);
        throw new Error('Failed to fetch products from database.');
    }
}
