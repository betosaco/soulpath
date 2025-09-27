import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth';
import { prisma, withConnection } from '@/lib/prisma';
import { cacheKey, withApiCache, cacheHeaders } from '@/lib/apiCache';

// GET: List teacher bookings (upcoming/past/all)
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Find teacher
    const teacher = await withConnection(() => prisma.teacher.findFirst({ where: { email: user.email } }));
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') || 'all') as 'upcoming' | 'past' | 'all';
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
    const offset = (page - 1) * limit;

    const now = new Date();
    const where: any = { teacherId: teacher.id };

    if (status === 'upcoming') {
      where.teacherScheduleSlot = { startTime: { gte: now } };
      where.status = 'confirmed';
    } else if (status === 'past') {
      where.teacherScheduleSlot = { startTime: { lt: now } };
      where.status = 'completed';
    }

    const cacheTtlMs = 15_000; // 15s cache for list pagination
    const key = cacheKey('/api/teacher/bookings', { status, page, limit }, String(teacher.id));
    const [bookings, totalCount] = await withApiCache(key, cacheTtlMs, () => withConnection(async () => {
      const result = await Promise.all([
        prisma.booking.findMany({
          where,
          select: {
            id: true,
            status: true,
            sessionType: true,
            notes: true,
            cancelledReason: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, email: true, fullName: true, phone: true } },
            userPackage: { select: { id: true } },
            teacherScheduleSlot: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
                teacherSchedule: {
                  select: {
                    serviceType: { select: { id: true, name: true, duration: true } },
                    venue: { select: { id: true, name: true, city: true } }
                  }
                }
              }
            }
          },
          skip: offset,
          take: limit,
          orderBy: [{ teacherScheduleSlot: { startTime: status === 'upcoming' ? 'asc' : 'desc' } }]
        }),
        prisma.booking.count({ where })
      ]);
      return result as [any[], number];
    }));

    const res = NextResponse.json({
      success: true,
      data: bookings,
      pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) }
    });
    const headers = cacheHeaders(Math.floor(cacheTtlMs / 1000));
    Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  } catch (error) {
    console.error('GET /api/teacher/bookings error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Cancel a specific booking belonging to the teacher
export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, reason } = await request.json();
    if (!bookingId || typeof bookingId !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid bookingId' }, { status: 400 });
    }

    // Find teacher
    const teacher = await withConnection(() => prisma.teacher.findFirst({ where: { email: user.email } }));
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    // Load booking to verify ownership
    const booking = await withConnection(() => prisma.booking.findUnique({
      where: { id: bookingId },
      include: { teacherScheduleSlot: { include: { teacherSchedule: true } }, userPackage: true }
    }));

    if (!booking || booking.teacherScheduleSlot?.teacherSchedule.teacherId !== teacher.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ success: true, message: 'Already cancelled' });
    }

    // Cancel and restore counts
    await prisma.$transaction(async (tx) => {
      // Restore session to user package if exists
      if (booking.userPackageId) {
        await tx.userPackage.update({
          where: { id: booking.userPackageId },
          data: { sessionsUsed: { decrement: 1 } }
        });
      }

      // Decrement teacher slot booked count if linked
      if (booking.teacherScheduleSlotId) {
        await tx.teacherScheduleSlot.update({
          where: { id: booking.teacherScheduleSlotId },
          data: { bookedCount: { decrement: 1 } }
        });
      }

      // Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled', cancelledAt: new Date(), cancelledReason: reason || 'Cancelled by teacher' }
      });
    });

    return NextResponse.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    console.error('PUT /api/teacher/bookings error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


