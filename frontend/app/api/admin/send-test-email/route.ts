import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function POST(request: NextRequest) {
  try {
    const { templateKey, email } = await request.json();

    // Get communication config
    const config = await withConnection(async () => {
      return await prisma.communicationConfig.findFirst();
    });

    if (!config || !config.email_enabled) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Email not enabled or configured'
      }, { status: 400 }));
    }

    // Get template
    const template = await withConnection(async () => {
      return await prisma.communicationTemplate.findUnique({
        where: { templateKey },
        include: {
          translations: {
            where: { language: 'es' }
          }
        }
      });
    });

    if (!template || !template.translations.length) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Template not found'
      }, { status: 404 }));
    }

    const translation = template.translations[0];

    // Mock data for testing
    const mockData = {
      customer_name: 'Cliente de Prueba',
      package_name: 'Test Us - Only Today!',
      sessions_count: 1,
      session_duration: 60,
      package_price: 1.00,
      purchase_date: new Date().toLocaleDateString('es-ES'),
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      booking_url: 'https://matmax.store/booking',
      website_url: 'https://matmax.store',
      class_date: new Date().toLocaleDateString('es-ES'),
      class_time: '08:15',
      class_type: 'Hatha Yoga',
      instructor_name: 'Lucia Meza',
      class_duration: 60,
      venue_address: '123 Wellness Street, Yoga District, Lima',
      booking_reference: 'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    // Replace placeholders in content
    let content = translation.content;
    let subject = translation.subject;

    if (subject) {
      Object.entries(mockData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        content = content.replace(new RegExp(placeholder, 'g'), String(value));
        subject = subject!.replace(new RegExp(placeholder, 'g'), String(value));
      });
    }

    // Send email via Brevo API
    console.log('📧 Sending test email via Brevo...');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Content length:', content.length);

    try {
      const { sendBrevoEmail } = await import('@/lib/brevo-email');
      
      const brevoResponse = await sendBrevoEmail({
        to: email,
        subject: subject || 'Test Email',
        htmlContent: content,
        apiKey: config.brevo_api_key || '',
        sender: {
          email: config.sender_email || '',
          name: config.sender_name || 'MatMax Studio'
        },
        replyTo: {
          email: config.admin_email || '',
          name: 'MatMax Support'
        }
      });

      console.log('✅ Email sent successfully:', brevoResponse.messageId);
    } catch (brevoError) {
      console.error('❌ Brevo API error:', brevoError);
      const errorMessage = brevoError instanceof Error ? brevoError.message : 'Unknown error';
      throw new Error(`Failed to send email via Brevo: ${errorMessage}`);
    }

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        to: email,
        subject: subject,
        template: templateKey,
        contentLength: content.length
      }
    }));

  } catch (error) {
    console.error('Error sending test email:', error);
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Failed to send test email'
    }, { status: 500 }));
  }
}
