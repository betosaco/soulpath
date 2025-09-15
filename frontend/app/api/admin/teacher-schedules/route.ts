import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Zod schemas for teacher schedule validation
const createTeacherScheduleSchema = z.object({
  teacherId: z.number().int().positive('Teacher ID must be positive'),
  venueId: z.number().int().positive('Venue ID must be positive'),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  isAvailable: z.boolean().default(true),
  maxBookings: z.number().int().positive('Max bookings must be positive').default(1),
  specialties: z.array(z.string()).default([])
});

const updateTeacherScheduleSchema = createTeacherScheduleSchema.partial().extend({
  id: z.number().int().positive('Schedule ID must be positive')
});

const querySchema = z.object({
  teacherId: z.coerce.number().int().positive().optional(),
  venueId: z.coerce.number().int().positive().optional(),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  isAvailable: z.enum(['true', 'false']).optional(),
  include: z.enum(['teacher', 'venue', 'slots', 'all']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    console.log('📅 GET /api/admin/teacher-schedules - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('✅ Admin user authenticated:', user.email);

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { teacherId, venueId, dayOfWeek, isAvailable, include, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { teacherId, venueId, dayOfWeek, isAvailable, include, page, limit });

    // Build the query
    const where: Record<string, unknown> = {};
    if (teacherId) where.teacherId = teacherId;
    if (venueId) where.venueId = venueId;
    if (dayOfWeek) where.dayOfWeek = dayOfWeek;
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';

    // Base select fields
    const select: Record<string, unknown> = {
      id: true,
      teacherId: true,
      venueId: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isAvailable: true,
      maxBookings: true,
      specialties: true,
      createdAt: true,
      updatedAt: true
    };

    // Add relationships based on include parameter
    if (include === 'teacher' || include === 'all') {
      select.teacher = {
        select: {
          id: true,
          name: true,
          email: true,
          languages: true,
          experience: true,
          isActive: true
        }
      };
    }

    if (include === 'venue' || include === 'all') {
      select.venue = {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
          capacity: true,
          isActive: true
        }
      };
    }

    if (include === 'slots' || include === 'all') {
      select.teacherScheduleSlots = {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
          bookedCount: true,
          maxBookings: true
        },
        orderBy: {
          startTime: 'asc'
        }
      };
    }

    // Execute query
    const [schedules, totalCount] = await Promise.all([
      prisma.teacherSchedule.findMany({
        where,
        select,
        orderBy: [
          { dayOfWeek: 'asc' },
          { startTime: 'asc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.teacherSchedule.count({ where })
    ]);

    console.log(`✅ Found ${schedules.length} teacher schedules (total: ${totalCount})`);

    return NextResponse.json({
      success: true,
      data: {
        schedules,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Teacher schedules API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📅 POST /api/admin/teacher-schedules - Creating teacher schedule...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = createTeacherScheduleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const scheduleData = validation.data;

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: scheduleData.teacherId }
    });

    if (!teacher) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found',
        message: 'The specified teacher does not exist'
      }, { status: 404 });
    }

    // Check if venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: scheduleData.venueId }
    });

    if (!venue) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found',
        message: 'The specified venue does not exist'
      }, { status: 404 });
    }

    // Check if schedule already exists for this teacher, venue, and day
    const existingSchedule = await prisma.teacherSchedule.findFirst({
      where: {
        teacherId: scheduleData.teacherId,
        venueId: scheduleData.venueId,
        dayOfWeek: scheduleData.dayOfWeek
      }
    });

    if (existingSchedule) {
      return NextResponse.json({
        success: false,
        error: 'Schedule already exists',
        message: 'A schedule already exists for this teacher at this venue on this day'
      }, { status: 409 });
    }

    // Validate time range
    const startTime = new Date(`2000-01-01T${scheduleData.startTime}:00`);
    const endTime = new Date(`2000-01-01T${scheduleData.endTime}:00`);
    
    if (startTime >= endTime) {
      return NextResponse.json({
        success: false,
        error: 'Invalid time range',
        message: 'End time must be after start time'
      }, { status: 400 });
    }

    const schedule = await prisma.teacherSchedule.create({
      data: scheduleData,
      select: {
        id: true,
        teacherId: true,
        venueId: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        isAvailable: true,
        maxBookings: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Teacher schedule created successfully:', schedule.id);

    return NextResponse.json({
      success: true,
      data: schedule,
      message: 'Teacher schedule created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create teacher schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('📅 PUT /api/admin/teacher-schedules - Updating teacher schedule...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateTeacherScheduleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { id, ...updateData } = validation.data;

    // Check if schedule exists
    const existingSchedule = await prisma.teacherSchedule.findUnique({
      where: { id }
    });

    if (!existingSchedule) {
      return NextResponse.json({
        success: false,
        error: 'Schedule not found',
        message: 'Schedule with this ID does not exist'
      }, { status: 404 });
    }

    // Check if teacher exists (if being updated)
    if (updateData.teacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: updateData.teacherId }
      });

      if (!teacher) {
        return NextResponse.json({
          success: false,
          error: 'Teacher not found',
          message: 'The specified teacher does not exist'
        }, { status: 404 });
      }
    }

    // Check if venue exists (if being updated)
    if (updateData.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: updateData.venueId }
      });

      if (!venue) {
        return NextResponse.json({
          success: false,
          error: 'Venue not found',
          message: 'The specified venue does not exist'
        }, { status: 404 });
      }
    }

    // Check for conflicts if day, teacher, or venue is being changed
    if (updateData.dayOfWeek || updateData.teacherId || updateData.venueId) {
      const teacherId = updateData.teacherId || existingSchedule.teacherId;
      const venueId = updateData.venueId || existingSchedule.venueId;
      const dayOfWeek = updateData.dayOfWeek || existingSchedule.dayOfWeek;

      const conflictingSchedule = await prisma.teacherSchedule.findFirst({
        where: {
          teacherId,
          venueId,
          dayOfWeek,
          id: { not: id }
        }
      });

      if (conflictingSchedule) {
        return NextResponse.json({
          success: false,
          error: 'Schedule conflict',
          message: 'A schedule already exists for this teacher at this venue on this day'
        }, { status: 409 });
      }
    }

    // Validate time range if times are being updated
    if (updateData.startTime || updateData.endTime) {
      const startTime = new Date(`2000-01-01T${updateData.startTime || existingSchedule.startTime}:00`);
      const endTime = new Date(`2000-01-01T${updateData.endTime || existingSchedule.endTime}:00`);
      
      if (startTime >= endTime) {
        return NextResponse.json({
          success: false,
          error: 'Invalid time range',
          message: 'End time must be after start time'
        }, { status: 400 });
      }
    }

    const schedule = await prisma.teacherSchedule.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        teacherId: true,
        venueId: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        isAvailable: true,
        maxBookings: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Teacher schedule updated successfully:', schedule.id);

    return NextResponse.json({
      success: true,
      data: schedule,
      message: 'Teacher schedule updated successfully'
    });

  } catch (error) {
    console.error('❌ Update teacher schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('📅 DELETE /api/admin/teacher-schedules - Deleting teacher schedule...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing schedule ID',
        message: 'Schedule ID is required'
      }, { status: 400 });
    }

    const scheduleId = parseInt(id);
    if (isNaN(scheduleId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid schedule ID',
        message: 'Schedule ID must be a number'
      }, { status: 400 });
    }

    // Check if schedule exists
    const existingSchedule = await prisma.teacherSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        teacherScheduleSlots: {
          include: {
            bookings: true
          }
        }
      }
    });

    if (!existingSchedule) {
      return NextResponse.json({
        success: false,
        error: 'Schedule not found',
        message: 'Schedule with this ID does not exist'
      }, { status: 404 });
    }

    // Check if schedule has bookings
    const hasBookings = existingSchedule.teacherScheduleSlots.some(slot => slot.bookings.length > 0);
    if (hasBookings) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete schedule with bookings',
        message: 'Please handle all bookings for this schedule before deleting'
      }, { status: 409 });
    }

    // Delete schedule slots first
    if (existingSchedule.teacherScheduleSlots.length > 0) {
      await prisma.teacherScheduleSlot.deleteMany({
        where: { teacherScheduleId: scheduleId }
      });
    }

    await prisma.teacherSchedule.delete({
      where: { id: scheduleId }
    });

    console.log('✅ Teacher schedule deleted successfully:', scheduleId);

    return NextResponse.json({
      success: true,
      message: 'Teacher schedule deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete teacher schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
