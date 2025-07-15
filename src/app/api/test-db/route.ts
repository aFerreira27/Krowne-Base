import { Pool } from 'pg';
import { getDB } from '@/lib/db';

export async function GET(request: Request) {
  let pool: Pool | undefined;
  try {
    pool = await getDB();
    const result = await pool.query('SELECT 1');

    if (result.rows.length > 0) {
      return new Response(JSON.stringify({ message: 'Database connection successful!' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Database connection failed: SELECT 1 returned no rows' }), { status: 500 });
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
    return new Response(JSON.stringify({ message: 'Database connection failed', error: (error as Error).message }), { status: 500 });
  } finally {
    if (pool) {
      await pool.end(); // Close the pool after the test
    }
  }
}