import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('👨‍🏫 GET /api/teachers/[id] - Starting request...');

    const { id } = params;
    const teacherId = parseInt(id);

    if (isNaN(teacherId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid teacher ID',
        message: 'Teacher ID must be a number'
      }, { status: 400 });
    }

    console.log('🔍 Fetching teacher:', teacherId);

    // Try to find by ID first, then by slug
    const teacher = await prisma.teacher.findFirst({
      where: {
        OR: [
          { id: teacherId },
          { slug: id }
        ],
        isActive: true
      },
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
        },
        teacherSchedules: {
          where: { isAvailable: true },
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            maxBookings: true,
            specialties: true,
            serviceType: {
              select: {
                id: true,
                name: true,
                category: true,
                duration: true,
                color: true,
                icon: true
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
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' }
          ]
        }
      }
    });

    if (!teacher) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found',
        message: 'The requested teacher does not exist or is not available'
      }, { status: 404 });
    }

    console.log('✅ Teacher found:', teacher.name);

    // Get related teachers (same venue or similar specialties)
    const relatedTeachers = await prisma.teacher.findMany({
      where: {
        isActive: true,
        id: { not: teacher.id },
        OR: [
          { venueId: teacher.venue?.id },
          { specialties: { hasSome: teacher.specialties } }
        ]
      },
      select: {
        id: true,
        name: true,
        shortBio: true,
        specialties: true,
        experience: true,
        avatarUrl: true,
        slug: true,
        featured: true
      },
      orderBy: [
        { featured: 'desc' },
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      take: 4
    });

    // Get teacher's upcoming classes/sessions
    const upcomingSessions = await prisma.teacherScheduleSlot.findMany({
      where: {
        teacherSchedule: {
          teacherId: teacher.id
        },
        startTime: {
          gte: new Date()
        },
        isAvailable: true
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        maxBookings: true,
        bookedCount: true,
        teacherSchedule: {
          select: {
            dayOfWeek: true,
            serviceType: {
              select: {
                id: true,
                name: true,
                category: true,
                duration: true,
                color: true
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
      orderBy: { startTime: 'asc' },
      take: 10
    });

    // Get teacher's recent reviews/testimonials (if you have a reviews system)
    // For now, we'll return empty array
    const reviews = [];

    return NextResponse.json({
      success: true,
      data: {
        ...teacher,
        relatedTeachers,
        upcomingSessions,
        reviews
      }
    });

  } catch (error) {
    console.error('❌ Teacher profile API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
