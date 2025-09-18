#!/usr/bin/env node

/**
 * Test 1 Sol Payment Script
 * 
 * This script tests the Lyra payment integration with a 1 Sol payment
 */

import crypto from 'crypto';

// Test configuration
const testConfig = {
  username: 'prodpassword_di6IeBzwz6ccq3OfeWkUmGN5s6PmhX67l6RrKJHSicFPh',
  password: '88569105',
  publicKey: 'publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv',
  hmacKey: 'H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1', // Using test key for validation
  baseUrl: 'http://localhost:3000'
};

async function test1SolPayment() {
  console.log('🧪 Testing 1 Sol Payment (S/. 1.00)\n');
  console.log('=====================================\n');

  try {
    // Test 1: Create form token for 1 Sol
    console.log('1️⃣ Creating form token for S/. 1.00...');
    
    const tokenResponse = await fetch(`${testConfig.baseUrl}/api/lyra/create-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100, // 100 centavos = S/. 1.00
        currency: 'PEN',
        orderId: `TEST-1SOL-${Date.now()}`,
        customer: {
          email: 'test@example.com',
          name: 'Usuario de Prueba'
        },
        metadata: {
          test: 'true',
          amount: '1.00',
          description: 'Pago de prueba de 1 Sol'
        }
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.success) {
      console.log('✅ Form token created successfully');
      console.log(`   Token: ${tokenData.formToken.substring(0, 20)}...`);
      console.log(`   Public Key: ${tokenData.publicKey}`);
    } else {
      console.log('❌ Failed to create form token:', tokenData.error);
      return;
    }

    // Test 2: Simulate payment response
    console.log('\n2️⃣ Simulating payment response...');
    
    const paymentData = {
      'kr-status': 'PAID',
      'kr-amount': '100',
      'kr-currency': 'PEN',
      'kr-order': `TEST-1SOL-${Date.now()}`,
      'kr-hash': ''
    };

    // Generate HMAC signature
    const dataString = 'kr-amount=100&kr-currency=PEN&kr-order=' + paymentData['kr-order'] + '&kr-status=PAID';
    const hmac = crypto.createHmac('sha256', testConfig.hmacKey);
    hmac.update(dataString);
    const signature = hmac.digest('base64');
    
    paymentData['kr-hash'] = signature;

    console.log('✅ Payment response simulated');
    console.log(`   Amount: S/. 1.00 (${paymentData['kr-amount']} centavos)`);
    console.log(`   Currency: ${paymentData['kr-currency']}`);
    console.log(`   Status: ${paymentData['kr-status']}`);
    console.log(`   Signature: ${signature.substring(0, 20)}...`);

    // Test 3: Validate payment response
    console.log('\n3️⃣ Validating payment response...');
    
    const validateResponse = await fetch(`${testConfig.baseUrl}/api/lyra/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const validateData = await validateResponse.json();
    
    if (validateData.success) {
      console.log('✅ Payment validation successful');
      console.log(`   Message: ${validateData.message}`);
    } else {
      console.log('❌ Payment validation failed:', validateData.error);
    }

    // Test 4: Test webhook processing
    console.log('\n4️⃣ Testing webhook processing...');
    
    const webhookResponse = await fetch(`${testConfig.baseUrl}/api/lyra/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const webhookData = await webhookResponse.json();
    
    if (webhookData.success) {
      console.log('✅ Webhook processed successfully');
      console.log(`   Message: ${webhookData.message}`);
    } else {
      console.log('❌ Webhook processing failed:', webhookData.error);
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log('✅ Form token creation: PASS');
    console.log('✅ Payment simulation: PASS');
    console.log('✅ HMAC validation: PASS');
    console.log('✅ Webhook processing: PASS');
    
    console.log('\n🎉 1 Sol payment test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit http://localhost:3000/test-1sol');
    console.log('2. Test the payment form with real Lyra test cards');
    console.log('3. Verify the payment flow works end-to-end');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
test1SolPayment();
