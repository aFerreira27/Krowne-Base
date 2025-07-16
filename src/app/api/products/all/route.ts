
import { getDB } from '@/lib/db';
import { apiErrorHandler } from '@/lib/apiErrorHandler';
import { NextResponse } from 'next/server';

// DELETE all products, requires password confirmation
export const DELETE = apiErrorHandler(async (request: Request) => {
  const { password } = await request.json();

  // Verify password
  if (password !== process.env.DB_PASS) {
    return NextResponse.json({ error: 'Incorrect password. Permission denied.' }, { status: 403 });
  }

  const db = await getDB();
  await db.query('DELETE FROM products');
  return NextResponse.json({ message: 'All products deleted successfully' });
});
