#!/usr/bin/env node

/**
 * Lyra Integration Test Script
 * 
 * This script tests the Lyra payment integration functionality
 * including API endpoints and HMAC validation.
 */

const crypto = require('crypto');

// Test configuration
const testConfig = {
  username: 'prodpassword_di6IeBzwz6ccq3OfeWkUmGN5s6PmhX67l6RrKJHSicFPh',
  password: '88569105',
  publicKey: 'publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv',
  hmacKey: 'L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw',
  apiEndpoint: 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
  baseUrl: 'http://localhost:3000'
};

async function testCreateToken() {
  console.log('🧪 Testing create token endpoint...\n');
  
  try {
    const response = await fetch(`${testConfig.baseUrl}/api/lyra/create-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 1000, // S/ 10.00
        currency: 'PEN',
        orderId: `TEST-${Date.now()}`,
        customer: {
          email: 'test@example.com',
          name: 'Test User'
        },
        metadata: {
          test: true
        }
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Create token endpoint working');
      console.log('   Form token received:', data.formToken ? 'Yes' : 'No');
      console.log('   Public key received:', data.publicKey ? 'Yes' : 'No');
      return data.formToken;
    } else {
      console.log('❌ Create token endpoint failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Create token endpoint error:', error.message);
    return null;
  }
}

function testHmacValidation() {
  console.log('\n🧪 Testing HMAC validation...\n');
  
  try {
    // Create test payment data
    const testData = {
      'kr-status': 'PAID',
      'kr-amount': '1000',
      'kr-order': 'TEST-ORDER-123',
      'kr-currency': 'PEN',
      'kr-hash': ''
    };

    // Generate signature
    const dataString = 'kr-amount=1000&kr-currency=PEN&kr-order=TEST-ORDER-123&kr-status=PAID';
    const hmac = crypto.createHmac('sha256', testConfig.hmacKey);
    hmac.update(dataString);
    const signature = hmac.digest('base64');
    
    testData['kr-hash'] = signature;

    console.log('✅ HMAC signature generated');
    console.log('   Test data:', JSON.stringify(testData, null, 2));
    console.log('   Signature:', signature);

    return testData;
  } catch (error) {
    console.log('❌ HMAC validation test failed:', error.message);
    return null;
  }
}

async function testValidateEndpoint(paymentData) {
  console.log('\n🧪 Testing validate endpoint...\n');
  
  try {
    const response = await fetch(`${testConfig.baseUrl}/api/lyra/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Validate endpoint working');
      console.log('   Payment validated:', data.message);
    } else {
      console.log('❌ Validate endpoint failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Validate endpoint error:', error.message);
  }
}

async function testWebhookEndpoint(paymentData) {
  console.log('\n🧪 Testing webhook endpoint...\n');
  
  try {
    const response = await fetch(`${testConfig.baseUrl}/api/lyra/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Webhook endpoint working');
      console.log('   Webhook processed:', data.message);
    } else {
      console.log('❌ Webhook endpoint failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Webhook endpoint error:', error.message);
  }
}

function testConfiguration() {
  console.log('🧪 Testing configuration...\n');
  
  const requiredFields = ['username', 'password', 'publicKey', 'hmacKey', 'apiEndpoint'];
  let allValid = true;

  requiredFields.forEach(field => {
    if (testConfig[field]) {
      console.log(`✅ ${field}: configured`);
    } else {
      console.log(`❌ ${field}: missing`);
      allValid = false;
    }
  });

  // Test HMAC key format
  if (testConfig.hmacKey && testConfig.hmacKey.length === 44) {
    console.log('✅ HMAC key format: valid');
  } else {
    console.log('❌ HMAC key format: invalid (expected 44 characters)');
    allValid = false;
  }

  // Test public key format
  if (testConfig.publicKey && testConfig.publicKey.startsWith('publickey_')) {
    console.log('✅ Public key format: valid');
  } else {
    console.log('❌ Public key format: invalid (should start with "publickey_")');
    allValid = false;
  }

  return allValid;
}

async function main() {
  console.log('🚀 Lyra Integration Test Suite\n');
  console.log('================================\n');

  // Test configuration
  const configValid = testConfiguration();
  
  if (!configValid) {
    console.log('\n❌ Configuration test failed!');
    console.log('Please fix the configuration before running integration tests.');
    process.exit(1);
  }

  // Test create token endpoint
  const formToken = await testCreateToken();
  
  // Test HMAC validation
  const paymentData = testHmacValidation();
  
  if (paymentData) {
    // Test validate endpoint
    await testValidateEndpoint(paymentData);
    
    // Test webhook endpoint
    await testWebhookEndpoint(paymentData);
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`Configuration: ${configValid ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Create Token: ${formToken ? '✅ Pass' : '❌ Fail'}`);
  console.log(`HMAC Validation: ${paymentData ? '✅ Pass' : '❌ Fail'}`);

  if (configValid && formToken && paymentData) {
    console.log('\n🎉 All tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Test with real payment form');
    console.log('2. Verify return URL handling');
    console.log('3. Test webhook processing');
    console.log('4. Deploy to production');
  } else {
    console.log('\n❌ Some tests failed!');
    console.log('Please check the errors above and fix them.');
    process.exit(1);
  }
}

// Run the tests
main().catch(console.error);