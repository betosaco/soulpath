import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

// ULTRA-OPTIMIZATION 1: In-memory cache for product details
const productDetailCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_SECONDS = 60; // 1 minute TTL for product details
const MAX_CACHE_SIZE = 100;

// ULTRA-OPTIMIZATION 2: Pre-computed response template
const responseTemplate = {
  success: true,
  meta: {
    ultraOptimized: true,
    performance: 'maximum'
  }
};

// ULTRA-OPTIMIZATION 3: Minimal data selection for product details
const minimalProductSelect = {
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
  seoTitle: true,
  seoDescription: true,
  slug: true,
  createdAt: true,
  updatedAt: true
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
    weight: product.weight,
    dimensions: product.dimensions,
    category: product.category,
    tags: product.tags,
    images: product.images,
    status: product.status,
    isFeatured: product.isFeatured,
    isPopular: product.isPopular,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    slug: product.slug,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();
  
  try {
    const { id } = await params;
    console.log('🚀 GET /api/products/[id] (ULTRA-OPTIMIZED) - Fetching product:', id);
    
    // ULTRA-OPTIMIZATION 5: In-memory cache check
    const cacheKey = `product_detail:${id}`;
    const now = Date.now();
    
    const cached = productDetailCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < (CACHE_TTL_SECONDS * 1000)) {
      const responseTime = performance.now() - startTime;
      console.log(`⚡️ In-memory cache hit for product ${id}: ${responseTime.toFixed(2)}ms`);
      
      return addCorsHeaders(NextResponse.json({
        ...cached.data,
        meta: {
          ...cached.data.meta,
          cached: true,
          responseTime: `${responseTime.toFixed(2)}ms`
        }
      }));
    }

    // ULTRA-OPTIMIZATION 6: Use connection pooling with `withConnection`
    const product = await withConnection(async () => {
      return await prisma.product.findUnique({
        where: { 
          id: id,
          status: 'ACTIVE' // Only show active products to public
        },
        select: minimalProductSelect
      });
    });

    if (!product) {
      console.log(`❌ Product not found: ${id}`);
      return addCorsHeaders(NextResponse.json(
        { 
          success: false, 
          error: 'Product not found',
          meta: {
            ultraOptimized: true,
            responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
          }
        },
        { status: 404 }
      ));
    }

    console.log(`✅ Found product: ${product.name}`);

    // ULTRA-OPTIMIZATION 7: Transform product data
    const transformedProduct = transformProduct(product);

    // ULTRA-OPTIMIZATION 8: Create response
    const response = {
      ...responseTemplate,
      data: transformedProduct,
      meta: {
        ...responseTemplate.meta,
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    };

    // ULTRA-OPTIMIZATION 9: Smart cache management
    if (productDetailCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries
      const oldestKey = productDetailCache.keys().next().value;
      productDetailCache.delete(oldestKey);
    }
    
    productDetailCache.set(cacheKey, { data: response, timestamp: now });
    console.log(`✅ Stored in-memory cache for product ${id}`);

    return addCorsHeaders(NextResponse.json(response));
  } catch (error) {
    console.error('❌ Error in GET /api/products/[id] (ULTRA-OPTIMIZED):', error);
    
    return addCorsHeaders(NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        message: 'An error occurred while fetching the product',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : 'Internal server error',
        meta: {
          ultraOptimized: true,
          responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
        }
      },
      { status: 500 }
    ));
  }
}

// ULTRA-OPTIMIZATION 10: Cleanup on process exit
process.on('SIGINT', async () => {
  productDetailCache.clear();
  console.log('🧹 Product detail cache cleared on exit');
});

process.on('SIGTERM', async () => {
  productDetailCache.clear();
  console.log('🧹 Product detail cache cleared on exit');
});
