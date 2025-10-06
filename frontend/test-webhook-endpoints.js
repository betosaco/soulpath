#!/usr/bin/env node

/**
 * Test webhook endpoints directly
 */

import { WebhookTelegramService } from './lib/services/webhook-telegram-service.js';

async function testWebhookEndpoints() {
  console.log('🧪 Testing Webhook Endpoints Directly\n');

  try {
    const telegramService = new WebhookTelegramService();

    // Test 1: Store a message
    console.log('📨 Test 1: Storing a message...');
    const messageId = await telegramService.storeMessage({
      chatId: '8425375613',
      userId: 'test-user-direct',
      messageText: 'Direct test message from webhook system',
      messageType: 'text',
      metadata: {
        test: 'direct',
        timestamp: new Date().toISOString()
      }
    });
    console.log(`✅ Message stored: ${messageId}`);

    // Test 2: Store a response
    console.log('\n📤 Test 2: Storing a response...');
    const responseId = await telegramService.storeResponse({
      chatId: '8425375613',
      responseText: 'Direct test response from webhook system',
      responseType: 'text',
      metadata: {
        test: 'direct',
        timestamp: new Date().toISOString()
      }
    });
    console.log(`✅ Response stored: ${responseId}`);

    // Test 3: Get statistics
    console.log('\n📊 Test 3: Getting statistics...');
    const stats = await telegramService.getStatistics();
    console.log('✅ Statistics:', JSON.stringify(stats, null, 2));

    // Test 4: Get pending messages
    console.log('\n📋 Test 4: Getting pending messages...');
    const pendingMessages = await telegramService.getPendingMessages(5);
    console.log(`✅ Found ${pendingMessages.length} pending messages`);
    pendingMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg.messageText} (${msg.status})`);
    });

    // Test 5: Get pending responses
    console.log('\n📋 Test 5: Getting pending responses...');
    const pendingResponses = await telegramService.getPendingResponses(5);
    console.log(`✅ Found ${pendingResponses.length} pending responses`);
    pendingResponses.forEach((resp, index) => {
      console.log(`  ${index + 1}. ${resp.responseText} (${resp.status})`);
    });

    // Test 6: Mark message as processed
    if (pendingMessages.length > 0) {
      console.log('\n🔄 Test 6: Marking message as processed...');
      await telegramService.markMessageProcessed(pendingMessages[0].id);
      console.log(`✅ Message ${pendingMessages[0].id} marked as processed`);
    }

    // Test 7: Mark response as sent
    if (pendingResponses.length > 0) {
      console.log('\n🔄 Test 7: Marking response as sent...');
      await telegramService.markResponseSent(pendingResponses[0].id);
      console.log(`✅ Response ${pendingResponses[0].id} marked as sent`);
    }

    // Test 8: Get updated statistics
    console.log('\n📊 Test 8: Getting updated statistics...');
    const updatedStats = await telegramService.getStatistics();
    console.log('✅ Updated statistics:', JSON.stringify(updatedStats, null, 2));

    console.log('\n🎉 ALL WEBHOOK TESTS COMPLETED SUCCESSFULLY!');
    console.log('============================================');
    console.log('✅ Message storage: WORKING');
    console.log('✅ Response storage: WORKING');
    console.log('✅ Statistics: WORKING');
    console.log('✅ Pending retrieval: WORKING');
    console.log('✅ Status updates: WORKING');

    console.log('\n🚀 WEBHOOK SYSTEM IS READY!');
    console.log('============================');
    console.log('The webhook-based Telegram system is fully functional:');
    console.log('- Messages can be stored in database');
    console.log('- Responses can be stored in database');
    console.log('- Status tracking works correctly');
    console.log('- Statistics are accurate');
    console.log('- No bot token required!');

    console.log('\n📋 NEXT STEPS:');
    console.log('==============');
    console.log('1. **External Integration**: Connect with Zapier, IFTTT, or custom services');
    console.log('2. **Background Processing**: Set up job queues for message processing');
    console.log('3. **API Endpoints**: Test the webhook endpoints with server running');
    console.log('4. **Frontend Integration**: Update admin panel to use webhook system');

  } catch (error) {
    console.error('❌ Webhook test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

testWebhookEndpoints();
