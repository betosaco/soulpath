import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

    // Get email configuration
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.email_enabled) {
      return NextResponse.json({ success: false, error: 'Email service is disabled',
        message: 'Please enable email service first'
      }, { status: 400 });
    }

    // Check which provider to use
    const provider = config.email_provider || 'brevo';

    if (provider === 'brevo') {
      // Send test email using Brevo API
      if (!config.brevo_api_key) {
        return NextResponse.json({ success: false, error: 'Brevo configuration not found',
          message: 'Please configure your Brevo API key first'
        }, { status: 400 });
      }

      const emailData = {
        sender: {
          name: config.sender_name || 'MATMAX Wellness Studio',
          email: config.sender_email || 'noreply@matmax.world'
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: content
      };

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
        console.error('Brevo API error:', errorData);
        return NextResponse.json({ success: false, error: 'Failed to send test email via Brevo',
          details: errorData.message || 'Unknown error from Brevo API'
        }, { status: 500 });
      }

      const result = await response.json();
      console.log('✅ Test email sent successfully via Brevo:', result.messageId);

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully via Brevo',
        messageId: result.messageId,
        provider: 'brevo'
      });

    } else if (provider === 'resend') {
      // Send test email using Resend API
      if (!config.resend_api_key) {
        return NextResponse.json({ success: false, error: 'Resend configuration not found',
          message: 'Please configure your Resend API key first'
        }, { status: 400 });
      }

      const emailData = {
        from: `${config.sender_name || 'MATMAX Wellness Studio'} <${config.sender_email || 'noreply@matmax.world'}>`,
        to: [to],
        subject: subject,
        html: content
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.resend_api_key}`
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API error:', errorData);
        return NextResponse.json({ success: false, error: 'Failed to send test email via Resend',
          details: errorData.message || 'Unknown error from Resend API'
        }, { status: 500 });
      }

      const result = await response.json();
      console.log('✅ Test email sent successfully via Resend:', result.id);

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully via Resend',
        messageId: result.id,
        provider: 'resend'
      });

    } else {
      return NextResponse.json({ success: false, error: 'Invalid email provider',
        message: 'Supported providers: brevo, resend'
      }, { status: 400 });
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

    // Get SMS configuration
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.labsmobile_username || !config.labsmobile_token) {
      return NextResponse.json({ success: false, error: 'SMS configuration not found',
        message: 'Please configure your Labsmobile credentials first'
      }, { status: 400 });
    }

    // Send test SMS using Labsmobile API
    const smsData = {
      message: message,
      tpoa: config.sms_sender_name || 'SoulPath',
      recipient: [{ msisdn: phoneNumber }]
    };

    const authHeader = Buffer.from(`${config.labsmobile_username}:${config.labsmobile_token}`).toString('base64');

    const response = await fetch('https://api.labsmobile.com/json/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(smsData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Labsmobile API error:', errorData);
      return NextResponse.json({ success: false, error: 'Failed to send test SMS',
        details: errorData.message || 'Unknown error from Labsmobile API'
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('✅ Test SMS sent successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test SMS sent successfully',
      result: result
    });
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

    // Get Telegram configuration
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.telegram_bot_token) {
      return NextResponse.json({ success: false, error: 'Telegram configuration not found',
        message: 'Please configure your Telegram bot token first'
      }, { status: 400 });
    }

    // Send test message using Telegram Bot API
    const telegramData = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    };

    const response = await fetch(`https://api.telegram.org/bot${config.telegram_bot_token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(telegramData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      return NextResponse.json({ success: false, error: 'Failed to send test Telegram message',
        details: errorData.description || 'Unknown error from Telegram API'
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('✅ Test Telegram message sent successfully:', result.message_id);

    return NextResponse.json({
      success: true,
      message: 'Test Telegram message sent successfully',
      messageId: result.message_id
    });
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

    // Get WhatsApp configuration
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.whatsapp_access_token || !config.whatsapp_phone_number_id) {
      return NextResponse.json({ success: false, error: 'WhatsApp configuration not found',
        message: 'Please configure your WhatsApp Business API credentials first'
      }, { status: 400 });
    }

    // Send test message using WhatsApp Business API
    const whatsappData = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message }
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${config.whatsapp_phone_number_id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.whatsapp_access_token}`
      },
      body: JSON.stringify(whatsappData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API error:', errorData);
      return NextResponse.json({ success: false, error: 'Failed to send test WhatsApp message',
        details: errorData.error?.message || 'Unknown error from WhatsApp API'
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('✅ Test WhatsApp message sent successfully:', result.messages?.[0]?.id);

    return NextResponse.json({
      success: true,
      message: 'Test WhatsApp message sent successfully',
      messageId: result.messages?.[0]?.id
    });
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

    const { userId, message } = validation.data;

    // Get Instagram configuration
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.instagram_access_token || !config.instagram_business_account_id) {
      return NextResponse.json({ success: false, error: 'Instagram configuration not found',
        message: 'Please configure your Instagram Business API credentials first'
      }, { status: 400 });
    }

    // Send test message using Instagram Business API
    const instagramData = {
      recipient: { id: userId },
      message: { text: message },
      messaging_type: 'MESSAGE_TAG',
      tag: 'ACCOUNT_UPDATE'
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${config.instagram_business_account_id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.instagram_access_token}`
      },
      body: JSON.stringify(instagramData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Instagram API error:', errorData);
      return NextResponse.json({ success: false, error: 'Failed to send test Instagram message',
        details: errorData.error?.message || 'Unknown error from Instagram API'
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('✅ Test Instagram message sent successfully:', result.message_id);

    return NextResponse.json({
      success: true,
      message: 'Test Instagram message sent successfully',
      messageId: result.message_id
    });
  } catch (error) {
    console.error('❌ Error sending test Instagram message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send test Instagram message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
