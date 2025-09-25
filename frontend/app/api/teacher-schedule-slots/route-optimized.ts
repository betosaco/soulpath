import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cache, cacheKeys, cacheTTL } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/teacher-schedule-slots - Fetching teacher schedule slots...');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const available = searchParams.get('available');
    const teacherId = searchParams.get('teacherId');
    const serviceTypeId = searchParams.get('serviceTypeId');
    const venueId = searchParams.get('venueId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Generate cache key
    const cacheKey = cacheKeys.schedule(startDate || undefined, endDate || undefined, available === 'true');
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      console.log('✅ Returning cached schedule data');
      return NextResponse.json({
        success: true,
        slots: cachedData,
        cached: true
      });
    }

    // Build optimized where clause
    const whereClause: Record<string, unknown> = {};

    if (available === 'true') {
      whereClause.isAvailable = true;
    }

    // Determine date range
    let dateStart: Date;
    let dateEnd: Date;

    if (startDate && endDate) {
      dateStart = new Date(startDate);
      dateEnd = new Date(endDate);
      dateEnd.setHours(23, 59, 59, 999);
    } else {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      dateStart = new Date(now);
      dateEnd = new Date(today);
      dateEnd.setDate(today.getDate() + 14);

      dateStart.setUTCHours(dateStart.getUTCHours(), dateStart.getUTCMinutes(), dateStart.getUTCSeconds(), dateStart.getUTCMilliseconds());
      dateEnd.setUTCHours(23, 59, 59, 999);
    }

    whereClause.startTime = {
      gte: dateStart,
      lte: dateEnd
    };

    // Add teacher/service/venue filters if provided
    if (teacherId || serviceTypeId || venueId) {
      whereClause.teacherSchedule = {} as any;
      if (teacherId) (whereClause.teacherSchedule as any).teacherId = parseInt(teacherId);
      if (serviceTypeId) (whereClause.teacherSchedule as any).serviceTypeId = parseInt(serviceTypeId);
      if (venueId) (whereClause.teacherSchedule as any).venueId = parseInt(venueId);
    }

    console.log('📅 Date range:', {
      start: dateStart.toISOString().split('T')[0],
      end: dateEnd.toISOString().split('T')[0],
      custom: !!(startDate && endDate)
    });

    // Optimized query with selective includes and better performance
    const slots = await prisma.teacherScheduleSlot.findMany({
      where: whereClause,
      select: {
        id: true,
        startTime: true,
        isAvailable: true,
        maxBookings: true,
        bookedCount: true,
        teacherSchedule: {
          select: {
            teacher: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            },
            serviceType: {
              select: {
                id: true,
                name: true,
                duration: true,
                icon: true
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
        }
      },
      orderBy: { startTime: 'asc' }
    });

    // Transform the data efficiently
    const transformedSlots = slots.map(slot => {
      const startTime = new Date(slot.startTime);
      const estTime = new Date(startTime.getTime() - (5 * 60 * 60 * 1000));

      const date = estTime.toISOString().split('T')[0];
      const hours = estTime.getUTCHours().toString().padStart(2, '0');
      const minutes = estTime.getUTCMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;

      const actualDayOfWeek = estTime.toLocaleDateString('en-US', {
        weekday: 'long',
        timeZone: 'UTC'
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
        dayOfWeek: actualDayOfWeek,
        dayOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(actualDayOfWeek)
      };
    });

    // Sort by date and time
    transformedSlots.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });

    console.log(`✅ Found ${slots.length} raw slots, ${transformedSlots.length} transformed slots`);

    // Cache the result
    await cache.set(cacheKey, transformedSlots, cacheTTL.schedule);

    return NextResponse.json({
      success: true,
      slots: transformedSlots
    });

  } catch (error) {
    console.error('❌ Error in GET /api/teacher-schedule-slots:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error && (
      error.message.includes('denied access') ||
      error.message.includes('Can\'t reach database server') ||
      error.message.includes('PrismaClientInitializationError') ||
      error.message.includes('not available during build phase')
    )) {
      console.log('🔄 Database unavailable, returning mock data for development');
      
      const mockSlots = generateMockScheduleSlots();
      
      return NextResponse.json({
        success: true,
        slots: mockSlots,
        message: 'Using mock data - database unavailable'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch teacher schedule slots',
      message: 'An error occurred while fetching teacher schedule slots'
    }, { status: 500 });
  }
}

// Generate mock schedule slots for development
function generateMockScheduleSlots() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - daysToMonday);

  const mockSlots: Array<{
    id: string;
    date: string;
    time: string;
    teacherId: string;
    serviceTypeId: string;
    venueId: string;
    isAvailable: boolean;
  }> = [];
  const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30', '20:00'];

  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + day);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Generate 3-5 slots per day
    const slotsPerDay = Math.floor(Math.random() * 3) + 3;
    const selectedTimes = timeSlots.sort(() => 0.5 - Math.random()).slice(0, slotsPerDay);

    selectedTimes.forEach((time, index) => {
      mockSlots.push({
        id: `mock_${day}_${index}`,
        date: dateStr,
        time,
        teacherId: `teacher_${Math.floor(Math.random() * 3) + 1}`,
        serviceTypeId: `service_${Math.floor(Math.random() * 3) + 1}`,
        venueId: `venue_${Math.floor(Math.random() * 2) + 1}`,
        isAvailable: Math.random() > 0.2 // 80% availability
      });
    });
  }

  return mockSlots.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
}
