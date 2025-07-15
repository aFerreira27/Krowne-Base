
import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';

// DELETE all products, requires password confirmation
export async function DELETE(request: Request) {
  try {
    const { password } = await request.json();

    // Verify password
    if (password !== process.env.DB_PASS) {
      return NextResponse.json({ error: 'Incorrect password. Permission denied.' }, { status: 403 });
    }

    const db = await getDB();
    await db.query('DELETE FROM products');
    return NextResponse.json({ message: 'All products deleted successfully' });
  } catch (error) {
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }
    console.error('Error deleting all products:', error);
    return NextResponse.json({ error: 'Failed to delete all products', details: (error as Error).message }, { status: 500 });
  }
}
