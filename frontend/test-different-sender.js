#!/usr/bin/env node

/**
 * Test with different sender email addresses
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDifferentSender() {
  console.log('📧 Testing with Different Sender Emails\n');

  try {
    const { CommunicationService } = await import('./lib/services/communication-service.ts');
    const communicationService = new CommunicationService();

    // Test with a Gmail address (more likely to be delivered)
    console.log('📧 Testing with Gmail sender...');
    try {
      const result = await communicationService.sendEmail({
        to: 'alberto@matmax.world',
        subject: 'Test Email - Gmail Sender',
        html: `
          <h2>Email Delivery Test</h2>
          <p>This email is sent with a Gmail sender address.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>Test:</strong> Gmail sender address</p>
        `,
        from: 'noreply@gmail.com' // This will use the default sender if not supported
      });

      if (result.success) {
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', result.messageId);
        console.log('Provider:', result.provider);
      } else {
        console.log('❌ Failed to send email');
        console.log('Error:', result.error);
      }
    } catch (error) {
      console.log('❌ Error sending email:', error.message);
    }

    console.log('\n📋 Alternative Solutions:');
    console.log('1. **Check Brevo Dashboard**:');
    console.log('   - Go to https://app.brevo.com/');
    console.log('   - Check "Email" > "Statistics"');
    console.log('   - Look for delivery logs and bounces');
    console.log('   - Check if your domain is verified');

    console.log('\n2. **Try Different Recipient Email**:');
    console.log('   - Test with a Gmail address');
    console.log('   - Test with a different email provider');
    console.log('   - Check if the issue is with the recipient');

    console.log('\n3. **Domain Verification**:');
    console.log('   - In Brevo, go to "Settings" > "Senders & IP"');
    console.log('   - Verify your domain (matmax.store)');
    console.log('   - Add SPF, DKIM, and DMARC records');

    console.log('\n4. **Check Email Headers**:');
    console.log('   - If you receive the email, check the headers');
    console.log('   - Look for any delivery warnings');
    console.log('   - Check if it was marked as spam');

  } catch (error) {
    console.error('❌ Error testing different sender:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDifferentSender();
