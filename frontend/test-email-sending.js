#!/usr/bin/env node

/**
 * Test email sending functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import the CommunicationService
import { CommunicationService } from './lib/services/communication-service.ts';

async function testEmailSending() {
  console.log('📧 Testing Email Sending\n');

  try {
    const communicationService = new CommunicationService();

    // Wait a moment for config to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🔧 Testing email sending with Brevo...');

    const result = await communicationService.sendEmail({
      to: 'betosaco@gmail.com',
      subject: 'Test Email from Communication Service',
      html: '<p>This is a test email sent directly from the Communication Service.</p><p>If you receive this, the email configuration is working correctly!</p>'
    });

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Provider:', result.provider);
    } else {
      console.log('❌ Email sending failed');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Error testing email sending:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailSending();
