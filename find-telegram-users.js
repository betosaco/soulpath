const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findTelegramUsers() {
  try {
    console.log('🔍 Searching for all Telegram users in database...\n');
    
    // Find all Telegram users
    const telegramUsers = await prisma.telegramUser.findMany({
      select: {
        id: true,
        userId: true,
        telegramChatId: true,
        telegramUserId: true,
        telegramUsername: true,
        telegramFirstName: true,
        telegramLastName: true,
        isActive: true,
        lastInteraction: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📱 Found ${telegramUsers.length} Telegram users:`);
    console.log('=' .repeat(80));
    
    telegramUsers.forEach((user, index) => {
      console.log(`${index + 1}. Telegram User ID: ${user.id}`);
      console.log(`   Database User ID: ${user.userId}`);
      console.log(`   Telegram Chat ID: ${user.telegramChatId}`);
      console.log(`   Telegram User ID: ${user.telegramUserId}`);
      console.log(`   Username: @${user.telegramUsername || 'N/A'}`);
      console.log(`   Name: ${user.telegramFirstName || ''} ${user.telegramLastName || ''}`);
      console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
      console.log(`   Last Interaction: ${user.lastInteraction || 'Never'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('-'.repeat(80));
    });

    // Find the business user
    console.log('\n🏢 Looking for business user (info@matmax.store)...');
    const businessUser = await prisma.user.findFirst({
      where: { email: 'info@matmax.store' },
      select: { id: true, email: true, fullName: true }
    });

    if (businessUser) {
      console.log(`✅ Business user found: ${businessUser.id} (${businessUser.email})`);
      
      // Check if this business user has a Telegram account
      const businessTelegramUser = telegramUsers.find(tu => tu.userId === businessUser.id);
      if (businessTelegramUser) {
        console.log(`✅ Business user HAS Telegram account: ${businessTelegramUser.telegramChatId}`);
      } else {
        console.log(`❌ Business user does NOT have Telegram account`);
        console.log('   This is why Telegram notifications are not working!');
      }
    } else {
      console.log('❌ Business user not found');
    }

    // Show any Telegram users without associated database users
    console.log('\n🔍 Checking for orphaned Telegram users...');
    const orphanedTelegramUsers = telegramUsers.filter(tu => !tu.userId);
    if (orphanedTelegramUsers.length > 0) {
      console.log(`Found ${orphanedTelegramUsers.length} orphaned Telegram users:`);
      orphanedTelegramUsers.forEach(user => {
        console.log(`   - Chat ID: ${user.telegramChatId}, Username: @${user.telegramUsername || 'N/A'}`);
      });
    } else {
      console.log('✅ No orphaned Telegram users found');
    }

  } catch (error) {
    console.error('❌ Error searching for Telegram users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findTelegramUsers();
