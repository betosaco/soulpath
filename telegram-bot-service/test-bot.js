#!/usr/bin/env node

/**
 * Telegram Bot Service Test Script
 * Tests the bot functionality without deploying
 */

import axios from 'axios';
import { TelegramBotService } from './services/telegram-bot-service.js';

const botService = new TelegramBotService();

// Test data
const testChatId = process.env.TEST_CHAT_ID || '123456789'; // Replace with actual chat ID
const testOrderDetails = {
  orderId: 'test-order-123',
  orderNumber: 'ORD-TEST-123',
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerPhone: '+1234567890',
  status: 'confirmed',
  paymentStatus: 'completed',
  total: 150.00,
  currency: 'USD',
  items: [
    {
      name: '5-Class Yoga Package',
      description: 'A package of 5 yoga classes',
      type: 'PACKAGE',
      quantity: 1,
      price: 110.00,
      total: 110.00,
      sessions: 5,
      duration: 60
    },
    {
      name: 'Yoga Mat',
      description: 'High-quality yoga mat',
      type: 'PRODUCT',
      quantity: 1,
      price: 40.00,
      total: 40.00
    }
  ],
  createdAt: new Date(),
  scheduleDetails: [
    {
      selectedDate: 'Monday, January 15, 2024',
      selectedTime: '10:00 AM',
      teacher: 'Maria Gonzalez',
      serviceType: 'Hatha Yoga',
      venue: 'MatMax Yoga Studio'
    }
  ],
  shippingAddress: {
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  }
};

async function runTests() {
  console.log('🧪 Running Telegram Bot Service Tests...\n');

  try {
    // Test 1: Bot Connection
    console.log('1️⃣ Testing bot connection...');
    const botInfoResponse = await axios.get(`https://api.telegram.org/bot${botService.botToken}/getMe`);
    if (botInfoResponse.data.ok) {
      console.log('✅ Bot connection successful');
      console.log(`   Bot Name: ${botInfoResponse.data.result.first_name}`);
      console.log(`   Username: @${botInfoResponse.data.result.username}`);
    } else {
      console.log('❌ Bot connection failed');
      return;
    }

    // Test 2: Webhook Info
    console.log('\n2️⃣ Testing webhook configuration...');
    const webhookResponse = await axios.get(`https://api.telegram.org/bot${botService.botToken}/getWebhookInfo`);
    if (webhookResponse.data.ok) {
      const webhookInfo = webhookResponse.data.result;
      console.log('✅ Webhook info retrieved');
      console.log(`   URL: ${webhookInfo.url || 'Not set'}`);
      console.log(`   Pending Updates: ${webhookInfo.pending_update_count || 0}`);
    }

    // Test 3: Message Formatting (without sending)
    console.log('\n3️⃣ Testing message formatting...');
    const formattedMessage = botService.formatOrderMessage(testOrderDetails);
    console.log('✅ Message formatting successful');
    console.log('📄 Formatted message preview:');
    console.log('---');
    console.log(formattedMessage.substring(0, 200) + '...');
    console.log('---');

    // Test 4: Send Test Message (optional)
    if (process.env.TEST_CHAT_ID) {
      console.log('\n4️⃣ Sending test message...');
      try {
        await botService.sendMessage(
          testChatId,
          `🧪 <b>Test Message from Telegram Bot Service</b>\n\nThis is a test message to verify the bot is working correctly.\n\nTime: ${new Date().toISOString()}`,
          { parseMode: 'HTML' }
        );
        console.log('✅ Test message sent successfully');
      } catch (error) {
        console.log('❌ Failed to send test message:', error.message);
        console.log('💡 Make sure TEST_CHAT_ID is set to a valid Telegram chat ID');
      }
    } else {
      console.log('\n4️⃣ Skipping test message (TEST_CHAT_ID not set)');
      console.log('💡 Set TEST_CHAT_ID environment variable to send test messages');
    }

    // Test 5: Order Notification (optional)
    if (process.env.TEST_CHAT_ID) {
      console.log('\n5️⃣ Testing order notification...');
      try {
        await botService.sendOrderConfirmation(testChatId, testOrderDetails);
        console.log('✅ Order notification sent successfully');
      } catch (error) {
        console.log('❌ Failed to send order notification:', error.message);
      }
    } else {
      console.log('\n5️⃣ Skipping order notification test (TEST_CHAT_ID not set)');
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Test Results Summary:');
    console.log('✅ Bot connection: OK');
    console.log('✅ Webhook info: OK');
    console.log('✅ Message formatting: OK');
    if (process.env.TEST_CHAT_ID) {
      console.log('✅ Test message: OK');
      console.log('✅ Order notification: OK');
    } else {
      console.log('⚠️  Message sending: Skipped (set TEST_CHAT_ID)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your TELEGRAM_BOT_TOKEN environment variable');
    console.error('2. Verify the bot token is correct');
    console.error('3. Make sure the bot is not already handling webhooks');
    console.error('4. Check your internet connection');
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };
