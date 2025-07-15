import { updateProduct, deleteProduct } from '@/lib/products';
import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sanitizeProduct } from '@/lib/sanitize';

// GET a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const db = await getDB();
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const product = sanitizeProduct(result.rows[0]);
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
        const updatedProductRow = await updateProduct(id, productData);
        
        if (!updatedProductRow) {
            return NextResponse.json({ error: 'Product not found or failed to update' }, { status: 404 });
        }
        
        const updatedProduct = sanitizeProduct(updatedProductRow);
        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error(`Error updating product ${id}:`, error);
        return NextResponse.json({ error: 'Failed to update product', details: (error as Error).message }, { status: 500 });
    }
}

// DELETE a product by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error)
 {
    console.error(`Error deleting product ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete product', details: (error as Error).message }, { status: 500 });
  }
}
