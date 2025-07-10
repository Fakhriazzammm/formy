import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from '@/lib/auth';
import { Payment } from '@/types';
import { executeQuery } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    const user = await getUserById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const email = user.email;
    const result = await executeQuery(`
      SELECT p.*, l.slug
      FROM payments p
      LEFT JOIN payment_links l ON l.payment_id = p.id
      WHERE p.customer->>'email' = '${email}'
      ORDER BY p.created_at DESC
      LIMIT 50
    `);
    const payments = result.data.map((row: Record<string, unknown>) => {
      const customer = row.customer ? JSON.parse(row.customer as string) : null;
      return { ...row, customer } as Payment;
    });
    return NextResponse.json({ payments });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 