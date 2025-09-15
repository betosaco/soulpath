import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Validation schemas for the new schema
const CreateTeacherSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  shortBio: z.string().max(500).optional(),
  experience: z.number().min(0).optional(),
  avatarUrl: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  galleryImages: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  teachingStyle: z.string().optional(),
  philosophy: z.string().optional(),
  approach: z.string().optional(),
  maxStudents: z.number().min(1).optional(),
  minStudents: z.number().min(1).optional(),
  preferredTimes: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
  featured: z.boolean().optional(),
  slug: z.string().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  venueId: z.number().optional(),
  // New relationship fields
  specialtyIds: z.array(z.number()).optional(),
  languageIds: z.array(z.number()).optional(),
});

const UpdateTeacherSchema = CreateTeacherSchema.partial();

// GET /api/admin/teachers - List teachers with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const specialty = searchParams.get('specialty');
    const language = searchParams.get('language');
    const venueId = searchParams.get('venueId');
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Build where clause with new relationships
    const where: Prisma.TeacherWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { shortBio: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (specialty) {
      where.specialties = {
        some: {
          specialty: {
            name: { contains: specialty, mode: 'insensitive' }
          }
        }
      };
    }

    if (language) {
      where.languages = {
        some: {
          language: {
            OR: [
              { name: { contains: language, mode: 'insensitive' } },
              { code: { contains: language, mode: 'insensitive' } }
            ]
          }
        }
      };
    }

    if (venueId) {
      where.venueId = parseInt(venueId);
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              amenities: {
                include: {
                  amenity: true
                }
              }
            }
          },
          specialties: {
            include: {
              specialty: true
            }
          },
          languages: {
            include: {
              language: true
            }
          },
          certifications: {
            where: { isVerified: true },
            orderBy: { displayOrder: 'asc' }
          },
          testimonials: {
            where: { isActive: true },
            orderBy: { rating: 'desc' },
            take: 3
          },
          faqs: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' }
          },
          _count: {
            select: {
              bookings: true,
              teacherSchedules: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { displayOrder: 'asc' },
          { name: 'asc' }
        ]
      }),
      prisma.teacher.count({ where })
    ]);

    return NextResponse.json({
      teachers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

// POST /api/admin/teachers - Create teacher with relationships
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateTeacherSchema.parse(body);

    const {
      specialtyIds = [],
      languageIds = [],
      ...teacherData
    } = validatedData;

    // Create teacher with relationships
    const teacher = await prisma.teacher.create({
      data: {
        ...teacherData,
        specialties: {
          create: specialtyIds.map((specialtyId: number) => ({
            specialty: { connect: { id: specialtyId } }
          }))
        },
        languages: {
          create: languageIds.map((languageId: number) => ({
            language: { connect: { id: languageId } }
          }))
        }
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
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
    });

    return NextResponse.json(teacher, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/teachers/[id] - Update teacher with relationships
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = parseInt(searchParams.get('id') || '0');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateTeacherSchema.parse(body);

    const {
      specialtyIds,
      languageIds,
      ...teacherData
    } = validatedData;

    // Update teacher with relationships
    const updateData: Prisma.TeacherUpdateInput = { ...teacherData };

    if (specialtyIds !== undefined) {
      // Replace existing specialties
      updateData.specialties = {
        deleteMany: {},
        create: specialtyIds.map((specialtyId: number) => ({
          specialty: { connect: { id: specialtyId } }
        }))
      };
    }

    if (languageIds !== undefined) {
      // Replace existing languages
      updateData.languages = {
        deleteMany: {},
        create: languageIds.map((languageId: number) => ({
          language: { connect: { id: languageId } }
        }))
      };
    }

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: updateData,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
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
    });

    return NextResponse.json(teacher);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/teachers/[id] - Delete teacher
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = parseInt(searchParams.get('id') || '0');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // Check if teacher has active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        teacherId,
        status: { in: ['CONFIRMED', 'PENDING'] }
      }
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete teacher with active bookings' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.teacher.update({
      where: { id: teacherId },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'Teacher deactivated successfully' });

  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { error: 'Failed to delete teacher' },
      { status: 500 }
    );
  }
}