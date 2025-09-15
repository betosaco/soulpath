import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🎯 GET /api/services/[id] - Starting request...');

    const { id } = params;
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid service ID',
        message: 'Service ID must be a number'
      }, { status: 400 });
    }

    console.log('🔍 Fetching service:', serviceId);

    // Try to find by ID first, then by slug
    const service = await prisma.serviceType.findFirst({
      where: {
        OR: [
          { id: serviceId },
          { slug: id }
        ],
        isActive: true
      },
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
        content: true,
        highlights: true,
        testimonials: true,
        faq: true,
        metaTitle: true,
        metaDescription: true,
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
                email: true,
                phone: true,
                bio: true,
                specialties: true,
                languages: true,
                experience: true,
                avatarUrl: true,
                isActive: true
              }
            },
            venue: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                country: true,
                capacity: true,
                amenities: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json({
        success: false,
        error: 'Service not found',
        message: 'The requested service does not exist or is not available'
      }, { status: 404 });
    }

    console.log('✅ Service found:', service.name);

    // Get related services
    const relatedServices = await prisma.serviceType.findMany({
      where: {
        category: service.category,
        isActive: true,
        id: { not: service.id }
      },
      select: {
        id: true,
        name: true,
        shortDescription: true,
        category: true,
        duration: true,
        maxParticipants: true,
        minParticipants: true,
        price: true,
        currency: true,
        coverImage: true,
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

    return NextResponse.json({
      success: true,
      data: {
        ...service,
        relatedServices
      }
    });

  } catch (error) {
    console.error('❌ Service detail API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
