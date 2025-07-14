import { Pool } from 'pg';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

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

const getIpType = (): IpAddressTypes | undefined =>
  (process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true' ? IpAddressTypes.PRIVATE : IpAddressTypes.PUBLIC) as IpAddressTypes;

// Function to connect to the database using the Cloud SQL Connector
const connectWithConnector = async () => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: getIpType(),
  });

  return new Pool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
};

// Initialize the connection pool
// We'll initialize the pool inside the POST handler or lazily to avoid issues in a serverless environment
let pool: Pool | null = null;


export async function POST(request: Request) {
  if (request.method === 'POST') {
    try {
      const productData = await request.json();
      // Lazily initialize the pool if it hasn't been already
      if (!pool) {
        pool = await connectWithConnector();
      }
      const result = await pool.query(
        'INSERT INTO products (name, sku, series, description, standard_features, images, specifications, documentation, compliance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        [
          productData.name,
          productData.sku,
          productData.series,
          productData.description || null,
          productData.standardFeatures || null,
          JSON.stringify(productData.images),
          JSON.stringify(productData.specifications),
          JSON.stringify(productData.documentation),
          JSON.stringify(productData.compliance),
        ]
      );
      return new Response(JSON.stringify({ message: 'Product created successfully', productId: result.rows[0].id }), { status: 201 });
    } catch (error) {
      console.error('Error creating product:', error);
      return new Response(JSON.stringify({ error: 'Failed to create product', details: (error as Error).message  }), { status: 500 });
    }
  } else {
    // Handle other HTTP methods if needed
    return new Response(null, { status: 405 }); // Method Not Allowed
  }
}