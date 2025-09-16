import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, withConnection } from '@/lib/prisma';

// Zod schemas for venue validation
const createVenueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().max(100, 'City name too long').optional(),
  country: z.string().max(100, 'Country name too long').optional(),
  capacity: z.number().int().positive('Capacity must be positive').default(10),
  maxGroupSize: z.number().int().positive('Max group size must be positive').optional(),
  amenities: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  featured: z.boolean().default(false)
});

const updateVenueSchema = createVenueSchema.partial().extend({
  id: z.number().int().positive('Venue ID must be positive')
});

const querySchema = z.object({
  isActive: z.enum(['true', 'false']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  city: z.string().optional(),
  include: z.enum(['teachers', 'schedules', 'all']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 GET /api/admin/venues - Starting request...');
    
    return await withConnection(async () => {
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    console.log('🔐 Venues API: User from middleware:', { userId, userEmail, userRole });
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('✅ Admin user authenticated:', userEmail);

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

    const { isActive, featured, city, include, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { isActive, featured, city, include, page, limit });

    // Build the query
    const where: Record<string, unknown> = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (featured !== undefined) where.featured = featured === 'true';
    if (city) where.city = { contains: city, mode: 'insensitive' };

    // Base select fields
    const select: Record<string, unknown> = {
      id: true,
      name: true,
      description: true,
      address: true,
      city: true,
      country: true,
      capacity: true,
      maxGroupSize: true,
      amenities: true,
      isActive: true,
      displayOrder: true,
      featured: true,
      createdAt: true,
      updatedAt: true
    };

    // Add relationships based on include parameter
    if (include === 'teachers' || include === 'all') {
      select.teachers = {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          specialties: true,
          languages: true,
          experience: true,
          isActive: true,
          displayOrder: true,
          featured: true
        }
      };
    }

    if (include === 'schedules' || include === 'all') {
      select.scheduleTemplates = {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          capacity: true,
          isAvailable: true,
          sessionDurationId: true,
          autoAvailable: true
        }
      };
      select.teacherSchedules = {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
          maxBookings: true,
          teacher: {
            select: {
              id: true,
              name: true,
              specialties: true
            }
          }
        }
      };
    }

    // Execute query
    const [venues, totalCount] = await Promise.all([
      prisma.venue.findMany({
        where,
        select,
        orderBy: [
          { displayOrder: 'asc' },
          { name: 'asc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.venue.count({ where })
    ]);

    console.log(`✅ Found ${venues.length} venues (total: ${totalCount})`);

    return NextResponse.json({
      success: true,
      data: {
        venues,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });
    }); // Close withConnection wrapper

  } catch (error) {
    console.error('❌ Venues API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🏢 POST /api/admin/venues - Creating venue...');
    
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = createVenueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const venueData = validation.data;

    // Check if venue name already exists
    const existingVenue = await prisma.venue.findFirst({
      where: { name: venueData.name }
    });

    if (existingVenue) {
      return NextResponse.json({
        success: false,
        error: 'Venue name already exists',
        message: 'A venue with this name already exists'
      }, { status: 409 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { amenities, ...venueDataWithoutAmenities } = venueData;
    const venue = await prisma.venue.create({
      data: {
        ...venueDataWithoutAmenities,
        maxGroupSize: venueData.maxGroupSize || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        country: true,
        capacity: true,
        maxGroupSize: true,
        amenities: true,
        isActive: true,
        displayOrder: true,
        featured: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Venue created successfully:', venue.id);

    return NextResponse.json({
      success: true,
      data: venue,
      message: 'Venue created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create venue error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🏢 PUT /api/admin/venues - Updating venue...');
    
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateVenueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { id, ...updateData } = validation.data;

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id }
    });

    if (!existingVenue) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found',
        message: 'Venue with this ID does not exist'
      }, { status: 404 });
    }

    // Check if name is being changed and if new name already exists
    if (updateData.name && updateData.name !== existingVenue.name) {
      const nameExists = await prisma.venue.findFirst({
        where: { 
          name: updateData.name,
          id: { not: id }
        }
      });

      if (nameExists) {
        return NextResponse.json({
          success: false,
          error: 'Venue name already exists',
          message: 'A venue with this name already exists'
        }, { status: 409 });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { amenities, ...updateDataWithoutAmenities } = updateData;
    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...updateDataWithoutAmenities,
        maxGroupSize: updateData.maxGroupSize || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        country: true,
        capacity: true,
        maxGroupSize: true,
        amenities: true,
        isActive: true,
        displayOrder: true,
        featured: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Venue updated successfully:', venue.id);

    return NextResponse.json({
      success: true,
      data: venue,
      message: 'Venue updated successfully'
    });

  } catch (error) {
    console.error('❌ Update venue error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🏢 DELETE /api/admin/venues - Deleting venue...');
    
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing venue ID',
        message: 'Venue ID is required'
      }, { status: 400 });
    }

    const venueId = parseInt(id);
    if (isNaN(venueId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid venue ID',
        message: 'Venue ID must be a number'
      }, { status: 400 });
    }

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        teachers: true,
        bookings: true
      }
    });

    if (!existingVenue) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found',
        message: 'Venue with this ID does not exist'
      }, { status: 404 });
    }

    // Check if venue has associated data
    if (existingVenue.teachers.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete venue with teachers',
        message: 'Please remove all teachers from this venue before deleting'
      }, { status: 409 });
    }

    if (existingVenue.bookings.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete venue with bookings',
        message: 'Please handle all bookings for this venue before deleting'
      }, { status: 409 });
    }

    await prisma.venue.delete({
      where: { id: venueId }
    });

    console.log('✅ Venue deleted successfully:', venueId);

    return NextResponse.json({
      success: true,
      message: 'Venue deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete venue error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
