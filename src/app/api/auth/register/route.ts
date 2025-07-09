export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Create user
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User registered successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        return NextResponse.json({
          success: false,
          error: 'User already exists'
        }, { status: 409 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Registration failed'
    }, { status: 500 });
  }
} 