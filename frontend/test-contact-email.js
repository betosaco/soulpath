#!/usr/bin/env node

/**
 * Test script for contact form email functionality
 */

async function testContactEmail() {
  console.log('🧪 Testing Contact Form Email Functionality\n');
  console.log('==========================================\n');

  try {
    // Test data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+51 999 999 999',
      message: 'This is a test message from the contact form.',
      language: 'en'
    };

    console.log('📧 Sending test contact form submission...');
    console.log('Test data:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:3000/api/contact/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Contact form test successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ Contact form test failed!');
      console.log('Error:', result.error);
      console.log('Details:', result.details);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testContactEmail();
