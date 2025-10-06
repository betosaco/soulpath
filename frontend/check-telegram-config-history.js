#!/usr/bin/env node

/**
 * Check Telegram configuration history and current state
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTelegramConfigHistory() {
  console.log('🔍 Checking Telegram Configuration History\n');

  try {
    // Check current configuration
    const config = await prisma.communicationConfig.findFirst();
    
    if (!config) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Current Configuration:');
    console.log('- ID:', config.id);
    console.log('- Email enabled:', config.emailEnabled);
    console.log('- Email provider:', config.emailProvider);
    console.log('- Brevo API key:', config.brevoApiKey ? 'Set' : 'Not set');
    console.log('- Sender email:', config.senderEmail);
    console.log('- Sender name:', config.senderName);
    console.log('- Admin email:', config.adminEmail);
    console.log('- Telegram enabled:', config.telegramEnabled);
    console.log('- Telegram bot token:', config.telegramBotToken ? 'Set' : 'Not set');
    console.log('- Telegram bot username:', config.telegramBotUsername);
    console.log('- Telegram webhook URL:', config.telegramWebhookUrl);

    console.log('\n🔍 Analysis:');
    console.log('The schema was changed from snake_case to camelCase.');
    console.log('This might have caused a mismatch between the database and the code.');

    console.log('\n🧪 Testing current bot token...');
    if (config.telegramBotToken) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getMe`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            console.log('✅ Current bot token is valid!');
            console.log('Bot ID:', data.result.id);
            console.log('Bot Username:', data.result.username);
            console.log('Bot Name:', data.result.first_name);
            
            // Update the bot username if it's different
            if (data.result.username !== config.telegramBotUsername) {
              console.log('\n🔧 Updating bot username...');
              await prisma.communicationConfig.update({
                where: { id: config.id },
                data: {
                  telegramBotUsername: data.result.username
                }
              });
              console.log('✅ Bot username updated!');
            }
          } else {
            console.log('❌ Current bot token is invalid');
            console.log('Error:', data.description);
          }
        } else {
          console.log('❌ Current bot token is invalid (404 error)');
          console.log('Status:', response.status);
        }
      } catch (error) {
        console.log('❌ Error testing bot token:', error.message);
      }
    } else {
      console.log('❌ No bot token configured');
    }

    console.log('\n📋 What we found:');
    console.log('1. The schema was changed from snake_case to camelCase');
    console.log('2. The database might have old data with snake_case field names');
    console.log('3. The code is now using camelCase field names');
    console.log('4. This could cause a mismatch between the database and the code');

    console.log('\n💡 Solutions:');
    console.log('1. **Check if the bot token is actually set** in the database');
    console.log('2. **Update the bot token** if it\'s missing or invalid');
    console.log('3. **Test the functionality** with the correct token');
    console.log('4. **Verify the field names** match between database and code');

  } catch (error) {
    console.error('❌ Error checking configuration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTelegramConfigHistory();
