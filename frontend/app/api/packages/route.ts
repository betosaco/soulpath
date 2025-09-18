import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('active') !== 'false'; // Default to true
  const currency = searchParams.get('currency') || 'PEN';
  
  try {
    console.log('🔍 GET /api/packages - Fetching active packages...');

    // Fetch packages with all pricing information
    const packages = await withConnection(async () => {
      return await prisma.packageDefinition.findMany({
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
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack'
    });
    
    // Check if it's a database connection error
    if (error instanceof Error && (
      error.message.includes('denied access') ||
      error.message.includes('User was denied access') ||
      error.message.includes('P1010') ||
      error.message.includes('PrismaClientInitializationError') ||
      error.message.includes('Can\'t reach database server') ||
      error.message.includes('not available during build phase')
    )) {
      console.log('🔄 Database unavailable, returning mock packages for development');
      
      // Return mock packages for development when database is not available
      const mockPackages = generateMockPackages(currency);
      
      return NextResponse.json({
        success: true,
        data: mockPackages,
        meta: {
          currency,
          total: mockPackages.length
        },
        message: 'Using mock data - database unavailable'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch packages',
      message: 'An error occurred while fetching packages',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
    }, { status: 500 });
  }
}

// Generate mock packages for development
function generateMockPackages(currency: string) {
  const currencySymbol = currency === 'PEN' ? 'S/' : '$';
  const currencyCode = currency;
  
  const mockPackages = [
    {
      id: 'mock_pkg_1',
      price: currency === 'PEN' ? 15000 : 150, // 150 PEN or $150
      packageDefinition: {
        id: 'pkg_1',
        name: 'Yoga Starter Pack',
        description: 'Perfect for beginners who want to start their yoga journey with guided sessions and personalized attention.',
        sessionsCount: 4,
        isActive: true,
        packageType: 'Individual',
        maxGroupSize: 1,
        isPopular: false,
        featured: false,
        displayOrder: 1,
        sessionDuration: {
          id: 'duration_1',
          name: 'Standard Session',
          duration_minutes: 60,
          description: '60-minute yoga session'
        }
      },
      currency: {
        id: 'curr_1',
        code: currencyCode,
        symbol: currencySymbol,
        name: currency === 'PEN' ? 'Peruvian Sol' : 'US Dollar'
      },
      pricingMode: 'FIXED',
      isActive: true
    },
    {
      id: 'mock_pkg_2',
      price: currency === 'PEN' ? 28000 : 280, // 280 PEN or $280
      packageDefinition: {
        id: 'pkg_2',
        name: 'Wellness Journey',
        description: 'A comprehensive wellness package combining yoga, meditation, and mindfulness practices for holistic health.',
        sessionsCount: 8,
        isActive: true,
        packageType: 'Individual',
        maxGroupSize: 1,
        isPopular: true,
        featured: true,
        displayOrder: 2,
        sessionDuration: {
          id: 'duration_2',
          name: 'Extended Session',
          duration_minutes: 75,
          description: '75-minute comprehensive wellness session'
        }
      },
      currency: {
        id: 'curr_1',
        code: currencyCode,
        symbol: currencySymbol,
        name: currency === 'PEN' ? 'Peruvian Sol' : 'US Dollar'
      },
      pricingMode: 'FIXED',
      isActive: true
    },
    {
      id: 'mock_pkg_3',
      price: currency === 'PEN' ? 45000 : 450, // 450 PEN or $450
      packageDefinition: {
        id: 'pkg_3',
        name: 'Premium Wellness',
        description: 'Our most comprehensive package with unlimited sessions, personalized nutrition guidance, and 24/7 support.',
        sessionsCount: 12,
        isActive: true,
        packageType: 'Individual',
        maxGroupSize: 1,
        isPopular: false,
        featured: true,
        displayOrder: 3,
        sessionDuration: {
          id: 'duration_3',
          name: 'Premium Session',
          duration_minutes: 90,
          description: '90-minute premium wellness session'
        }
      },
      currency: {
        id: 'curr_1',
        code: currencyCode,
        symbol: currencySymbol,
        name: currency === 'PEN' ? 'Peruvian Sol' : 'US Dollar'
      },
      pricingMode: 'FIXED',
      isActive: true
    },
    {
      id: 'mock_pkg_4',
      price: currency === 'PEN' ? 20000 : 200, // 200 PEN or $200
      packageDefinition: {
        id: 'pkg_4',
        name: 'Group Wellness',
        description: 'Join our group sessions for a shared wellness experience with friends and like-minded individuals.',
        sessionsCount: 6,
        isActive: true,
        packageType: 'Group',
        maxGroupSize: 8,
        isPopular: true,
        featured: false,
        displayOrder: 4,
        sessionDuration: {
          id: 'duration_4',
          name: 'Group Session',
          duration_minutes: 60,
          description: '60-minute group wellness session'
        }
      },
      currency: {
        id: 'curr_1',
        code: currencyCode,
        symbol: currencySymbol,
        name: currency === 'PEN' ? 'Peruvian Sol' : 'US Dollar'
      },
      pricingMode: 'FIXED',
      isActive: true
    }
  ];

  return mockPackages;
}
