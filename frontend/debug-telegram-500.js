#!/usr/bin/env node

/**
 * Debug the Telegram 500 error
 */

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function debugTelegram500() {
  console.log('🔍 Debugging Telegram 500 Error\n');

  try {
    // Get admin user for authentication
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('❌ No admin user found');
      return;
    }

    console.log('👤 Admin user found:', adminUser.email);

    // Create a test JWT token
    const testToken = jwt.sign(
      { 
        userId: adminUser.id, 
        email: adminUser.email, 
        role: adminUser.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('🔑 Test token created');

    // Test Telegram endpoint with detailed error handling
    console.log('\n📱 Testing Telegram endpoint with detailed debugging...');
    
    try {
      const telegramResponse = await fetch('http://localhost:3000/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          type: 'telegram',
          chatId: '123456789', // This will fail but we can see the exact error
          message: 'Test message from debug script'
        })
      });

      console.log('Telegram test status:', telegramResponse.status);
      
      if (telegramResponse.ok) {
        const telegramData = await telegramResponse.json();
        console.log('✅ Telegram test successful!');
        console.log('Response:', telegramData);
      } else {
        const errorText = await telegramResponse.text();
        console.log('❌ Telegram test failed');
        console.log('Status:', telegramResponse.status);
        console.log('Error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.log('Parsed error:', errorData);
          
          if (errorData.details) {
            console.log('Error details:', errorData.details);
          }
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
      }
    } catch (error) {
      console.log('❌ Network error testing Telegram:', error.message);
    }

    // Test with a valid chat ID if we can find one
    console.log('\n🔍 Checking for valid chat IDs...');
    try {
      const config = await prisma.communicationConfig.findFirst();
      if (config && config.telegramBotToken) {
        console.log('🤖 Testing bot token directly...');
        
        const botResponse = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getMe`);
        if (botResponse.ok) {
          const botData = await botResponse.json();
          if (botData.ok) {
            console.log('✅ Bot token is valid!');
            console.log('Bot username:', botData.result.username);
            console.log('Bot ID:', botData.result.id);
            
            // Try to get updates to find valid chat IDs
            console.log('\n📱 Checking for recent updates...');
            const updatesResponse = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/getUpdates`);
            if (updatesResponse.ok) {
              const updatesData = await updatesResponse.json();
              if (updatesData.ok && updatesData.result.length > 0) {
                console.log('✅ Found recent updates!');
                console.log('Number of updates:', updatesData.result.length);
                
                // Extract chat IDs
                const chatIds = new Set();
                updatesData.result.forEach(update => {
                  if (update.message && update.message.chat) {
                    chatIds.add(update.message.chat.id);
                    console.log('Found chat ID:', update.message.chat.id);
                    console.log('Chat type:', update.message.chat.type);
                    console.log('From user:', update.message.from.username || update.message.from.first_name);
                  }
                });
                
                if (chatIds.size > 0) {
                  console.log('\n🧪 Testing with a real chat ID...');
                  const realChatId = Array.from(chatIds)[0];
                  console.log('Using chat ID:', realChatId);
                  
                  try {
                    const realTestResponse = await fetch('http://localhost:3000/api/admin/communication/test', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${testToken}`
                      },
                      body: JSON.stringify({
                        type: 'telegram',
                        chatId: realChatId.toString(),
                        message: 'Test message with real chat ID'
                      })
                    });

                    console.log('Real test status:', realTestResponse.status);
                    const realTestData = await realTestResponse.text();
                    console.log('Real test response:', realTestData);
                  } catch (error) {
                    console.log('Error with real chat ID:', error.message);
                  }
                } else {
                  console.log('⚠️  No chat IDs found in updates');
                  console.log('To get a chat ID:');
                  console.log('1. Start a chat with your bot');
                  console.log('2. Send /start to the bot');
                  console.log('3. Send a message to the bot');
                  console.log('4. Run this script again');
                }
              } else {
                console.log('⚠️  No recent updates found');
                console.log('Make sure to start a chat with your bot first');
              }
            }
          } else {
            console.log('❌ Bot token validation failed');
            console.log('Error:', botData.description);
          }
        } else {
          console.log('❌ Bot token is invalid (404 error)');
          console.log('You need to get a new bot token from @BotFather');
        }
      } else {
        console.log('❌ No Telegram bot token configured');
      }
    } catch (error) {
      console.log('❌ Error checking bot token:', error.message);
    }

  } catch (error) {
    console.error('❌ Error debugging Telegram 500:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTelegram500();
