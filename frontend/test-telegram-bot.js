#!/usr/bin/env node

/**
 * Test Telegram bot connection
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTelegramBot() {
  console.log('🤖 Testing Telegram Bot Connection\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.telegramBotToken) {
      console.log('❌ No Telegram bot token found in configuration');
      return;
    }

    console.log('🔧 Testing Telegram bot token validation...');

    const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getMe`);

    if (response.ok) {
      const data = await response.json();
      if (data.ok) {
        console.log('✅ Telegram bot token is valid!');
        console.log('Bot ID:', data.result.id);
        console.log('Bot Username:', data.result.username);
        console.log('Bot Name:', data.result.first_name);
        console.log('Can Join Groups:', data.result.can_join_groups);
        console.log('Can Read All Group Messages:', data.result.can_read_all_group_messages);
        console.log('Supports Inline Queries:', data.result.supports_inline_queries);
      } else {
        console.log('❌ Telegram bot token validation failed');
        console.log('Error:', data.description);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Telegram bot token validation failed');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Error testing Telegram bot:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTelegramBot();
