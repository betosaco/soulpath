import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cache, cacheKeys, cacheTTL } from '@/lib/redis';
import { getInternalProductsScheduleService } from '@/lib/services/schedule-api-service';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 Internal Products API called:', request.url);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const includeSchedule = searchParams.get('includeSchedule') === 'true';
    const internalOnly = searchParams.get('internalOnly') === 'true';

    console.log('🏢 Query params:', { page, limit, search, category, sortBy, sortOrder, includeSchedule, internalOnly });

    // Generate cache key for internal products
    const cacheKey = `internal_products:${page}:${limit}:${search}:${category}:${sortBy}:${sortOrder}:${includeSchedule}:${internalOnly}`;
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      console.log('✅ Returning cached internal products data');
      return NextResponse.json({
        success: true,
        data: (cachedData as any).data,
        pagination: (cachedData as any).pagination,
        schedule: (cachedData as any).schedule,
        cached: true
      });
    }

    const skip = (page - 1) * limit;

    // Build where clause for internal products
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        sku?: { contains: string; mode: 'insensitive' };
      }>;
      status: 'ACTIVE';
      category?: string;
      isInternal?: boolean;
    } = {
      status: 'ACTIVE' // Only show active products
    };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = category;
    }

    // Filter for internal products if requested
    if (internalOnly) {
      where.isInternal = true;
    }

    // Build orderBy clause
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sortBy] = sortOrder as 'asc' | 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          shortDescription: true,
          sku: true,
          price: true,
          comparePrice: true,
          currency: true,
          stock: true,
          weight: true,
          dimensions: true,
          category: true,
          tags: true,
          images: true,
          status: true,
          isFeatured: true,
          isPopular: true,
          isInternal: true, // Include internal flag
          seoTitle: true,
          seoDescription: true,
          slug: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.product.count({ where })
    ]);

    console.log('🏢 Found internal products:', products.length, 'Total:', total);

    // Get schedule data if requested
    let scheduleData = null;
    if (includeSchedule) {
      try {
        const scheduleService = getInternalProductsScheduleService();
        const scheduleResponse = await scheduleService.getSchedules({ available: true });
        if (scheduleResponse.success && scheduleResponse.data) {
          scheduleData = scheduleResponse.data;
          console.log('✅ Retrieved schedule data for internal products:', scheduleData.length, 'schedules');
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch schedule data for internal products:', error);
      }
    }

    const responseData = {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      // Include schedule data if requested
      ...(includeSchedule && scheduleData && { schedule: scheduleData })
    };

    // Cache the result
    await cache.set(cacheKey, responseData, cacheTTL.products);

    return NextResponse.json({
      success: true,
      ...responseData
    });
  } catch (error) {
    console.error('Error fetching internal products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch internal products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Product name is required'
      }, { status: 400 });
    }

    // Create internal product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        sku: body.sku,
        price: body.price || 0,
        comparePrice: body.comparePrice,
        currency: body.currency || 'PEN',
        stock: body.stock || 0,
        weight: body.weight,
        dimensions: body.dimensions,
        category: body.category,
        tags: body.tags || [],
        images: body.images || [],
        status: body.status || 'ACTIVE',
        isFeatured: body.isFeatured || false,
        isPopular: body.isPopular || false,
        isInternal: true, // Mark as internal product
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        slug: body.slug
      }
    });

    // Clear cache after creating new product
    await cache.del('internal_products:*');

    return NextResponse.json({
      success: true,
      message: 'Internal product created successfully',
      data: product
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating internal product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create internal product' },
      { status: 500 }
    );
  }
}
