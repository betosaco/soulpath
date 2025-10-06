#!/usr/bin/env node

/**
 * Test Telegram with proper bot username handling
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTelegramWithUsername() {
  console.log('🤖 Testing Telegram with Username Handling\n');

  const botToken = '8361218732d:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const chatId = '8425375613';

  console.log('📊 Configuration:');
  console.log('- Bot Token:', botToken.substring(0, 10) + '...');
  console.log('- Chat ID:', chatId);

  // Test 1: Get bot info to see the actual username
  console.log('\n📱 Test 1: Getting bot info...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.ok) {
        console.log('✅ Bot token is valid!');
        console.log('Bot ID:', data.result.id);
        console.log('Bot Username:', data.result.username);
        console.log('Bot Name:', data.result.first_name);
        console.log('Bot Username with @:', '@' + data.result.username);
        
        // Update database with correct username
        console.log('\n🔧 Updating database with correct bot info...');
        try {
          const config = await prisma.communicationConfig.findFirst();
          if (config) {
            await prisma.communicationConfig.update({
              where: { id: config.id },
              data: {
                telegramBotToken: botToken,
                telegramBotUsername: data.result.username, // Store without @
                telegramChatIds: [chatId],
              }
            });
            console.log('✅ Database updated with correct bot info!');
            console.log('Bot Username stored:', data.result.username);
          }
        } catch (error) {
          console.log('❌ Error updating database:', error.message);
        }
      } else {
        console.log('❌ Bot token validation failed');
        console.log('Error:', data.description);
        return;
      }
    } else {
      console.log('❌ Bot token validation failed');
      console.log('Status:', response.status);
      return;
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return;
  }

  // Test 2: Send message with proper formatting
  console.log('\n📱 Test 2: Sending message...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🎉 Test message from MatMax Communication Service!\n\nThis message is sent to verify that the Telegram integration is working correctly with your bot token and chat ID.'
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.ok) {
        console.log('✅ Message sent successfully!');
        console.log('Message ID:', data.result.message_id);
        console.log('Chat ID:', data.result.chat.id);
        console.log('Date:', new Date(data.result.date * 1000).toISOString());
        console.log('📱 Check your Telegram chat for the message!');
      } else {
        console.log('❌ Message sending failed');
        console.log('Error:', data.description);
        console.log('Error Code:', data.error_code);
      }
    } else {
      console.log('❌ Message sending failed');
      console.log('Status:', response.status);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 3: Test via CommunicationService
  console.log('\n🧪 Test 3: Testing via CommunicationService...');
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

  console.log('\n🎯 Summary:');
  console.log('If you can receive messages from the bot in Telegram, then:');
  console.log('✅ The bot token is valid');
  console.log('✅ The bot is working');
  console.log('✅ The integration should work');
  console.log('📱 Check your Telegram chat for the test messages!');

  await prisma.$disconnect();
}

testTelegramWithUsername();
