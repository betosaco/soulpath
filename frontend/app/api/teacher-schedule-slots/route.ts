import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/teacher-schedule-slots - Fetching teacher schedule slots...');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const available = searchParams.get('available');
    const teacherId = searchParams.get('teacherId');
    const serviceTypeId = searchParams.get('serviceTypeId');
    const venueId = searchParams.get('venueId');

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (available === 'true') {
      whereClause.isAvailable = true;
    }

    if (teacherId) {
      whereClause.teacherSchedule = {
        ...(whereClause.teacherSchedule || {}),
        teacherId: parseInt(teacherId)
      };
    }

    if (serviceTypeId) {
      whereClause.teacherSchedule = {
        ...(whereClause.teacherSchedule || {}),
        serviceTypeId: parseInt(serviceTypeId)
      };
    }

    if (venueId) {
      whereClause.teacherSchedule = {
        ...(whereClause.teacherSchedule || {}),
        venueId: parseInt(venueId)
      };
    }

    // Show current week starting from today
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so 6 days to Monday
    startOfWeek.setDate(today.getDate() - daysToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Show one week

    whereClause.startTime = {
      ...(whereClause.startTime || {}),
      gte: startOfWeek,
      lt: endOfWeek
    };

    console.log('📅 Current week range:', {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    });

    // Fetch schedule slots from database
    const slots = await prisma.teacherScheduleSlot.findMany({
      where: whereClause,
      include: {
        teacherSchedule: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                bio: true,
                shortBio: true,
                experience: true,
                avatarUrl: true
              }
            },
            serviceType: {
              select: {
                id: true,
                name: true,
                description: true,
                shortDescription: true,
                duration: true,
                difficulty: true,
                color: true,
                icon: true
              }
            },
            venue: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true
              }
            }
          }
        }
      },
      orderBy: [
        { startTime: 'asc' }
      ]
    });

    // Transform the data to match the expected format with proper EST timezone conversion
    const transformedSlots = slots.map(slot => {
      // Convert UTC time to EST (UTC-5) using proper timezone handling
      const startTime = new Date(slot.startTime);
      
      // Convert to EST by subtracting 5 hours
      const estTime = new Date(startTime.getTime() - (5 * 60 * 60 * 1000));
      
      // Format date as YYYY-MM-DD
      const date = estTime.toISOString().split('T')[0];
      
      // Format time as HH:MM in 24-hour format
      const hours = estTime.getUTCHours().toString().padStart(2, '0');
      const minutes = estTime.getUTCMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      
      // Get the actual day of week from the EST date
      const actualDayOfWeek = estTime.toLocaleDateString('en-US', { 
        weekday: 'long',
        timeZone: 'America/New_York'
      });
      
      return {
        id: slot.id,
        date,
        time,
        isAvailable: slot.isAvailable && (slot.maxBookings === null || (slot.bookedCount || 0) < slot.maxBookings),
        capacity: slot.maxBookings || 15,
        bookedCount: slot.bookedCount || 0,
        duration: slot.teacherSchedule.serviceType?.duration || 60,
        teacher: slot.teacherSchedule.teacher,
        serviceType: slot.teacherSchedule.serviceType,
        venue: slot.teacherSchedule.venue,
        dayOfWeek: actualDayOfWeek
      };
    });

    // Filter out Sunday classes (safety check)
    const filteredSlots = transformedSlots.filter(slot => slot.dayOfWeek !== 'Sunday');

    console.log(`✅ Found ${filteredSlots.length} teacher schedule slots (filtered out Sunday classes)`);

    return NextResponse.json({
      success: true,
      slots: filteredSlots
    });

  } catch (error) {
    console.error('❌ Error in GET /api/teacher-schedule-slots:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch teacher schedule slots',
      message: 'An error occurred while fetching teacher schedule slots'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
