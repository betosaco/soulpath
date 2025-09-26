import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cache, cacheTTL } from '@/lib/redis';
import { getPackagesScheduleService } from '@/lib/services/schedule-api-service';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';
    const currency = searchParams.get('currency') || 'PEN';
    const includeSchedule = searchParams.get('includeSchedule') === 'true';

    console.log('🚀 GET /api/packages (OPTIMIZED) - Fetching packages...');

    // Simplified cache key (removed timestamp complexity)
    const cacheKey = `packages:${currency}:${activeOnly}:${includeSchedule}`;
    
    // Try to get from cache first
    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        console.log('✅ Cache hit for packages:', cacheKey);
        return NextResponse.json(cachedData);
      }
    } catch (error) {
      console.warn('⚠️ Cache read error:', error);
    }

    console.log('❌ Cache miss for packages:', cacheKey);

    // OPTIMIZATION 1: Simplified database query with minimal joins
    const whereClause = activeOnly ? { isActive: true } : {};
    
    const packages = await prisma.packageDefinition.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        sessionsCount: true,
        packageType: true,
        maxGroupSize: true,
        isActive: true,
        isPopular: true,
        featured: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
        // OPTIMIZATION 2: Only fetch price for requested currency
        packagePrices: {
          where: {
            isActive: true,
            currency: {
              code: currency
            }
          },
          select: {
            price: true,
            pricePerClass: true,
            currency: {
              select: {
                code: true,
                symbol: true
              }
            }
          }
        },
        // OPTIMIZATION 3: Simplified session duration (only if needed)
        sessionDuration: {
          select: {
            name: true,
            duration_minutes: true
          }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });
    
    console.log('✅ Found packages:', packages.length);

    if (!packages || packages.length === 0) {
      console.log('⚠️ No packages found, returning empty array');
      return NextResponse.json({
        success: true,
        data: [],
        meta: {
          currency,
          total: 0
        }
      });
    }

    // OPTIMIZATION 4: Parallel schedule data fetching (only if requested)
    let scheduleData = null;
    if (includeSchedule) {
      try {
        // Run schedule fetch in parallel with data processing
        const schedulePromise = (async () => {
          try {
            const service = getPackagesScheduleService();
            const response = await service.getSchedules({ available: true });
            return response.success ? response.data : null;
          } catch (error) {
            console.warn('⚠️ Failed to fetch schedule data:', error);
            return null;
          }
        })();
        
        scheduleData = await schedulePromise;
        if (scheduleData) {
          console.log('✅ Retrieved schedule data:', scheduleData.length, 'schedules');
        }
      } catch (error) {
        console.warn('⚠️ Schedule data fetch failed:', error);
      }
    }

    // OPTIMIZATION 5: Simplified data transformation
    const transformedPackages = packages.map(pkg => {
      // Get the price for the requested currency (already filtered in query)
      const packagePrice = pkg.packagePrices?.[0];
      
      return {
        id: pkg.id, // Use package ID
        price: packagePrice ? Number(packagePrice.price) : 0,
        pricePerClass: packagePrice?.pricePerClass != null ? Number(packagePrice.pricePerClass) : undefined,
        currency: packagePrice?.currency?.code || currency,
        packageDefinition: {
          id: pkg.id,
          name: pkg.name,
          description: pkg.description || '',
          sessionsCount: pkg.sessionsCount || 1,
          packageType: pkg.packageType || 'standard',
          maxGroupSize: pkg.maxGroupSize || 1,
          isActive: pkg.isActive,
          isPopular: pkg.isPopular || false,
          featured: pkg.featured || false,
          displayOrder: pkg.displayOrder,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt,
          // Only include session duration if it exists
          ...(pkg.sessionDuration && {
            sessionDuration: {
              name: pkg.sessionDuration.name,
              duration_minutes: pkg.sessionDuration.duration_minutes
            }
          })
        },
        pricingMode: 'custom',
        isActive: true,
        // Include schedule data if available
        ...(includeSchedule && scheduleData && { schedule: scheduleData })
      };
    });

    console.log(`✅ Processed ${transformedPackages.length} packages`);

    const response = {
      success: true,
      data: transformedPackages,
      meta: {
        currency,
        total: transformedPackages.length,
        cached: false,
        optimized: true
      }
    };

    // OPTIMIZATION 6: Shorter cache TTL for better performance
    try {
      await cache.set(cacheKey, response, cacheTTL.packages || 900); // 15 minutes instead of 30
      console.log('✅ Cached packages data for key:', cacheKey);
    } catch (error) {
      console.warn('⚠️ Cache write error:', error);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error in GET /api/packages:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch packages',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Simple validation
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Package name is required'
      }, { status: 400 });
    }

    // Create package with minimal data
    const data = await prisma.packageDefinition.create({
      data: {
        name: body.name,
        description: body.description,
        sessionsCount: body.sessionsCount || 1,
        packageType: body.packageType || 'standard',
        maxGroupSize: body.maxGroupSize || 1,
        isActive: body.isActive !== false,
        isPopular: body.isPopular || false,
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
        sessionDurationId: body.sessionDurationId || 1,
      }
    });

    // Clear cache after creating new package
    try {
      await cache.del('packages:*');
      console.log('✅ Cleared packages cache after creating new package');
    } catch (error) {
      console.warn('⚠️ Cache clear error:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      data
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error in POST /api/packages:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
