const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Testing Prisma client after regeneration...');

    // Test that we can access the new fields
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

  } catch (error) {
    console.error('❌ Prisma error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
