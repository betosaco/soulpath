#!/usr/bin/env node

/**
 * Guide to create a new Telegram bot and configure it
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createNewTelegramBot() {
  console.log('🤖 Creating New Telegram Bot Guide\n');

  console.log('📋 Step-by-Step Instructions:');
  console.log('1. **Open Telegram** on your phone or computer');
  console.log('2. **Search for @BotFather**');
  console.log('3. **Start a chat** with @BotFather');
  console.log('4. **Send /newbot** command');
  console.log('5. **Follow the instructions**:');
  console.log('   - Enter a name for your bot (e.g., "MatMax Test Bot")');
  console.log('   - Enter a username for your bot (e.g., "matmax_test_bot")');
  console.log('   - BotFather will give you a bot token');
  console.log('6. **Copy the bot token** (it looks like: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)');
  console.log('7. **Copy the bot username** (without @)');

  console.log('\n🔧 Once you have the new bot token:');
  console.log('1. Edit this file: create-new-telegram-bot.js');
  console.log('2. Replace "YOUR_NEW_BOT_TOKEN" with your actual token');
  console.log('3. Replace "YOUR_BOT_USERNAME" with your bot username');
  console.log('4. Run: npx tsx create-new-telegram-bot.js');

  console.log('\n📱 Get Your Chat ID:');
  console.log('1. **Start a chat** with your new bot');
  console.log('2. **Send /start** to the bot');
  console.log('3. **Get your chat ID** using one of these methods:');
  console.log('   - Use @userinfobot (send any message, it will reply with your user ID)');
  console.log('   - Use @getidsbot (send any message, it will reply with your chat ID)');
  console.log('   - Check the webhook logs if you have them enabled');

  console.log('\n🧪 Test the Configuration:');
  console.log('Once you have a valid bot token and chat ID:');
  console.log('1. Update the configuration in the database');
  console.log('2. Test via admin panel: Go to communication settings > Test Telegram');
  console.log('3. Test via script: npx tsx test-telegram-with-chatid.js');

  // Placeholder for when you get the new token
  const newBotToken = 'YOUR_NEW_BOT_TOKEN';
  const newBotUsername = 'YOUR_BOT_USERNAME';
  const newChatId = 'YOUR_CHAT_ID';

  if (newBotToken === 'YOUR_NEW_BOT_TOKEN') {
    console.log('\n⚠️  Please get a new bot token from @BotFather first');
    console.log('Then update this script with your actual values');
    return;
  }

  try {
    console.log('\n🔧 Testing new bot token...');
    const response = await fetch(`https://api.telegram.org/bot${newBotToken}/getMe`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.ok) {
        console.log('✅ New bot token is valid!');
        console.log('Bot ID:', data.result.id);
        console.log('Bot Username:', data.result.username);
        console.log('Bot Name:', data.result.first_name);
        
        console.log('\n🔧 Updating database...');
        const config = await prisma.communicationConfig.findFirst();
        
        if (config) {
          await prisma.communicationConfig.update({
            where: { id: config.id },
            data: {
              telegramBotToken: newBotToken,
              telegramBotUsername: newBotUsername,
              telegramChatIds: [newChatId],
            }
          });
          
          console.log('✅ Configuration updated successfully!');
          console.log('🤖 Your bot is now ready to use!');
          console.log('🔗 Bot link: https://t.me/' + newBotUsername);
          
          // Test sending a message
          console.log('\n🧪 Testing message sending...');
          try {
            const { CommunicationService } = await import('./lib/services/communication-service.ts');
            const communicationService = new CommunicationService();
            
            const result = await communicationService.sendTelegramMessage({
              chatId: newChatId,
              message: '🎉 Test message from MatMax Communication Service!\n\nThis is a test to verify that the Telegram integration is working correctly.'
            });

            if (result.success) {
              console.log('✅ Telegram message sent successfully!');
              console.log('Message ID:', result.messageId);
              console.log('Provider:', result.provider);
              console.log('📱 Check your Telegram chat for the message!');
            } else {
              console.log('❌ Telegram message sending failed');
              console.log('Error:', result.error);
            }
          } catch (error) {
            console.log('❌ Error testing message:', error.message);
          }
        }
      } else {
        console.log('❌ Bot token validation failed');
        console.log('Error:', data.description);
      }
    } else {
      console.log('❌ Bot token validation failed');
      console.log('Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing bot token:', error.message);
  }

  await prisma.$disconnect();
}

createNewTelegramBot();
