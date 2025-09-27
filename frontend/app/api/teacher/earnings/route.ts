import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth';
import { prisma, withConnection } from '@/lib/prisma';
import { cacheKey, withApiCache, cacheHeaders } from '@/lib/apiCache';

// Commission percent as decimal
const COMMISSION = 0.5087; // 50.87%

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const teacher = await prisma.teacher.findFirst({ where: { email: user.email } });
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const rangeStart = startDateParam ? new Date(startDateParam + 'T00:00:00.000Z') : new Date(new Date().getFullYear(), 0, 1);
    const rangeEnd = endDateParam ? new Date(endDateParam + 'T23:59:59.999Z') : new Date();

    const cacheTtlMs = 60_000; // 60s earnings cache
    const key = cacheKey('/api/teacher/earnings', { startDateParam, endDateParam }, String(teacher.id));
    // Fetch completed or confirmed bookings linked to a userPackage (units consumed) for this teacher
    const bookings = await withApiCache(key, cacheTtlMs, () => withConnection(() => prisma.booking.findMany({
      where: {
        createdAt: { gte: rangeStart, lte: rangeEnd },
        status: { in: ['confirmed', 'completed'] },
        OR: [
          { teacherId: teacher.id },
          { teacherScheduleSlot: { teacherSchedule: { teacherId: teacher.id } } }
        ]
      },
      select: {
        id: true,
        createdAt: true,
        user: { select: { id: true, fullName: true, email: true } },
        userPackage: {
          select: {
            id: true,
            packagePrice: {
              select: {
                id: true,
                pricePerClass: true,
                packageDefinition: { select: { id: true, name: true, sessionsCount: true, packageType: true } },
                currency: { select: { code: true, symbol: true } }
              }
            }
          }
        },
        serviceType: { select: { id: true, name: true } },
        teacherScheduleSlot: {
          select: {
            teacherSchedule: {
              select: { venue: { select: { id: true, name: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })));

    let totalGross = 0;
    let totalCommission = 0;
    const rows: any[] = [];

    for (const b of bookings) {
      const pricePerClass = Number(b.userPackage?.packagePrice?.pricePerClass ?? 0);
      const gross = pricePerClass > 0 ? pricePerClass : 0;
      const commission = +(gross * COMMISSION).toFixed(2);
      totalGross += gross;
      totalCommission += commission;
      rows.push({
        id: b.id,
        date: b.createdAt,
        service: b.serviceType?.name ?? 'Class',
        venue: b.teacherScheduleSlot?.teacherSchedule?.venue?.name ?? 'Venue',
        gross,
        commission,
        currency: b.userPackage?.packagePrice?.currency?.code ?? 'USD',
        symbol: b.userPackage?.packagePrice?.currency?.symbol ?? '$',
        // details
        student: {
          id: b.user?.id ?? '',
          name: b.user?.fullName || b.user?.email || 'Unknown'
        },
        pass: {
          userPackageId: b.userPackage?.id ?? null,
          name: b.userPackage?.packagePrice?.packageDefinition?.name ?? 'Package',
          sessionsCount: b.userPackage?.packagePrice?.packageDefinition?.sessionsCount ?? null,
          packageType: b.userPackage?.packagePrice?.packageDefinition?.packageType ?? null,
          pricePerClass
        }
      });
    }

    const res = NextResponse.json({
      success: true,
      data: {
        commissionPercent: COMMISSION,
        totalGross: +totalGross.toFixed(2),
        totalCommission: +totalCommission.toFixed(2),
        items: rows
      }
    });
    const headers = cacheHeaders(Math.floor(cacheTtlMs / 1000));
    Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  } catch (error) {
    console.error('GET /api/teacher/earnings error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


