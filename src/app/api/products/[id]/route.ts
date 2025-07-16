import { updateProduct, deleteProduct } from '@/lib/products';
import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sanitizeProduct } from '@/lib/sanitize';
import { apiErrorHandler } from '@/lib/apiErrorHandler';

// GET a single product by ID
export const GET = apiErrorHandler(async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = await params;
  const db = await getDB();
  const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  const product = sanitizeProduct(result.rows[0]);
  return NextResponse.json(product);
});

// PUT (update) a product by ID
export const PUT = apiErrorHandler(async (request: Request, { params }: { params: { id: string } }) => {
    const { id } = await params;
    const productData = await request.json();
    const updatedProductRow = await updateProduct(id, productData);
    
    if (!updatedProductRow) {
        return NextResponse.json({ error: 'Product not found or failed to update' }, { status: 404 });
    }
    
    const updatedProduct = sanitizeProduct(updatedProductRow);
    return NextResponse.json(updatedProduct);
});

// DELETE a product by ID
export const DELETE = apiErrorHandler(async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = await params;
  const deletedProduct = await deleteProduct(id);
  if (!deletedProduct) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Product deleted successfully' });
});
