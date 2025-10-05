/**
 * Script to add telegram fields to the User table
 */

const { PrismaClient } = require('@prisma/client');

async function addUserTelegramFields() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Adding telegram fields to User table...');

    // Add telegram fields to users table
    await prisma.$executeRaw`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT,
      ADD COLUMN IF NOT EXISTS telegram_username TEXT
    `;

    console.log('✅ Telegram fields added to User table successfully!');

  } catch (error) {
    console.error('❌ Failed to add telegram fields:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addUserTelegramFields();
