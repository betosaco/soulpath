#!/usr/bin/env node

/**
 * Test communication API with proper authentication
 */

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testCommunicationAPI() {
  console.log('🔍 Testing Communication API\n');

  try {
    // Get admin user for authentication
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('❌ No admin user found');
      return;
    }

    console.log('👤 Admin user found:', adminUser.email);

    // Create a test JWT token
    const testToken = jwt.sign(
      { 
        userId: adminUser.id, 
        email: adminUser.email, 
        role: adminUser.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('🔑 Test token created');

    // Test email endpoint
    console.log('\n📧 Testing email endpoint...');
    try {
      const emailResponse = await fetch('http://localhost:3000/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          type: 'email',
          to: 'test@example.com',
          subject: 'Test Email from API',
          content: 'This is a test email sent via the API endpoint.'
        })
      });

      console.log('Email test status:', emailResponse.status);
      const emailData = await emailResponse.json();
      console.log('Email test response:', emailData);

      if (emailResponse.ok) {
        console.log('✅ Email test successful!');
      } else {
        console.log('❌ Email test failed');
      }
    } catch (error) {
      console.log('❌ Error testing email:', error.message);
    }

    // Test Telegram endpoint
    console.log('\n📱 Testing Telegram endpoint...');
    try {
      const telegramResponse = await fetch('http://localhost:3000/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          type: 'telegram',
          chatId: '123456789', // This will fail but we can see the response
          message: 'Test message from API'
        })
      });

      console.log('Telegram test status:', telegramResponse.status);
      const telegramData = await telegramResponse.json();
      console.log('Telegram test response:', telegramData);

      if (telegramResponse.ok) {
        console.log('✅ Telegram test successful!');
      } else {
        console.log('❌ Telegram test failed');
      }
    } catch (error) {
      console.log('❌ Error testing Telegram:', error.message);
    }

    // Test validation endpoint
    console.log('\n🔍 Testing validation endpoint...');
    try {
      const validationResponse = await fetch('http://localhost:3000/api/admin/communication/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          provider: 'brevo',
          type: 'email',
          apiKey: 'test-key'
        })
      });

      console.log('Validation test status:', validationResponse.status);
      const validationData = await validationResponse.json();
      console.log('Validation test response:', validationData);

      if (validationResponse.ok) {
        console.log('✅ Validation test successful!');
      } else {
        console.log('❌ Validation test failed');
      }
    } catch (error) {
      console.log('❌ Error testing validation:', error.message);
    }

  } catch (error) {
    console.error('❌ Error testing communication API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCommunicationAPI();
