import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CommunicationTemplateService } from '@/lib/communication/template-service';
import { createEmailService } from '@/lib/brevo-email-service';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();
    if (!email || !name) {
      return NextResponse.json({ success: false, error: 'Missing name or email' }, { status: 400 });
    }

    // Ensure user exists (without password), mark as PENDING
    const userRecord = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { fullName: name, status: 'PENDING' },
      create: { email: email.toLowerCase(), fullName: name, status: 'PENDING', role: 'USER', language: 'es' }
    });

    // Ensure teacher exists and is active
    await prisma.teacher.upsert({
      where: { email: email.toLowerCase() },
      update: { name, isActive: true },
      create: { name, email: email.toLowerCase(), isActive: true }
    });

    // Build token and links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Invalidate previous tokens for this user (optional clean-up)
    try {
      await prisma.passwordResetToken.deleteMany({ where: { userId: userRecord.id } });
    } catch (_e) {}

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await prisma.passwordResetToken.create({
      data: {
        userId: userRecord.id,
        token,
        expiresAt
      }
    });

    const setPasswordUrl = `${baseUrl}/set-password?token=${encodeURIComponent(token)}`;
    const dashboardUrl = `${baseUrl}/account/teacher`;

    // Load template
    const template = await CommunicationTemplateService.getTemplate('teacher_enrollment', 'es', {
      teacherName: name,
      teacherEmail: email,
      setPasswordUrl,
      dashboardUrl
    });

    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 500 });
    }

    const emailService = await createEmailService();
    if (!emailService) {
      return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 });
    }

    const sent = await emailService.sendEmailWithBCC({
      to: email,
      bcc: 'alberto@matmax.world',
      subject: template.subject || 'Configuración de cuenta de profesora',
      html: template.content,
      text: template.content.replace(/<[^>]+>/g, '')
    });

    if (!sent) {
      return NextResponse.json({ success: false, error: 'Failed to send enrollment email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Teacher enrolled and email sent', userId: userRecord.id });
  } catch (error) {
    console.error('Enroll teacher error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


