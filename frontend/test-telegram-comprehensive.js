#!/usr/bin/env node

/**
 * Comprehensive Telegram bot testing
 */

async function testTelegramComprehensive() {
  console.log('🔍 Comprehensive Telegram Bot Testing\n');

  const botToken = '8361218732d:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const chatId = '8425375613';

  console.log('📊 Token Information:');
  console.log('- Token:', botToken);
  console.log('- Length:', botToken.length);
  console.log('- Format check:', botToken.includes(':') ? '✅ Has colon' : '❌ Missing colon');
  console.log('- Prefix:', botToken.substring(0, 10));
  console.log('- Suffix:', botToken.substring(botToken.length - 10));
  console.log('- Chat ID:', chatId);

  console.log('\n🔧 Testing different approaches...');

  // Test 1: Basic bot info
  console.log('\n📱 Test 1: getMe endpoint...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.ok) {
      console.log('✅ Bot token is valid!');
      console.log('Bot ID:', data.result.id);
      console.log('Bot Username:', data.result.username);
      console.log('Bot Name:', data.result.first_name);
    } else {
      console.log('❌ Bot token is invalid');
      console.log('Error:', data.description);
      console.log('Error Code:', data.error_code);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: Try with different URL format
  console.log('\n📱 Test 2: getUpdates endpoint...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    console.log('Status:', response.status);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 3: Try sending a message
  console.log('\n📱 Test 3: sendMessage endpoint...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: 'Test message from comprehensive test'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 4: Check if the token format is correct
  console.log('\n📱 Test 4: Token format analysis...');
  const tokenParts = botToken.split(':');
  console.log('Token parts:', tokenParts.length);
  console.log('First part (bot ID):', tokenParts[0]);
  console.log('Second part (token):', tokenParts[1] ? tokenParts[1].substring(0, 10) + '...' : 'Missing');
  
  if (tokenParts.length !== 2) {
    console.log('❌ Token format is incorrect - should have exactly one colon');
  } else {
    console.log('✅ Token format looks correct');
  }

  console.log('\n🔍 Possible Issues:');
  console.log('1. **Bot was deleted**: The bot might have been deleted from @BotFather');
  console.log('2. **Token is expired**: The token might have expired');
  console.log('3. **Bot is restricted**: The bot might have restrictions');
  console.log('4. **Token is malformed**: There might be extra characters or spaces');
  console.log('5. **Bot is not active**: The bot might not be active');

  console.log('\n💡 Solutions:');
  console.log('1. **Check with @BotFather**:');
  console.log('   - Go to @BotFather on Telegram');
  console.log('   - Send /mybots command');
  console.log('   - Check if your bot is listed');
  console.log('   - If not listed, the bot was deleted');

  console.log('\n2. **Get a new token**:');
  console.log('   - Go to @BotFather');
  console.log('   - Send /newbot command');
  console.log('   - Create a new bot');
  console.log('   - Get a fresh token');

  console.log('\n3. **Verify the token**:');
  console.log('   - Make sure there are no extra spaces');
  console.log('   - Make sure the token is copied correctly');
  console.log('   - Check if the token is complete');

  console.log('\n🧪 Manual Verification:');
  console.log('1. Go to Telegram and search for your bot');
  console.log('2. Try to start a chat with your bot');
  console.log('3. Send /start to the bot');
  console.log('4. Check if the bot responds');
  console.log('5. If the bot doesn\'t respond, it means the bot is invalid');

  console.log('\n📱 Alternative Test:');
  console.log('Try this URL in your browser:');
  console.log(`https://api.telegram.org/bot${botToken}/getMe`);
  console.log('If it returns an error, the bot token is invalid');

  console.log('\n🎯 Summary:');
  console.log('The bot token is returning a 404 error from Telegram\'s API.');
  console.log('This means the bot either:');
  console.log('- Was deleted from @BotFather');
  console.log('- Has an invalid token');
  console.log('- Is not active');
  console.log('You need to get a new bot token from @BotFather.');
}

testTelegramComprehensive();
