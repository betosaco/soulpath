#!/usr/bin/env node

/**
 * Check Telegram bot configuration
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTelegramConfig() {
  console.log('🤖 Checking Telegram Bot Configuration\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Current Telegram configuration:');
    console.log('- Telegram enabled:', config.telegramEnabled);
    console.log('- Bot token configured:', config.telegramBotToken ? 'Yes' : 'No');
    console.log('- Bot username:', config.telegramBotUsername || 'Not set');
    console.log('- Webhook URL:', config.telegramWebhookUrl || 'Not set');
    console.log('- Chat IDs:', config.telegramChatIds?.length || 0, 'users connected');

    if (config.telegramBotToken) {
      console.log('\n🔧 Testing bot token validation...');
      
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
          } else {
            console.log('❌ Bot token validation failed');
            console.log('Error:', data.description);
          }
        } else {
          const errorText = await response.text();
          console.log('❌ Bot token validation failed');
          console.log('Status:', response.status);
          console.log('Error:', errorText);
        }
      } catch (error) {
        console.error('❌ Error testing bot token:', error);
      }
    } else {
      console.log('❌ No bot token configured');
    }

  } catch (error) {
    console.error('❌ Error checking Telegram config:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTelegramConfig();
