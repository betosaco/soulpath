#!/usr/bin/env node

/**
 * Direct test to send email using Brevo API
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function sendDirectTestEmail() {
  console.log('📧 Direct Email Test to betosaco@gmail.com\n');

  try {
    // Test data
    const testData = {
      customer_name: 'Alberto Saco',
      package_name: 'Paquete de 10 Sesiones de Yoga',
      package_price: '150.00',
      quantity: '1',
      total_amount: 'S/.150.00',
      payment_method: 'Stripe',
      purchase_date: new Date().toLocaleDateString(),
      sessions_count: '10',
      session_duration: '60',
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      booking_url: 'https://matmax.store/schedule',
      website_url: 'https://matmax.store'
    };

    // Get the template
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'package_purchase_confirmation',
        isActive: true
      },
      include: {
        translations: {
          where: {
            language: 'es'
          }
        }
      }
    });

    if (!template || !template.translations.length) {
      console.log('❌ Template not found!');
      return;
    }

    const translation = template.translations[0];
    
    // Replace placeholders
    let content = translation.content;
    let subject = translation.subject;

    Object.entries(testData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), String(value));
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    });

    console.log('✅ Template processed successfully');
    console.log('Subject:', subject);
    console.log('Content length:', content.length, 'characters');
    console.log('\n');

    // Send email using Brevo API directly
    const brevoApiKey = process.env.BREVO_API_KEY;
    
    if (!brevoApiKey) {
      console.log('❌ BREVO_API_KEY not found in environment variables');
      console.log('Please set BREVO_API_KEY in your .env file');
      return;
    }

    console.log('📤 Sending email via Brevo API...');

    const emailData = {
      sender: {
        name: 'MatMax Yoga Studio',
        email: 'info@matmax.store'
      },
      to: [
        {
          email: 'betosaco@gmail.com',
          name: 'Alberto Saco'
        }
      ],
      subject: subject,
      htmlContent: content,
      replyTo: {
        email: 'info@matmax.store',
        name: 'MatMax Support'
      }
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Check betosaco@gmail.com for the payment confirmation email');
      console.log('Message ID:', result.messageId);
      console.log('\n📋 Email Details:');
      console.log('- To: betosaco@gmail.com');
      console.log('- From: info@matmax.store');
      console.log('- Subject:', subject);
      console.log('- Template: package_purchase_confirmation (Spanish)');
    } else {
      console.log('❌ Failed to send email');
      console.log('Status:', response.status);
      console.log('Response:', result);
    }

  } catch (error) {
    console.error('❌ Error sending email:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
sendDirectTestEmail();

