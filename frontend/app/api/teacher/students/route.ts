import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth';
import { prisma, withConnection } from '@/lib/prisma';

// GET: List unique students who have bookings with the teacher
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

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Fetch bookings linked to the teacher either directly (booking.teacherId)
    // or via the teacherScheduleSlot -> teacherSchedule relation
    const bookings = await withConnection(() => prisma.booking.findMany({
      where: {
        createdAt: { gte: oneYearAgo },
        status: { in: ['confirmed', 'completed', 'cancelled'] },
        OR: [
          { teacherId: teacher.id },
          { teacherScheduleSlot: { teacherSchedule: { teacherId: teacher.id } } }
        ]
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        userId: true,
        user: { select: { id: true, email: true, fullName: true, phone: true } },
        teacherScheduleSlot: {
          select: {
            teacherSchedule: {
              select: {
                serviceType: { select: { id: true, name: true } },
                venue: { select: { id: true, name: true, city: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }));

    const studentMap = new Map<string, {
      id: string;
      email: string | null;
      fullName: string | null;
      phone: string | null;
      lastBookingAt: Date | null;
      bookingsCount: number;
      // aggregates
      completedCount: number;
      cancelledCount: number;
      confirmedCount: number;
      topServiceType?: { id: number; name: string } | null;
      topVenue?: { id: number; name: string; city: string | null } | null;
    }>();

    for (const b of bookings) {
      if (!b.user) continue;
      const existing = studentMap.get(b.user.id);
      const serviceType = b.teacherScheduleSlot?.teacherSchedule?.serviceType || null;
      const venue = b.teacherScheduleSlot?.teacherSchedule?.venue || null;

      if (!existing) {
        studentMap.set(b.user.id, {
          id: b.user.id,
          email: b.user.email,
          fullName: b.user.fullName,
          phone: b.user.phone,
          lastBookingAt: b.createdAt,
          bookingsCount: 1,
          completedCount: b.status === 'completed' ? 1 : 0,
          cancelledCount: b.status === 'cancelled' ? 1 : 0,
          confirmedCount: b.status === 'confirmed' ? 1 : 0,
          topServiceType: serviceType ? { id: serviceType.id, name: serviceType.name } : null,
          topVenue: venue ? { id: venue.id, name: venue.name, city: venue.city ?? null } : null,
        });
      } else {
        existing.bookingsCount += 1;
        if (b.createdAt && (!existing.lastBookingAt || b.createdAt > existing.lastBookingAt)) {
          existing.lastBookingAt = b.createdAt;
        }
        if (b.status === 'completed') existing.completedCount += 1;
        if (b.status === 'cancelled') existing.cancelledCount += 1;
        if (b.status === 'confirmed') existing.confirmedCount += 1;

        // Rough "top" calculation: prefer most recently seen if none set; for a better approach we can tally frequency
        if (!existing.topServiceType && serviceType) {
          existing.topServiceType = { id: serviceType.id, name: serviceType.name };
        }
        if (!existing.topVenue && venue) {
          existing.topVenue = { id: venue.id, name: venue.name, city: venue.city ?? null };
        }
      }
    }

    const students = Array.from(studentMap.values())
      .map(s => {
        const attended = s.completedCount + s.confirmedCount; // considered attended/going
        const total = s.bookingsCount || 1;
        const attendanceRate = Math.round((attended / total) * 100);
        return {
          ...s,
          attendanceRate
        };
      })
      .sort((a, b) => {
        const aTime = a.lastBookingAt ? a.lastBookingAt.getTime() : 0;
        const bTime = b.lastBookingAt ? b.lastBookingAt.getTime() : 0;
        return bTime - aTime;
      });

    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error('GET /api/teacher/students error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


