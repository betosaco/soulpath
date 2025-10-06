#!/usr/bin/env node

/**
 * Update Telegram configuration with provided token and chat ID
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTelegramWithToken() {
  console.log('🤖 Updating Telegram Configuration\n');

  try {
    const config = await prisma.communicationConfig.findFirst();
    
    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    // Your provided values
    const newBotToken = '8361218732d:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
    const newChatId = '8425375613';

    console.log('🔧 Testing bot token first...');
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${newBotToken}/getMe`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          console.log('✅ Bot token is valid!');
          console.log('Bot ID:', data.result.id);
          console.log('Bot Username:', data.result.username);
          console.log('Bot Name:', data.result.first_name);
          
          console.log('\n🔧 Updating database with new configuration...');
          
          const updatedConfig = await prisma.communicationConfig.update({
            where: { id: config.id },
            data: {
              telegramBotToken: newBotToken,
              telegramBotUsername: data.result.username,
              telegramChatIds: [newChatId], // Add the chat ID to the array
            }
          });
          
          console.log('✅ Telegram configuration updated successfully!');
          console.log('📊 New configuration:');
          console.log('- Bot token:', updatedConfig.telegramBotToken ? 'Set' : 'Not set');
          console.log('- Bot username:', updatedConfig.telegramBotUsername);
          console.log('- Chat IDs:', updatedConfig.telegramChatIds?.length || 0, 'users connected');
          console.log('- Chat ID:', newChatId);
          
          console.log('\n🧪 Testing Telegram message sending...');
          
          // Test sending a message
          try {
            const { CommunicationService } = await import('./lib/services/communication-service.ts');
            const communicationService = new CommunicationService();
            
            const result = await communicationService.sendTelegramMessage({
              chatId: newChatId,
              message: '🎉 Test message from MatMax Communication Service!\n\nThis is a test to verify that the Telegram integration is working correctly with your bot token and chat ID.'
            });

            if (result.success) {
              console.log('✅ Telegram message sent successfully!');
              console.log('Message ID:', result.messageId);
              console.log('Provider:', result.provider);
              console.log('📱 Check your Telegram chat for the message!');
            } else {
              console.log('❌ Telegram message sending failed');
              console.log('Error:', result.error);
            }
          } catch (error) {
            console.log('❌ Error testing Telegram message:', error.message);
          }
          
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
      console.log('❌ Error testing bot token:', error.message);
    }

  } catch (error) {
    console.error('❌ Error updating Telegram configuration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTelegramWithToken();
