#!/usr/bin/env node

/**
 * Test email sending directly via Brevo API
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEmailDirect() {
  console.log('📧 Testing Direct Email Sending via Brevo API\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.brevoApiKey) {
      console.log('❌ No Brevo API key found in configuration');
      return;
    }

    console.log('🔧 Sending test email directly to Brevo API...');

    const emailData = {
      sender: {
        name: config.senderName || 'MatMax Wellness Studio',
        email: config.senderEmail || 'info@matmax.store'
      },
      to: [{
        email: 'betosaco@gmail.com'
      }],
      subject: 'Test Email - Direct Brevo API Call',
      htmlContent: '<p>This is a test email sent directly to Brevo API.</p><p>If you receive this, the Brevo integration is working!</p>',
      textContent: 'This is a test email sent directly to Brevo API. If you receive this, the Brevo integration is working!'
    };

    console.log('📤 Email data:', JSON.stringify(emailData, null, 2));

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': config.brevoApiKey
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email sent successfully via Brevo API!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Email sending failed');
      console.log('Status:', response.status);
      console.log('Error:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Error testing direct email sending:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailDirect();
