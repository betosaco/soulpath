import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth';
import { prisma, withConnection } from '@/lib/prisma';
import { cacheKey, withApiCache, cacheHeaders } from '@/lib/apiCache';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a teacher
    const teacher = await withConnection(() => prisma.teacher.findFirst({ where: { email: user.email } }));
    
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        error: 'Forbidden', 
        message: 'Teacher profile not found' 
      }, { status: 403 });
    }

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const cacheTtlMs = 30_000; // 30s cache for stats
    const key = cacheKey('/api/teacher/stats', {}, String(teacher.id));

    // Get teacher's schedule slots (cached)
    const teacherSchedules = await withApiCache(key + '|schedules', cacheTtlMs, () => withConnection(() => prisma.teacherSchedule.findMany({
      where: { teacherId: teacher.id },
      include: {
        teacherScheduleSlots: {
          include: {
            bookings: {
              where: {
                status: { not: 'CANCELLED' }
              }
            }
          }
        }
      }
    })));

    // Calculate stats
    let todayBookings = 0;
    let upcomingSessions = 0;
    const totalStudents = new Set();

    for (const schedule of teacherSchedules) {
      for (const slot of schedule.teacherScheduleSlots) {
        const slotDate = new Date(slot.startTime);
        
        // Count today's bookings
        if (slotDate >= startOfDay && slotDate < endOfDay) {
          todayBookings += slot.bookings.length;
        }
        
        // Count upcoming sessions (future bookings)
        if (slotDate > new Date()) {
          upcomingSessions += slot.bookings.length;
        }
        
        // Count unique students
        slot.bookings.forEach(booking => {
          if (booking.userId) {
            totalStudents.add(booking.userId);
          }
        });
      }
    }

    // Get average rating (if reviews exist)
    const reviews: Array<{ rating: number | null }> = await withApiCache(key + '|reviews', cacheTtlMs, async () => {
      try {
        return await withConnection(() => prisma.testimonial.findMany({
          where: { teacherId: teacher.id },
          select: { rating: true }
        }));
      } catch {
        return [];
      }
    });

    const ratings = reviews.map(r => r.rating).filter((v): v is number => typeof v === 'number');
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, v) => sum + v, 0) / ratings.length 
      : 0;

    const stats = {
      todayBookings,
      upcomingSessions,
      totalStudents: totalStudents.size,
      rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
    };

    const res = NextResponse.json({
      success: true,
      data: stats
    });
    const headers = cacheHeaders(Math.floor(cacheTtlMs / 1000));
    Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
    return res;

  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
