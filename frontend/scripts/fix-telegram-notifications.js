import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTelegramNotifications() {
  try {
    console.log('🔧 Fixing Telegram notification system...');

    // Step 1: Check current Telegram users
    const telegramUsers = await prisma.telegramUser.findMany({
      include: { user: true }
    });

    console.log('\n📱 Current Telegram Users:');
    telegramUsers.forEach((user, index) => {
      console.log(`${index + 1}. User: ${user.user?.email || 'No email'}`);
      console.log(`   Chat ID: ${user.telegramChatId || 'UNDEFINED ❌'}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Linked: ${user.userId ? '✅' : '❌'}`);
      console.log('');
    });

    // Step 2: Check environment variables
    console.log('🔍 Environment Variables:');
    console.log(`TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`TELEGRAM_CHAT_ID: ${process.env.TELEGRAM_CHAT_ID ? '✅ SET' : '❌ NOT SET'}`);

    // Step 3: Ask user for admin chat ID
    console.log('\n⚠️  IMPORTANT: To fix Telegram notifications, you need to:');
    console.log('');
    console.log('1. Open Telegram and message your bot: @matmaxworld_bot');
    console.log('2. Send the /register command to get your Chat ID');
    console.log('3. Copy the Chat ID number from the bot message');
    console.log('4. Set it as TELEGRAM_CHAT_ID environment variable in Vercel');
    console.log('');
    console.log('📝 Commands to run in Vercel CLI or Dashboard:');
    console.log('vercel env add TELEGRAM_BOT_TOKEN');
    console.log('vercel env add TELEGRAM_CHAT_ID');
    console.log('');
    console.log('🔧 Current bot token (hardcoded in code): 8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU');
    console.log('   (This should be set as TELEGRAM_BOT_TOKEN)');

    // Step 4: Create a temporary admin Telegram user if needed
    const adminEmail = 'betosaco@gmail.com'; // Replace with actual admin email
    const adminUser = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    if (adminUser) {
      // Check if admin already has a Telegram user entry
      const existingAdminTelegram = await prisma.telegramUser.findFirst({
        where: { userId: adminUser.id }
      });

      if (!existingAdminTelegram) {
        console.log('\n👑 Creating admin Telegram user entry (Chat ID will be set when admin registers)');
        await prisma.telegramUser.create({
          data: {
            userId: adminUser.id,
            telegramChatId: null, // Will be set when admin registers with bot
            isActive: true,
            createdAt: new Date(),
            lastInteraction: new Date()
          }
        });
        console.log('✅ Admin Telegram user created - admin needs to register with bot');
      } else {
        console.log('\n👑 Admin Telegram user already exists');
        console.log(`   Chat ID: ${existingAdminTelegram.telegramChatId || 'Not set - admin needs to register'}`);
      }
    } else {
      console.log(`\n❌ Admin user with email ${adminEmail} not found`);
    }

    // Step 5: Provide instructions for fixing the issue
    console.log('\n🎯 TO FIX THE TELEGRAM ISSUE:');
    console.log('');
    console.log('1. Set environment variables in Vercel:');
    console.log('   - TELEGRAM_BOT_TOKEN: 8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU');
    console.log('   - TELEGRAM_CHAT_ID: [Get from bot /register command]');
    console.log('');
    console.log('2. Have admin register with the bot:');
    console.log('   - Go to @matmaxworld_bot on Telegram');
    console.log('   - Send /register command');
    console.log('   - Copy the Chat ID and set as TELEGRAM_CHAT_ID');
    console.log('');
    console.log('3. For user notifications:');
    console.log('   - Users need to link their accounts via the website');
    console.log('   - Go to account settings and click "Telegram Notifications"');
    console.log('');
    console.log('4. Alternative: Modify the code to always send to admin chat as backup');
    console.log('');
    console.log('📱 CURRENT STATUS:');
    console.log(`   - Admin will receive notifications: ${process.env.TELEGRAM_CHAT_ID ? '✅' : '❌ (needs TELEGRAM_CHAT_ID)'}`);
    console.log(`   - Users will receive notifications: ❌ (need to link accounts)`);
    console.log(`   - Bot token configured: ${process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌'}`);

  } catch (error) {
    console.error('❌ Error fixing Telegram notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTelegramNotifications();
