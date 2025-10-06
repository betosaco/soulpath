#!/usr/bin/env node

/**
 * Test Telegram functionality with a specific chat ID
 */

import { PrismaClient } from '@prisma/client';
import { CommunicationService } from './lib/services/communication-service.ts';

const prisma = new PrismaClient();

async function testTelegramWithChatId() {
  console.log('📱 Testing Telegram with Chat ID\n');

  try {
    const communicationService = new CommunicationService();

    // Wait a moment for config to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🔧 Testing Telegram message sending...');
    console.log('Note: You need to get a valid chat ID first.');
    console.log('To get your chat ID:');
    console.log('1. Start a chat with your bot (@Matmaxcommerce_bot)');
    console.log('2. Send /start to the bot');
    console.log('3. Check the webhook logs or use a tool like @userinfobot');
    console.log('4. Use that chat ID in the test below\n');

    // Test with a placeholder chat ID - you'll need to replace this with a real one
    const testChatId = '123456789'; // Replace with your actual chat ID
    
    console.log(`Testing with chat ID: ${testChatId}`);
    console.log('(This will fail if the chat ID is not valid)\n');

    const result = await communicationService.sendTelegramMessage({
      chatId: testChatId,
      message: '🧪 Test message from MatMax Communication Service!\n\nThis is a test to verify that the Telegram integration is working correctly.'
    });

    if (result.success) {
      console.log('✅ Telegram message sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Provider:', result.provider);
    } else {
      console.log('❌ Telegram message sending failed');
      console.log('Error:', result.error);
      console.log('\nPossible reasons:');
      console.log('- Invalid or expired bot token');
      console.log('- Invalid chat ID');
      console.log('- Bot token not properly configured');
      console.log('- Bot is not started or blocked');
    }

  } catch (error) {
    console.error('❌ Error testing Telegram:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTelegramWithChatId();
