
import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all products
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    try {
        const db = await getDB();
        let selectQuery = 'SELECT id, name, sku, series, description, images, specifications, documentation, standard_features, compliance, related_products FROM products';
        const queryParams = [];

        if (query) {
            selectQuery += ' WHERE name ILIKE $1 OR sku ILIKE $1 OR description ILIKE $1';
            queryParams.push(`%${query}%`);
        }
        
        const result = await db.query(selectQuery, queryParams);
        
        // Sanitize product data to ensure array fields are never null
        const sanitizedProducts = result.rows.map(product => ({
            ...product,
            images: product.images || [],
            compliance: product.compliance || [],
            related_products: product.related_products || [],
            specifications: product.specifications || [],
            documentation: product.documentation || [],
        }));

        return NextResponse.json(sanitizedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products', details: (error as Error).message }, { status: 500 });
    }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const db = await getDB();

    const result = await db.query(
      'INSERT INTO products (name, sku, series, description, standard_features, images, specifications, documentation, compliance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [
        productData.name,
        productData.sku,
        productData.series,
        productData.description,
        productData.standard_features,
        JSON.stringify(productData.images.map((img: {url: string}) => img.url)),
        JSON.stringify(productData.specifications),
        JSON.stringify(productData.documentation),
        JSON.stringify(productData.compliance),
      ]
    );

    return NextResponse.json({ message: 'Product created successfully', productId: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product', details: (error as Error).message }, { status: 500 });
  }
}
