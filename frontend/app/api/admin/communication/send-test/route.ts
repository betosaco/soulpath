import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const testEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  templateId: z.number().optional()
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/communication/send-test - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);
    const body = await request.json();
    
    // Validate request body
    const validation = testEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { to, subject, content } = validation.data;

    // Get email configuration
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.brevo_api_key) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email configuration not found',
        message: 'Please configure your Brevo API key first'
      }, { status: 400 });
    }

    // Send test email using Brevo API
    const emailData = {
      sender: {
        name: config.sender_name || 'MATMAX Wellness Studio',
        email: config.sender_email || 'noreply@matmax.world'
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: content
    };

    console.log('📧 Sending test email to:', to);
    console.log('📧 Subject:', subject);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.brevo_api_key
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Brevo API error:', errorData);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send test email',
        details: errorData.message || 'Unknown error from Brevo API'
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('✅ Test email sent successfully:', result.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      recipient: to
    });

  } catch (error) {
    console.error('❌ Unexpected error in POST /api/admin/communication/send-test:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error', 
      details: errorMessage 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
