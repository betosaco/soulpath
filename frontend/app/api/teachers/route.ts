import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  specialty: z.string().optional(),
  experience: z.enum(['0-2', '3-5', '6-10', '10+']).optional(),
  venue: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sortBy: z.enum(['featured', 'name', 'experience', 'created']).default('featured'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

export async function GET(request: NextRequest) {
  try {
    console.log('👨‍🏫 GET /api/teachers - Starting request...');

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
      specialty, 
      experience, 
      venue, 
      featured, 
      search, 
      page, 
      limit, 
      sortBy, 
      sortOrder 
    } = validation.data;

    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { 
      specialty, experience, venue, featured, search, page, limit, sortBy, sortOrder 
    });

    // Build the query
    const where: Record<string, unknown> = {
      isActive: true // Only show active teachers
    };

    if (specialty) where.specialties = { has: specialty };
    if (venue) {
      where.venue = {
        name: { contains: venue, mode: 'insensitive' }
      };
    }
    if (featured !== undefined) where.featured = featured === 'true';
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { shortBio: { contains: search, mode: 'insensitive' } },
        { specialties: { has: search } }
      ];
    }

    if (experience) {
      const exp = experience.split('-');
      if (exp.length === 2) {
        if (exp[1] === '+') {
          where.experience = { gt: parseInt(exp[0]) };
        } else {
          where.experience = {
            gte: parseInt(exp[0]),
            lte: parseInt(exp[1])
          };
        }
      }
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
      case 'experience':
        orderBy = [{ experience: sortOrder }];
        break;
      case 'created':
        orderBy = [{ createdAt: sortOrder }];
        break;
      default:
        orderBy = [{ displayOrder: 'asc' }, { name: 'asc' }];
    }

    // Execute query
    const [teachers, totalCount] = await Promise.all([
      prisma.teacher.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          bio: true,
          shortBio: true,
          specialties: true,
          languages: true,
          experience: true,
          avatarUrl: true,
          coverImage: true,
          galleryImages: true,
          videoUrl: true,
          thumbnailUrl: true,
          website: true,
          instagram: true,
          facebook: true,
          linkedin: true,
          teachingStyle: true,
          philosophy: true,
          approach: true,
          maxStudents: true,
          minStudents: true,
          preferredTimes: true,
          featured: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
          createdAt: true,
          updatedAt: true,
          venue: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              country: true,
              capacity: true,
              amenities: true
            }
          },
          certifications: {
            where: { isVerified: true },
            select: {
              id: true,
              name: true,
              issuingOrganization: true,
              issueDate: true,
              expiryDate: true,
              credentialId: true,
              credentialUrl: true,
              description: true,
              isVerified: true,
              displayOrder: true
            },
            orderBy: { displayOrder: 'asc' }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.teacher.count({ where })
    ]);

    console.log(`✅ Found ${teachers.length} teachers (total: ${totalCount})`);

    // Get filter options
    // Note: specialties is not a scalar field, so we can't group by it
    // const specialtyCounts = await prisma.teacher.groupBy({
    //   by: ['specialties'],
    //   where: { isActive: true },
    //   _count: { specialties: true }
    // });

    const venueCounts = await prisma.teacher.groupBy({
      by: ['venueId'],
      where: { 
        isActive: true,
        venueId: { not: null }
      },
      _count: { venueId: true },
      _max: {
        venueId: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        teachers,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        filters: {
          specialties: Array.from(new Set(teachers.flatMap(t => t.specialties))),
          venues: venueCounts.map(v => ({
            id: v.venueId,
            name: `Venue ${v.venueId}`,
            count: v._count.venueId
          }))
        }
      }
    });

  } catch (error) {
    console.error('❌ Teachers API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
