import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🛒 Public Products API called:', request.url);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('🛒 Query params:', { page, limit, search, category, sortBy, sortOrder });

    const skip = (page - 1) * limit;

    // Build where clause - only show ACTIVE products for public
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        sku?: { contains: string; mode: 'insensitive' };
      }>;
      status: 'ACTIVE';
      category?: string;
    } = {
      status: 'ACTIVE' // Only show active products to public
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
          isFeatured: true,
          isPopular: true,
          seoTitle: true,
          seoDescription: true,
          slug: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.product.count({ where })
    ]);

    console.log('🛒 Found products:', products.length, 'Total:', total);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
