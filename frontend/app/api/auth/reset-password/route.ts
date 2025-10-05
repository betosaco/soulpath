import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { createEmailService } from '@/lib/brevo-email-service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user details from database
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: { email: true, fullName: true }
    });

    if (!userDetails?.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store reset token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetExpiry
      }
    });

    // Send password reset email
    const emailService = await createEmailService();
    if (emailService) {
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://matmax.world'}/account/profile?reset=true&token=${resetToken}`;
      
      await emailService.sendEmail({
        to: userDetails.email,
        subject: 'Reset Your Password - MATMAX',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Hello ${userDetails.fullName || userDetails.email},</p>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <p><a href="${resetUrl}" style="background: #4a7c2e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>MATMAX Team</p>
          </div>
        `
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/auth/reset-password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}