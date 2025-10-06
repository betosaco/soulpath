#!/usr/bin/env node

/**
 * Fix Telegram bot token
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTelegramToken() {
  console.log('🔧 Fixing Telegram Bot Token\n');

  console.log('📋 To fix your Telegram bot:');
  console.log('1. Go to Telegram and search for @BotFather');
  console.log('2. Start a chat with @BotFather');
  console.log('3. Send /newbot command');
  console.log('4. Follow the instructions to create a new bot');
  console.log('5. Copy the bot token that BotFather gives you');
  console.log('6. Update the token below and run this script again\n');

  // Replace these with your actual values
  const newBotToken = 'YOUR_NEW_BOT_TOKEN_HERE';
  const newBotUsername = 'YOUR_BOT_USERNAME_HERE';

  if (newBotToken === 'YOUR_NEW_BOT_TOKEN_HERE') {
    console.log('⚠️  Please update the script with your actual bot token:');
    console.log('1. Edit this file: fix-telegram-token.js');
    console.log('2. Replace "YOUR_NEW_BOT_TOKEN_HERE" with your actual bot token');
    console.log('3. Replace "YOUR_BOT_USERNAME_HERE" with your bot username');
    console.log('4. Run the script again');
    return;
  }

  try {
    console.log('🔧 Testing new bot token...');
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
            }
          });
          
          console.log('✅ Bot token updated successfully!');
          console.log('🤖 Your bot is now ready to use!');
          console.log('🔗 Bot link: https://t.me/' + newBotUsername);
          console.log('\n📱 Next steps:');
          console.log('1. Start a chat with your bot');
          console.log('2. Send /start to the bot');
          console.log('3. Get your chat ID using @userinfobot');
          console.log('4. Test the functionality');
        } else {
          console.log('❌ No communication config found');
        }
      } else {
        console.log('❌ New bot token validation failed');
        console.log('Error:', data.description);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ New bot token validation failed');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Error testing new bot token:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTelegramToken();
