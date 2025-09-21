#!/usr/bin/env node

/**
 * Test script to send a payment confirmation email to betosaco@gmail.com
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function sendTestEmail() {
  console.log('📧 Sending Test Payment Confirmation Email\n');

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

    console.log('📋 Test Data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n');

    // Get the template from database
    console.log('🔍 Fetching template from database...');
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
    console.log('✅ Template found!');
    console.log('Subject:', translation.subject);
    console.log('Content length:', translation.content.length, 'characters');
    console.log('\n');

    // Replace placeholders in template
    let content = translation.content;
    let subject = translation.subject;

    Object.entries(testData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), String(value));
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    });

    console.log('🔄 Placeholders replaced successfully');
    console.log('Final subject:', subject);
    console.log('\n');

    // Test the email sending using the API endpoint
    console.log('📤 Testing email sending via API...');
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'betosaco@gmail.com',
          subject: subject,
          html: content,
          type: 'payment_confirmation'
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Test email sent successfully!');
        console.log('📧 Check betosaco@gmail.com for the payment confirmation email');
        console.log('\n📋 Email Details:');
        console.log('- To: betosaco@gmail.com');
        console.log('- From: info@matmax.store');
        console.log('- Subject:', subject);
        console.log('- Template: package_purchase_confirmation (Spanish)');
      } else {
        console.log('❌ Failed to send test email');
        console.log('Response:', result);
      }
    } catch (apiError) {
      console.log('❌ API call failed:', apiError.message);
      console.log('This might be because the development server is not running.');
      console.log('Please start the development server with: npm run dev');
    }

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
sendTestEmail();
