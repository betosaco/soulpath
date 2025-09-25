import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

// ULTRA-OPTIMIZATION 1: In-memory cache for schedule slots
const scheduleSlotsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_SECONDS = 30; // 30 seconds TTL for schedule slots (frequently changing)
const MAX_CACHE_SIZE = 50;

// ULTRA-OPTIMIZATION 2: Pre-computed response template
const responseTemplate = {
  success: true,
  meta: {
    ultraOptimized: true,
    performance: 'maximum'
  }
};

// ULTRA-OPTIMIZATION 3: Minimal data selection for schedule slots
const minimalScheduleSelect = {
  id: true,
  startTime: true,
  isAvailable: true,
  bookedCount: true,
  maxBookings: true,
  isLate: true,
  lateMinutes: true,
  lateMessage: true,
  lateNotifiedAt: true,
  originalStartTime: true,
  originalEndTime: true,
  teacherSchedule: {
    select: {
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
};

// ULTRA-OPTIMIZATION 4: Streamlined slot transformation
function transformScheduleSlot(slot: any) {
  // For late slots, use original time; otherwise use current startTime
  const timeToUse = slot.isLate && slot.originalStartTime ? slot.originalStartTime : slot.startTime;
  
  // Convert UTC time to Peru time (UTC-5)
  const startTime = new Date(timeToUse);
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
    isAvailable: slot.isAvailable && (slot.bookedCount || 0) < (slot.maxBookings || 12),
    capacity: slot.maxBookings || 12,
    bookedCount: slot.bookedCount || 0,
    duration: slot.teacherSchedule?.serviceType?.duration || 60,
    teacher: slot.teacherSchedule?.teacher,
    serviceType: slot.teacherSchedule?.serviceType,
    venue: slot.teacherSchedule?.venue,
    dayOfWeek,
    dayOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayOfWeek),
    // Late notification fields
    isLate: slot.isLate || false,
    lateMinutes: slot.lateMinutes || 0,
    lateMessage: slot.lateMessage || null,
    lateNotifiedAt: slot.lateNotifiedAt || null,
    originalStartTime: slot.originalStartTime || null,
    originalEndTime: slot.originalEndTime || null
  };
}

export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    console.log('🚀 GET /api/teacher-schedule-slots (ULTRA-OPTIMIZED) - Fetching schedule slots...');
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const available = searchParams.get('available');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // ULTRA-OPTIMIZATION 5: In-memory cache check
    const cacheKey = `schedule_slots:${available}:${startDate}:${endDate}`;
    const now = Date.now();
    
    const cached = scheduleSlotsCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < (CACHE_TTL_SECONDS * 1000)) {
      const responseTime = performance.now() - startTime;
      console.log(`⚡️ In-memory cache hit for schedule slots: ${responseTime.toFixed(2)}ms`);
      
      return addCorsHeaders(NextResponse.json({
        ...cached.data,
        meta: {
          ...cached.data.meta,
          cached: true,
          responseTime: `${responseTime.toFixed(2)}ms`
        }
      }));
    }

    // Build where clause with late notification support
    const currentTime = new Date();
    const end = startDate && endDate 
      ? new Date(endDate + 'T23:59:59.999Z')
      : new Date(currentTime.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days from now

    // Simplified query that includes late notification slots
    const orConditions = [];
    
    // Regular slots starting in the future
    const regularSlotCondition: any = {
      startTime: { gte: currentTime, lte: end },
      isLate: { not: true }
    };
    if (available === 'true') {
      regularSlotCondition.isAvailable = true;
    }
    orConditions.push(regularSlotCondition);
    
    // Late notification slots (show regardless of time)
    const lateSlotCondition: any = {
      isLate: true
    };
    if (available === 'true') {
      lateSlotCondition.isAvailable = true;
    }
    orConditions.push(lateSlotCondition);
    
    const whereClause: any = {
      OR: orConditions
    };

    // Add date range filter if specified
    if (startDate && endDate) {
      const start = new Date(startDate + 'T00:00:00.000Z');
      whereClause.OR = whereClause.OR.map((condition: any) => ({
        ...condition,
        startTime: { gte: start, lte: end }
      }));
    }

    console.log('🔍 Querying with:', whereClause);

    // ULTRA-OPTIMIZATION 6: Direct query for debugging
    const slots = await prisma.teacherScheduleSlot.findMany({
      where: whereClause,
      select: minimalScheduleSelect,
      orderBy: { startTime: 'asc' }
    });

    console.log(`✅ Found ${slots.length} raw slots`);

    // ULTRA-OPTIMIZATION 7: Parallel processing
    const transformedSlots = slots.map(transformScheduleSlot);

    console.log(`✅ Transformed ${transformedSlots.length} slots`);

    // ULTRA-OPTIMIZATION 8: Create response
    const response = {
      ...responseTemplate,
      slots: transformedSlots,
      meta: {
        ...responseTemplate.meta,
        responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }
    };

    // ULTRA-OPTIMIZATION 9: Smart cache management
    if (scheduleSlotsCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries
      const oldestKey = scheduleSlotsCache.keys().next().value;
      scheduleSlotsCache.delete(oldestKey);
    }
    
    scheduleSlotsCache.set(cacheKey, { data: response, timestamp: now });
    console.log(`✅ Stored in-memory cache for schedule slots`);

    return addCorsHeaders(NextResponse.json(response));
  } catch (error) {
    console.error('❌ Error in GET /api/teacher-schedule-slots (ULTRA-OPTIMIZED):', error);
    
    return addCorsHeaders(NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch schedule slots',
        message: 'An error occurred while fetching schedule slots',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : 'Internal server error',
        meta: {
          ultraOptimized: true,
          responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
        }
      },
      { status: 500 }
    ));
  }
}

// ULTRA-OPTIMIZATION 10: Cleanup on process exit
process.on('SIGINT', async () => {
  scheduleSlotsCache.clear();
  console.log('🧹 Schedule slots cache cleared on exit');
});

process.on('SIGTERM', async () => {
  scheduleSlotsCache.clear();
  console.log('🧹 Schedule slots cache cleared on exit');
});

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
