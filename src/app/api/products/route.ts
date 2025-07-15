
import { getDB } from '@/lib/db';
import { addProduct } from '@/lib/products';
import { NextResponse } from 'next/server';
import { sanitizeProduct } from '@/lib/sanitize';

// GET all products
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
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
        
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products', details: (error as Error).message }, { status: 500 });
    }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const result = await addProduct(productData);

    return NextResponse.json({ message: 'Product created successfully', productId: result.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product', details: (error as Error).message }, { status: 500 });
  }
}
