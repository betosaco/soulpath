import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🔄 Starting Telegram Users table migration...');

    // Check if table already exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'telegram_users'
      )
    `;

    if (tableExists[0].exists) {
      console.log('✅ Telegram users table already exists');

      // Check if user's Chat ID is stored
      const telegramUsers = await prisma.$queryRaw`
        SELECT * FROM telegram_users WHERE telegram_chat_id = '6894679353'
      `;

      console.log('📊 User configuration status:', {
        configured: telegramUsers.length > 0,
        record: telegramUsers[0] || null
      });

      return;
    }

    console.log('📝 Creating telegram_users table...');

    // Run migration SQL statements one by one
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS telegram_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          telegram_chat_id TEXT NOT NULL,
          telegram_user_id TEXT,
          telegram_username TEXT,
          telegram_first_name TEXT,
          telegram_last_name TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          last_interaction TIMESTAMP WITH TIME ZONE,
          notification_preferences JSONB DEFAULT '{"order_confirmations": true, "status_updates": true, "marketing": false}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id),
          UNIQUE(telegram_chat_id)
      )`,

      `CREATE INDEX IF NOT EXISTS idx_telegram_users_user_id ON telegram_users(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_telegram_users_chat_id ON telegram_users(telegram_chat_id)`,
      `CREATE INDEX IF NOT EXISTS idx_telegram_users_active ON telegram_users(is_active)`,
      `CREATE INDEX IF NOT EXISTS idx_telegram_users_last_interaction ON telegram_users(last_interaction)`,

      `CREATE OR REPLACE FUNCTION update_telegram_users_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql`,

      `CREATE TRIGGER trigger_update_telegram_users_updated_at
          BEFORE UPDATE ON telegram_users
          FOR EACH ROW
          EXECUTE FUNCTION update_telegram_users_updated_at()`,

      `COMMENT ON TABLE telegram_users IS 'Links system users with their Telegram chat IDs for notifications'`,
      `COMMENT ON COLUMN telegram_users.user_id IS 'Reference to the User table'`,
      `COMMENT ON COLUMN telegram_users.telegram_chat_id IS 'Telegram chat ID for sending messages'`,
      `COMMENT ON COLUMN telegram_users.telegram_user_id IS 'Telegram user ID'`,
      `COMMENT ON COLUMN telegram_users.telegram_username IS 'Telegram username (optional)'`,
      `COMMENT ON COLUMN telegram_users.telegram_first_name IS 'User first name from Telegram'`,
      `COMMENT ON COLUMN telegram_users.telegram_last_name IS 'User last name from Telegram'`,
      `COMMENT ON COLUMN telegram_users.is_active IS 'Whether this Telegram link is active'`,
      `COMMENT ON COLUMN telegram_users.last_interaction IS 'Last time user interacted with bot'`,
      `COMMENT ON COLUMN telegram_users.notification_preferences IS 'User notification preferences as JSON'`
    ];

    // Execute each statement
    for (let i = 0; i < sqlStatements.length; i++) {
      console.log(`⚡ Executing statement ${i + 1}/${sqlStatements.length}...`);
      await prisma.$queryRawUnsafe(sqlStatements[i]);
    }

    console.log('✅ Telegram users table created successfully!');

    // Verify table creation
    const verifyTable = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'telegram_users'
      )
    `;

    if (verifyTable[0].exists) {
      console.log('🎉 Migration completed and verified!');
    } else {
      throw new Error('Table creation verification failed');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
