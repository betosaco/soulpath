import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cache, cacheTTL } from '@/lib/redis';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false'; // Default to true
    const currency = searchParams.get('currency') || 'PEN';

    console.log('🔍 GET /api/packages - Fetching packages...');

    // Create cache key
    const cacheKey = `packages:${currency}:${activeOnly}`;
    
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

    // Try to fetch packages using Prisma with optimized query
    const packages = await prisma.packageDefinition.findMany({
      where: activeOnly ? { isActive: true } : {},
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
          }
        },
        sessionDuration: {
          select: {
            id: true,
            name: true,
            duration_minutes: true
          }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });
    
    console.log('Database query result:', { packages });
    console.log('Packages count:', packages?.length || 0);

    if (!packages) {
      console.error('Error fetching packages: No packages returned');
      
      // If table doesn't exist or has issues, return mock data
      console.log('🔄 Database unavailable, returning mock packages');
      
      const mockPackages = [
        {
          id: 1,
          name: 'Yoga Starter Pack',
          description: 'Perfect for beginners who want to start their yoga journey',
          sessionsCount: 4,
          packageType: 'individual',
          maxGroupSize: 1,
          isActive: true,
          isPopular: false,
          featured: false,
          displayOrder: 1,
          price: 150,
          currency: currency,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Yoga Pro Package',
          description: 'Advanced package for experienced practitioners',
          sessionsCount: 8,
          packageType: 'individual',
          maxGroupSize: 1,
          isActive: true,
          isPopular: true,
          featured: true,
          displayOrder: 2,
          price: 280,
          currency: currency,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Group Yoga Sessions',
          description: 'Perfect for friends and family to practice together',
          sessionsCount: 6,
          packageType: 'group',
          maxGroupSize: 4,
          isActive: true,
          isPopular: false,
          featured: false,
          displayOrder: 3,
          price: 200,
          currency: currency,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

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

    // Transform packages to match expected format
    const transformedPackages = packages.map(pkg => {
      // Get the price for the requested currency
      const packagePrice = pkg.packagePrices?.find(pp => 
        pp.currency.code === currency
      ) || pkg.packagePrices?.[0];
      
      return {
        id: pkg.id,
        price: packagePrice ? Number(packagePrice.price) : 0,
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
          updatedAt: pkg.updatedAt
        }
      };
    });

    console.log(`✅ Found ${transformedPackages.length} packages`);

    const response = {
      success: true,
      data: transformedPackages,
      meta: {
        currency,
        total: transformedPackages.length
      }
    };

    // Cache the response
    try {
      await cache.set(cacheKey, response, cacheTTL.packages);
      console.log('✅ Cached packages data for key:', cacheKey, 'TTL:', cacheTTL.packages);
    } catch (error) {
      console.warn('⚠️ Cache write error:', error);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
    }, { status: 500 });
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

    // Try to insert into database
    const { data, error } = await supabase
      .from('package_definitions')
      .insert({
        name: body.name,
        description: body.description,
        sessions_count: body.sessionsCount || 1,
        package_type: body.packageType || 'standard',
        max_group_size: body.maxGroupSize || 1,
        is_active: body.isActive !== false,
        is_popular: body.isPopular || false,
        featured: body.featured || false,
        display_order: body.displayOrder || 0,
        session_duration_id: body.sessionDurationId || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating package:', error);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        message: 'Failed to create package',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      data
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}