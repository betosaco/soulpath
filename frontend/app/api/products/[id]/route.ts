import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cache, cacheKeys, cacheTTL } from '@/lib/redis';

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🛒 Public Product API called for ID:', id);
    
    // Generate cache key
    const cacheKey = cacheKeys.productDetail(id);
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      console.log('✅ Returning cached product data');
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true
      });
    }
    
    const product = await prisma.product.findUnique({
      where: { 
        id: id,
        status: 'ACTIVE' // Only show active products to public
      },
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
        seoTitle: true,
        seoDescription: true,
        slug: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('🛒 Found product:', product.name);

    // Cache the result
    await cache.set(cacheKey, product, cacheTTL.productDetail);

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
