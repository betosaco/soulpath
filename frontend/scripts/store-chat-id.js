import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function storeChatId(userId) {
  try {
    console.log(`🔄 Storing Chat ID 6894679353 for user ${userId}...`);

    // Check if Chat ID already exists
    const existing = await prisma.$queryRaw`
      SELECT * FROM telegram_users WHERE telegram_chat_id = '6894679353'
    `;

    if (existing.length > 0) {
      console.log('✅ Chat ID already stored!');
      console.log('📊 Existing record:', existing[0]);
      return;
    }

    // Check if user exists
    const userExists = await prisma.$queryRaw`
      SELECT id, email, full_name FROM users WHERE id = ${userId}
    `;

    if (userExists.length === 0) {
      console.log('❌ User not found!');
      return;
    }

    console.log('👤 Linking to user:', userExists[0]);

    // Insert the Chat ID record
    await prisma.$queryRaw`
      INSERT INTO telegram_users (
        user_id,
        telegram_chat_id,
        telegram_username,
        telegram_first_name,
        is_active,
        last_interaction,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        '6894679353',
        'albertosaco',
        'Alberto',
        true,
        NOW(),
        NOW(),
        NOW()
      )
    `;

    console.log('✅ Chat ID stored successfully!');

    // Verify
    const verify = await prisma.$queryRaw`
      SELECT * FROM telegram_users WHERE telegram_chat_id = '6894679353'
    `;

    console.log('📊 Stored record:', verify[0]);

  } catch (error) {
    console.error('❌ Error storing Chat ID:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// If run directly with user ID as argument
const userId = process.argv[2];
if (userId) {
  storeChatId(userId);
} else {
  console.log('❓ Usage: node scripts/store-chat-id.js <user_id>');
  console.log('📝 Example: node scripts/store-chat-id.js cmfuet98a0004bt2jppqbyosn');
  console.log('');
  console.log('👥 Available users:');
  // Show available users
  const prisma = new PrismaClient();
  prisma.$queryRaw`SELECT id, email, full_name FROM users LIMIT 10`
    .then(users => {
      users.forEach((u, i) => {
        console.log(`  ${i+1}. ${u.email || 'No email'} - ${u.full_name || 'No name'}`);
        console.log(`     ID: ${u.id}`);
      });
    })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
