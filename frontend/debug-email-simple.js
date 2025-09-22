// Simple email debug test
import { createEmailService } from './lib/brevo-email-service.ts';

async function testEmailService() {
  try {
    console.log('🔍 Testing email service...');
    
    // Test creating email service
    const emailService = await createEmailService();
    
    if (!emailService) {
      console.error('❌ Email service not created - Brevo configuration not found');
      return;
    }
    
    console.log('✅ Email service created successfully');
    
    // Test sending a simple email
    const emailResult = await emailService.sendEmailWithBCC({
      to: 'alberto@matmax.world',
      bcc: 'alberto@matmax.world',
      subject: 'Test Email - MatMax Yoga Studio',
      html: '<h1>Test Email</h1><p>This is a test email from MatMax Yoga Studio.</p>',
      text: 'Test Email\n\nThis is a test email from MatMax Yoga Studio.'
    });
    
    if (emailResult) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.log('❌ Test email failed to send');
    }
    
  } catch (error) {
    console.error('❌ Error testing email service:', error);
  }
}

testEmailService();
