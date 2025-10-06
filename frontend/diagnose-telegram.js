#!/usr/bin/env node

/**
 * Diagnose Telegram bot issues
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseTelegram() {
  console.log('🔍 Diagnosing Telegram Bot Issues\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Configuration Status:');
    console.log('- Telegram enabled:', config.telegramEnabled);
    console.log('- Bot token configured:', config.telegramBotToken ? 'Yes' : 'No');
    console.log('- Bot username:', config.telegramBotUsername || 'Not set');
    console.log('- Webhook URL:', config.telegramWebhookUrl || 'Not set');
    console.log('- Chat IDs:', config.telegramChatIds?.length || 0, 'users connected');

    if (!config.telegramBotToken) {
      console.log('\n❌ No bot token configured');
      return;
    }

    console.log('\n🔧 Testing bot token...');
    
    // Test 1: Check if bot exists
    try {
      const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getMe`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          console.log('✅ Bot token is valid!');
          console.log('Bot ID:', data.result.id);
          console.log('Bot Username:', data.result.username);
          console.log('Bot Name:', data.result.first_name);
          console.log('Can Join Groups:', data.result.can_join_groups);
          console.log('Can Read All Group Messages:', data.result.can_read_all_group_messages);
          console.log('Supports Inline Queries:', data.result.supports_inline_queries);
          
          // Test 2: Check bot updates
          console.log('\n🔧 Checking for recent updates...');
          try {
            const updatesResponse = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getUpdates`);
            if (updatesResponse.ok) {
              const updatesData = await updatesResponse.json();
              if (updatesData.ok) {
                console.log('✅ Bot is receiving updates');
                console.log('Recent updates count:', updatesData.result.length);
                
                if (updatesData.result.length > 0) {
                  console.log('\n📱 Recent chat IDs found:');
                  const chatIds = new Set();
                  updatesData.result.forEach(update => {
                    if (update.message && update.message.chat) {
                      chatIds.add(update.message.chat.id);
                    }
                  });
                  chatIds.forEach(chatId => {
                    console.log('- Chat ID:', chatId);
                  });
                  
                  if (chatIds.size > 0) {
                    console.log('\n🧪 You can test with one of these chat IDs!');
                    console.log('Update the test script with a valid chat ID and try again.');
                  }
                } else {
                  console.log('⚠️  No recent updates found');
                  console.log('Make sure to:');
                  console.log('1. Start a chat with your bot');
                  console.log('2. Send /start to the bot');
                  console.log('3. Send a message to the bot');
                  console.log('4. Run this script again');
                }
              } else {
                console.log('❌ Error getting updates:', updatesData.description);
              }
            } else {
              console.log('❌ Failed to get updates, status:', updatesResponse.status);
            }
          } catch (error) {
            console.log('❌ Error checking updates:', error.message);
          }
          
        } else {
          console.log('❌ Bot token validation failed');
          console.log('Error:', data.description);
          console.log('Error Code:', data.error_code);
          
          if (data.error_code === 401) {
            console.log('\n💡 This means the bot token is invalid or expired');
            console.log('You need to get a new token from @BotFather');
          } else if (data.error_code === 404) {
            console.log('\n💡 This means the bot token is not found');
            console.log('The token might be malformed or the bot was deleted');
          }
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Bot token validation failed');
        console.log('Status:', response.status);
        console.log('Error:', errorText);
      }
    } catch (error) {
      console.log('❌ Error testing bot token:', error.message);
    }

  } catch (error) {
    console.error('❌ Error diagnosing Telegram:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseTelegram();
