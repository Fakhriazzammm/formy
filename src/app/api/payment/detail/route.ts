import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getUserById } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    const user = await getUserById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    const result = await db.query(`
      SELECT p.*, l.slug
      FROM payments p
      LEFT JOIN payment_links l ON l.payment_id = p.id
      WHERE l.slug = $1
      LIMIT 1
    `, [slug]);
    if (!result.rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const row = result.rows[0];
    const customer = row.customer ? JSON.parse(row.customer) : null;
    if (!customer || customer.email !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    let payment_url = null;
    if (row.status !== "paid" && row.mayar_order_id) {
      payment_url = `https://app.mayar.id/invoice/${row.mayar_order_id}`;
    }
    const payment = {
      ...row,
      customer,
      payment_url,
    };
    return NextResponse.json({ payment });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 