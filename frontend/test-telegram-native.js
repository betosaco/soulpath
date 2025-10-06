#!/usr/bin/env node

/**
 * Test Telegram API using native fetch (same as CommunicationService)
 */

async function testTelegramNative() {
  console.log('🤖 Testing Telegram API with Native Fetch\n');

  const botToken = '8361218732d:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const chatId = '8425375613';

  console.log('📊 Configuration:');
  console.log('- Bot Token:', botToken.substring(0, 10) + '...');
  console.log('- Chat ID:', chatId);

  // Test 1: getMe endpoint (same as CommunicationService approach)
  console.log('\n📱 Test 1: getMe endpoint...');
  try {
    const url = `https://api.telegram.org/bot${botToken}/getMe`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response Body:', JSON.stringify(result, null, 2));

    if (response.ok && result.ok) {
      console.log('✅ Bot token is valid!');
      console.log('Bot ID:', result.result.id);
      console.log('Bot Username:', result.result.username);
      console.log('Bot Name:', result.result.first_name);
    } else {
      console.log('❌ Bot token is invalid');
      console.log('Error:', result.description);
      console.log('Error Code:', result.error_code);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: sendMessage endpoint (same as CommunicationService approach)
  console.log('\n📱 Test 2: sendMessage endpoint...');
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🧪 Test message from native fetch!\n\nThis message is sent using the same approach as the CommunicationService.'
      })
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response Body:', JSON.stringify(result, null, 2));

    if (response.ok && result.ok) {
      console.log('✅ Message sent successfully!');
      console.log('Message ID:', result.result.message_id);
      console.log('Chat ID:', result.result.chat.id);
      console.log('Date:', new Date(result.result.date * 1000).toISOString());
      console.log('📱 Check your Telegram chat for the message!');
    } else {
      console.log('❌ Message sending failed');
      console.log('Error:', result.description);
      console.log('Error Code:', result.error_code);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 3: Try with different user agent
  console.log('\n📱 Test 3: With custom user agent...');
  try {
    const url = `https://api.telegram.org/bot${botToken}/getMe`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MatMax-Communication-Service/1.0'
      }
    });

    console.log('Response Status:', response.status);
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 4: Try with different approach
  console.log('\n📱 Test 4: Alternative approach...');
  try {
    const url = `https://api.telegram.org/bot${botToken}/getUpdates`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; MatMaxBot/1.0)'
      }
    });

    console.log('Response Status:', response.status);
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  console.log('\n🔍 Analysis:');
  console.log('The CommunicationService uses native fetch API to call Telegram REST API.');
  console.log('This is the correct approach and should work if the bot token is valid.');
  console.log('If all tests return 404, the bot token is definitely invalid.');

  console.log('\n💡 Next Steps:');
  console.log('1. Verify the bot exists in Telegram');
  console.log('2. Check with @BotFather if the bot is still active');
  console.log('3. Get a new bot token if the current one is invalid');
  console.log('4. Test with the new token');
}

testTelegramNative();
