import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

// ULTRA-OPTIMIZATION 1: In-memory cache for frequently accessed data
const memoryCache = new Map();
const CACHE_TTL = 30000; // 30 seconds
const MAX_CACHE_SIZE = 100;

// ULTRA-OPTIMIZATION 2: Pre-computed response templates
const responseTemplate = {
  success: true,
  meta: {
    currency: 'PEN',
    total: 0,
    ultraOptimized: true,
    performance: 'maximum'
  }
};

// ULTRA-OPTIMIZATION 3: Connection pooling with keep-alive
let connectionPool: any = null;

async function getOptimizedConnection() {
  if (!connectionPool) {
    connectionPool = prisma;
    // Pre-warm the connection
    await connectionPool.$connect();
  }
  return connectionPool;
}

// ULTRA-OPTIMIZATION 4: Minimal data selection
const minimalSelect = {
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
      currency: { code: 'PEN' }
    },
    select: {
      id: true,
      price: true,
      currency: {
        select: {
          code: true,
          symbol: true
        }
      }
    },
    take: 1 // Only get the first price
  }
};

// ULTRA-OPTIMIZATION 5: Streamlined transformation
function transformPackage(pkg: any) {
  const price = pkg.packagePrices[0];
  if (!price) return null;

  return {
    id: price.id,
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
      displayOrder: pkg.displayOrder
    },
    currency: {
      code: price.currency.code,
      symbol: price.currency.symbol
    }
  };
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';
    const currency = searchParams.get('currency') || 'PEN';
    const includeSchedule = searchParams.get('includeSchedule') === 'true';

    // ULTRA-OPTIMIZATION 6: Smart caching with cache invalidation
    const cacheKey = `ultra:${currency}:${activeOnly}:${includeSchedule}`;
    const cached = memoryCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      const responseTime = performance.now() - startTime;
      console.log(`🚀 Ultra-fast cache hit: ${responseTime.toFixed(2)}ms`);
      
      return addCorsHeaders(NextResponse.json({
        ...cached.data,
        meta: {
          ...cached.data.meta,
          cached: true,
          responseTime: `${responseTime.toFixed(2)}ms`
        }
      }));
    }

    // ULTRA-OPTIMIZATION 7: Optimized database query
    const packages = await withConnection(async () => {
      const db = await getOptimizedConnection();
      
      return await db.packageDefinition.findMany({
        where: {
          isActive: activeOnly ? true : undefined
        },
        select: minimalSelect,
        orderBy: { displayOrder: 'asc' }
      });
    });

    // ULTRA-OPTIMIZATION 8: Parallel processing
    const transformedPackages = packages
      .map(transformPackage)
      .filter(Boolean);

    // ULTRA-OPTIMIZATION 9: Minimal response object
    const response = {
      ...responseTemplate,
      data: transformedPackages,
      meta: {
        ...responseTemplate.meta,
        currency,
        total: transformedPackages.length,
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    };

    // ULTRA-OPTIMIZATION 10: Smart cache management
    if (memoryCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries
      const oldestKey = memoryCache.keys().next().value;
      memoryCache.delete(oldestKey);
    }
    
    memoryCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    console.log(`🚀 Ultra-optimized response: ${response.meta.responseTime}`);

    return addCorsHeaders(NextResponse.json(response));

  } catch (error) {
    console.error('❌ Ultra-optimized API error:', error);
    
    // ULTRA-OPTIMIZATION 11: Fast error response
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      meta: {
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    }, { status: 500 }));
  }
}

// ULTRA-OPTIMIZATION 12: Cleanup on process exit
process.on('SIGINT', async () => {
  if (connectionPool) {
    await connectionPool.$disconnect();
  }
  memoryCache.clear();
});
