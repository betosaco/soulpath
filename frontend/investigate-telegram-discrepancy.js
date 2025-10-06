#!/usr/bin/env node

/**
 * Investigate the discrepancy between receiving messages and API 404
 */

async function investigateTelegramDiscrepancy() {
  console.log('🔍 Investigating Telegram Discrepancy\n');

  const botToken = '8361218732d:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const chatId = '8425375613';

  console.log('📊 Situation Analysis:');
  console.log('- You can receive messages from the bot in Telegram ✅');
  console.log('- But the API returns 404 error ❌');
  console.log('- This suggests a configuration or token issue');

  console.log('\n🔧 Possible Explanations:');
  console.log('1. **Different Bot**: You might be using a different bot than the one with this token');
  console.log('2. **Token Format**: The token might have extra characters or spaces');
  console.log('3. **Bot State**: The bot might be in a restricted state');
  console.log('4. **API Endpoint**: There might be an issue with the API endpoint');

  console.log('\n📱 Test 1: Detailed token analysis...');
  console.log('Token:', botToken);
  console.log('Length:', botToken.length);
  console.log('Has colon:', botToken.includes(':'));
  console.log('Parts:', botToken.split(':').length);
  console.log('First part:', botToken.split(':')[0]);
  console.log('Second part length:', botToken.split(':')[1]?.length);

  console.log('\n📱 Test 2: Try different API endpoints...');
  
  // Test getMe
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    console.log('getMe Status:', response.status);
    const data = await response.json();
    console.log('getMe Response:', data);
  } catch (error) {
    console.log('getMe Error:', error.message);
  }

  // Test getUpdates
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    console.log('getUpdates Status:', response.status);
    const data = await response.json();
    console.log('getUpdates Response:', data);
  } catch (error) {
    console.log('getUpdates Error:', error.message);
  }

  // Test sendMessage
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: 'Test message'
      })
    });
    console.log('sendMessage Status:', response.status);
    const data = await response.json();
    console.log('sendMessage Response:', data);
  } catch (error) {
    console.log('sendMessage Error:', error.message);
  }

  console.log('\n🔍 Investigation Questions:');
  console.log('1. **What is the exact bot username you see in Telegram?**');
  console.log('2. **Can you send messages TO the bot and get responses?**');
  console.log('3. **What happens when you send /start to the bot?**');
  console.log('4. **Is this the same bot that was created with this token?**');

  console.log('\n💡 Possible Solutions:');
  console.log('1. **Check Bot Username**: Verify the bot username in Telegram');
  console.log('2. **Get Fresh Token**: Create a new bot and get a fresh token');
  console.log('3. **Check Bot Status**: Ensure the bot is not deleted or restricted');
  console.log('4. **Verify Token**: Make sure the token is copied correctly');

  console.log('\n🧪 Manual Test:');
  console.log('1. Go to Telegram and find your bot');
  console.log('2. Check the bot username (it should start with @)');
  console.log('3. Send a message to the bot');
  console.log('4. Check if the bot responds');
  console.log('5. If the bot responds, note the exact username');

  console.log('\n📱 Alternative Test:');
  console.log('Try this URL in your browser:');
  console.log(`https://api.telegram.org/bot${botToken}/getMe`);
  console.log('If it returns an error, the token is invalid');
  console.log('If it returns bot info, the token is valid');

  console.log('\n🎯 Next Steps:');
  console.log('1. **Verify the bot username** in Telegram');
  console.log('2. **Check if you can send messages** to the bot');
  console.log('3. **Get a fresh token** if needed');
  console.log('4. **Test with the correct token**');
}

investigateTelegramDiscrepancy();
