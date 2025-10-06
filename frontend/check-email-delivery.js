#!/usr/bin/env node

/**
 * Check email delivery and troubleshoot issues
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEmailDelivery() {
  console.log('📧 Checking Email Delivery Issues\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Current Email Configuration:');
    console.log('- Email enabled:', config.emailEnabled);
    console.log('- Email provider:', config.emailProvider);
    console.log('- Sender email:', config.senderEmail);
    console.log('- Sender name:', config.senderName);
    console.log('- Admin email:', config.adminEmail);

    console.log('\n🔍 Common reasons why emails might not be received:');
    console.log('1. **Spam/Junk Folder**: Check your spam/junk folder');
    console.log('2. **Email Provider Blocking**: Some providers block emails from certain domains');
    console.log('3. **Sender Email Issues**: The sender email might not be verified');
    console.log('4. **Recipient Email Issues**: The recipient email might be invalid');
    console.log('5. **Brevo Account Issues**: Your Brevo account might have restrictions');

    console.log('\n🧪 Let\'s test with different email addresses:');
    
    // Test with admin email
    console.log('\n📧 Testing with admin email...');
    try {
      const { CommunicationService } = await import('./lib/services/communication-service.ts');
      const communicationService = new CommunicationService();
      
      const result = await communicationService.sendEmail({
        to: config.adminEmail || 'admin@matmax.world',
        subject: 'Email Delivery Test - Admin Email',
        html: `
          <h2>Email Delivery Test</h2>
          <p>This is a test email to verify email delivery.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${config.senderName} &lt;${config.senderEmail}&gt;</p>
          <p><strong>Provider:</strong> ${config.emailProvider}</p>
        `
      });

      if (result.success) {
        console.log('✅ Email sent successfully to admin email!');
        console.log('Message ID:', result.messageId);
        console.log('Provider:', result.provider);
        console.log('📧 Check your admin email inbox and spam folder');
      } else {
        console.log('❌ Failed to send email to admin');
        console.log('Error:', result.error);
      }
    } catch (error) {
      console.log('❌ Error sending test email:', error.message);
    }

    console.log('\n📋 Troubleshooting Steps:');
    console.log('1. **Check Spam Folder**: Look in your spam/junk folder');
    console.log('2. **Check Sender Email**: Make sure the sender email is valid');
    console.log('3. **Check Brevo Account**: Log into your Brevo account and check:');
    console.log('   - Account status');
    console.log('   - Sending limits');
    console.log('   - Domain verification');
    console.log('4. **Try Different Email**: Test with a different email address');
    console.log('5. **Check Brevo Logs**: Look at your Brevo dashboard for delivery logs');

    console.log('\n🔧 Brevo Account Check:');
    console.log('- Go to: https://app.brevo.com/');
    console.log('- Check your account status');
    console.log('- Look at the "Email" section for delivery logs');
    console.log('- Check if your domain is verified');
    console.log('- Look for any sending restrictions');

  } catch (error) {
    console.error('❌ Error checking email delivery:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmailDelivery();
