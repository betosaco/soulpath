const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTelegramUserLookup() {
  try {
    console.log('🔍 Testing Telegram user lookup...');
    
    // Check if business user exists
    const businessUser = await prisma.user.findFirst({
      where: { email: 'info@matmax.store' },
      select: { id: true, email: true, fullName: true }
    });

    console.log('🏢 Business user lookup result:', businessUser ? 'Found' : 'Not found');
    if (businessUser) {
      console.log('   User ID:', businessUser.id);
      console.log('   Email:', businessUser.email);
      console.log('   Name:', businessUser.fullName);
    }

    if (businessUser) {
      // Check if telegram user exists
      const telegramUser = await prisma.telegramUser.findFirst({
        where: { 
          userId: businessUser.id,
          isActive: true
        }
      });

      console.log('📱 Telegram user lookup result:', telegramUser ? 'Found' : 'Not found');
      if (telegramUser) {
        console.log('   Telegram Chat ID:', telegramUser.telegramChatId);
        console.log('   Telegram User ID:', telegramUser.telegramUserId);
        console.log('   Username:', telegramUser.telegramUsername);
        console.log('   First Name:', telegramUser.telegramFirstName);
        console.log('   Is Active:', telegramUser.isActive);
      } else {
        console.log('❌ No Telegram user found for business account');
        console.log('   This means the business account needs to be linked to Telegram');
      }
    } else {
      console.log('❌ Business user not found');
      console.log('   Need to create a user with email: info@matmax.store');
    }

  } catch (error) {
    console.error('❌ Error testing Telegram user lookup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTelegramUserLookup();


