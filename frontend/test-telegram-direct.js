#!/usr/bin/env node

/**
 * Test Telegram bot directly with your provided token and chat ID
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTelegramDirect() {
  console.log('🤖 Testing Telegram Bot Directly\n');

  const botToken = '8361218732d:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const chatId = '8425375613';

  console.log('🔧 Testing bot token directly...');
  console.log('Bot token:', botToken.substring(0, 10) + '...');
  console.log('Chat ID:', chatId);

  try {
    // Test 1: Check if bot exists
    console.log('\n📱 Test 1: Checking bot info...');
    const botResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    
    if (botResponse.ok) {
      const botData = await botResponse.json();
      if (botData.ok) {
        console.log('✅ Bot token is valid!');
        console.log('Bot ID:', botData.result.id);
        console.log('Bot Username:', botData.result.username);
        console.log('Bot Name:', botData.result.first_name);
        console.log('Can Join Groups:', botData.result.can_join_groups);
        console.log('Can Read All Group Messages:', botData.result.can_read_all_group_messages);
        console.log('Supports Inline Queries:', botData.result.supports_inline_queries);
      } else {
        console.log('❌ Bot token validation failed');
        console.log('Error:', botData.description);
        console.log('Error Code:', botData.error_code);
        return;
      }
    } else {
      const errorText = await botResponse.text();
      console.log('❌ Bot token validation failed');
      console.log('Status:', botResponse.status);
      console.log('Error:', errorText);
      return;
    }

    // Test 2: Send a message directly
    console.log('\n📱 Test 2: Sending message directly...');
    const messageResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🧪 Direct test message from MatMax Communication Service!\n\nThis message is sent directly via Telegram API to test the bot token and chat ID.'
      })
    });

    if (messageResponse.ok) {
      const messageData = await messageResponse.json();
      if (messageData.ok) {
        console.log('✅ Message sent successfully!');
        console.log('Message ID:', messageData.result.message_id);
        console.log('Chat ID:', messageData.result.chat.id);
        console.log('Date:', new Date(messageData.result.date * 1000).toISOString());
        console.log('📱 Check your Telegram chat for the message!');
      } else {
        console.log('❌ Message sending failed');
        console.log('Error:', messageData.description);
        console.log('Error Code:', messageData.error_code);
      }
    } else {
      const errorText = await messageResponse.text();
      console.log('❌ Message sending failed');
      console.log('Status:', messageResponse.status);
      console.log('Error:', errorText);
    }

    // Test 3: Update database configuration
    console.log('\n🔧 Test 3: Updating database configuration...');
    try {
      const config = await prisma.communicationConfig.findFirst();
      
      if (config) {
        await prisma.communicationConfig.update({
          where: { id: config.id },
          data: {
            telegramBotToken: botToken,
            telegramBotUsername: 'your_bot_username', // We'll get this from the bot info
            telegramChatIds: [chatId],
          }
        });
        
        console.log('✅ Database configuration updated!');
        console.log('📊 Configuration:');
        console.log('- Bot token: Set');
        console.log('- Chat ID:', chatId);
        console.log('- Telegram enabled: true');
      } else {
        console.log('❌ No communication config found');
      }
    } catch (error) {
      console.log('❌ Error updating database:', error.message);
    }

    // Test 4: Test via CommunicationService
    console.log('\n🧪 Test 4: Testing via CommunicationService...');
    try {
      const { CommunicationService } = await import('./lib/services/communication-service.ts');
      const communicationService = new CommunicationService();
      
      const result = await communicationService.sendTelegramMessage({
        chatId: chatId,
        message: '🎉 Test message via CommunicationService!\n\nThis message is sent through the CommunicationService to verify the integration is working correctly.'
      });

      if (result.success) {
        console.log('✅ CommunicationService test successful!');
        console.log('Message ID:', result.messageId);
        console.log('Provider:', result.provider);
        console.log('📱 Check your Telegram chat for the message!');
      } else {
        console.log('❌ CommunicationService test failed');
        console.log('Error:', result.error);
      }
    } catch (error) {
      console.log('❌ Error testing CommunicationService:', error.message);
    }

  } catch (error) {
    console.error('❌ Error testing Telegram:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTelegramDirect();
