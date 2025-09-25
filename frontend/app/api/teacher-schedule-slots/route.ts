import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { cache, cacheKeys, cacheTTL } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 API called with URL:', request.url);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const available = searchParams.get('available');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const whereClause: any = {};

    if (available === 'true') {
      whereClause.isAvailable = true;
    }

    // Determine date range
    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate + 'T00:00:00.000Z'),
        lte: new Date(endDate + 'T23:59:59.999Z')
      };
    } else {
      // Default to next 14 days
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + 14);
      whereClause.startTime = {
        gte: now,
        lte: futureDate
      };
    }

    console.log('🔍 Querying with:', whereClause);

    // Query database
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
      orderBy: { startTime: 'asc' }
    });

    console.log(`✅ Found ${slots.length} raw slots`);

    // Transform the data
    const transformedSlots = slots.map(slot => {
      // Convert UTC time to Peru time (UTC-5)
      const startTime = new Date(slot.startTime);
      const peruTime = new Date(startTime.getTime() - (5 * 60 * 60 * 1000));

      // Format date and time
      const date = peruTime.toISOString().split('T')[0];
      const hours = peruTime.getUTCHours().toString().padStart(2, '0');
      const minutes = peruTime.getUTCMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      const dayOfWeek = peruTime.toLocaleDateString('en-US', { weekday: 'long' });

      return {
        id: slot.id,
        date,
        time,
        isAvailable: slot.isAvailable && (slot.bookedCount || 0) < (slot.maxBookings || 15),
        capacity: slot.maxBookings || 15,
        bookedCount: slot.bookedCount || 0,
        duration: slot.teacherSchedule?.serviceType?.duration || 60,
        teacher: slot.teacherSchedule?.teacher,
        serviceType: slot.teacherSchedule?.serviceType,
        venue: slot.teacherSchedule?.venue,
        dayOfWeek,
        dayOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayOfWeek)
      };
    });

    console.log(`✅ Transformed ${transformedSlots.length} slots`);
    if (transformedSlots.length > 0) {
      console.log('📅 First transformed slot:', transformedSlots[0]);
    }

    return NextResponse.json({
      success: true,
      slots: transformedSlots
    });

  } catch (error) {
    console.error('❌ Error in API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch schedule slots'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Generate mock schedule slots for development
function _generateMockScheduleSlots() {
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
