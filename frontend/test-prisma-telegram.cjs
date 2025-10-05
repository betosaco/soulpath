const { PrismaClient } = require('@prisma/client');

async function testPrismaTelegram() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Testing Prisma client after regeneration with Telegram fields...');

    // Test that we can access the new Telegram fields
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        telegramChatId: true,
        telegramUsername: true
      }
    });

    if (user) {
      console.log('✅ Prisma client working - Telegram fields accessible');
      console.log('📋 Sample user:', {
        email: user.email,
        telegramChatId: user.telegramChatId,
        telegramUsername: user.telegramUsername
      });
    } else {
      console.log('⚠️ No users found, but Prisma client is working');
    }

    // Also test that we can query users with Telegram data
    const usersWithTelegram = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        telegramChatId: true,
        telegramUsername: true
      },
      take: 3
    });

    console.log(`📋 Found ${usersWithTelegram.length} users with Telegram fields:`);
    usersWithTelegram.forEach(user => {
      console.log(`  - ${user.fullName || user.email}: Chat ID: ${user.telegramChatId || 'null'}, Username: ${user.telegramUsername || 'null'}`);
    });

  } catch (error) {
    console.error('❌ Prisma error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaTelegram();
