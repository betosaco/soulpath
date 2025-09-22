import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Determine date range
    let dateStart: Date;
    let dateEnd: Date;

    if (startDate && endDate) {
      // Use custom date range
      dateStart = new Date(startDate);
      dateEnd = new Date(endDate);
      dateEnd.setHours(23, 59, 59, 999); // Include the entire end date
    } else {
      // Default to current week
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so 6 days to Monday
      startOfWeek.setDate(today.getDate() - daysToMonday);

      dateStart = startOfWeek;
      dateEnd = new Date(startOfWeek);
      dateEnd.setDate(startOfWeek.getDate() + 7); // Show one week
    }

    whereClause.startTime = {
      ...(whereClause.startTime || {}),
      gte: dateStart,
      lte: dateEnd
    };

    console.log('📅 Date range:', {
      start: dateStart.toISOString().split('T')[0],
      end: dateEnd.toISOString().split('T')[0],
      custom: !!(startDate && endDate),
      startTime: dateStart.toISOString(),
      endTime: dateEnd.toISOString()
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

    // Transform the data to match the expected format - times are already stored in EST
    const transformedSlots = slots.map(slot => {
      // Times are already stored in EST format, no conversion needed
      const startTime = new Date(slot.startTime);
      
      // Format date as YYYY-MM-DD
      const date = startTime.toISOString().split('T')[0];
      
      // Format time as HH:MM in 24-hour format - times are already in correct timezone
      const hours = startTime.getHours().toString().padStart(2, '0');
      const minutes = startTime.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      
      // Get the actual day of week from the date
      const actualDayOfWeek = startTime.toLocaleDateString('en-US', { 
        weekday: 'long'
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

    // Sort by date (current day first), then by time
    transformedSlots.sort((a, b) => {
      // First sort by date
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      // Then sort by time within the same date
      return a.time.localeCompare(b.time);
    });

    console.log(`✅ Found ${slots.length} raw slots, ${transformedSlots.length} transformed slots`);
    if (slots.length > 0) {
      console.log('📅 First slot:', {
        id: slots[0].id,
        startTime: slots[0].startTime.toISOString(),
        isAvailable: slots[0].isAvailable
      });
    }

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
      
      // Return mock data for development when database is not available
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
  // Mock data for demonstration (commented out as not used in current implementation)
  /*
  const teachers = [
    { id: 1, name: 'Ana García', bio: 'Certified Yoga Instructor', shortBio: 'Yoga Expert', experience: 5, avatarUrl: null },
    { id: 2, name: 'Carlos Mendoza', bio: 'Pilates Specialist', shortBio: 'Pilates Pro', experience: 8, avatarUrl: null },
    { id: 3, name: 'María López', bio: 'Meditation Guide', shortBio: 'Mindfulness Expert', experience: 3, avatarUrl: null }
  ];
  const serviceTypes = [
    { id: 1, name: 'Hatha Yoga', description: 'Gentle yoga practice', shortDescription: 'Gentle yoga', duration: 60, difficulty: 'Beginner', color: '#6ea058', icon: '🧘' },
    { id: 2, name: 'Vinyasa Flow', description: 'Dynamic yoga flow', shortDescription: 'Dynamic flow', duration: 75, difficulty: 'Intermediate', color: '#4a90e2', icon: '🌊' },
    { id: 3, name: 'Pilates', description: 'Core strengthening', shortDescription: 'Core work', duration: 45, difficulty: 'All levels', color: '#e74c3c', icon: '💪' }
  ];
  const venues = [
    { id: 1, name: 'Studio A', address: 'Calle Alcanfores 425', city: 'Miraflores' },
    { id: 2, name: 'Studio B', address: 'Calle Alcanfores 425', city: 'Miraflores' }
  ];
  */

  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + day);
    const dateStr = currentDate.toISOString().split('T')[0];
    // const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }); // Not used in current implementation

    // Process all days including Sunday

    // Generate 3-5 slots per day
    const slotsPerDay = Math.floor(Math.random() * 3) + 3;
    const selectedTimes = timeSlots.sort(() => 0.5 - Math.random()).slice(0, slotsPerDay);

    selectedTimes.forEach((time, index) => {
      // Teacher, serviceType, and venue selection removed as they're not used in the response
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
