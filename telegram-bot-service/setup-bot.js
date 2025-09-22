#!/usr/bin/env node

/**
 * Telegram Bot Service Setup Script
 * Sets up the bot service and database connections
 */

import { PrismaClient } from '@prisma/client';
import { TelegramBotService } from './services/telegram-bot-service.js';

const prisma = new PrismaClient();
const botService = new TelegramBotService();

async function setupBot() {
  console.log('🤖 Setting up Telegram Bot Service...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test 2: Telegram Bot Connection
    console.log('\n2️⃣ Testing Telegram bot connection...');
    try {
      const botInfoResponse = await fetch(`https://api.telegram.org/bot${botService.botToken}/getMe`);
      const botInfo = await botInfoResponse.json();

      if (botInfo.ok) {
        console.log('✅ Bot connection successful');
        console.log(`   Bot Name: ${botInfo.result.first_name}`);
        console.log(`   Username: @${botInfo.result.username}`);
        console.log(`   ID: ${botInfo.result.id}`);
      } else {
        console.log('❌ Bot connection failed');
        console.log(`   Error: ${botInfo.description}`);
        return;
      }
    } catch (error) {
      console.log('❌ Bot connection failed');
      console.log(`   Error: ${error.message}`);
      return;
    }

    // Test 3: Check Database Tables
    console.log('\n3️⃣ Checking database tables...');
    try {
      // Check if telegram_users table exists by trying to count records
      const userCount = await prisma.telegramUser.count();
      console.log('✅ Telegram users table exists');
      console.log(`   Current linked users: ${userCount}`);
    } catch (error) {
      console.log('⚠️ Telegram users table might not exist');
      console.log('   Run the migration: npx prisma db push');
    }

    // Test 4: Webhook Status
    console.log('\n4️⃣ Checking webhook status...');
    try {
      const webhookResponse = await fetch(`https://api.telegram.org/bot${botService.botToken}/getWebhookInfo`);
      const webhookInfo = await webhookResponse.json();

      if (webhookInfo.ok) {
        console.log('✅ Webhook info retrieved');
        console.log(`   URL: ${webhookInfo.result.url || 'Not set'}`);
        console.log(`   Pending Updates: ${webhookInfo.result.pending_update_count || 0}`);

        if (!webhookInfo.result.url) {
          console.log('\n⚠️ Webhook not configured!');
          console.log('   Run: ./setup-webhook.sh');
        }
      }
    } catch (error) {
      console.log('❌ Failed to check webhook status');
      console.log(`   Error: ${error.message}`);
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Deploy to Vercel: npm run deploy');
    console.log('2. Set up webhook: ./setup-webhook.sh');
    console.log('3. Test the bot: npm run test');
    console.log('4. Integrate with main app for order notifications');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your DATABASE_URL environment variable');
    console.error('2. Verify the database is running and accessible');
    console.error('3. Check your TELEGRAM_BOT_TOKEN');
    console.error('4. Run: npm install');
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupBot().catch(console.error);
}

export { setupBot };
