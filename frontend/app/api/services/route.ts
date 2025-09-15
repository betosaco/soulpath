import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  category: z.enum(['class', 'workshop', 'training_program']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  durationMin: z.coerce.number().min(0).optional(),
  durationMax: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sortBy: z.enum(['featured', 'name', 'price', 'duration', 'created']).default('featured'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

export async function GET(request: NextRequest) {
  try {
    console.log('🎯 GET /api/services - Starting request...');

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { 
      category, 
      difficulty, 
      featured, 
      search, 
      priceMin, 
      priceMax, 
      durationMin, 
      durationMax, 
      page, 
      limit, 
      sortBy, 
      sortOrder 
    } = validation.data;

    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { 
      category, difficulty, featured, search, priceMin, priceMax, 
      durationMin, durationMax, page, limit, sortBy, sortOrder 
    });

    // Build the query
    const where: Record<string, unknown> = {
      isActive: true // Only show active services
    };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (featured !== undefined) where.featured = featured === 'true';
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { highlights: { has: search } }
      ];
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    if (durationMin !== undefined || durationMax !== undefined) {
      where.duration = {};
      if (durationMin !== undefined) where.duration.gte = durationMin;
      if (durationMax !== undefined) where.duration.lte = durationMax;
    }

    // Build sort order
    let orderBy: Record<string, unknown>[] = [];
    
    switch (sortBy) {
      case 'featured':
        orderBy = [
          { featured: 'desc' },
          { displayOrder: 'asc' },
          { name: 'asc' }
        ];
        break;
      case 'name':
        orderBy = [{ name: sortOrder }];
        break;
      case 'price':
        orderBy = [{ price: sortOrder }];
        break;
      case 'duration':
        orderBy = [{ duration: sortOrder }];
        break;
      case 'created':
        orderBy = [{ createdAt: sortOrder }];
        break;
      default:
        orderBy = [{ displayOrder: 'asc' }, { name: 'asc' }];
    }

    // Execute query
    const [services, totalCount] = await Promise.all([
      prisma.serviceType.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          shortDescription: true,
          category: true,
          duration: true,
          maxParticipants: true,
          minParticipants: true,
          requirements: true,
          benefits: true,
          difficulty: true,
          price: true,
          currency: true,
          featured: true,
          color: true,
          icon: true,
          coverImage: true,
          galleryImages: true,
          videoUrl: true,
          thumbnailUrl: true,
          highlights: true,
          testimonials: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          teacherSchedules: {
            where: { isAvailable: true },
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              teacher: {
                select: {
                  id: true,
                  name: true,
                  specialties: true,
                  avatarUrl: true
                }
              },
              venue: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  address: true
                }
              }
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.serviceType.count({ where })
    ]);

    console.log(`✅ Found ${services.length} services (total: ${totalCount})`);

    // Get category counts for filters
    const categoryCounts = await prisma.serviceType.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true }
    });

    const difficultyCounts = await prisma.serviceType.groupBy({
      by: ['difficulty'],
      where: { 
        isActive: true,
        difficulty: { not: null }
      },
      _count: { difficulty: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        services,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        filters: {
          categories: categoryCounts.map(c => ({
            value: c.category,
            count: c._count.category
          })),
          difficulties: difficultyCounts.map(d => ({
            value: d.difficulty,
            count: d._count.difficulty
          }))
        }
      }
    });

  } catch (error) {
    console.error('❌ Services API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
