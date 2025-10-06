#!/usr/bin/env node

/**
 * Get your Telegram chat ID for testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getChatId() {
  console.log('📱 Getting Your Telegram Chat ID\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.telegramBotToken) {
      console.log('❌ No Telegram bot token found');
      return;
    }

    console.log('🤖 Your bot: @' + (config.telegramBotUsername || 'unknown'));
    console.log('🔗 Bot link: https://t.me/' + (config.telegramBotUsername || 'unknown'));
    console.log('\n📋 Steps to get your chat ID:');
    console.log('1. Click the bot link above or search for your bot on Telegram');
    console.log('2. Start a chat with your bot');
    console.log('3. Send /start to the bot');
    console.log('4. Use one of these methods to get your chat ID:\n');

    console.log('Method 1: Use @userinfobot');
    console.log('- Search for @userinfobot on Telegram');
    console.log('- Start a chat with it');
    console.log('- Send any message');
    console.log('- It will reply with your user ID (this is your chat ID)\n');

    console.log('Method 2: Use @getidsbot');
    console.log('- Search for @getidsbot on Telegram');
    console.log('- Start a chat with it');
    console.log('- Send any message');
    console.log('- It will reply with your chat ID\n');

    console.log('Method 3: Check webhook logs');
    console.log('- If you have webhook logging enabled');
    console.log('- Check the logs when you message your bot');
    console.log('- Look for the chat_id in the incoming message\n');

    console.log('Once you have your chat ID, you can test with:');
    console.log('npx tsx test-telegram-with-chatid.js');
    console.log('(Update the chat ID in that script first)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getChatId();
