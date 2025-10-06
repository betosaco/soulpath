#!/usr/bin/env node

/**
 * Debug Telegram token issues
 */

async function debugTelegramToken() {
  console.log('🔍 Debugging Telegram Token Issues\n');

  const botToken = '8361218732d:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const chatId = '8425375613';

  console.log('📊 Token Analysis:');
  console.log('- Token length:', botToken.length);
  console.log('- Token format:', botToken.includes(':') ? 'Valid format' : 'Invalid format');
  console.log('- Token prefix:', botToken.substring(0, 10));
  console.log('- Chat ID:', chatId);
  console.log('- Chat ID type:', typeof chatId);

  console.log('\n🔧 Testing different approaches...');

  // Test 1: Basic bot info
  console.log('\n📱 Test 1: Basic bot info...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (data.ok) {
      console.log('✅ Bot token is valid!');
      console.log('Bot info:', data.result);
    } else {
      console.log('❌ Bot token is invalid');
      console.log('Error:', data.description);
      console.log('Error Code:', data.error_code);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: Try with different URL format
  console.log('\n📱 Test 2: Alternative URL format...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    console.log('Status:', response.status);
    
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 3: Test message sending
  console.log('\n📱 Test 3: Test message sending...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: 'Test message'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  console.log('\n🔍 Possible Issues:');
  console.log('1. **Bot was deleted**: The bot might have been deleted from @BotFather');
  console.log('2. **Token format**: The token might be malformed');
  console.log('3. **Bot restrictions**: The bot might have restrictions');
  console.log('4. **Network issues**: There might be network connectivity issues');
  console.log('5. **Rate limiting**: Telegram might be rate limiting requests');

  console.log('\n💡 Solutions:');
  console.log('1. **Check with @BotFather**: Go to @BotFather and check if your bot still exists');
  console.log('2. **Get new token**: Create a new bot and get a fresh token');
  console.log('3. **Verify token**: Make sure the token is copied correctly');
  console.log('4. **Check bot status**: Ensure the bot is not deleted or restricted');

  console.log('\n🧪 Manual Test:');
  console.log('1. Go to Telegram and search for your bot');
  console.log('2. Start a chat with your bot');
  console.log('3. Send /start to the bot');
  console.log('4. Check if the bot responds');
  console.log('5. If the bot doesn\'t respond, it means the bot is invalid');

  console.log('\n📱 Alternative Test:');
  console.log('Try this URL in your browser:');
  console.log(`https://api.telegram.org/bot${botToken}/getMe`);
  console.log('If it returns an error, the bot token is invalid');
}

debugTelegramToken();
