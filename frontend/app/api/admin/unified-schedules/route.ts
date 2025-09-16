import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, withConnection } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Type for teacher schedule with relations
type TeacherScheduleWithRelations = Prisma.TeacherScheduleGetPayload<{
  include: {
    teacher: {
      select: {
        id: true;
        name: true;
        email: true;
        avatarUrl: true;
        specialties: {
          include: {
            specialty: true;
            serviceType: true;
          };
        };
      };
    };
    venue: {
      select: {
        id: true;
        name: true;
        city: true;
        address: true;
      };
    };
    serviceType: {
      select: {
        id: true;
        name: true;
        category: true;
        duration: true;
      };
    };
  };
}>;

// Validation schemas
const dayOfWeekSchema = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

// Query schema for filtering
const querySchema = z.object({
  type: z.enum(['teacher', 'venue', 'general']).nullable().optional(),
  teacherId: z.string().nullable().optional().transform(val => val ? parseInt(val) : undefined).pipe(z.number().int().positive().optional()),
  venueId: z.string().nullable().optional().transform(val => val ? parseInt(val) : undefined).pipe(z.number().int().positive().optional()),
  dayOfWeek: dayOfWeekSchema.nullable().optional(),
  isAvailable: z.string().nullable().optional().transform(val => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }),
  dateFrom: z.string().nullable().optional(),
  dateTo: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  include: z.enum(['teacher', 'venue', 'slots', 'serviceType', 'all']).optional(),
  page: z.string().nullable().optional().transform(val => val ? parseInt(val) : 1).pipe(z.number().int().min(1)),
  limit: z.string().nullable().optional().transform(val => val ? parseInt(val) : 20).pipe(z.number().int().min(1).max(100))
});

// Teacher schedule creation schema
const CreateTeacherScheduleSchema = z.object({
  type: z.literal('teacher'),
  teacherId: z.number().int().positive('Teacher ID must be positive'),
  venueId: z.number().int().positive('Venue ID must be positive'),
  serviceTypeId: z.number().int().positive('Service type ID must be positive').optional(),
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  isAvailable: z.boolean().default(true),
  maxBookings: z.number().int().positive('Max bookings must be positive').default(1),
  specialties: z.array(z.string()).default([]),
  isRecurrent: z.boolean().default(false),
  selectedDays: z.array(dayOfWeekSchema).optional()
});

// Venue schedule creation schema
const CreateVenueScheduleSchema = z.object({
  type: z.literal('venue'),
  venueId: z.number().int().positive('Venue ID must be positive'),
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  capacity: z.number().int().positive('Capacity must be positive'),
  isAvailable: z.boolean().default(true),
  maxBookings: z.number().int().positive('Max bookings must be positive').default(1),
  sessionDurationId: z.number().int().positive('Session duration ID must be positive'),
  autoAvailable: z.boolean().default(true)
});

