import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { policyId } = body || {};
    if (!policyId) return NextResponse.json({ success: false, error: 'policyId required' }, { status: 400 });

    const ack = await prisma.policyAcknowledgment.upsert({
      where: { policyId_professorId: { policyId, professorId: user.userId } },
      create: { policyId, professorId: user.userId },
      update: {},
      select: { id: true, acknowledgedAt: true }
    });

    return NextResponse.json({ success: true, data: ack });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Internal server error', details: e?.message }, { status: 500 });
  }
}

