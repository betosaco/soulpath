import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';

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
    const slots = await withConnection(async () => {
      return await prisma.teacherScheduleSlot.findMany({
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

  const mockSlots: any[] = [];
  const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30', '20:00'];
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

  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + day);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Skip Sunday
    if (dayName === 'Sunday') continue;

    // Generate 3-5 slots per day
    const slotsPerDay = Math.floor(Math.random() * 3) + 3;
    const selectedTimes = timeSlots.sort(() => 0.5 - Math.random()).slice(0, slotsPerDay);

    selectedTimes.forEach((time, index) => {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
      const venue = venues[Math.floor(Math.random() * venues.length)];

      mockSlots.push({
        id: `mock_${day}_${index}`,
        date: dateStr,
        time,
        isAvailable: Math.random() > 0.2, // 80% availability
        capacity: 15,
        bookedCount: Math.floor(Math.random() * 8),
        duration: serviceType.duration,
        teacher,
        serviceType,
        venue,
        dayOfWeek: dayName
      });
    });
  }

  return mockSlots.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
}
