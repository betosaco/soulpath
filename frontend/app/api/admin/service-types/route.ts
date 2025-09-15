import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Zod schemas for service type validation
const createServiceTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  category: z.enum(['class', 'workshop', 'training_program']),
  duration: z.number().int().positive('Duration must be positive').default(60),
  maxParticipants: z.number().int().positive('Max participants must be positive').optional(),
  minParticipants: z.number().int().positive('Min participants must be positive').default(1),
  requirements: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  featured: z.boolean().default(false),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  icon: z.string().max(50, 'Icon name too long').optional()
});

const updateServiceTypeSchema = createServiceTypeSchema.partial().extend({
  id: z.number().int().positive('Service type ID must be positive')
});

const querySchema = z.object({
  category: z.enum(['class', 'workshop', 'training_program']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  include: z.enum(['packages', 'teachers', 'all']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    console.log('🎯 GET /api/admin/service-types - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('✅ Admin user authenticated:', user.email);

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

    const { category, isActive, featured, include, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { category, isActive, featured, include, page, limit });

    // Build the query
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (featured !== undefined) where.featured = featured === 'true';

    // Base select fields
    const select: Record<string, unknown> = {
      id: true,
      name: true,
      description: true,
      category: true,
      duration: true,
      maxParticipants: true,
      minParticipants: true,
      requirements: true,
      isActive: true,
      displayOrder: true,
      featured: true,
      color: true,
      icon: true,
      createdAt: true,
      updatedAt: true
    };

    // Add relationships based on include parameter
    if (include === 'packages' || include === 'all') {
      select.packageServices = {
        select: {
          id: true,
          sessionsIncluded: true,
          isActive: true,
          packageDefinition: {
            select: {
              id: true,
              name: true,
              packageType: true,
              isActive: true
            }
          }
        }
      };
    }

    if (include === 'teachers' || include === 'all') {
      select.teacherSchedules = {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
          teacher: {
            select: {
              id: true,
              name: true,
              specialties: true,
              isActive: true
            }
          },
          venue: {
            select: {
              id: true,
              name: true,
              city: true
            }
          }
        }
      };
    }

    // Execute query
    const [serviceTypes, totalCount] = await Promise.all([
      prisma.serviceType.findMany({
        where,
        select,
        orderBy: [
          { category: 'asc' },
          { displayOrder: 'asc' },
          { name: 'asc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.serviceType.count({ where })
    ]);

    console.log(`✅ Found ${serviceTypes.length} service types (total: ${totalCount})`);

    return NextResponse.json({
      success: true,
      data: {
        serviceTypes,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Service types API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 POST /api/admin/service-types - Creating service type...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = createServiceTypeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const serviceTypeData = validation.data;

    // Check if service type name already exists for this category
    const existingServiceType = await prisma.serviceType.findFirst({
      where: { 
        name: serviceTypeData.name,
        category: serviceTypeData.category.toUpperCase() as 'CLASS' | 'WORKSHOP' | 'TRAINING_PROGRAM'
      }
    });

    if (existingServiceType) {
      return NextResponse.json({
        success: false,
        error: 'Service type name already exists',
        message: `A ${serviceTypeData.category} with this name already exists`
      }, { status: 409 });
    }

    const serviceType = await prisma.serviceType.create({
      data: {
        ...serviceTypeData,
        category: serviceTypeData.category.toUpperCase() as 'CLASS' | 'WORKSHOP' | 'TRAINING_PROGRAM',
        maxParticipants: serviceTypeData.maxParticipants || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        duration: true,
        maxParticipants: true,
        minParticipants: true,
        requirements: true,
        isActive: true,
        displayOrder: true,
        featured: true,
        color: true,
        icon: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Service type created successfully:', serviceType.id);

    return NextResponse.json({
      success: true,
      data: serviceType,
      message: 'Service type created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create service type error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🎯 PUT /api/admin/service-types - Updating service type...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateServiceTypeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { id, ...updateData } = validation.data;

    // Check if service type exists
    const existingServiceType = await prisma.serviceType.findUnique({
      where: { id }
    });

    if (!existingServiceType) {
      return NextResponse.json({
        success: false,
        error: 'Service type not found',
        message: 'Service type with this ID does not exist'
      }, { status: 404 });
    }

    // Check if name is being changed and if new name already exists for this category
    if (updateData.name && updateData.name !== existingServiceType.name) {
      const nameExists = await prisma.serviceType.findFirst({
        where: { 
          name: updateData.name,
          category: updateData.category ? updateData.category.toUpperCase() as 'CLASS' | 'WORKSHOP' | 'TRAINING_PROGRAM' : existingServiceType.category,
          id: { not: id }
        }
      });

      if (nameExists) {
        return NextResponse.json({
          success: false,
          error: 'Service type name already exists',
          message: `A ${updateData.category || existingServiceType.category} with this name already exists`
        }, { status: 409 });
      }
    }

    const serviceType = await prisma.serviceType.update({
      where: { id },
      data: {
        ...updateData,
        category: updateData.category ? updateData.category.toUpperCase() as 'CLASS' | 'WORKSHOP' | 'TRAINING_PROGRAM' : undefined,
        maxParticipants: updateData.maxParticipants || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        duration: true,
        maxParticipants: true,
        minParticipants: true,
        requirements: true,
        isActive: true,
        displayOrder: true,
        featured: true,
        color: true,
        icon: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Service type updated successfully:', serviceType.id);

    return NextResponse.json({
      success: true,
      data: serviceType,
      message: 'Service type updated successfully'
    });

  } catch (error) {
    console.error('❌ Update service type error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🎯 DELETE /api/admin/service-types - Deleting service type...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
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
        error: 'Missing service type ID',
        message: 'Service type ID is required'
      }, { status: 400 });
    }

    const serviceTypeId = parseInt(id);
    if (isNaN(serviceTypeId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid service type ID',
        message: 'Service type ID must be a number'
      }, { status: 400 });
    }

    // Check if service type exists
    const existingServiceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
      include: {
        teacherSchedules: true,
        packageServices: true,
        bookings: true
      }
    });

    if (!existingServiceType) {
      return NextResponse.json({
        success: false,
        error: 'Service type not found',
        message: 'Service type with this ID does not exist'
      }, { status: 404 });
    }

    // Check if service type has associated data
    if (existingServiceType.teacherSchedules.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete service type with schedules',
        message: 'Please remove all teacher schedules for this service type before deleting'
      }, { status: 409 });
    }

    if (existingServiceType.packageServices.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete service type with package relationships',
        message: 'Please remove all package relationships for this service type before deleting'
      }, { status: 409 });
    }

    if (existingServiceType.bookings.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete service type with bookings',
        message: 'Please handle all bookings for this service type before deleting'
      }, { status: 409 });
    }

    await prisma.serviceType.delete({
      where: { id: serviceTypeId }
    });

    console.log('✅ Service type deleted successfully:', serviceTypeId);

    return NextResponse.json({
      success: true,
      message: 'Service type deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete service type error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
