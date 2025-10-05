import fetch from 'node-fetch';

async function testTelegramConfig() {
  try {
    console.log('🧪 Testing Telegram configuration API...');

    // Test GET endpoint
    console.log('📡 Testing GET /api/admin/telegram-config...');
    const getResponse = await fetch('http://localhost:3000/api/admin/telegram-config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth, but we can see the response
      }
    });

    console.log('📊 GET Response status:', getResponse.status);
    const getData = await getResponse.json();
    console.log('📊 GET Response data:', JSON.stringify(getData, null, 2));

    // Test POST endpoint with test data
    console.log('\n📡 Testing POST /api/admin/telegram-config...');
    const postResponse = await fetch('http://localhost:3000/api/admin/telegram-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        bot_token: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
        webhook_url: 'https://example.com/webhook',
        is_active: false
      })
    });

    console.log('📊 POST Response status:', postResponse.status);
    const postData = await postResponse.json();
    console.log('📊 POST Response data:', JSON.stringify(postData, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Wait a bit for the server to start, then run the test
setTimeout(testTelegramConfig, 5000);
