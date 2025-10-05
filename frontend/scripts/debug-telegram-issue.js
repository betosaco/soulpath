import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugTelegramIssue() {
  try {
    console.log('🔍 Debugging Telegram notification issue...');

    // Check Telegram users
    const telegramUsers = await prisma.telegramUser.findMany({
      where: { isActive: true }
    });

    console.log('\n📱 Telegram Users:');
    console.log(`Total active users: ${telegramUsers.length}`);

    telegramUsers.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.telegramId}`);
      console.log(`   User ID: ${user.userId}`);
      console.log(`   Username: ${user.username || 'N/A'}`);
      console.log(`   First Name: ${user.firstName || 'N/A'}`);
      console.log(`   Last Name: ${user.lastName || 'N/A'}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log('');
    });

    // Check recent orders and their Telegram notifications
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('📦 Recent Orders (Last 24 hours):');
    for (const order of recentOrders) {
      const orderAge = Math.floor((Date.now() - order.createdAt.getTime()) / 1000 / 60); // minutes ago
      console.log(`\n${order.orderNumber}`);
      console.log(`  Customer: ${order.customerName} (${order.customerEmail})`);
      console.log(`  Created: ${orderAge} minutes ago`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Payment: ${order.paymentStatus} (${order.paymentMethod})`);

      // Check if this order should have triggered Telegram notifications
      const hasItems = order.items?.length > 0;
      console.log(`  Has items: ${hasItems}`);
      console.log(`  Should send Telegram: ${hasItems && telegramUsers.length > 0}`);
    }

    // Check the Telegram bot configuration
    console.log('\n🤖 Telegram Bot Configuration:');
    console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ SET' : '❌ NOT SET');
    console.log('TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? '✅ SET' : '❌ NOT SET');

    // Check if there's a Telegram service file
    console.log('\n📁 Telegram Service Files:');
    const fs = require('fs');
    const telegramServicePath = './lib/communication/telegram-service.ts';
    const telegramServiceExists = fs.existsSync(telegramServicePath);
    console.log(`Telegram service file exists: ${telegramServiceExists ? '✅' : '❌'}`);

    if (telegramServiceExists) {
      try {
        const content = fs.readFileSync(telegramServicePath, 'utf8');
        const hasBotToken = content.includes('TELEGRAM_BOT_TOKEN');
        const hasChatId = content.includes('TELEGRAM_CHAT_ID');
        console.log(`Service uses TELEGRAM_BOT_TOKEN: ${hasBotToken ? '✅' : '❌'}`);
        console.log(`Service uses TELEGRAM_CHAT_ID: ${hasChatId ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`Error reading service file: ${error.message}`);
      }
    }

    console.log('\n🎯 DIAGNOSIS:');

    if (telegramUsers.length === 0) {
      console.log('❌ No active Telegram users configured');
    }

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.log('❌ TELEGRAM_BOT_TOKEN not configured');
    }

    if (!process.env.TELEGRAM_CHAT_ID) {
      console.log('❌ TELEGRAM_CHAT_ID not configured');
    }

    if (!telegramServiceExists) {
      console.log('❌ Telegram service file missing');
    }

    console.log('\n🔧 CHECK THESE IN VERCEL:');
    console.log('1. TELEGRAM_BOT_TOKEN environment variable');
    console.log('2. TELEGRAM_CHAT_ID environment variable');
    console.log('3. Ensure Telegram service is properly imported');
    console.log('4. Check if email sender changes affected Telegram config');

    console.log('\n📝 POSSIBLE CAUSES:');
    console.log('1. Email sender change might have affected environment variables');
    console.log('2. Telegram bot token expired or changed');
    console.log('3. Chat ID changed when bot was reconfigured');
    console.log('4. Environment variables not updated in Vercel deployment');

  } catch (error) {
    console.error('❌ Error debugging Telegram issue:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTelegramIssue();
