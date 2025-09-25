import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cache, cacheTTL } from '@/lib/redis';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🛒 Products API called:', request.url);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('🛒 Query params:', { page, limit, search, category, status, sortBy, sortOrder });

    // Generate cache key for admin products
    const cacheKey = `admin:products:${page}:${limit}:${search}:${category}:${status}:${sortBy}:${sortOrder}`;
    
    // Try to get from cache first
    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        console.log('✅ Cache hit for admin products:', cacheKey);
        return NextResponse.json({
          success: true,
          data: (cachedData as any).data,
          pagination: (cachedData as any).pagination,
          cached: true
        });
      }
    } catch (error) {
      console.warn('⚠️ Cache read error:', error);
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        sku?: { contains: string; mode: 'insensitive' };
      }>;
      status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
      category?: string;
    } = {};
    
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
    
    if (status && ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'].includes(status)) {
      where.status = status as 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
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
        include: {
          _count: {
            select: {
              orderItems: true,
              inventoryLogs: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    console.log('🛒 Found products:', products.length, 'Total:', total);

    const response = {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    // Cache the response
    try {
      await cache.set(cacheKey, response, cacheTTL.products);
      console.log('✅ Cached admin products data for key:', cacheKey, 'TTL:', cacheTTL.products);
    } catch (error) {
      console.warn('⚠️ Cache write error:', error);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      currency = 'PEN',
      stock = 0,
      minStock = 10,
      maxStock,
      weight,
      dimensions,
      category,
      tags = [],
      images = [],
      status = 'ACTIVE',
      isDigital = false,
      isFeatured = false,
      isPopular = false,
      seoTitle,
      seoDescription,
      slug
    } = body;

    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const product = await prisma.product.create({
      data: {
        name,
        description,
        shortDescription,
        sku,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        currency,
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        maxStock: maxStock ? parseInt(maxStock) : null,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        category,
        tags,
        images,
        status,
        isDigital,
        isFeatured,
        isPopular,
        seoTitle,
        seoDescription,
        slug: productSlug
      }
    });

    // Invalidate products cache when new product is created
    try {
      await cache.del('admin:products:*');
      console.log('✅ Invalidated admin products cache after creating new product');
    } catch (error) {
      console.warn('⚠️ Cache invalidation error:', error);
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
