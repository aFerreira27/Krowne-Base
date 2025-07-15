import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const db = await getDB();
    const result = await db.query('SELECT id, name, sku, series, description, images, specifications, documentation, standard_features, compliance, related_products FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const product = result.rows[0];
    // Ensure array fields are never null
    if (!product.images) {
        product.images = [];
    }
    if (!product.compliance) {
        product.compliance = [];
    }
    if (!product.related_products) {
      product.related_products = [];
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch product', details: (error as Error).message }, { status: 500 });
  }
}

// PUT (update) a product by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const productData = await request.json();
        const db = await getDB();

        // Construct the update query dynamically based on provided fields
        const fields = [];
        const values = [];
        let fieldIndex = 1;

        for (const [key, value] of Object.entries(productData)) {
            if (key !== 'id') { // Don't try to update the ID
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
            return NextResponse.json({ message: 'No fields to update' }, { status: 200 });
        }
        
        values.push(id); // For the WHERE clause
        const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${fieldIndex} RETURNING id, name, sku, series, description, images, specifications, documentation, standard_features, compliance, related_products`;

        const result = await db.query(query, values);
        
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found or failed to update' }, { status: 404 });
        }
        
        const product = result.rows[0];
        // Ensure array fields are never null
        if (!product.images) {
            product.images = [];
        }
        if (!product.compliance) {
            product.compliance = [];
        }
        if (!product.related_products) {
            product.related_products = [];
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error(`Error updating product ${id}:`, error);
        return NextResponse.json({ error: 'Failed to update product', details: (error as Error).message }, { status: 500 });
    }
}

// DELETE a product by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const db = await getDB();
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error)
 {
    console.error(`Error deleting product ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete product', details: (error as Error).message }, { status: 500 });
  }
}
