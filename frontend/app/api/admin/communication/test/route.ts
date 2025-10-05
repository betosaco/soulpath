import { NextRequest, NextResponse } from 'next/server';
import { handleAdminAuth } from '@/lib/auth';
import { communicationService } from '@/lib/services/communication-service';
import { z } from 'zod';

interface TestEmailData {
  to: string;
  subject: string;
  content: string;
}

interface TestSmsData {
  phoneNumber: string;
  message: string;
}

interface TestWhatsAppData {
  phoneNumber: string;
  message: string;
}

interface TestInstagramData {
  userId: string;
  message: string;
}

const testEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required')
});

const testSmsSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  message: z.string().min(1, 'Message is required')
});

const testWhatsAppSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  message: z.string().min(1, 'Message is required')
});

const testInstagramSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z.string().min(1, 'Message is required')
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/communication/test - Starting request...');

    const auth = await handleAdminAuth(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    console.log('✅ User authenticated:', user.email);
    const body = await request.json();
    const { type } = body; // 'email', 'sms', or 'telegram'

    if (type === 'email') {
      return await testEmail(request, body);
    } else if (type === 'sms') {
      return await testSms(request, body);
    } else if (type === 'telegram') {
      return await testTelegram(request, body);
    } else if (type === 'whatsapp') {
      return await testWhatsApp(request, body);
    } else if (type === 'instagram') {
      return await testInstagram(request, body);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid test type',
        message: 'Type must be one of: "email", "sms", "telegram", "whatsapp", "instagram"'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Unexpected error in POST /api/admin/communication/test:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

async function testEmail(_request: NextRequest, body: TestEmailData) {
  try {
    // Validate request body
    const validation = testEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { to, subject, content } = validation.data;

    // Use CommunicationService to send test email
    const result = await communicationService.sendEmail({
      to,
      subject,
      html: content
    });

    if (result.success) {
      console.log('✅ Test email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully via ${result.provider}`,
        messageId: result.messageId,
        provider: result.provider
      });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send test email',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function testSms(_request: NextRequest, body: TestSmsData) {
  try {
    // Validate request body
    const validation = testSmsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { phoneNumber, message } = validation.data;

    // Use CommunicationService to send test SMS
    const result = await communicationService.sendSms({
      to: phoneNumber,
      message
    });

    if (result.success) {
      console.log('✅ Test SMS sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: `Test SMS sent successfully via ${result.provider}`,
        messageId: result.messageId,
        provider: result.provider
      });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send test SMS',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error sending test SMS:', error);
    return NextResponse.json({ success: false, error: 'Failed to send test SMS',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function testTelegram(_request: NextRequest, body: { chatId: string; message: string }) {
  try {
    const { chatId, message } = body;

    // Use CommunicationService to send test Telegram message
    const result = await communicationService.sendTelegramMessage({
      chatId,
      message
    });

    if (result.success) {
      console.log('✅ Test Telegram message sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: `Test Telegram message sent successfully via ${result.provider}`,
        messageId: result.messageId,
        provider: result.provider
      });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send test Telegram message',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error sending test Telegram message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send test Telegram message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function testWhatsApp(_request: NextRequest, body: TestWhatsAppData) {
  try {
    // Validate request body
    const validation = testWhatsAppSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { phoneNumber, message } = validation.data;

    // Use CommunicationService to send test WhatsApp message
    const result = await communicationService.sendWhatsAppMessage({
      to: phoneNumber,
      message
    });

    if (result.success) {
      console.log('✅ Test WhatsApp message sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: `Test WhatsApp message sent successfully via ${result.provider}`,
        messageId: result.messageId,
        provider: result.provider
      });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send test WhatsApp message',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error sending test WhatsApp message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send test WhatsApp message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function testInstagram(_request: NextRequest, body: TestInstagramData) {
  try {
    // Validate request body
    const validation = testInstagramSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 });
    }

    // Instagram testing not implemented in CommunicationService yet
    return NextResponse.json({
      success: false,
      error: 'Instagram testing not implemented yet',
      message: 'Instagram integration is planned for future release'
    }, { status: 501 });

  } catch (error) {
    console.error('❌ Error with Instagram test:', error);
    return NextResponse.json({ success: false, error: 'Instagram test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
