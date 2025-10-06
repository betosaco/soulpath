#!/usr/bin/env node

/**
 * Update Telegram bot token in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTelegramToken() {
  console.log('🤖 Update Telegram Bot Token\n');

  try {
    const config = await prisma.communicationConfig.findFirst();
    
    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Current configuration:');
    console.log('- Bot token configured:', config.telegramBotToken ? 'Yes' : 'No');
    console.log('- Bot username:', config.telegramBotUsername || 'Not set');

    // You can update the token here by replacing 'YOUR_NEW_BOT_TOKEN' with the actual token
    const newBotToken = 'YOUR_NEW_BOT_TOKEN'; // Replace this with your actual bot token
    const newBotUsername = 'YOUR_BOT_USERNAME'; // Replace this with your bot username (without @)

    if (newBotToken === 'YOUR_NEW_BOT_TOKEN') {
      console.log('\n⚠️  Please update the script with your actual bot token:');
      console.log('1. Edit this file: update-telegram-token.js');
      console.log('2. Replace "YOUR_NEW_BOT_TOKEN" with your actual bot token');
      console.log('3. Replace "YOUR_BOT_USERNAME" with your bot username');
      console.log('4. Run the script again');
      return;
    }

    console.log('\n🔧 Updating bot token...');

    const updatedConfig = await prisma.communicationConfig.update({
      where: { id: config.id },
      data: {
        telegramBotToken: newBotToken,
        telegramBotUsername: newBotUsername,
      }
    });

    console.log('✅ Bot token updated successfully!');
    console.log('📊 New configuration:');
    console.log('- Bot token configured:', updatedConfig.telegramBotToken ? 'Yes' : 'No');
    console.log('- Bot username:', updatedConfig.telegramBotUsername || 'Not set');

    // Test the new token
    console.log('\n🔧 Testing new bot token...');
    try {
      const response = await fetch(`https://api.telegram.org/bot${newBotToken}/getMe`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          console.log('✅ New bot token is valid!');
          console.log('Bot ID:', data.result.id);
          console.log('Bot Username:', data.result.username);
          console.log('Bot Name:', data.result.first_name);
        } else {
          console.log('❌ New bot token validation failed');
          console.log('Error:', data.description);
        }
      } else {
        const errorText = await response.text();
        console.log('❌ New bot token validation failed');
        console.log('Status:', response.status);
        console.log('Error:', errorText);
      }
    } catch (error) {
      console.error('❌ Error testing new bot token:', error);
    }

  } catch (error) {
    console.error('❌ Error updating Telegram token:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTelegramToken();
