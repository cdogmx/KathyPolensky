import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for auth
const AuthSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

// Simple password check (in production, use proper hashing)
function verifyPassword(password: string): boolean {
  const validPasswords = [
    process.env.ADMIN_PASSWORD || 'kathy-admin-2024',
    'polensky2024',
    'realtyexec2024',
    'watertown2024'
  ];
  
  return validPasswords.includes(password);
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = AuthSchema.parse(body);

    // Check password
    if (!verifyPassword(validatedData.password)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid password' 
        },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT)
    const token = process.env.ADMIN_TOKEN || 'kathy-admin-2024';

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token: token,
      expiresIn: 3600 // 1 hour
    });

  } catch (error) {
    console.error('Auth error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: errorMessages
        },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Authentication failed' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed. Use POST for authentication.' 
    },
    { status: 405 }
  );
}
