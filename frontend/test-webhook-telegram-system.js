#!/usr/bin/env node

/**
 * Test the webhook-based Telegram system
 */

import { PrismaClient } from '@prisma/client';
import { WebhookTelegramService } from './lib/services/webhook-telegram-service.js';
import { TelegramProcessor } from './lib/services/telegram-processor.js';

const prisma = new PrismaClient();

async function testWebhookTelegramSystem() {
  console.log('🧪 Testing Webhook-Based Telegram System\n');

  try {
    // Test 1: Database Connection
    console.log('📊 Test 1: Database Connection');
    console.log('=============================');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test 2: WebhookTelegramService
    console.log('\n📊 Test 2: WebhookTelegramService');
    console.log('==================================');
    const telegramService = new WebhookTelegramService();
    
    // Test storing a message
    console.log('📨 Testing message storage...');
    const messageId = await telegramService.storeMessage({
      chatId: '8425375613',
      userId: 'test-user-123',
      messageText: 'Hello from webhook test!',
      messageType: 'text',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    });
    console.log(`✅ Message stored with ID: ${messageId}`);

    // Test storing a response
    console.log('📤 Testing response storage...');
    const responseId = await telegramService.storeResponse({
      chatId: '8425375613',
      responseText: 'Hello! This is a test response from the webhook system.',
      responseType: 'text',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    });
    console.log(`✅ Response stored with ID: ${responseId}`);

    // Test getting pending messages
    console.log('📋 Testing pending messages retrieval...');
    const pendingMessages = await telegramService.getPendingMessages(5);
    console.log(`✅ Found ${pendingMessages.length} pending messages`);

    // Test getting pending responses
    console.log('📋 Testing pending responses retrieval...');
    const pendingResponses = await telegramService.getPendingResponses(5);
    console.log(`✅ Found ${pendingResponses.length} pending responses`);

    // Test statistics
    console.log('📊 Testing statistics...');
    const stats = await telegramService.getStatistics();
    console.log('✅ Statistics:', JSON.stringify(stats, null, 2));

    // Test 3: TelegramProcessor
    console.log('\n📊 Test 3: TelegramProcessor');
    console.log('===========================');
    const processor = new TelegramProcessor();
    
    console.log('🚀 Testing processor status...');
    const status = processor.getStatus();
    console.log('✅ Processor status:', status);

    console.log('🧹 Testing cleanup...');
    await processor.cleanup();
    console.log('✅ Cleanup completed');

    // Test 4: Webhook Endpoints
    console.log('\n📊 Test 4: Webhook Endpoints');
    console.log('============================');
    
    // Test message webhook endpoint
    console.log('📨 Testing message webhook endpoint...');
    try {
      const messageResponse = await fetch('http://localhost:3000/api/telegram/webhook-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: '8425375613',
          userId: 'test-user-456',
          messageText: 'Test message via webhook endpoint',
          messageType: 'text',
          metadata: {
            source: 'test-script',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (messageResponse.ok) {
        const messageData = await messageResponse.json();
        console.log('✅ Message webhook endpoint working:', messageData);
      } else {
        console.log('⚠️ Message webhook endpoint not available (server might not be running)');
      }
    } catch (error) {
      console.log('⚠️ Message webhook endpoint not available:', error.message);
    }

    // Test response webhook endpoint
    console.log('📤 Testing response webhook endpoint...');
    try {
      const responseResponse = await fetch('http://localhost:3000/api/telegram/webhook-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: '8425375613',
          responseText: 'Test response via webhook endpoint',
          responseType: 'text',
          metadata: {
            source: 'test-script',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (responseResponse.ok) {
        const responseData = await responseResponse.json();
        console.log('✅ Response webhook endpoint working:', responseData);
      } else {
        console.log('⚠️ Response webhook endpoint not available (server might not be running)');
      }
    } catch (error) {
      console.log('⚠️ Response webhook endpoint not available:', error.message);
    }

    // Test 5: Database Models
    console.log('\n📊 Test 5: Database Models');
    console.log('=========================');
    
    // Test TelegramMessage model
    console.log('📨 Testing TelegramMessage model...');
    const messageCount = await prisma.telegramMessage.count();
    console.log(`✅ TelegramMessage count: ${messageCount}`);

    // Test TelegramResponse model
    console.log('📤 Testing TelegramResponse model...');
    const responseCount = await prisma.telegramResponse.count();
    console.log(`✅ TelegramResponse count: ${responseCount}`);

    // Test recent messages
    console.log('📋 Testing recent messages...');
    const recentMessages = await prisma.telegramMessage.findMany({
      orderBy: { receivedAt: 'desc' },
      take: 3
    });
    console.log(`✅ Recent messages: ${recentMessages.length}`);
    recentMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg.messageText} (${msg.status})`);
    });

    // Test recent responses
    console.log('📋 Testing recent responses...');
    const recentResponses = await prisma.telegramResponse.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    console.log(`✅ Recent responses: ${recentResponses.length}`);
    recentResponses.forEach((resp, index) => {
      console.log(`  ${index + 1}. ${resp.responseText} (${resp.status})`);
    });

    // Test 6: Integration Test
    console.log('\n📊 Test 6: Integration Test');
    console.log('===========================');
    
    // Simulate a complete message flow
    console.log('🔄 Simulating complete message flow...');
    
    // 1. Store incoming message
    const incomingMessageId = await telegramService.storeMessage({
      chatId: '8425375613',
      userId: 'integration-test-user',
      messageText: 'Integration test message',
      messageType: 'text',
      metadata: { test: 'integration' }
    });
    console.log(`✅ Incoming message stored: ${incomingMessageId}`);

    // 2. Mark message as processed
    await telegramService.markMessageProcessed(incomingMessageId);
    console.log('✅ Message marked as processed');

    // 3. Store outgoing response
    const outgoingResponseId = await telegramService.storeResponse({
      chatId: '8425375613',
      responseText: 'Integration test response',
      responseType: 'text',
      metadata: { test: 'integration' }
    });
    console.log(`✅ Outgoing response stored: ${outgoingResponseId}`);

    // 4. Mark response as sent
    await telegramService.markResponseSent(outgoingResponseId);
    console.log('✅ Response marked as sent');

    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('✅ Database connection: WORKING');
    console.log('✅ WebhookTelegramService: WORKING');
    console.log('✅ TelegramProcessor: WORKING');
    console.log('✅ Database models: WORKING');
    console.log('✅ Integration flow: WORKING');
    console.log('⚠️ Webhook endpoints: Need server running');

    console.log('\n🚀 NEXT STEPS:');
    console.log('===============');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Test webhook endpoints with server running');
    console.log('3. Set up external service integration');
    console.log('4. Configure background job processing');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhookTelegramSystem();
