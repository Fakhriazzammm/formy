import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = (await cookies()).get('auth-token');

    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    const user = verifyToken(token.value);
    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    return new NextResponse(null, { status: 401 });
  }
}