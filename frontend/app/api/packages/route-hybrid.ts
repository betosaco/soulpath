import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';
import { getPackagesScheduleService } from '@/lib/services/schedule-api-service';

export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('active') !== 'false';
  const currency = searchParams.get('currency') || 'PEN';
  const includeSchedule = searchParams.get('includeSchedule') === 'true';
  
  try {
    console.log('🚀 GET /api/packages (HYBRID) - Fetching packages...');

    // HYBRID OPTIMIZATION 1: Use connection pooling like Monday 12 PM
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
          // HYBRID OPTIMIZATION 2: Optimized price selection (Monday 12 PM approach)
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
          // HYBRID OPTIMIZATION 3: Simplified session duration
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

    // HYBRID OPTIMIZATION 4: Single-pass transformation (Monday 12 PM approach)
    const transformedPackages = packages.map(pkg => {
      // Get the first active price for the specified currency
      const price = pkg.packagePrices[0];
      
      if (!price) {
        console.warn(`No price found for package ${pkg.name} in currency ${currency}`);
        return null;
      }

      return {
        id: price.id, // Use price ID like Monday 12 PM (more efficient)
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

    // HYBRID OPTIMIZATION 5: Optional schedule data (only if requested)
    let scheduleData = null;
    if (includeSchedule) {
      try {
        const scheduleService = getPackagesScheduleService();
        const scheduleResponse = await scheduleService.getSchedules({ available: true });
        if (scheduleResponse.success && scheduleResponse.data) {
          scheduleData = scheduleResponse.data;
          console.log('✅ Retrieved schedule data:', scheduleData.length, 'schedules');
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch schedule data:', error);
      }
    }

    const response = {
      success: true,
      data: transformedPackages,
      meta: {
        currency,
        total: transformedPackages.length,
        hybrid: true,
        performance: 'optimized'
      },
      // Include schedule data if available
      ...(includeSchedule && scheduleData && { schedule: scheduleData })
    };

    return addCorsHeaders(NextResponse.json(response));

  } catch (error) {
    console.error('❌ Error in GET /api/packages:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack'
    });
    
    // HYBRID OPTIMIZATION 6: Graceful fallback like Monday 12 PM
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
      
      return addCorsHeaders(NextResponse.json({
        success: true,
        data: mockPackages,
        meta: {
          currency,
          total: mockPackages.length,
          hybrid: true,
          mock: true
        },
        message: 'Using mock data - database unavailable'
      }));
    }
    
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Failed to fetch packages',
      message: 'An error occurred while fetching packages',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'                                                                            
    }, { status: 500 }));
  }
}

// HYBRID OPTIMIZATION 7: Keep the efficient mock data generator from Monday 12 PM
function generateMockPackages(currency: string) {
  const currencySymbol = currency === 'PEN' ? 'S/' : '$';
  const currencyCode = currency;
  
  const mockPackages = [
    {
      id: 'mock_pkg_1',
      price: currency === 'PEN' ? 15000 : 150,
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
      price: currency === 'PEN' ? 28000 : 280,
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
      price: currency === 'PEN' ? 45000 : 450,
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
      price: currency === 'PEN' ? 20000 : 200,
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
