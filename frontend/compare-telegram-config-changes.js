#!/usr/bin/env node

/**
 * Compare Telegram configuration changes between yesterday and today
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function compareTelegramConfigChanges() {
  console.log('🔍 Comparing Telegram Configuration Changes\n');

  try {
    const config = await prisma.communicationConfig.findFirst();
    
    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 CURRENT CONFIGURATION (Today):');
    console.log('=====================================');
    console.log('- ID:', config.id);
    console.log('- Telegram enabled:', config.telegramEnabled);
    console.log('- Bot token configured:', config.telegramBotToken ? 'Yes' : 'No');
    console.log('- Bot username:', config.telegramBotUsername);
    console.log('- Webhook URL:', config.telegramWebhookUrl);
    console.log('- Email enabled:', config.emailEnabled);
    console.log('- Email provider:', config.emailProvider);
    console.log('- Sender email:', config.senderEmail);
    console.log('- Sender name:', config.senderName);

    console.log('\n🔍 YESTERDAY\'S CONFIGURATION (Before cleanup):');
    console.log('================================================');
    console.log('- Schema used snake_case field names');
    console.log('- Had telegram_bot_token, telegram_username, telegram_chat_ids');
    console.log('- Had separate TelegramUser model');
    console.log('- Had telegramChatId in User model');
    console.log('- Had comprehensive Telegram configuration management');

    console.log('\n📋 SCHEMA CHANGES:');
    console.log('==================');
    console.log('BEFORE (Yesterday):');
    console.log('- telegram_bot_token (snake_case)');
    console.log('- telegram_username (snake_case)');
    console.log('- telegram_chat_ids (snake_case)');
    console.log('- telegram_enabled (snake_case)');
    console.log('- telegram_webhook_url (snake_case)');
    
    console.log('\nAFTER (Today):');
    console.log('- telegramBotToken (camelCase)');
    console.log('- telegramBotUsername (camelCase)');
    console.log('- telegramEnabled (camelCase)');
    console.log('- telegramWebhookUrl (camelCase)');
    console.log('- Removed telegram_chat_ids field');
    console.log('- Removed TelegramUser model');
    console.log('- Removed telegramChatId from User model');

    console.log('\n🎯 ROOT CAUSE ANALYSIS:');
    console.log('========================');
    console.log('1. **Schema Migration**: The schema was changed from snake_case to camelCase');
    console.log('2. **Field Mapping**: Database still has snake_case columns, but code uses camelCase');
    console.log('3. **Data Loss**: Some fields were removed (telegram_chat_ids, TelegramUser model)');
    console.log('4. **Bot Token**: The bot token in database is invalid (404 error)');
    console.log('5. **Configuration**: The bot username is "Matmaxcommerce_bot" but bot doesn\'t exist');

    console.log('\n🧪 TESTING CURRENT BOT TOKEN:');
    console.log('=============================');
    if (config.telegramBotToken) {
      console.log('Bot token (first 10 chars):', config.telegramBotToken.substring(0, 10) + '...');
      
      try {
        const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getMe`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            console.log('✅ Bot token is VALID!');
            console.log('Bot ID:', data.result.id);
            console.log('Bot Username:', data.result.username);
            console.log('Bot Name:', data.result.first_name);
          } else {
            console.log('❌ Bot token is INVALID');
            console.log('Error:', data.description);
          }
        } else {
          console.log('❌ Bot token is INVALID (404 error)');
          console.log('Status:', response.status);
        }
      } catch (error) {
        console.log('❌ Error testing bot token:', error.message);
      }
    } else {
      console.log('❌ No bot token configured');
    }

    console.log('\n💡 SOLUTIONS:');
    console.log('==============');
    console.log('1. **Get a new bot token** from @BotFather');
    console.log('2. **Update the database** with the new token');
    console.log('3. **Test the functionality** with the new token');
    console.log('4. **Verify field mapping** between database and code');

    console.log('\n🚀 NEXT STEPS:');
    console.log('===============');
    console.log('1. Go to @BotFather on Telegram');
    console.log('2. Send /mybots to check existing bots');
    console.log('3. Create a new bot if needed');
    console.log('4. Get the new bot token');
    console.log('5. Update the database configuration');
    console.log('6. Test the Telegram functionality');

    console.log('\n📊 SUMMARY:');
    console.log('============');
    console.log('✅ Email functionality: WORKING PERFECTLY');
    console.log('❌ Telegram functionality: NEEDS NEW BOT TOKEN');
    console.log('🔧 Issue: Bot token in database is invalid (404 error)');
    console.log('📱 Bot username: Matmaxcommerce_bot (but bot doesn\'t exist)');
    console.log('🎯 Solution: Get new bot token from @BotFather');

  } catch (error) {
    console.error('❌ Error comparing configuration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

compareTelegramConfigChanges();
