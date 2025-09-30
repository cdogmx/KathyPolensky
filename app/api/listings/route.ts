import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client for serverless
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    // Build where clause
    const where: any = {};

    // Status filter
    if (status && status !== '') {
      where.status = status;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseInt(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseInt(maxPrice);
      }
    }

    // Search filter
    if (search && search !== '') {
      where.OR = [
        { address: { contains: search, mode: 'insensitive' } },
        { mlsNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch listings from database
    const listings = await prisma.listing.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { price: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    });

    // Transform data for frontend
    const transformedListings = listings.map(listing => ({
      id: listing.id,
      mlsNumber: listing.mlsNumber,
      address: listing.address,
      price: listing.price,
      status: listing.status,
      description: listing.description,
      latitude: listing.latitude || null,
      longitude: listing.longitude || null,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString()
    }));

    return NextResponse.json(transformedListings);

  } catch (error) {
    console.error('Error fetching listings:', error);

    // Handle database connection errors
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: 'Unable to connect to the database. Please try again later.'
        },
        { status: 503 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        { 
          error: 'Database query failed',
          message: 'An error occurred while querying the database.'
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching listings.'
      },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client in serverless environment
    await prisma.$disconnect();
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Use POST /api/listings for creating listings.' 
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Use PUT /api/listings/[id] for updating listings.' 
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Use DELETE /api/listings/[id] for deleting listings.' 
    },
    { status: 405 }
  );
}