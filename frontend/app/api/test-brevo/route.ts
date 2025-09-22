import { NextRequest, NextResponse } from 'next/server';
import { createEmailService } from '@/lib/brevo-email-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Brevo API service (public endpoint)...');

    // Create email service
    const emailService = await createEmailService();

    if (!emailService) {
      console.error('❌ Email service not available');
      return NextResponse.json({
        success: false,
        error: 'Email service not available. Please check Brevo configuration.'
      }, { status: 500 });
    }

    // Check if this is a test for BCC functionality
    const body = await request.json().catch(() => ({}));
    if (body.test === 'bcc-order-email') {
      console.log('🧪 Testing BCC order confirmation email...');

      // Test the order confirmation email with BCC
      const testOrderData = {
        customerName: 'Test Customer',
        customerEmail: 'betosaco@gmail.com',
        orderNumber: 'TEST-ORDER-123',
        orderId: 'test-order-id',
        orderDate: new Date().toLocaleDateString('es-ES'),
        orderStatus: 'PENDING',
        orderStatusText: 'Pendiente',
        paymentStatus: 'PENDING',
        paymentStatusText: 'Pendiente',
        billingDocumentType: 'boleta_simple',
        orderItems: [
          {
            name: 'Test Package',
            description: 'Test package description',
            type_text: 'Paquete',
            quantity: 1,
            unit_price: 60,
            total_price: 60,
            sessions: 1,
            duration_minutes: 30
          }
        ],
        subtotal: 60,
        tax_amount: 0,
        shipping_amount: 0,
        total_amount: 60,
        currency: 'PEN',
        order_url: 'https://matmax.store/test-order'
      };

      const { sendOrderConfirmationEmail } = await import('@/lib/send-order-confirmation-email');
      const emailSent = await sendOrderConfirmationEmail(testOrderData);

      if (emailSent) {
        return NextResponse.json({
          success: true,
          message: 'Order confirmation email with BCC sent successfully!',
          recipient: testOrderData.customerEmail,
          bcc: 'info@matmax.store',
          orderNumber: testOrderData.orderNumber
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to send order confirmation email'
        }, { status: 500 });
      }
    }

    // Test email data
    const testEmailData = {
      to: 'betosaco@gmail.com',
      subject: '🧪 Vercel Brevo API Key Test - Public Endpoint',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Brevo API Test</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: #f7f7f7; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #191970, #0A0A23); color: #FFD700; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
                .content { padding: 30px; }
                .success-box { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✨ Brevo API Test ✨</h1>
                    <p>Vercel Environment Test</p>
                </div>
                <div class="content">
                    <h2>🎉 API Key Working!</h2>
                    <p>This email confirms that your Brevo API key is configured correctly in the Vercel environment.</p>

                    <div class="success-box">
                        <h3>✅ What This Confirms</h3>
                        <ul>
                            <li>Brevo API key is properly set in Vercel environment variables</li>
                            <li>API key has correct permissions for sending emails</li>
                            <li>Brevo service is accessible and responding</li>
                            <li>Email delivery system is ready for production</li>
                        </ul>
                    </div>

                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li><strong>Sent to:</strong> betosaco@gmail.com</li>
                        <li><strong>Sent from:</strong> info@matmax.store</li>
                        <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                        <li><strong>Environment:</strong> Vercel (Production)</li>
                        <li><strong>API:</strong> Brevo (Sendinblue)</li>
                        <li><strong>Endpoint:</strong> /api/test-brevo (Public)</li>
                    </ul>

                    <p>If you received this email, your Brevo integration is working perfectly! 🚀</p>
                </div>
                <div class="footer">
                    <p>© 2024 MatMax Yoga Studio<br>
                    Testing Brevo Email Integration</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Send the test email
    console.log('📧 Sending test email to:', testEmailData.to);
    const emailSent = await emailService.sendEmail(testEmailData);

    if (emailSent) {
      console.log('✅ Test email sent successfully via Brevo');
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully to betosaco@gmail.com',
        timestamp: new Date().toISOString(),
        recipient: testEmailData.to,
        endpoint: 'public-test-brevo'
      });
    } else {
      console.error('❌ Failed to send test email');
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email via Brevo'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in public test endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 });
  }
}
