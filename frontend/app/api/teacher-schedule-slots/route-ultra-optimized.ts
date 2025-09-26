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
    isAvailable: slot.isAvailable && (slot.bookedCount || 0) < (slot.maxBookings || 12),
    capacity: slot.maxBookings || 12,
    bookedCount: slot.bookedCount || 0,
    duration: slot.teacherSchedule?.serviceType?.duration || 60,
    teacher: slot.teacherSchedule?.teacher,
    serviceType: slot.teacherSchedule?.serviceType,
    venue: slot.teacherSchedule?.venue,
    dayOfWeek,
    dayOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayOfWeek)
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

    // ULTRA-OPTIMIZATION 6: Use connection pooling with `withConnection`
    const slots = await withConnection(async () => {
      return await prisma.teacherScheduleSlot.findMany({
        where: whereClause,
        select: minimalScheduleSelect,
        orderBy: { startTime: 'asc' }
      });
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
      if (oldestKey) {
        scheduleSlotsCache.delete(oldestKey);
      }
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
