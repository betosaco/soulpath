import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupAdminTelegram() {
  try {
    console.log('🔧 Setting up admin Telegram notifications...');

    // Step 1: Find admin user
    const adminEmail = 'betosaco@gmail.com'; // Update this with your admin email
    const adminUser = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    if (!adminUser) {
      console.log(`❌ Admin user with email ${adminEmail} not found`);
      console.log('📝 Please update the adminEmail variable in this script with your admin email');
      return;
    }

    console.log(`✅ Found admin user: ${adminUser.email} (ID: ${adminUser.id})`);

    // Step 2: Check existing Telegram users
    const existingTelegramUsers = await prisma.telegramUser.findMany({
      include: { user: true }
    });

    console.log('\n📱 Existing Telegram Users:');
    existingTelegramUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.user?.email || 'No email'} - Chat ID: ${user.telegramChatId} - Active: ${user.isActive}`);
    });

    // Step 3: Check if admin has Telegram user
    const adminTelegramUser = existingTelegramUsers.find(tu => tu.userId === adminUser.id);

    if (!adminTelegramUser) {
      console.log('\n👑 Admin does not have a Telegram user entry');

      // Create admin Telegram user entry with placeholder chat ID
      // This will be updated when admin registers with the bot
      await prisma.telegramUser.create({
        data: {
          userId: adminUser.id,
          telegramChatId: 'PLACEHOLDER_ADMIN_CHAT_ID', // This will be updated
          isActive: true,
          lastInteraction: new Date()
        }
      });

      console.log('✅ Created placeholder Telegram user entry for admin');
      console.log('⚠️  Admin needs to register with the bot to get the actual Chat ID');
    } else {
      console.log(`\n👑 Admin already has Telegram user entry with Chat ID: ${adminTelegramUser.telegramChatId}`);
    }

    // Step 4: Provide setup instructions
    console.log('\n🎯 TO COMPLETE THE SETUP:');
    console.log('');
    console.log('1. Environment Variables (set in Vercel):');
    console.log('   TELEGRAM_BOT_TOKEN = 8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU');
    console.log('   TELEGRAM_CHAT_ID = [Admin Chat ID from step 2]');
    console.log('');
    console.log('2. Get Admin Chat ID:');
    console.log('   - Open Telegram and go to @matmaxworld_bot');
    console.log('   - Send the command: /register');
    console.log('   - The bot will reply with your Chat ID');
    console.log('   - Copy that number and set it as TELEGRAM_CHAT_ID in Vercel');
    console.log('');
    console.log('3. Update the placeholder in database:');
    console.log('   - After getting the Chat ID, run this command:');
    console.log(`   UPDATE telegram_users SET telegram_chat_id = 'YOUR_CHAT_ID' WHERE user_id = '${adminUser.id}';`);
    console.log('');
    console.log('4. Test the notifications:');
    console.log('   - Place a test order');
    console.log('   - Check if admin receives Telegram notification');
    console.log('');
    console.log('📱 CURRENT STATUS:');
    console.log(`   - Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Configured' : '❌ Not set in Vercel'}`);
    console.log(`   - Admin Chat ID: ${process.env.TELEGRAM_CHAT_ID ? '✅ Configured' : '❌ Not set in Vercel'}`);
    console.log(`   - Admin Linked: ${adminTelegramUser ? '✅ Yes' : '❌ No (needs to register with bot)'}`);
    console.log(`   - User Notifications: ${existingTelegramUsers.filter(u => u.telegramChatId && u.telegramChatId !== 'PLACEHOLDER_ADMIN_CHAT_ID').length} users linked`);

  } catch (error) {
    console.error('❌ Error setting up admin Telegram:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminTelegram();

