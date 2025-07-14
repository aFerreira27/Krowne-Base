import { neon } from '@neondatabase/serverless';

type ProductData = {
  name: string;
  sku: string;
  series: string;
  description?: string;
  standardFeatures?: string;
  images: { url: string; }[];
  specifications: { key: string; value: string; }[];
  documentation: { type: string; url: string; }[];
  compliance: any[]; // Adjust based on your actual compliance type
};

const db = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  if (request.method === 'POST') {
    try {
      const productData: ProductData = await request.json();
      const result = await db`
        INSERT INTO products (name, sku, series, description, standard_features, images, specifications, documentation, compliance)
        VALUES (
          ${productData.name},
          ${productData.sku},
          ${productData.series},
 ${productData.description || null},
 ${productData.standardFeatures || null},
          ${JSON.stringify(productData.images)},
          ${JSON.stringify(productData.specifications)},
          ${JSON.stringify(productData.documentation)},
          ${JSON.stringify(productData.compliance)}
        )
        RETURNING id`;

      return new Response(JSON.stringify({ message: 'Product created successfully', productId: result[0].id }), { status: 201 });
    } catch (error) {
      console.error('Error creating product:', error);
      return new Response(JSON.stringify({ error: 'Failed to create product', details: (error as Error).message  }), { status: 500 });
    }
  } else {
    // Handle other HTTP methods if needed
    return new Response(null, { status: 405 }); // Method Not Allowed
  }
}