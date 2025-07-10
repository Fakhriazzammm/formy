import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  // Forward ke /api/forms/list agar masuk ke formsList
  await fetch('http://localhost:3000/api/forms/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return NextResponse.json({ success: true });
} 