import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

// Allows setting password via emailed token or admin enrollment
// Body: { email: string, password: string, token?: string }
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'Missing token or password' }, { status: 400 });
    }

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { password: hashed, status: 'ACTIVE', role: user.role === 'USER' ? 'TEACHER' : user.role } });
      await tx.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } });
    });

    return NextResponse.json({ success: true, message: 'Password set successfully' });
  } catch (error) {
    console.error('set-password error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


