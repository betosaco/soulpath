/**
 * Test script for Lyra API
 * Run: node test-lyra-api.js
 */

async function testLyraAPI() {
  console.log('🧪 Testing Lyra API endpoint...\n');

  try {
    const requestData = {
      amount: 10000, // 100.00 in cents
      currency: 'PEN',
      orderId: `TEST-${Date.now()}`,
      customer: {
        email: 'test@example.com',
        phone: '+51999999999',
        firstName: 'Test',
        lastName: 'User',
      },
    };

    console.log('📤 Request:', JSON.stringify(requestData, null, 2));

    const response = await fetch('http://localhost:3000/api/lyra/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('\n📡 Response Status:', response.status, response.statusText);

    const data = await response.json();

    console.log('\n📥 Response Data:', JSON.stringify(data, null, 2));

    if (data.success && data.formToken) {
      console.log('\n✅ SUCCESS! FormToken generated:', data.formToken.substring(0, 50) + '...');
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error);
      console.log('Debug:', data.debug);
      console.log('Missing vars:', data.missingVars);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLyraAPI();
