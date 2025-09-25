import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: List upcoming slots for the authenticated teacher
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Find teacher by email
    const teacher = await prisma.teacher.findFirst({ where: { email: user.email } });
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Calculate range
    const now = new Date();
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + (isNaN(days) ? 30 : days));

    const hasCustomRange = !!(startDateParam && endDateParam);
    const rangeStart = hasCustomRange ? new Date(startDateParam + 'T00:00:00.000Z') : now;
    const rangeEnd = hasCustomRange ? new Date(endDateParam + 'T23:59:59.999Z') : defaultEnd;

    console.log('🔍 Teacher slots query - late-aware range');
    console.log('🔍 Query params:', { rangeStart, rangeEnd, hasCustomRange, teacherId: teacher.id });

    // Build where with support for including late slots whose originalStartTime is within range
    const where: any = {
      teacherSchedule: { teacherId: teacher.id },
      OR: [
        // Regular slots (not late or null) within range by startTime
        {
          startTime: { gte: rangeStart, lte: rangeEnd },
          OR: [ { isLate: false }, { isLate: null } ]
        },
        // Late slots: include if their adjusted startTime OR originalStartTime falls in range
        {
          isLate: true,
          OR: [
            { startTime: { gte: rangeStart, lte: rangeEnd } },
            { originalStartTime: { gte: rangeStart, lte: rangeEnd } }
          ]
        }
      ]
    };

    const slots = await prisma.teacherScheduleSlot.findMany({
      where,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        isAvailable: true,
        bookedCount: true,
        maxBookings: true,
        isLate: true,
        lateMinutes: true,
        lateMessage: true,
        lateNotifiedAt: true,
        originalStartTime: true,
        originalEndTime: true,
        bookings: {
          select: {
            id: true,
            status: true,
            user: { select: { id: true, email: true, fullName: true, phone: true } },
            userPackage: { select: { id: true } }
          }
        },
        teacherSchedule: {
          select: {
            serviceType: { select: { id: true, name: true, duration: true } },
            venue: { select: { id: true, name: true, city: true } }
          }
        }
      },
      orderBy: { startTime: 'asc'       }
    });

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error('GET /api/teacher/slots error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper to get DayOfWeek string (e.g., 'Monday') from a Date
function getDayOfWeekName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Helper to build a Date object representing a time-of-day (for Time columns)
function buildTimeOfDay(date: Date): Date {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  // Use a fixed epoch date; DB column is TIME, Prisma accepts Date
  return new Date(`1970-01-01T${hh}:${mm}:00.000Z`);
}

// POST: Create a new slot for the authenticated teacher
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create slots
    if (String(user.role).toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Admin role required' }, { status: 403 });
    }

    const teacher = await withConnection(() => prisma.teacher.findFirst({ where: { email: user.email } }));
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { startTime, endTime, venueId, serviceTypeId, maxBookings } = body || {};

    if (!startTime || !endTime || !venueId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return NextResponse.json({ success: false, error: 'Invalid start/end times' }, { status: 400 });
    }

    const dayOfWeek = getDayOfWeekName(start);
    const scheduleStartTime = buildTimeOfDay(start);
    const scheduleEndTime = buildTimeOfDay(end);

    // Find or create a TeacherSchedule for this time window and day
    const existingSchedule = await withConnection(() => prisma.teacherSchedule.findFirst({
      where: {
        teacherId: teacher.id,
        venueId: Number(venueId),
        serviceTypeId: serviceTypeId ? Number(serviceTypeId) : undefined,
        dayOfWeek,
        startTime: scheduleStartTime,
        endTime: scheduleEndTime,
      }
    }));

    const schedule = existingSchedule || await withConnection(() => prisma.teacherSchedule.create({
      data: {
        teacherId: teacher.id,
        venueId: Number(venueId),
        serviceTypeId: serviceTypeId ? Number(serviceTypeId) : null,
        dayOfWeek,
        startTime: scheduleStartTime,
        endTime: scheduleEndTime,
        isAvailable: true,
        maxBookings: maxBookings ? Number(maxBookings) : 1,
      }
    }));

    // Create the slot instance
    const slot = await withConnection(() => prisma.teacherScheduleSlot.create({
      data: {
        teacherScheduleId: schedule.id,
        startTime: start,
        endTime: end,
        isAvailable: true,
        maxBookings: maxBookings ? Number(maxBookings) : schedule.maxBookings || 1,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        isAvailable: true,
        maxBookings: true,
        bookedCount: true,
      }
    }));

    return NextResponse.json({ success: true, data: slot });
  } catch (error) {
    console.error('POST /api/teacher/slots error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Cancel a slot (mark unavailable) owned by the authenticated teacher
export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const teacher = await withConnection(() => prisma.teacher.findFirst({ where: { email: user.email } }));
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { slotId, day, action, transferToTeacherId } = body || {};

    // Cancel by single slot
    if (slotId) {
      // Verify slot belongs to this teacher via its schedule
    const slot = await withConnection(() => prisma.teacherScheduleSlot.findUnique({
        where: { id: Number(slotId) },
        select: { 
          id: true, 
          teacherSchedule: { 
            select: { 
              teacherId: true,
              serviceType: { select: { name: true } },
              venue: { select: { name: true } }
            } 
          },
          bookings: {
            select: {
              id: true,
              userId: true,
              status: true,
              userPackageId: true
            }
          }
        }
    }));

    if (!slot || slot.teacherSchedule.teacherId !== teacher.id) {
        return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 404 });
      }

      // Handle transfer to substitute teacher
      if (action === 'cancel' && transferToTeacherId) {
        const result = await withConnection(() => prisma.$transaction(async (tx) => {
          // Update the slot to be assigned to the substitute teacher
          const substituteTeacher = await tx.teacher.findUnique({
            where: { id: Number(transferToTeacherId) }
          });

          if (!substituteTeacher) {
            throw new Error('Substitute teacher not found');
          }

          // Create a new schedule for the substitute teacher if it doesn't exist
          const substituteSchedule = await tx.teacherSchedule.findFirst({
            where: {
              teacherId: Number(transferToTeacherId),
              dayOfWeek: slot.teacherSchedule.dayOfWeek,
              startTime: slot.teacherSchedule.startTime,
              endTime: slot.teacherSchedule.endTime,
              venueId: slot.teacherSchedule.venueId,
              serviceTypeId: slot.teacherSchedule.serviceTypeId
            }
          });

          let scheduleId = substituteSchedule?.id;
          if (!scheduleId) {
            const newSchedule = await tx.teacherSchedule.create({
              data: {
                teacherId: Number(transferToTeacherId),
                dayOfWeek: slot.teacherSchedule.dayOfWeek,
                startTime: slot.teacherSchedule.startTime,
                endTime: slot.teacherSchedule.endTime,
                venueId: slot.teacherSchedule.venueId,
                serviceTypeId: slot.teacherSchedule.serviceTypeId,
                isAvailable: true,
                maxBookings: slot.teacherSchedule.maxBookings
              }
            });
            scheduleId = newSchedule.id;
          }

          // Update the slot to use the substitute teacher's schedule
          await tx.teacherScheduleSlot.update({
            where: { id: Number(slotId) },
            data: { teacherScheduleId: scheduleId }
          });

          // Update bookings to reflect the new teacher
      await tx.booking.updateMany({
            where: { teacherScheduleSlotId: Number(slotId) },
            data: { teacherId: Number(transferToTeacherId) }
          });

          return { 
            message: `Class transferred to ${substituteTeacher.fullName}`,
            substituteTeacher: substituteTeacher.fullName
          };
        }));

        return NextResponse.json({ success: true, data: result });
      }

      // Handle regular cancellation
      if (action === 'cancel') {
        const result = await withConnection(() => prisma.$transaction(async (tx) => {
          // Cancel all bookings for this slot
          const cancelledBookings = await tx.booking.updateMany({
            where: { 
              teacherScheduleSlotId: Number(slotId), 
              status: { not: 'cancelled' } 
            },
            data: { 
              status: 'cancelled', 
              cancelledAt: new Date(), 
              cancelledReason: 'Cancelled by teacher' 
            }
          });

          // Mark slot as unavailable
          await tx.teacherScheduleSlot.update({
            where: { id: Number(slotId) },
            data: { isAvailable: false }
          });

          // Restore user package sessions for cancelled bookings
          if (cancelledBookings.count > 0) {
            const bookings = await tx.booking.findMany({
              where: { teacherScheduleSlotId: Number(slotId), status: 'cancelled' },
              select: { userPackageId: true }
            });

            for (const booking of bookings) {
              if (booking.userPackageId) {
                await tx.userPackage.update({
                  where: { id: booking.userPackageId },
                  data: { sessionsRemaining: { increment: 1 } }
                });
              }
            }
          }

          return { 
            message: 'Class cancelled successfully',
            cancelledBookings: cancelledBookings.count
          };
        }));

        return NextResponse.json({ success: true, data: result });
      }

      // Legacy: Simple cancellation (mark unavailable)
      await withConnection(() => prisma.teacherScheduleSlot.update({
        where: { id: Number(slotId) },
        data: { isAvailable: false }
      }));

      return NextResponse.json({ success: true });
    }

    // Cancel by day (all published slots on given calendar day)
    if (day) {
      const dayStart = new Date(day + 'T00:00:00.000Z');
      const dayEnd = new Date(day + 'T23:59:59.999Z');

      // Find all slots for this teacher on that day
      const slots = await withConnection(() => prisma.teacherScheduleSlot.findMany({
        where: {
          startTime: { gte: dayStart, lte: dayEnd },
          isAvailable: true,
          teacherSchedule: { teacherId: teacher.id }
        },
        select: { id: true }
      }));

      if (slots.length === 0) {
        return NextResponse.json({ success: true, message: 'No published slots to cancel for that day', data: { cancelled: 0 } });
      }

      const ids = slots.map(s => s.id);

      // Mark slots unavailable and cancel bookings on those slots
      const result = await prisma.$transaction(async (tx) => {
        const cancelledBookings = await tx.booking.updateMany({
          where: { teacherScheduleSlotId: { in: ids }, status: { not: 'cancelled' } },
          data: { status: 'cancelled', cancelledAt: new Date(), cancelledReason: 'Cancelled by teacher (day)' }
        });

        const updatedSlots = await tx.teacherScheduleSlot.updateMany({
          where: { id: { in: ids } },
          data: { isAvailable: false }
        });

        return { cancelledBookings: cancelledBookings.count, cancelledSlots: updatedSlots.count };
      });

      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: 'slotId or day is required' }, { status: 400 });
  } catch (error) {
    console.error('PUT /api/teacher/slots error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Cancel a slot and optionally notify/cancel clients
// NOTE: A more advanced cancellation flow that restores packages can be added as a separate endpoint if needed


