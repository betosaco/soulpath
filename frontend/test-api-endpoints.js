#!/usr/bin/env node

/**
 * Test API endpoints for communication
 */

async function testApiEndpoints() {
  console.log('🔍 Testing API Endpoints\n');

  try {
    // Test email validation endpoint
    console.log('📧 Testing email validation endpoint...');
    const emailValidationResponse = await fetch('http://localhost:3000/api/admin/communication/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth, but we can see the response
      },
      body: JSON.stringify({
        provider: 'brevo',
        type: 'email',
        apiKey: 'test-key'
      })
    });

    console.log('Email validation status:', emailValidationResponse.status);
    const emailValidationData = await emailValidationResponse.json();
    console.log('Email validation response:', emailValidationData);

    // Test email sending endpoint
    console.log('\n📧 Testing email sending endpoint...');
    const emailTestResponse = await fetch('http://localhost:3000/api/admin/communication/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth, but we can see the response
      },
      body: JSON.stringify({
        type: 'email',
        to: 'test@example.com',
        subject: 'Test Email',
        content: 'Test content'
      })
    });

    console.log('Email test status:', emailTestResponse.status);
    const emailTestData = await emailTestResponse.json();
    console.log('Email test response:', emailTestData);

    // Test Telegram validation endpoint
    console.log('\n📱 Testing Telegram validation endpoint...');
    const telegramValidationResponse = await fetch('http://localhost:3000/api/admin/communication/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth, but we can see the response
      },
      body: JSON.stringify({
        provider: 'telegram',
        type: 'telegram',
        apiKey: 'test-bot-token'
      })
    });

    console.log('Telegram validation status:', telegramValidationResponse.status);
    const telegramValidationData = await telegramValidationResponse.json();
    console.log('Telegram validation response:', telegramValidationData);

  } catch (error) {
    console.error('❌ Error testing API endpoints:', error);
  }
}

testApiEndpoints();
