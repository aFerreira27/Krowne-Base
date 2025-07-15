
import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';

// DELETE all products
export async function DELETE(request: Request) {
  try {
    const db = await getDB();
    await db.query('DELETE FROM products');
    return NextResponse.json({ message: 'All products deleted successfully' });
  } catch (error) {
    console.error('Error deleting all products:', error);
    return NextResponse.json({ error: 'Failed to delete all products', details: (error as Error).message }, { status: 500 });
  }
}
