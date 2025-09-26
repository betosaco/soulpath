import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma, withConnection } from '@/lib/prisma';

// GET: List teacher reviews
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Find teacher
    const teacher = await withConnection(() => prisma.teacher.findFirst({ where: { email: user.email } }));
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'Teacher profile not found' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
    const offset = (page - 1) * limit;

    const [reviews, totalCount] = await withConnection(async () => {
      const list = await prisma.testimonial.findMany({
        where: { teacherId: teacher.id },
        select: {
          id: true,
          rating: true,
          text: true,
          createdAt: true,
          authorName: true,
          authorTitle: true,
          authorImage: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });
      const count = await prisma.testimonial.count({ where: { teacherId: teacher.id } });
      return [list, count];
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) }
    });
  } catch (error) {
    console.error('GET /api/teacher/reviews error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


