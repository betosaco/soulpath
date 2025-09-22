const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTelegramUser() {
  try {
    console.log('🔍 Looking up business user...');
    
    // Find the business user
    const businessUser = await prisma.user.findFirst({
      where: { email: 'info@matmax.store' },
      select: { id: true, email: true, fullName: true }
    });

    if (!businessUser) {
      console.log('❌ Business user not found');
      return;
    }

    console.log('✅ Business user found:', businessUser.id, businessUser.email);

    // Check if Telegram user already exists
    const existingTelegramUser = await prisma.telegramUser.findFirst({
      where: { 
        userId: businessUser.id,
        isActive: true
      }
    });

    if (existingTelegramUser) {
      console.log('✅ Telegram user already exists:', existingTelegramUser.telegramChatId);
      return;
    }

    // Create a Telegram user for the business account
    // You'll need to replace this with the actual chat ID from your Telegram bot
    const telegramChatId = 'YOUR_TELEGRAM_CHAT_ID_HERE'; // Replace with actual chat ID
    
    console.log('📱 Creating Telegram user for business account...');
    const telegramUser = await prisma.telegramUser.create({
      data: {
        userId: businessUser.id,
        telegramChatId: telegramChatId,
        telegramUserId: 'business_bot_user',
        telegramUsername: 'matmax_business',
        telegramFirstName: 'MatMax',
        telegramLastName: 'Business',
        isActive: true,
        lastInteraction: new Date()
      }
    });

    console.log('✅ Telegram user created successfully!');
    console.log('   ID:', telegramUser.id);
    console.log('   Chat ID:', telegramUser.telegramChatId);
    console.log('   User ID:', telegramUser.userId);

  } catch (error) {
    console.error('❌ Error creating Telegram user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTelegramUser();
