import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Advanced filtering schema for the new schema
const ServiceSearchSchema = z.object({
  // Basic filters
  search: z.string().optional(),
  category: z.enum(['CLASS', 'WORKSHOP', 'TRAINING_PROGRAM', 'RETREAT', 'CONSULTATION']).optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).optional(),
  
  // Relationship filters
  amenityIds: z.array(z.number()).optional(),
  specialtyIds: z.array(z.number()).optional(),
  languageIds: z.array(z.number()).optional(),
  venueIds: z.array(z.number()).optional(),
  teacherIds: z.array(z.number()).optional(),
  
  // Pricing filters
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  
  // Availability filters
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).optional(),
  timeFrom: z.string().optional(), // HH:mm format
  timeTo: z.string().optional(), // HH:mm format
  
  // Pagination
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
  
  // Sorting
  sortBy: z.enum(['name', 'price', 'rating', 'createdAt', 'featured']).default('featured'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const queryParams = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') as 'CLASS' | 'WORKSHOP' | 'TRAINING_PROGRAM' | null,
      difficulty: searchParams.get('difficulty') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null,
      amenityIds: searchParams.get('amenityIds')?.split(',').map(Number).filter(Boolean),
      specialtyIds: searchParams.get('specialtyIds')?.split(',').map(Number).filter(Boolean),
      languageIds: searchParams.get('languageIds')?.split(',').map(Number).filter(Boolean),
      venueIds: searchParams.get('venueIds')?.split(',').map(Number).filter(Boolean),
      teacherIds: searchParams.get('teacherIds')?.split(',').map(Number).filter(Boolean),
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      currency: searchParams.get('currency') || undefined,
      dayOfWeek: searchParams.get('dayOfWeek') as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY' | null,
      timeFrom: searchParams.get('timeFrom') || undefined,
      timeTo: searchParams.get('timeTo') || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
      sortBy: (searchParams.get('sortBy') as 'featured' | 'name' | 'price' | 'duration' | 'createdAt' | null) || 'featured',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc' | null) || 'desc'
    };

    const validatedParams = ServiceSearchSchema.parse(queryParams);
    const { page, limit, sortBy, sortOrder, ...filters } = validatedParams;
    const skip = (page - 1) * limit;

    // Build complex where clause using new relationships
    const where: Record<string, unknown> = {
      isActive: true
    };

    // Text search
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { shortDescription: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    // Category filter
    if (filters.category) {
      where.category = filters.category;
    }

    // Difficulty filter
    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }

    // Venue-based filtering (amenities)
    if (filters.amenityIds && filters.amenityIds.length > 0) {
      where.teacherSchedules = {
        some: {
          venue: {
            amenities: {
              some: {
                amenityId: { in: filters.amenityIds }
              }
            }
          }
        }
      };
    }

    // Teacher-based filtering (specialties and languages)
    if (filters.specialtyIds && filters.specialtyIds.length > 0) {
      where.teacherSchedules = {
        some: {
          teacher: {
            specialties: {
              some: {
                specialtyId: { in: filters.specialtyIds }
              }
            }
          }
        }
      };
    }

    if (filters.languageIds && filters.languageIds.length > 0) {
      where.teacherSchedules = {
        some: {
          teacher: {
            languages: {
              some: {
                languageId: { in: filters.languageIds }
              }
            }
          }
        }
      };
    }

    // Venue filter
    if (filters.venueIds && filters.venueIds.length > 0) {
      where.teacherSchedules = {
        some: {
          venueId: { in: filters.venueIds }
        }
      };
    }

    // Teacher filter
    if (filters.teacherIds && filters.teacherIds.length > 0) {
      where.teacherSchedules = {
        some: {
          teacherId: { in: filters.teacherIds }
        }
      };
    }

    // Pricing filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.currency) {
      where.servicePrices = {
        some: {
          isActive: true,
          ...(filters.minPrice !== undefined && { price: { gte: filters.minPrice } }),
          ...(filters.maxPrice !== undefined && { price: { lte: filters.maxPrice } }),
          ...(filters.currency && { currency: filters.currency })
        }
      };
    }

    // Availability filter
    if (filters.dayOfWeek || filters.timeFrom || filters.timeTo) {
      where.teacherSchedules = {
        some: {
          ...(filters.dayOfWeek && { dayOfWeek: filters.dayOfWeek }),
          ...(filters.timeFrom && { startTime: { gte: filters.timeFrom } }),
          ...(filters.timeTo && { endTime: { lte: filters.timeTo } }),
          isAvailable: true
        }
      };
    }

    // Build orderBy clause
    const orderBy: Record<string, unknown> = {};
    if (sortBy === 'featured') {
      orderBy.featured = 'desc';
    } else if (sortBy === 'price') {
      orderBy.servicePrices = {
        _count: 'desc'
      };
    } else if (sortBy === 'rating') {
      orderBy.testimonials = {
        _count: 'desc'
      };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Execute query with all relationships
    const [services, total] = await Promise.all([
      prisma.serviceType.findMany({
        where,
        skip,
        take: limit,
        include: {
          // Rich content
          testimonials: {
            where: { isActive: true },
            orderBy: { rating: 'desc' },
            take: 3,
            select: {
              id: true,
              text: true,
              authorName: true,
              authorTitle: true,
              authorImage: true,
              rating: true,
              isVerified: true
            }
          },
          faqs: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
            select: {
              id: true,
              question: true,
              answer: true,
              category: true
            }
          },
          // Pricing information
          servicePrices: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            select: {
              id: true,
              price: true,
              currency: true,
              pricingType: true,
              venue: {
                select: {
                  id: true,
                  name: true,
                  city: true
                }
              },
              teacher: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          // Teacher and venue information
          teacherSchedules: {
            where: { isAvailable: true },
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                  specialties: {
                    include: {
                      specialty: true
                    }
                  },
                  languages: {
                    include: {
                      language: true
                    }
                  }
                }
              },
              venue: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  city: true,
                  amenities: {
                    include: {
                      amenity: true
                    }
                  }
                }
              }
            }
          },
          // Statistics
          _count: {
            select: {
              bookings: true,
              testimonials: true
            }
          }
        },
        orderBy
      }),
      prisma.serviceType.count({ where })
    ]);

    // Calculate average rating for each service
    const servicesWithRatings = await Promise.all(
      services.map(async (service) => {
        const avgRating = await prisma.testimonial.aggregate({
          where: {
            serviceTypeId: service.id,
            isActive: true,
            rating: { not: null }
          },
          _avg: {
            rating: true
          }
        });

        return {
          ...service,
          averageRating: avgRating._avg.rating || 0
        };
      })
    );

    // Get available filters for the UI
    const availableFilters = await getAvailableFilters();

    return NextResponse.json({
      services: servicesWithRatings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: availableFilters
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error searching services:', error);
    return NextResponse.json(
      { error: 'Failed to search services' },
      { status: 500 }
    );
  }
}

// Helper function to get available filter options
async function getAvailableFilters() {
  const [amenities, specialties, languages, venues, teachers] = await Promise.all([
    prisma.amenity.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, icon: true, category: true }
    }),
    prisma.specialty.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, category: true }
    }),
    prisma.language.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, code: true, nativeName: true }
    }),
    prisma.venue.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, city: true, country: true }
    }),
    prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, avatarUrl: true }
    })
  ]);

  return {
    amenities,
    specialties,
    languages,
    venues,
    teachers,
    categories: [
      { value: 'CLASS', label: 'Class' },
      { value: 'WORKSHOP', label: 'Workshop' },
      { value: 'TRAINING_PROGRAM', label: 'Training Program' },
      { value: 'RETREAT', label: 'Retreat' },
      { value: 'CONSULTATION', label: 'Consultation' }
    ],
    difficulties: [
      { value: 'BEGINNER', label: 'Beginner' },
      { value: 'INTERMEDIATE', label: 'Intermediate' },
      { value: 'ADVANCED', label: 'Advanced' },
      { value: 'ALL_LEVELS', label: 'All Levels' }
    ]
  };
}
