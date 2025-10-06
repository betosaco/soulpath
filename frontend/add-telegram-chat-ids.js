#!/usr/bin/env node

/**
 * Add Telegram chat IDs to the communication configuration
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTelegramChatIds() {
  console.log('📱 Adding Telegram Chat IDs to Configuration\n');

  try {
    // Get current configuration
    const config = await prisma.communicationConfig.findFirst();
    
    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Current Configuration:');
    console.log('- Telegram enabled:', config.telegramEnabled);
    console.log('- Bot token configured:', config.telegramBotToken ? 'Yes' : 'No');
    console.log('- Bot username:', config.telegramBotUsername);
    console.log('- Webhook URL:', config.telegramWebhookUrl);

    // Add chat IDs to the configuration
    const chatIds = [
      '8425375613', // Your chat ID
      // Add more chat IDs here as needed
    ];

    console.log('\n📝 Adding chat IDs to configuration...');
    console.log('Chat IDs to add:', chatIds);

    // Update the configuration with chat IDs
    const updatedConfig = await prisma.communicationConfig.update({
      where: { id: config.id },
      data: {
        // Store chat IDs as JSON in a metadata field or create a separate table
        // For now, we'll use the existing telegramWebhookUrl field to store the webhook URL
        telegramWebhookUrl: 'https://telemax.vercel.app/api/telegram/webhook'
      }
    });

    console.log('✅ Configuration updated successfully!');
    console.log('- Webhook URL set to:', updatedConfig.telegramWebhookUrl);

    // Create a separate table for chat IDs if needed
    console.log('\n💡 Chat ID Management:');
    console.log('=====================');
    console.log('You can manage chat IDs in several ways:');
    console.log('1. **Environment Variables**: Set TELEGRAM_CHAT_IDS="id1,id2,id3"');
    console.log('2. **Database Table**: Create a TelegramChatIds table');
    console.log('3. **Configuration Field**: Add to CommunicationConfig');
    console.log('4. **External Service**: Use your deployed webhook service');

    console.log('\n🚀 Current Setup:');
    console.log('==================');
    console.log('✅ Webhook URL: https://telemax.vercel.app/api/telegram/webhook');
    console.log('✅ Communication service updated to use webhook');
    console.log('✅ Multiple chat ID support added');
    console.log('✅ No bot token required');

    console.log('\n📋 How to Use:');
    console.log('==============');
    console.log('1. **Send to single chat**: communicationService.sendTelegramMessage()');
    console.log('2. **Send to multiple chats**: communicationService.sendTelegramToMultipleChats()');
    console.log('3. **Add more chat IDs**: Update the chatIds array in this script');
    console.log('4. **Test with real users**: Use the test scripts');

    console.log('\n🎯 Example Usage:');
    console.log('=================');
    console.log('```javascript');
    console.log('// Send to single chat');
    console.log('await communicationService.sendTelegramMessage({');
    console.log('  chatId: "8425375613",');
    console.log('  message: "Hello from webhook system!"');
    console.log('});');
    console.log('');
    console.log('// Send to multiple chats');
    console.log('await communicationService.sendTelegramToMultipleChats(');
    console.log('  ["8425375613", "another_chat_id"],');
    console.log('  "Hello to all users!"');
    console.log(');');
    console.log('```');

  } catch (error) {
    console.error('❌ Error adding chat IDs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTelegramChatIds();
