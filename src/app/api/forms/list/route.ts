import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  const result = await db.execute(sql`SELECT id, name, config FROM public.forms ORDER BY created_at DESC`);
  return NextResponse.json({ forms: result.rows });
}

export async function POST(req: Request) {
  const data = await req.json();
  // Insert ke database
  const result = await db.execute(sql`INSERT INTO public.forms (name, config) VALUES (${data.name}, ${JSON.stringify(data.components)}) RETURNING id`);
  return NextResponse.json({ success: true, id: result.rows?.[0]?.id });
}

export async function PUT(req: Request) {
  const data = await req.json();
  await db.execute(sql`UPDATE public.forms SET name = ${data.name}, config = ${JSON.stringify(data.components)}, updated_at = now() WHERE id = ${data.id}`);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await db.execute(sql`DELETE FROM public.forms WHERE id = ${id}`);
  return NextResponse.json({ success: true });
} 