// General schedule creation schema
const CreateGeneralScheduleSchema = z.object({
  type: z.literal('general'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  isAvailable: z.boolean().default(true),
  maxBookings: z.number().int().positive('Max bookings must be positive').default(1)
});

// Union schema for all schedule types
const CreateScheduleSchema = z.discriminatedUnion('type', [
  CreateTeacherScheduleSchema,
  CreateVenueScheduleSchema,
  CreateGeneralScheduleSchema
]);

// Update schemas (partial versions)
const UpdateTeacherScheduleSchema = CreateTeacherScheduleSchema.partial().extend({
  id: z.number().int().positive('Schedule ID must be positive')
});

const UpdateVenueScheduleSchema = CreateVenueScheduleSchema.partial().extend({
  id: z.number().int().positive('Schedule ID must be positive')
});

const UpdateGeneralScheduleSchema = CreateGeneralScheduleSchema.partial().extend({
  id: z.number().int().positive('Schedule ID must be positive')
});

const UpdateScheduleSchema = z.discriminatedUnion('type', [
  UpdateTeacherScheduleSchema,
  UpdateVenueScheduleSchema,
  UpdateGeneralScheduleSchema
]);

// GET /api/admin/unified-schedules - List schedules with filtering
export async function GET(request: NextRequest) {
  try {
    return await withConnection(async () => {
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      type: searchParams.get('type'),
      teacherId: searchParams.get('teacherId'),
      venueId: searchParams.get('venueId'),
      dayOfWeek: searchParams.get('dayOfWeek'),
      isAvailable: searchParams.get('isAvailable'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      search: searchParams.get('search'),
      include: searchParams.get('include'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit')
    };
    
    console.log('🔍 Query data received:', queryData);
    const validation = querySchema.safeParse(queryData);

    if (!validation.success) {
      console.error('❌ Query validation failed:', validation.error.issues);
      console.error('❌ Query params:', {
        type: searchParams.get('type'),
        teacherId: searchParams.get('teacherId'),
        venueId: searchParams.get('venueId'),
        dayOfWeek: searchParams.get('dayOfWeek'),
        isAvailable: searchParams.get('isAvailable'),
        dateFrom: searchParams.get('dateFrom'),
        dateTo: searchParams.get('dateTo'),
        search: searchParams.get('search'),
        include: searchParams.get('include'),
        page: searchParams.get('page'),
        limit: searchParams.get('limit')
      });
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { type, teacherId, venueId, dayOfWeek, isAvailable, search, include, page, limit } = validation.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TeacherScheduleWhereInput = {};
    
    if (type === 'teacher' || !type) {
      if (teacherId) where.teacherId = teacherId;
      if (venueId) where.venueId = venueId;
      if (dayOfWeek) where.dayOfWeek = dayOfWeek;
      if (isAvailable !== undefined) where.isAvailable = isAvailable;
      if (search) {
        where.OR = [
          { teacher: { name: { contains: search, mode: 'insensitive' } } },
          { teacher: { email: { contains: search, mode: 'insensitive' } } }
        ];
      }
    }

    // Get teacher schedules
      const teacherSchedules: TeacherScheduleWithRelations[] = await prisma.teacherSchedule.findMany({
      where: type === 'teacher' || !type ? where : { id: -1 }, // Empty result if not teacher type
      skip: type === 'teacher' || !type ? skip : 0,
      take: type === 'teacher' || !type ? limit : 0,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              specialties: {
                include: {
                  specialty: true,
                  serviceType: true
                }
              }
            }
          },
          venue: include === 'venue' || include === 'all' ? {
            select: {
              id: true,
              name: true,
              city: true,
              address: true
            }
          } : false,
          serviceType: include === 'serviceType' || include === 'all' ? {
            select: {
              id: true,
              name: true,
              category: true,
              duration: true
            }
          } : false
        },
        orderBy: [
          { dayOfWeek: 'asc' },
          { startTime: 'asc' }
      ]
    });

    // Get total count
    const teacherCount = type === 'teacher' || !type ? await prisma.teacherSchedule.count({ where }) : 0;
    const venueCount = type === 'venue' ? await prisma.scheduleTemplate.count() : 0;
    const totalCount = teacherCount + venueCount;

    // Transform teacher schedules to unified format
    const schedules = teacherSchedules.map(schedule => ({
      id: schedule.id,
      type: 'teacher' as const,
      teacherId: schedule.teacherId,
      venueId: schedule.venueId,
      serviceTypeId: schedule.serviceTypeId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: schedule.isAvailable,
      maxBookings: schedule.maxBookings,
      specialties: schedule.teacher?.specialties?.map((s) => s.specialty.name) || [],
      teacher: schedule.teacher,
      venue: schedule.venue,
      serviceType: schedule.serviceType,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt
    }));

    return NextResponse.json({
      success: true,
      schedules,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
    }); // Close withConnection wrapper

  } catch (error) {
    console.error('❌ Unified schedules API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/admin/unified-schedules - Create new schedule
export async function POST(request: NextRequest) {
  try {
    return await withConnection(async () => {
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = CreateScheduleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const data = validation.data;

    if (data.type === 'teacher') {
      // Handle teacher schedule creation
      if (data.isRecurrent && data.selectedDays && data.selectedDays.length > 0) {
        // Create multiple schedules for selected days
        const schedules = await Promise.all(
          data.selectedDays.map(day => 
            prisma.teacherSchedule.create({
              data: {
                teacherId: data.teacherId,
                venueId: data.venueId,
                serviceTypeId: data.serviceTypeId,
                dayOfWeek: day,
                startTime: data.startTime,
                endTime: data.endTime,
                isAvailable: data.isAvailable,
                maxBookings: data.maxBookings
              },
              include: {
                teacher: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                  }
                },
                venue: {
                  select: {
                    id: true,
                    name: true,
                    city: true
                  }
                },
                serviceType: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                    duration: true
                  }
                }
              }
            })
          )
        );

        return NextResponse.json({
          success: true,
          schedules,
          message: `Created ${schedules.length} teacher schedules`
        }, { status: 201 });
      } else {
        // Create single teacher schedule
        const schedule = await prisma.teacherSchedule.create({
          data: {
            teacherId: data.teacherId,
            venueId: data.venueId,
            serviceTypeId: data.serviceTypeId,
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            isAvailable: data.isAvailable,
            maxBookings: data.maxBookings
          },
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true
              }
            },
            venue: {
              select: {
                id: true,
                name: true,
                city: true
              }
            },
            serviceType: {
              select: {
                id: true,
                name: true,
                category: true,
                duration: true
              }
            }
          }
        });

        return NextResponse.json({
          success: true,
          schedule,
          message: 'Teacher schedule created successfully'
        }, { status: 201 });
      }
    } else if (data.type === 'venue') {
      // Handle venue schedule creation
      const schedule = await prisma.scheduleTemplate.create({
        data: {
          venueId: data.venueId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          capacity: data.capacity,
          isAvailable: data.isAvailable,
          sessionDurationId: data.sessionDurationId,
          autoAvailable: data.autoAvailable
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true
            }
          },
          sessionDuration: {
            select: {
              id: true,
              name: true,
              duration_minutes: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        schedule,
        message: 'Venue schedule created successfully'
      }, { status: 201 });
    } else {
      // Handle general schedule creation
      const schedule = await prisma.scheduleTemplate.create({
        data: {
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          isAvailable: data.isAvailable
        }
      });

      return NextResponse.json({
        success: true,
        schedule,
        message: 'General schedule created successfully'
      }, { status: 201 });
    }
    }); // Close withConnection wrapper

  } catch (error) {
    console.error('❌ Create schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/unified-schedules - Update existing schedule
export async function PUT(request: NextRequest) {
  try {
    return await withConnection(async () => {
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const validation = UpdateScheduleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: validation.error.issues
      }, { status: 400 });
    }

    const data = validation.data;

    if (data.type === 'teacher') {
      // Update teacher schedule
      const existingSchedule = await prisma.teacherSchedule.findUnique({
        where: { id: data.id }
      });

      if (!existingSchedule) {
        return NextResponse.json({
          success: false,
          error: 'Schedule not found'
        }, { status: 404 });
      }

      const schedule = await prisma.teacherSchedule.update({
        where: { id: data.id },
        data: {
          teacherId: data.teacherId,
          venueId: data.venueId,
          serviceTypeId: data.serviceTypeId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          isAvailable: data.isAvailable,
          maxBookings: data.maxBookings
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          },
          venue: {
            select: {
              id: true,
              name: true,
              city: true
            }
          },
          serviceType: {
            select: {
              id: true,
              name: true,
              category: true,
              duration: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        schedule,
        message: 'Teacher schedule updated successfully'
      });
    } else if (data.type === 'venue') {
      // Update venue schedule
      const existingSchedule = await prisma.scheduleTemplate.findUnique({
        where: { id: data.id }
      });

      if (!existingSchedule) {
        return NextResponse.json({
          success: false,
          error: 'Schedule not found'
        }, { status: 404 });
      }

      const schedule = await prisma.scheduleTemplate.update({
        where: { id: data.id },
        data: {
          venueId: data.venueId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          capacity: data.capacity,
          isAvailable: data.isAvailable,
          sessionDurationId: data.sessionDurationId,
          autoAvailable: data.autoAvailable
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true
            }
          },
          sessionDuration: {
            select: {
              id: true,
              name: true,
              duration_minutes: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        schedule,
        message: 'Venue schedule updated successfully'
      });
    } else {
      // Update general schedule
      const existingSchedule = await prisma.scheduleTemplate.findUnique({
        where: { id: data.id }
      });

      if (!existingSchedule) {
        return NextResponse.json({
          success: false,
          error: 'Schedule not found'
        }, { status: 404 });
      }

      const schedule = await prisma.scheduleTemplate.update({
        where: { id: data.id },
        data: {
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          isAvailable: data.isAvailable
        }
      });

      return NextResponse.json({
        success: true,
        schedule,
        message: 'General schedule updated successfully'
      });
    }
    }); // Close withConnection wrapper

  } catch (error) {
    console.error('❌ Update schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/admin/unified-schedules - Delete schedule
export async function DELETE(request: NextRequest) {
  try {
    return await withConnection(async () => {
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Schedule ID is required'
      }, { status: 400 });
    }

    const scheduleId = parseInt(id);
    if (isNaN(scheduleId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid schedule ID'
      }, { status: 400 });
    }

    if (type === 'teacher' || !type) {
      // Delete teacher schedule
      const existingSchedule = await prisma.teacherSchedule.findUnique({
        where: { id: scheduleId }
      });

      if (!existingSchedule) {
        return NextResponse.json({
          success: false,
          error: 'Teacher schedule not found'
        }, { status: 404 });
      }

      // Check for active bookings
      const activeBookings = await prisma.booking.count({
        where: {
          teacherScheduleSlotId: scheduleId,
          status: { in: ['CONFIRMED', 'PENDING'] }
        }
      });

      if (activeBookings > 0) {
        return NextResponse.json({
          success: false,
          error: 'Cannot delete schedule with active bookings'
        }, { status: 400 });
      }

      await prisma.teacherSchedule.delete({
        where: { id: scheduleId }
      });

      return NextResponse.json({
        success: true,
        message: 'Teacher schedule deleted successfully'
      });
    } else {
      // Delete venue/general schedule
      const existingSchedule = await prisma.scheduleTemplate.findUnique({
        where: { id: scheduleId }
      });

      if (!existingSchedule) {
        return NextResponse.json({
          success: false,
          error: 'Schedule not found'
        }, { status: 404 });
      }

      // Check for active bookings
      const activeBookings = await prisma.booking.count({
        where: {
          scheduleSlot: {
            scheduleTemplateId: scheduleId
          },
          status: { in: ['CONFIRMED', 'PENDING'] }
        }
      });

      if (activeBookings > 0) {
        return NextResponse.json({
          success: false,
          error: 'Cannot delete schedule with active bookings'
    }, { status: 400 });
      }

      await prisma.scheduleTemplate.delete({
        where: { id: scheduleId }
      });

      return NextResponse.json({
        success: true,
        message: 'Schedule deleted successfully'
      });
    }
    }); // Close withConnection wrapper

  } catch (error) {
    console.error('❌ Delete schedule error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}