import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Initialize Prisma client for serverless
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Validation schema
const ListingSchema = z.object({
  mlsNumber: z.string()
    .min(1, 'MLS Number is required')
    .max(50, 'MLS Number must be less than 50 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'MLS Number can only contain letters, numbers, and hyphens'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be less than 500 characters'),
  price: z.number()
    .positive('Price must be greater than 0')
    .max(999999999, 'Price must be less than $1 billion'),
  status: z.enum(['Active', 'Pending', 'Sold'], {
    errorMap: () => ({ message: 'Status must be Active, Pending, or Sold' })
  }),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .nullable(),
});

// Simple auth check
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.ADMIN_TOKEN || 'kathy-admin-2024';
  
  if (!authHeader) {
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  return token === expectedToken;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized. Invalid or missing authentication token.' 
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = ListingSchema.parse(body);

    // Check if listing already exists
    const existingListing = await prisma.listing.findUnique({
      where: { mlsNumber: validatedData.mlsNumber }
    });

    let result;
    
    if (existingListing) {
      // Update existing listing (upsert behavior)
      result = await prisma.listing.update({
        where: { mlsNumber: validatedData.mlsNumber },
        data: {
          address: validatedData.address,
          price: validatedData.price,
          status: validatedData.status,
          description: validatedData.description,
          updatedAt: new Date(),
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Listing updated successfully',
        data: {
          id: result.id,
          mlsNumber: result.mlsNumber,
          address: result.address,
          price: result.price,
          status: result.status,
          action: 'updated'
        }
      });
    } else {
      // Create new listing
      result = await prisma.listing.create({
        data: {
          mlsNumber: validatedData.mlsNumber,
          address: validatedData.address,
          price: validatedData.price,
          status: validatedData.status,
          description: validatedData.description,
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Listing created successfully',
        data: {
          id: result.id,
          mlsNumber: result.mlsNumber,
          address: result.address,
          price: result.price,
          status: result.status,
          action: 'created'
        }
      });
    }

  } catch (error) {
    console.error('Error processing listing:', error);

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'A listing with this MLS number already exists' 
        },
        { status: 409 }
      );
    }

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

    // Handle database connection errors
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed. Please try again later.' 
        },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client in serverless environment
    await prisma.$disconnect();
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed. Use POST to create listings.' 
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed. Use POST to create listings.' 
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed. Use POST to create listings.' 
    },
    { status: 405 }
  );
}
