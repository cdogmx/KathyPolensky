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

// Validation schema for bulk listings
const BulkListingSchema = z.object({
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

const BulkRequestSchema = z.object({
  listings: z.array(BulkListingSchema).min(1, 'At least one listing is required').max(1000, 'Maximum 1000 listings per batch'),
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
    const validatedData = BulkRequestSchema.parse(body);

    const results = {
      total: validatedData.listings.length,
      created: 0,
      updated: 0,
      errors: [] as Array<{
        row: number;
        mlsNumber: string;
        error: string;
      }>
    };

    // Process each listing
    for (let i = 0; i < validatedData.listings.length; i++) {
      const listing = validatedData.listings[i];
      
      try {
        // Check if listing already exists
        const existingListing = await prisma.listing.findUnique({
          where: { mlsNumber: listing.mlsNumber }
        });

        if (existingListing) {
          // Update existing listing
          await prisma.listing.update({
            where: { mlsNumber: listing.mlsNumber },
            data: {
              address: listing.address,
              price: listing.price,
              status: listing.status,
              description: listing.description,
              updatedAt: new Date(),
            }
          });
          results.updated++;
        } else {
          // Create new listing
          await prisma.listing.create({
            data: {
              mlsNumber: listing.mlsNumber,
              address: listing.address,
              price: listing.price,
              status: listing.status,
              description: listing.description,
            }
          });
          results.created++;
        }
      } catch (error) {
        console.error(`Error processing listing ${i + 1}:`, error);
        
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
          if (error.message.includes('Unique constraint')) {
            errorMessage = 'MLS number already exists';
          } else if (error.message.includes('Invalid value')) {
            errorMessage = 'Invalid data format';
          } else {
            errorMessage = error.message;
          }
        }

        results.errors.push({
          row: i + 1,
          mlsNumber: listing.mlsNumber,
          error: errorMessage
        });
      }
    }

    // Determine success/failure
    const hasErrors = results.errors.length > 0;
    const hasSuccess = results.created > 0 || results.updated > 0;

    if (!hasSuccess && hasErrors) {
      return NextResponse.json({
        success: false,
        message: 'All listings failed to process',
        data: results
      }, { status: 400 });
    }

    if (hasErrors && hasSuccess) {
      return NextResponse.json({
        success: true,
        message: `Bulk upload completed with ${results.errors.length} errors`,
        data: results
      });
    }

    return NextResponse.json({
      success: true,
      message: `Bulk upload completed successfully. ${results.created} created, ${results.updated} updated.`,
      data: results
    });

  } catch (error) {
    console.error('Bulk upload error:', error);

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
        message: 'An unexpected error occurred during bulk upload. Please try again.' 
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
      message: 'Method not allowed. Use POST for bulk upload.' 
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed. Use POST for bulk upload.' 
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed. Use POST for bulk upload.' 
    },
    { status: 405 }
  );
}
