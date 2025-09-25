import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cache, cacheKeys, cacheTTL } from '@/lib/redis';

const prisma = new PrismaClient();

// Zod schema for schedule creation
const scheduleCreateSchema = z.object({
  day_of_week: z.string().min(1, 'Day of week is required'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(10, 'Capacity cannot exceed 10').optional(),
  is_available: z.boolean().default(true),
  auto_available: z.boolean().default(true).optional(),
  session_duration_id: z.number().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dayOfWeek = searchParams.get('day_of_week');
    const available = searchParams.get('available');

    // Generate cache key for schedules
    const cacheKey = `schedules:${dayOfWeek || 'all'}:${available || 'all'}`;
    
    // Try to get from cache first
    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        console.log('✅ Cache hit for schedules:', cacheKey);
        return NextResponse.json({
          success: true,
          data: cachedData,
          cached: true
        });
      }
    } catch (error) {
      console.warn('⚠️ Cache read error:', error);
    }

    // Build where clause for Prisma
    const where: any = {};
    
    if (dayOfWeek) {
      where.dayOfWeek = dayOfWeek;
    }
    
    if (available !== null) {
      where.isAvailable = available === 'true';
    }

    // Fetch schedules using Prisma
    const schedules = await prisma.scheduleTemplate.findMany({
      where,
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    console.log('✅ Found schedules:', schedules.length);

    // Cache the response
    try {
      await cache.set(cacheKey, schedules, cacheTTL.schedules || 1800); // 30 minutes default
      console.log('✅ Cached schedules data for key:', cacheKey, 'TTL:', cacheTTL.schedules || 1800);
    } catch (error) {
      console.warn('⚠️ Cache write error:', error);
    }

    return NextResponse.json({
      success: true,
      data: schedules
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      toast: {
        type: 'error',
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate schedule data
    const validation = scheduleCreateSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.issues);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Schedule data validation failed',
        details: validation.error.issues,
        toast: {
          type: 'error',
          title: 'Validation Error',
          description: 'Schedule data validation failed. Please check the form fields.'
        }
      }, { status: 400 });
    }

    const scheduleData = validation.data;

    // Check if schedule already exists
    const existingSchedule = await prisma.scheduleTemplate.findFirst({
      where: {
        dayOfWeek: scheduleData.day_of_week,
        startTime: scheduleData.start_time
      }
    });

    if (existingSchedule) {
      return NextResponse.json({
        success: false,
        error: 'Schedule already exists',
        message: 'A schedule already exists for this day and time',
        toast: {
          type: 'error',
          title: 'Schedule Exists',
          description: 'A schedule already exists for this day and time'
        }
      }, { status: 409 });
    }

    // Create new schedule using Prisma
    const data = await prisma.scheduleTemplate.create({
      data: {
        dayOfWeek: scheduleData.day_of_week,
        startTime: scheduleData.start_time,
        endTime: scheduleData.end_time,
        capacity: scheduleData.capacity || 10,
        isAvailable: scheduleData.is_available,
        autoAvailable: scheduleData.auto_available,
        sessionDurationId: scheduleData.session_duration_id
      }
    });

    console.log('✅ Created schedule:', data.id);

    // Invalidate schedules cache when new schedule is created
    try {
      await cache.del('schedules:*');
      console.log('✅ Invalidated schedules cache after creating new schedule');
    } catch (error) {
      console.warn('⚠️ Cache invalidation error:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Schedule created successfully',
      data,
      toast: {
        type: 'success',
        title: 'Success!',
        description: `Schedule for ${data.dayOfWeek} at ${data.startTime} created successfully`
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      toast: {
        type: 'error',
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.'
      }
    }, { status: 500 });
  }
}
