
import { addProduct, getProducts } from '@/lib/products';
import { NextResponse } from 'next/server';
import { sanitizeProduct } from '@/lib/sanitize';
import { apiErrorHandler } from '@/lib/apiErrorHandler';

// GET all products
export const GET = apiErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const products = await getProducts(query || undefined);

  return NextResponse.json(products);
});


// POST a new product
export const POST = apiErrorHandler(async (request: Request) => {
  const productData = await request.json();
  const newProduct = await addProduct(productData);
  const sanitizedProduct = sanitizeProduct(newProduct);

  return NextResponse.json({ message: 'Product created successfully', product: sanitizedProduct }, { status: 201 });
});
