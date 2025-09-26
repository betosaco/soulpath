import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const teacher = await prisma.teacher.findFirst({ where: { email: user.email } });
    if (!teacher) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    try {
      const settings = await prisma.teacherPaymentSettings.findUnique({ where: { teacherId: teacher.id } });
      return NextResponse.json({ success: true, data: settings || null });
    } catch (dbError) {
      console.error('GET payment settings DB error:', dbError);
      // Gracefully handle missing table during first deploy: return empty instead of 500
      return NextResponse.json({ success: true, data: null });
    }
  } catch (error) {
    console.error('GET /api/teacher/settings/payment error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    if (!user || !user.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const teacher = await prisma.teacher.findFirst({ where: { email: user.email } });
    if (!teacher) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const data = {
      bankName: body.bankName ?? null,
      accountNumber: body.accountNumber ?? null,
      accountType: body.accountType ?? null,
      ruc: body.ruc ?? null,
      payoutEmail: body.payoutEmail ?? null,
      payoutPhone: body.payoutPhone ?? null,
      documentType: body.documentType ?? null,
      documentNumber: body.documentNumber ?? null,
    };

    const settings = await prisma.teacherPaymentSettings.upsert({
      where: { teacherId: teacher.id },
      create: { teacherId: teacher.id, ...data },
      update: data,
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('PUT /api/teacher/settings/payment error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


