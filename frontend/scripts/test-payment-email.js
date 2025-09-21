#!/usr/bin/env node

/**
 * Test script to verify payment confirmation email functionality
 * This script tests the email template and data replacement
 */

import { PrismaClient } from '@prisma/client';
import { CommunicationTemplateService } from '../lib/communication/template-service.ts';

const prisma = new PrismaClient();

async function testPaymentEmail() {
  console.log('🧪 Testing Payment Confirmation Email\n');

  try {
    // Test data similar to what would be sent after a successful payment
    const testData = {
      customer_name: 'María García',
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

    console.log('📧 Test Data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n');

    // Test getting the template from database
    console.log('🔍 Fetching template from database...');
    const template = await CommunicationTemplateService.getTemplate(
      'package_purchase_confirmation',
      'es',
      testData
    );

    if (template) {
      console.log('✅ Template found!');
      console.log('\n📝 Subject:');
      console.log(template.subject);
      console.log('\n📄 Content Preview (first 500 chars):');
      console.log(template.content.substring(0, 500) + '...');
      
      // Check if all placeholders were replaced
      const hasUnreplacedPlaceholders = template.content.includes('{{') || template.subject?.includes('{{');
      if (hasUnreplacedPlaceholders) {
        console.log('\n⚠️  WARNING: Some placeholders were not replaced!');
        const matches = template.content.match(/\{\{[^}]+\}\}/g);
        if (matches) {
          console.log('Unreplaced placeholders:', matches);
        }
      } else {
        console.log('\n✅ All placeholders were successfully replaced!');
      }

      // Check if customer name is included
      if (template.content.includes(testData.customer_name)) {
        console.log('✅ Customer name is included in the email');
      } else {
        console.log('❌ Customer name is NOT included in the email');
      }

      // Check if order details are included
      const orderDetails = [
        testData.package_name,
        testData.package_price,
        testData.sessions_count,
        testData.purchase_date
      ];
      
      const includedDetails = orderDetails.filter(detail => 
        template.content.includes(detail)
      );
      
      console.log(`✅ Order details included: ${includedDetails.length}/${orderDetails.length}`);
      console.log('Included:', includedDetails);
      
      if (includedDetails.length < orderDetails.length) {
        const missing = orderDetails.filter(detail => 
          !template.content.includes(detail)
        );
        console.log('Missing:', missing);
      }

    } else {
      console.log('❌ Template not found!');
      console.log('This could mean:');
      console.log('1. The template is not in the database');
      console.log('2. The template is not active');
      console.log('3. There is no Spanish translation');
    }

  } catch (error) {
    console.error('❌ Error testing payment email:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPaymentEmail();
