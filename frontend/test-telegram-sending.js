#!/usr/bin/env node

/**
 * Test Telegram sending functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import the CommunicationService
import { CommunicationService } from './lib/services/communication-service.ts';

async function testTelegramSending() {
  console.log('📱 Testing Telegram Sending\n');

  try {
    const communicationService = new CommunicationService();

    // Wait a moment for config to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🔧 Testing Telegram message sending...');

    const result = await communicationService.sendTelegramMessage({
      chatId: '123456789', // This is a test chat ID
      message: 'Test message from Communication Service'
    });

    if (result.success) {
      console.log('✅ Telegram message sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Provider:', result.provider);
    } else {
      console.log('❌ Telegram message sending failed');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Error testing Telegram sending:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTelegramSending();
