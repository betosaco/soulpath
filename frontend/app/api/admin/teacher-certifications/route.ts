import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Zod schemas for teacher certification validation
const createCertificationSchema = z.object({
  teacherId: z.number().int().positive('Teacher ID must be positive'),
  name: z.string().min(1, 'Certification name is required').max(255, 'Name too long'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required').max(255, 'Organization name too long'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().max(100, 'Credential ID too long').optional(),
  credentialUrl: z.string().url('Invalid credential URL').optional(),
  description: z.string().optional(),
  isVerified: z.boolean().default(false),
  displayOrder: z.number().int().default(0)
});

const updateCertificationSchema = createCertificationSchema.partial().extend({
  id: z.number().int().positive('Certification ID must be positive')
});

const querySchema = z.object({
  teacherId: z.coerce.number().int().positive().optional(),
  isVerified: z.enum(['true', 'false']).optional(),
  include: z.enum(['teacher', 'all']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    console.log('🏆 GET /api/admin/teacher-certifications - Starting request...');
    
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

    const { teacherId, isVerified, include, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { teacherId, isVerified, include, page, limit });

    // Build the query
    const where: Record<string, unknown> = {};
    if (teacherId) where.teacherId = teacherId;
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';

    // Base select fields
    const select: Record<string, unknown> = {
      id: true,
      teacherId: true,
      name: true,
      issuingOrganization: true,
      issueDate: true,
      expiryDate: true,
      credentialId: true,
      credentialUrl: true,
      description: true,
      isVerified: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true
    };

    // Add relationships based on include parameter
    if (include === 'teacher' || include === 'all') {
      select.teacher = {
        select: {
          id: true,
          name: true,
          email: true,
          specialties: true,
          experience: true,
          isActive: true
        }
      };
    }

    // Execute query
    const [certifications, totalCount] = await Promise.all([
      prisma.teacherCertification.findMany({
        where,
        select,
        orderBy: [
          { teacherId: 'asc' },
          { displayOrder: 'asc' },
          { issueDate: 'desc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.teacherCertification.count({ where })
    ]);

    console.log(`✅ Found ${certifications.length} certifications (total: ${totalCount})`);

    return NextResponse.json({
      success: true,
      data: {
        certifications,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Teacher certifications API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🏆 POST /api/admin/teacher-certifications - Creating certification...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = createCertificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const certificationData = validation.data;

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: certificationData.teacherId }
    });

    if (!teacher) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found',
        message: 'The specified teacher does not exist'
      }, { status: 404 });
    }

    // Parse dates
    const processedData = {
      ...certificationData,
      issueDate: certificationData.issueDate ? new Date(certificationData.issueDate) : null,
      expiryDate: certificationData.expiryDate ? new Date(certificationData.expiryDate) : null
    };

    const certification = await prisma.teacherCertification.create({
      data: processedData,
      select: {
        id: true,
        teacherId: true,
        name: true,
        issuingOrganization: true,
        issueDate: true,
        expiryDate: true,
        credentialId: true,
        credentialUrl: true,
        description: true,
        isVerified: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Certification created successfully:', certification.id);

    return NextResponse.json({
      success: true,
      data: certification,
      message: 'Certification created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create certification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🏆 PUT /api/admin/teacher-certifications - Updating certification...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateCertificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { id, ...updateData } = validation.data;

    // Check if certification exists
    const existingCertification = await prisma.teacherCertification.findUnique({
      where: { id }
    });

    if (!existingCertification) {
      return NextResponse.json({
        success: false,
        error: 'Certification not found',
        message: 'Certification with this ID does not exist'
      }, { status: 404 });
    }

    // Check if teacher exists (if being updated)
    if (updateData.teacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: updateData.teacherId }
      });

      if (!teacher) {
        return NextResponse.json({
          success: false,
          error: 'Teacher not found',
          message: 'The specified teacher does not exist'
        }, { status: 404 });
      }
    }

    // Parse dates
    const processedData = {
      ...updateData,
      issueDate: updateData.issueDate ? new Date(updateData.issueDate) : undefined,
      expiryDate: updateData.expiryDate ? new Date(updateData.expiryDate) : undefined
    };

    const certification = await prisma.teacherCertification.update({
      where: { id },
      data: processedData,
      select: {
        id: true,
        teacherId: true,
        name: true,
        issuingOrganization: true,
        issueDate: true,
        expiryDate: true,
        credentialId: true,
        credentialUrl: true,
        description: true,
        isVerified: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Certification updated successfully:', certification.id);

    return NextResponse.json({
      success: true,
      data: certification,
      message: 'Certification updated successfully'
    });

  } catch (error) {
    console.error('❌ Update certification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🏆 DELETE /api/admin/teacher-certifications - Deleting certification...');
    
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
        error: 'Missing certification ID',
        message: 'Certification ID is required'
      }, { status: 400 });
    }

    const certificationId = parseInt(id);
    if (isNaN(certificationId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid certification ID',
        message: 'Certification ID must be a number'
      }, { status: 400 });
    }

    // Check if certification exists
    const existingCertification = await prisma.teacherCertification.findUnique({
      where: { id: certificationId }
    });

    if (!existingCertification) {
      return NextResponse.json({
        success: false,
        error: 'Certification not found',
        message: 'Certification with this ID does not exist'
      }, { status: 404 });
    }

    await prisma.teacherCertification.delete({
      where: { id: certificationId }
    });

    console.log('✅ Certification deleted successfully:', certificationId);

    return NextResponse.json({
      success: true,
      message: 'Certification deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete certification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
