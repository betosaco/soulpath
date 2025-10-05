const { PrismaClient } = require('@prisma/client');

async function testDB() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Testing database connection...');

    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          telegram_chat_id: true,
          telegram_username: true,
          role: true
        },
        take: 3
      });

      console.log('📋 Sample users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - Telegram: ${user.telegram_chat_id || 'none'}`);
      });
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();
