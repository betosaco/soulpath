import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const policies = await prisma.policy.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        contentUrl: true,
        contentType: true,
        createdAt: true,
        updatedAt: true,
        acknowledgments: {
          where: { professorId: user.userId },
          select: { id: true, acknowledgedAt: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: policies });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Internal server error', details: e?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, summary, contentUrl, contentType, isActive } = body || {};
    const policy = await prisma.policy.create({
      data: { title, summary, contentUrl, contentType, isActive: Boolean(isActive) }
    });
    return NextResponse.json({ success: true, data: policy });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Internal server error', details: e?.message }, { status: 500 });
  }
}

