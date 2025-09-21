import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createEmailService } from '@/lib/brevo-email-service';

export async function POST(request: NextRequest) {
  try {
    console.log('📧 POST /api/client/send-payment-confirmation - Starting request...');
    
    const user = await requireAuth(request);
    if (!user) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    const body = await request.json();
    const { orderId, amount, currency, packageData } = body;

    if (!orderId || !amount || !packageData) {
      return NextResponse.json({
        success: false,
        error: 'Missing required data',
        message: 'Order ID, amount, and package data are required'
      }, { status: 400 });
    }

    // Send confirmation email
    try {
      const emailService = await createEmailService();
      if (emailService) {
        // Get template from database
        const { CommunicationTemplateService } = await import('@/lib/communication/template-service');
        const template = await CommunicationTemplateService.getTemplate(
          'package_purchase_confirmation',
          'es', // Spanish template
          {
            customer_name: user.email,
            package_name: packageData.name || 'Paquete de Yoga',
            package_price: (amount / 100).toFixed(2), // Convert from cents
            quantity: '1',
            total_amount: `${typeof currency === 'string' ? currency : currency?.symbol || 'S/.'}${(amount / 100).toFixed(2)}`,
            payment_method: 'Pago Online',
            purchase_date: new Date().toLocaleDateString(),
            sessions_count: packageData.sessionsCount?.toString() || '1',
            session_duration: packageData.sessionDuration?.duration_minutes?.toString() || '60',
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            booking_url: `${process.env.NEXT_PUBLIC_APP_URL}/schedule`,
            website_url: process.env.NEXT_PUBLIC_APP_URL || 'https://matmax.world'
          }
        );

        if (template) {
          await emailService.sendTemplateEmail(
            user.email,
            template.content,
            template.subject || 'Purchase Confirmation - MatMax Yoga Studio',
            {}
          );
          console.log('✅ Payment confirmation email sent from success page');
        } else {
          console.warn('⚠️ Purchase confirmation template not found, using fallback');
          // Fallback to simple email
          await emailService.sendEmail({
            to: user.email,
            subject: '¡Gracias por tu compra! - MatMax Yoga Studio',
            html: `
              <h1>¡Gracias por tu compra!</h1>
              <p>Hola ${user.email},</p>
              <p>Tu paquete ${packageData.name || 'de Yoga'} ha sido confirmado.</p>
              <p>Precio: ${typeof currency === 'string' ? currency : currency?.symbol || 'S/.'}${(amount / 100).toFixed(2)}</p>
              <p>Fecha: ${new Date().toLocaleDateString()}</p>
            `
          });
        }
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error in POST /api/client/send-payment-confirmation:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to send confirmation email'
    }, { status: 500 });
  }
}
