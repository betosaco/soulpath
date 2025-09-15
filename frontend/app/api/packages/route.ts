import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/packages - Fetching active packages...');

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false'; // Default to true
    const currency = searchParams.get('currency') || 'PEN';

    // Fetch packages with all pricing information
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
        featured: true,
        displayOrder: true,
        packagePrices: {
          where: {
            isActive: true,
            currency: {
              code: currency
            }
          },
          select: {
            id: true,
            price: true,
            pricingMode: true,
            isActive: true,
            currency: {
              select: {
                id: true,
                code: true,
                name: true,
                symbol: true
              }
            }
          },
          orderBy: {
            price: 'asc'
          }
        },
        sessionDuration: {
          select: {
            id: true,
            name: true,
            duration_minutes: true,
            description: true
          }
        }
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    // Transform the data to match the expected PackagePrice format
    const transformedPackages = packages.map(pkg => {
      // Get the first active price for the specified currency
      const price = pkg.packagePrices[0];
      
      if (!price) {
        console.warn(`No price found for package ${pkg.name} in currency ${currency}`);
        return null;
      }

      return {
        id: price.id, // Use the price ID, not package ID
        price: Number(price.price),
        packageDefinition: {
          id: pkg.id,
          name: pkg.name,
          description: pkg.description || '',
          sessionsCount: pkg.sessionsCount,
          isActive: true,
          packageType: pkg.packageType,
          maxGroupSize: pkg.maxGroupSize,
          isPopular: pkg.isPopular,
          featured: pkg.featured,
          displayOrder: pkg.displayOrder,
          sessionDuration: pkg.sessionDuration
        },
        currency: {
          id: price.currency.id,
          code: price.currency.code,
          symbol: price.currency.symbol,
          name: price.currency.name
        },
        pricingMode: price.pricingMode,
        isActive: price.isActive
      };
    }).filter(Boolean); // Remove null entries

    console.log(`✅ Found ${transformedPackages.length} active packages with pricing`);

    return NextResponse.json({
      success: true,
      data: transformedPackages,
      meta: {
        currency,
        total: transformedPackages.length
      }
    });

  } catch (error) {
    console.error('❌ Error in GET /api/packages:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch packages',
      message: 'An error occurred while fetching packages',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
    }, { status: 500 });
  }
}
