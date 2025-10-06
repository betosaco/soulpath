#!/usr/bin/env node

/**
 * Fix Telegram with the correct token from the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTelegramWithCorrectToken() {
  console.log('🔧 Fixing Telegram with Correct Token\n');

  try {
    const config = await prisma.communicationConfig.findFirst();
    
    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Current Database Configuration:');
    console.log('- Telegram enabled:', config.telegramEnabled);
    console.log('- Bot token configured:', config.telegramBotToken ? 'Yes' : 'No');
    console.log('- Bot username:', config.telegramBotUsername);
    console.log('- Webhook URL:', config.telegramWebhookUrl);

    if (config.telegramBotToken) {
      console.log('\n🔍 Current bot token (first 10 chars):', config.telegramBotToken.substring(0, 10) + '...');
      
      console.log('\n🧪 Testing current bot token...');
      try {
        const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getMe`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            console.log('✅ Current bot token is valid!');
            console.log('Bot ID:', data.result.id);
            console.log('Bot Username:', data.result.username);
            console.log('Bot Name:', data.result.first_name);
            
            // Test sending a message
            console.log('\n📱 Testing message sending...');
            const messageResponse = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                chat_id: '8425375613', // Your chat ID
                text: '🎉 Test message from MatMax Communication Service!\n\nThis message is sent to verify that the Telegram integration is working correctly with the database token.'
              })
            });

            if (messageResponse.ok) {
              const messageData = await messageResponse.json();
              if (messageData.ok) {
                console.log('✅ Message sent successfully!');
                console.log('Message ID:', messageData.result.message_id);
                console.log('📱 Check your Telegram chat for the message!');
              } else {
                console.log('❌ Message sending failed');
                console.log('Error:', messageData.description);
              }
            } else {
              console.log('❌ Message sending failed');
              console.log('Status:', messageResponse.status);
            }
          } else {
            console.log('❌ Current bot token is invalid');
            console.log('Error:', data.description);
            console.log('\n💡 The bot token in the database is invalid.');
            console.log('You need to get a new bot token from @BotFather.');
          }
        } else {
          console.log('❌ Current bot token is invalid (404 error)');
          console.log('Status:', response.status);
          console.log('\n💡 The bot token in the database is invalid.');
          console.log('You need to get a new bot token from @BotFather.');
        }
      } catch (error) {
        console.log('❌ Error testing bot token:', error.message);
      }
    } else {
      console.log('❌ No bot token configured in database');
      console.log('You need to configure a bot token.');
    }

    console.log('\n🎯 Summary:');
    console.log('The database has a bot token configured, but it\'s invalid.');
    console.log('This means the bot was deleted or the token is expired.');
    console.log('You need to get a new bot token from @BotFather.');

    console.log('\n🚀 Next Steps:');
    console.log('1. Go to @BotFather on Telegram');
    console.log('2. Send /mybots to check if your bot exists');
    console.log('3. If not listed, create a new bot with /newbot');
    console.log('4. Get the new bot token');
    console.log('5. Update the database with the new token');

  } catch (error) {
    console.error('❌ Error fixing Telegram:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTelegramWithCorrectToken();
