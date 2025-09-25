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
      },
      orderBy: { createdAt: 'desc' }
    }));

    const studentMap = new Map<string, {
      id: string;
      email: string | null;
      fullName: string | null;
      phone: string | null;
      lastBookingAt: Date;
      bookingsCount: number;
    }>();

    for (const b of bookings) {
      if (!b.user) continue;
      const existing = studentMap.get(b.user.id);
      if (!existing) {
        studentMap.set(b.user.id, {
          id: b.user.id,
          email: b.user.email,
          fullName: b.user.fullName,
          phone: b.user.phone,
          lastBookingAt: b.createdAt,
          bookingsCount: 1,
        });
      } else {
        existing.bookingsCount += 1;
        if (b.createdAt > existing.lastBookingAt) existing.lastBookingAt = b.createdAt;
      }
    }

    const students = Array.from(studentMap.values()).sort((a, b) => b.lastBookingAt.getTime() - a.lastBookingAt.getTime());

    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error('GET /api/teacher/students error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


