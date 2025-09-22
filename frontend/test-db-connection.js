import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Test Telegram users table
    const telegramUserCount = await prisma.telegramUser.count();
    console.log(`📱 Total Telegram users in database: ${telegramUserCount}`);
    
    // Get all Telegram users
    const telegramUsers = await prisma.telegramUser.findMany({
      select: {
        id: true,
        userId: true,
        telegramChatId: true,
        isActive: true
      }
    });
    
    console.log('\n📱 Telegram users found:');
    telegramUsers.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, UserID: ${user.userId}, ChatID: ${user.telegramChatId}, Active: ${user.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
