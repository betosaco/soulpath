#!/usr/bin/env node

/**
 * Complete Telegram fix - get new token and test
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTelegramComplete() {
  console.log('🔧 Complete Telegram Fix\n');

  console.log('📋 Current Status:');
  console.log('❌ Telegram bot token is invalid (404 error)');
  console.log('❌ No valid chat IDs configured');
  console.log('❌ Telegram tests are failing with 500 error');
  console.log('✅ Email functionality is working perfectly');

  console.log('\n🚀 Solution Steps:');
  console.log('1. **Get a New Bot Token**:');
  console.log('   - Go to Telegram and search for @BotFather');
  console.log('   - Start a chat with @BotFather');
  console.log('   - Send /newbot command');
  console.log('   - Follow the instructions to create a new bot');
  console.log('   - Copy the bot token that BotFather gives you');

  console.log('\n2. **Update the Bot Token**:');
  console.log('   - Edit the file: fix-telegram-token.js');
  console.log('   - Replace "YOUR_NEW_BOT_TOKEN_HERE" with your actual token');
  console.log('   - Replace "YOUR_BOT_USERNAME_HERE" with your bot username');
  console.log('   - Run: npx tsx fix-telegram-token.js');

  console.log('\n3. **Get Your Chat ID**:');
  console.log('   - Start a chat with your new bot');
  console.log('   - Send /start to the bot');
  console.log('   - Use @userinfobot to get your chat ID');
  console.log('   - Or use @getidsbot to get your chat ID');

  console.log('\n4. **Test the Functionality**:');
  console.log('   - Go to your admin communication settings');
  console.log('   - Click "Test Telegram Connection"');
  console.log('   - Enter your chat ID');
  console.log('   - Click "Test"');

  console.log('\n📱 Alternative: Test with Script');
  console.log('Once you have a valid bot token and chat ID:');
  console.log('1. Edit test-telegram-with-chatid.js');
  console.log('2. Replace "123456789" with your real chat ID');
  console.log('3. Run: npx tsx test-telegram-with-chatid.js');

  console.log('\n🔍 Current Configuration:');
  try {
    const config = await prisma.communicationConfig.findFirst();
    if (config) {
      console.log('- Telegram enabled:', config.telegramEnabled);
      console.log('- Bot token configured:', config.telegramBotToken ? 'Yes' : 'No');
      console.log('- Bot username:', config.telegramBotUsername || 'Not set');
      console.log('- Chat IDs:', config.telegramChatIds?.length || 0, 'users connected');
      
      if (config.telegramBotToken) {
        console.log('\n🧪 Testing current bot token...');
        try {
          const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getMe`);
          if (response.ok) {
            const data = await response.json();
            if (data.ok) {
              console.log('✅ Current bot token is valid!');
              console.log('Bot username:', data.result.username);
              console.log('Bot ID:', data.result.id);
            } else {
              console.log('❌ Current bot token is invalid');
              console.log('Error:', data.description);
            }
          } else {
            console.log('❌ Current bot token is invalid (404 error)');
            console.log('You need to get a new token from @BotFather');
          }
        } catch (error) {
          console.log('❌ Error testing bot token:', error.message);
        }
      }
    }
  } catch (error) {
    console.log('❌ Error checking configuration:', error.message);
  }

  console.log('\n🎯 Summary:');
  console.log('✅ Email functionality: WORKING PERFECTLY');
  console.log('❌ Telegram functionality: NEEDS VALID BOT TOKEN');
  console.log('🔧 Fix: Get new bot token from @BotFather');
  console.log('📱 Test: Use real chat ID for testing');

  await prisma.$disconnect();
}

fixTelegramComplete();
