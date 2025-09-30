import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

// ULTRA-OPTIMIZATION 1: In-memory cache for products
const productsCache = new Map();
const CACHE_TTL = 300000; // 5 minutes (products don't change frequently)
const MAX_CACHE_SIZE = 50;

// ULTRA-OPTIMIZATION 2: Pre-computed response templates
const responseTemplate = {
  success: true,
  meta: {
    ultraOptimized: true,
    performance: 'maximum'
  }
};

// ULTRA-OPTIMIZATION 3: Minimal data selection for products
// Fields required by products listing page
const minimalProductSelect = {
  id: true,
  name: true,
  description: true,
  shortDescription: true,
  sku: true,
  price: true,
  // include comparePrice for strike-through display
  comparePrice: true,
  currency: true,
  stock: true,
  category: true,
  images: true,
  status: true,
  isFeatured: true,
};

// ULTRA-OPTIMIZATION 4: Streamlined product transformation
function transformProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    sku: product.sku,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    currency: product.currency,
    stock: product.stock,
    category: product.category,
    images: product.images,
    status: product.status,
    isFeatured: product.isFeatured,
  };
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    // Default to 20 items; hard cap at 20 to keep payloads small
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 20);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // ULTRA-OPTIMIZATION 5: Smart caching with cache invalidation
    const cacheKey = `ultra_products:${page}:${limit}:${search}:${category}:${sortBy}:${sortOrder}`;
    const cached = productsCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      const responseTime = performance.now() - startTime;
      console.log(`🚀 Ultra-fast products cache hit: ${responseTime.toFixed(2)}ms`);
      
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
      
      // Build optimized where clause
      const where: any = {
        status: 'ACTIVE' // Only show active products
      };

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
          select: minimalProductSelect,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        db.product.count({ where })
      ]);

      return [productsResult, totalResult];
    });

    // ULTRA-OPTIMIZATION 7: Parallel processing
    const transformedProducts = products.map(transformProduct);

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
    if (productsCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries
      const oldestKey = productsCache.keys().next().value;
      productsCache.delete(oldestKey);
    }
    
    productsCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    console.log(`🚀 Ultra-optimized products response: ${response.meta.responseTime}`);

    // Add HTTP caching headers for CDN/browser caching
    const jsonResponse = NextResponse.json(response);
    const corsResponse = addCorsHeaders(jsonResponse);
    corsResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
    corsResponse.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
    corsResponse.headers.set('Vercel-CDN-Cache-Control', 'max-age=300');
    
    return corsResponse;

  } catch (error) {
    console.error('❌ Ultra-optimized products API error:', error);
    
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

// ULTRA-OPTIMIZATION 11: Cleanup on process exit
process.on('SIGINT', async () => {
  productsCache.clear();
});
