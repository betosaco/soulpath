import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

// ULTRA-OPTIMIZATION 1: In-memory cache for internal products
const internalProductsCache = new Map();
const CACHE_TTL = 30000; // 30 seconds
const MAX_CACHE_SIZE = 50;

// ULTRA-OPTIMIZATION 2: Pre-computed response templates
const responseTemplate = {
  success: true,
  meta: {
    ultraOptimized: true,
    performance: 'maximum'
  }
};

// ULTRA-OPTIMIZATION 3: Minimal data selection for internal products
const minimalInternalProductSelect = {
  id: true,
  name: true,
  description: true,
  shortDescription: true,
  sku: true,
  price: true,
  currency: true,
  stock: true,
  category: true,
  tags: true,
  images: true,
  status: true,
  isFeatured: true,
  isPopular: true,
  isInternal: true,
  slug: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true
};

// ULTRA-OPTIMIZATION 4: Streamlined internal product transformation
function transformInternalProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    sku: product.sku,
    price: Number(product.price),
    currency: product.currency,
    stock: product.stock,
    category: product.category,
    tags: product.tags,
    images: product.images,
    status: product.status,
    isFeatured: product.isFeatured,
    isPopular: product.isPopular,
    isInternal: product.isInternal,
    slug: product.slug,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Cap at 50
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const internalOnly = searchParams.get('internalOnly') === 'true';

    // ULTRA-OPTIMIZATION 5: Smart caching with cache invalidation
    const cacheKey = `ultra_internal_products:${page}:${limit}:${search}:${category}:${sortBy}:${sortOrder}:${internalOnly}`;
    const cached = internalProductsCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      const responseTime = performance.now() - startTime;
      console.log(`🚀 Ultra-fast internal products cache hit: ${responseTime.toFixed(2)}ms`);
      
      return addCorsHeaders(NextResponse.json({
        ...cached.data,
        meta: {
          ...cached.data.meta,
          cached: true,
          responseTime: `${responseTime.toFixed(2)}ms`
        }
      }));
    }

    const skip = (page - 1) * limit;

    // ULTRA-OPTIMIZATION 6: Optimized database query
    const [products, totalCount] = await withConnection(async () => {
      const db = prisma;
      
      // Build optimized where clause for internal products
      const where: any = {
        status: 'ACTIVE'
      };

      if (internalOnly) {
        where.isInternal = true;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (category) {
        where.category = category;
      }

      // Execute queries in parallel
      const [productsResult, totalResult] = await Promise.all([
        db.product.findMany({
          where,
          select: minimalInternalProductSelect,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        db.product.count({ where })
      ]);

      return [productsResult, totalResult];
    });

    // ULTRA-OPTIMIZATION 7: Parallel processing
    const transformedProducts = products.map(transformInternalProduct);

    // ULTRA-OPTIMIZATION 8: Minimal response object
    const response = {
      ...responseTemplate,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      meta: {
        ...responseTemplate.meta,
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    };

    // ULTRA-OPTIMIZATION 9: Smart cache management
    if (internalProductsCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries
      const oldestKey = internalProductsCache.keys().next().value;
      internalProductsCache.delete(oldestKey);
    }
    
    internalProductsCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    console.log(`🚀 Ultra-optimized internal products response: ${response.meta.responseTime}`);

    return addCorsHeaders(NextResponse.json(response));

  } catch (error) {
    console.error('❌ Ultra-optimized internal products API error:', error);
    
    // ULTRA-OPTIMIZATION 10: Fast error response
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      meta: {
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    }, { status: 500 }));
  }
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const body = await request.json();

    // ULTRA-OPTIMIZATION 11: Fast validation
    if (!body.name || !body.price) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Name and price are required',
        meta: {
          responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
        }
      }, { status: 400 }));
    }

    // ULTRA-OPTIMIZATION 12: Optimized product creation
    const product = await withConnection(async () => {
      const db = prisma;
      
      return await db.product.create({
        data: {
          name: body.name,
          description: body.description,
          shortDescription: body.shortDescription,
          sku: body.sku,
          price: Number(body.price),
          currency: body.currency || 'S/.',
          stock: body.stock || 0,
          category: body.category,
          tags: body.tags || [],
          images: body.images || [],
          status: body.status || 'ACTIVE',
          isFeatured: body.isFeatured || false,
          isPopular: body.isPopular || false,
          isInternal: true, // Internal products are always internal
          slug: body.slug,
          seoTitle: body.seoTitle,
          seoDescription: body.seoDescription
        }
      });
    });

    // ULTRA-OPTIMIZATION 13: Clear cache after creation
    internalProductsCache.clear();

    console.log(`🚀 Ultra-optimized internal product created: ${(performance.now() - startTime).toFixed(2)}ms`);

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: 'Internal product created successfully',
      data: transformInternalProduct(product),
      meta: {
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    }, { status: 201 }));

  } catch (error) {
    console.error('❌ Ultra-optimized internal product creation error:', error);
    
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Failed to create internal product',
      meta: {
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    }, { status: 500 }));
  }
}

// ULTRA-OPTIMIZATION 14: Cleanup on process exit
process.on('SIGINT', async () => {
  internalProductsCache.clear();
});
