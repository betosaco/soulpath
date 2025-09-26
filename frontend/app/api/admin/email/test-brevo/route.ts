import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { renderEmailLayout, getEmailTheme } from '@/lib/brevo-email';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Brevo email service...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    // Import the Brevo email service
    const { createEmailService } = await import('@/lib/brevo-email-service');
    const emailService = await createEmailService();
    
    if (!emailService) {
      console.error('❌ Email service not available');
      return NextResponse.json({ 
        success: false, 
        error: 'Email service not available. Please check Brevo configuration.' 
      }, { status: 500 });
    }

    // Test email data
    const testEmailData = {
      to: 'betosaco@gmail.com',
      subject: '🧪 Test Email from SoulPath - Brevo Integration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Email</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: #f7f7f7; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #191970, #0A0A23); color: #FFD700; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
                .content { padding: 30px; }
                .test-info { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✨ MatMax Yoga Studio ✨</h1>
                    <p>Brevo Email Service Test</p>
                </div>
                <div class="content">
                    <h2>🎉 Test Email Successful!</h2>
                    <p>This is a test email to verify that the Brevo email service integration is working correctly.</p>
                    
                    <div class="test-info">
                        <h3>✅ What This Confirms</h3>
                        <ul>
                            <li>Brevo API key is configured correctly</li>
                            <li>Email service can connect to Brevo</li>
                            <li>Emails can be sent successfully</li>
                            <li>Template system is ready for use</li>
                        </ul>
                    </div>

                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li><strong>Sent to:</strong> betosaco@gmail.com</li>
                        <li><strong>Sent from:</strong> SoulPath Email Service</li>
                        <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                        <li><strong>Service:</strong> Brevo (Sendinblue)</li>
                    </ul>

                    <p>If you received this email, the integration is working perfectly! 🚀</p>
                </div>
                <div class="footer">
                    <p>© 2024 MatMax Yoga Studio - José Garfias<br>
                    Guiding souls through mindful movement and breath</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Wrap with admin theme and send the test email
    console.log('📧 Sending test email to:', testEmailData.to);
    const themedHtml = renderEmailLayout(testEmailData.html, testEmailData.subject, getEmailTheme('frontpage'));
    const emailSent = await emailService.sendEmail({ ...testEmailData, html: themedHtml });

    if (emailSent) {
      console.log('✅ Test email sent successfully via Brevo');
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully to betosaco@gmail.com',
        timestamp: new Date().toISOString(),
        recipient: testEmailData.to
      });
    } else {
      console.error('❌ Failed to send test email');
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email via Brevo'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in test email endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error', 
      details: errorMessage 
    }, { status: 500 });
  }
}
