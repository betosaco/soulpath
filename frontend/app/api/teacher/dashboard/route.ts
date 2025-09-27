import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth';
import { prisma, withConnection } from '@/lib/prisma';
import { cacheKey, withApiCache, cacheHeaders } from '@/lib/apiCache';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const teacher = await withConnection(() => prisma.teacher.findFirst({ where: { email: user.email } }));
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.max(parseInt(searchParams.get('days') || '30', 10), 1);
    const bookingsStatus = (searchParams.get('status') || 'upcoming') as 'upcoming' | 'past' | 'all';
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 100);

    const now = new Date();
    const slotsRangeStart = new Date();
    const slotsRangeEnd = new Date();
    slotsRangeEnd.setDate(slotsRangeEnd.getDate() + days);

    const cacheTtlMs = 20_000; // 20s overall dashboard cache
    const key = cacheKey('/api/teacher/dashboard', { days, bookingsStatus, limit }, String(teacher.id));

    const data = await withApiCache(key, cacheTtlMs, async () => {
      // Slots (late-aware)
      const slotsWhere: any = {
        teacherSchedule: { teacherId: teacher.id },
        OR: [
          { startTime: { gte: slotsRangeStart, lte: slotsRangeEnd }, OR: [{ isLate: false }, { isLate: null }] },
          { isLate: true, OR: [ { startTime: { gte: slotsRangeStart, lte: slotsRangeEnd } }, { originalStartTime: { gte: slotsRangeStart, lte: slotsRangeEnd } } ] },
        ],
      };

      const slotsPromise = withConnection(() => prisma.teacherScheduleSlot.findMany({
        where: slotsWhere,
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
          originalStartTime: true,
          originalEndTime: true,
          bookings: {
            select: {
              id: true,
              status: true,
              user: { select: { id: true, email: true, fullName: true } },
            },
          },
          teacherSchedule: { select: { serviceType: { select: { id: true, name: true, duration: true } }, venue: { select: { id: true, name: true, city: true } } } },
        },
        orderBy: { startTime: 'asc' },
      }));

      // Bookings list
      const bookingsWhere: any = { teacherId: teacher.id };
      if (bookingsStatus === 'upcoming') {
        bookingsWhere.teacherScheduleSlot = { startTime: { gte: now } };
        bookingsWhere.status = 'confirmed';
      } else if (bookingsStatus === 'past') {
        bookingsWhere.teacherScheduleSlot = { startTime: { lt: now } };
        bookingsWhere.status = 'completed';
      }

      const bookingsPromise = withConnection(() => prisma.booking.findMany({
        where: bookingsWhere,
        select: {
          id: true,
          status: true,
          sessionType: true,
          notes: true,
          createdAt: true,
          user: { select: { id: true, email: true, fullName: true, phone: true } },
          teacherScheduleSlot: { select: { startTime: true, endTime: true, teacherSchedule: { select: { serviceType: { select: { name: true, duration: true } }, venue: { select: { name: true, city: true } } } } } },
        },
        take: limit,
        orderBy: [{ teacherScheduleSlot: { startTime: bookingsStatus === 'upcoming' ? 'asc' : 'desc' } }],
      }));

      // Stats
      const schedulesForStats = await withConnection(() => prisma.teacherSchedule.findMany({
        where: { teacherId: teacher.id },
        include: { teacherScheduleSlots: { include: { bookings: { where: { status: { not: 'CANCELLED' } } } } } },
      }));

      let todayBookings = 0;
      let upcomingSessions = 0;
      const totalStudents = new Set<string>();
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      for (const schedule of schedulesForStats) {
        for (const slot of schedule.teacherScheduleSlots) {
          const slotDate = new Date(slot.startTime);
          if (slotDate >= startOfDay && slotDate < endOfDay) todayBookings += slot.bookings.length;
          if (slotDate > new Date()) upcomingSessions += slot.bookings.length;
          slot.bookings.forEach(b => { if (b.userId) totalStudents.add(String(b.userId)); });
        }
      }

      const reviews = await withConnection(() => prisma.testimonial.findMany({ where: { teacherId: teacher.id }, select: { rating: true } }));
      const ratings = reviews.map(r => r.rating).filter((v): v is number => typeof v === 'number');
      const averageRating = ratings.length ? ratings.reduce((s, v) => s + v, 0) / ratings.length : 0;

      const [slots, bookings] = await Promise.all([slotsPromise, bookingsPromise]);
      return {
        slots,
        bookings,
        stats: { todayBookings, upcomingSessions, totalStudents: totalStudents.size, rating: Math.round(averageRating * 10) / 10 },
      };
    });

    const res = NextResponse.json({ success: true, data });
    const headers = cacheHeaders(Math.floor(20_000 / 1000));
    Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  } catch (error) {
    console.error('GET /api/teacher/dashboard error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


