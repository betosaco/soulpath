import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Zod schemas for package service validation
const createPackageServiceSchema = z.object({
  packageDefinitionId: z.number().int().positive('Package definition ID must be positive'),
  serviceTypeId: z.number().int().positive('Service type ID must be positive'),
  sessionsIncluded: z.number().int().positive('Sessions included must be positive').default(1),
  isActive: z.boolean().default(true)
});

const updatePackageServiceSchema = createPackageServiceSchema.partial().extend({
  id: z.number().int().positive('Package service ID must be positive')
});

const querySchema = z.object({
  packageDefinitionId: z.coerce.number().int().positive().optional(),
  serviceTypeId: z.coerce.number().int().positive().optional(),
  category: z.enum(['class', 'workshop', 'training_program']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  include: z.enum(['package', 'service', 'all']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    console.log('📦 GET /api/admin/package-services - Starting request...');
    
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

    const { packageDefinitionId, serviceTypeId, category, isActive, include, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { packageDefinitionId, serviceTypeId, category, isActive, include, page, limit });

    // Build the query
    const where: Record<string, unknown> = {};
    if (packageDefinitionId) where.packageDefinitionId = packageDefinitionId;
    if (serviceTypeId) where.serviceTypeId = serviceTypeId;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    // Add category filter through service type
    if (category) {
      where.serviceType = {
        category: category
      };
    }

    // Base select fields
    const select: Record<string, unknown> = {
      id: true,
      packageDefinitionId: true,
      serviceTypeId: true,
      sessionsIncluded: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    };

    // Add relationships based on include parameter
    if (include === 'package' || include === 'all') {
      select.packageDefinition = {
        select: {
          id: true,
          name: true,
          description: true,
          packageType: true,
          sessionsCount: true,
          isActive: true,
          isGlobal: true
        }
      };
    }

    if (include === 'service' || include === 'all') {
      select.serviceType = {
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          duration: true,
          maxParticipants: true,
          minParticipants: true,
          requirements: true,
          color: true,
          icon: true,
          isActive: true
        }
      };
    }

    // Execute query
    const [packageServices, totalCount] = await Promise.all([
      prisma.packageService.findMany({
        where,
        select,
        orderBy: [
          { packageDefinitionId: 'asc' },
          { serviceTypeId: 'asc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.packageService.count({ where })
    ]);

    console.log(`✅ Found ${packageServices.length} package services (total: ${totalCount})`);

    return NextResponse.json({
      success: true,
      data: {
        packageServices,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Package services API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📦 POST /api/admin/package-services - Creating package service...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = createPackageServiceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const packageServiceData = validation.data;

    // Check if package definition exists
    const packageDefinition = await prisma.packageDefinition.findUnique({
      where: { id: packageServiceData.packageDefinitionId }
    });

    if (!packageDefinition) {
      return NextResponse.json({
        success: false,
        error: 'Package definition not found',
        message: 'The specified package definition does not exist'
      }, { status: 404 });
    }

    // Check if service type exists
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: packageServiceData.serviceTypeId }
    });

    if (!serviceType) {
      return NextResponse.json({
        success: false,
        error: 'Service type not found',
        message: 'The specified service type does not exist'
      }, { status: 404 });
    }

    // Check if relationship already exists
    const existingPackageService = await prisma.packageService.findFirst({
      where: {
        packageDefinitionId: packageServiceData.packageDefinitionId,
        serviceTypeId: packageServiceData.serviceTypeId
      }
    });

    if (existingPackageService) {
      return NextResponse.json({
        success: false,
        error: 'Package service relationship already exists',
        message: 'This package already includes this service type'
      }, { status: 409 });
    }

    const packageService = await prisma.packageService.create({
      data: packageServiceData,
      select: {
        id: true,
        packageDefinitionId: true,
        serviceTypeId: true,
        sessionsIncluded: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Package service created successfully:', packageService.id);

    return NextResponse.json({
      success: true,
      data: packageService,
      message: 'Package service relationship created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create package service error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('📦 PUT /api/admin/package-services - Updating package service...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = updatePackageServiceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { id, ...updateData } = validation.data;

    // Check if package service exists
    const existingPackageService = await prisma.packageService.findUnique({
      where: { id }
    });

    if (!existingPackageService) {
      return NextResponse.json({
        success: false,
        error: 'Package service not found',
        message: 'Package service with this ID does not exist'
      }, { status: 404 });
    }

    // Check if package definition exists (if being updated)
    if (updateData.packageDefinitionId) {
      const packageDefinition = await prisma.packageDefinition.findUnique({
        where: { id: updateData.packageDefinitionId }
      });

      if (!packageDefinition) {
        return NextResponse.json({
          success: false,
          error: 'Package definition not found',
          message: 'The specified package definition does not exist'
        }, { status: 404 });
      }
    }

    // Check if service type exists (if being updated)
    if (updateData.serviceTypeId) {
      const serviceType = await prisma.serviceType.findUnique({
        where: { id: updateData.serviceTypeId }
      });

      if (!serviceType) {
        return NextResponse.json({
          success: false,
          error: 'Service type not found',
          message: 'The specified service type does not exist'
        }, { status: 404 });
      }
    }

    // Check for conflicts if package or service is being changed
    if (updateData.packageDefinitionId || updateData.serviceTypeId) {
      const packageDefinitionId = updateData.packageDefinitionId || existingPackageService.packageDefinitionId;
      const serviceTypeId = updateData.serviceTypeId || existingPackageService.serviceTypeId;

      const conflictingPackageService = await prisma.packageService.findFirst({
        where: {
          packageDefinitionId,
          serviceTypeId,
          id: { not: id }
        }
      });

      if (conflictingPackageService) {
        return NextResponse.json({
          success: false,
          error: 'Package service conflict',
          message: 'This package already includes this service type'
        }, { status: 409 });
      }
    }

    const packageService = await prisma.packageService.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        packageDefinitionId: true,
        serviceTypeId: true,
        sessionsIncluded: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Package service updated successfully:', packageService.id);

    return NextResponse.json({
      success: true,
      data: packageService,
      message: 'Package service relationship updated successfully'
    });

  } catch (error) {
    console.error('❌ Update package service error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('📦 DELETE /api/admin/package-services - Deleting package service...');
    
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
        error: 'Missing package service ID',
        message: 'Package service ID is required'
      }, { status: 400 });
    }

    const packageServiceId = parseInt(id);
    if (isNaN(packageServiceId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid package service ID',
        message: 'Package service ID must be a number'
      }, { status: 400 });
    }

    // Check if package service exists
    const existingPackageService = await prisma.packageService.findUnique({
      where: { id: packageServiceId }
    });

    if (!existingPackageService) {
      return NextResponse.json({
        success: false,
        error: 'Package service not found',
        message: 'Package service with this ID does not exist'
      }, { status: 404 });
    }

    await prisma.packageService.delete({
      where: { id: packageServiceId }
    });

    console.log('✅ Package service deleted successfully:', packageServiceId);

    return NextResponse.json({
      success: true,
      message: 'Package service relationship deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete package service error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
