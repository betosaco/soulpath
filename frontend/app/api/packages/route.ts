import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 GET /api/packages - Fetching active packages...');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔗 Database URL exists:', !!process.env.DATABASE_URL);

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    // Fetch packages directly without cache for now
    const packages = await prisma.packageDefinition.findMany({
      where: {
        isActive: activeOnly ? true : undefined
      },
      select: {
        id: true,
        name: true,
        description: true,
        sessionsCount: true,
        packageType: true,
        maxGroupSize: true,
        isPopular: true,
        packagePrices: {
          where: {
            isActive: true
          },
          select: {
            price: true,
            currency: {
              select: {
                code: true,
                symbol: true
              }
            }
          },
          orderBy: {
            price: 'asc'
          },
          take: 1 // Get the cheapest price for display
        },
        sessionDuration: {
          select: {
            name: true,
            duration_minutes: true
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    // Transform the data to match the expected format
    const transformedPackages = packages.map(pkg => {
      // Get the first active price (you might want to handle multiple currencies differently)
      const price = pkg.packagePrices[0];
      
      return {
        id: pkg.id,
        name: pkg.name,
        description: pkg.description || '',
        sessionsCount: pkg.sessionsCount,
        price: price ? (isNaN(Number(price.price)) ? 0 : Number(price.price)) : 0,
        currency: price?.currency?.symbol || '$',
        duration: pkg.sessionDuration.duration_minutes,
        isPopular: pkg.id === 1, // Mark first package as popular, adjust as needed
        packageType: pkg.packageType,
        maxGroupSize: pkg.maxGroupSize
      };
    });

    console.log(`✅ Found ${transformedPackages.length} active packages`);

    return NextResponse.json({
      success: true,
      packages: transformedPackages
    });

  } catch (error) {
    console.error('❌ Error in GET /api/packages:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch packages',
      message: 'An error occurred while fetching packages',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
