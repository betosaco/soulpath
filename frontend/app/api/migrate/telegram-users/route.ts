import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🔄 Running Telegram Users table migration...');

    // Check if table already exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'telegram_users'
      )
    ` as Array<{ exists: boolean }>;

    if (tableExists[0].exists) {
      console.log('✅ Telegram users table already exists');

      // Check if user's Chat ID is stored
      const telegramUsers = await prisma.$queryRaw`
        SELECT * FROM telegram_users WHERE telegram_chat_id = '6894679353'
      ` as Array<{ telegram_chat_id: string; telegram_username?: string }>;

      return NextResponse.json({
        success: true,
        message: 'Table already exists',
        data: {
          tableExists: true,
          userConfigured: telegramUsers.length > 0,
          record: telegramUsers[0] || null
        }
      });
    }

    // Run migration SQL statements one by one
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS telegram_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
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
    for (const sql of sqlStatements) {
      await prisma.$queryRawUnsafe(sql);
    }

    console.log('✅ Telegram users table created successfully');

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      data: {
        tableCreated: true,
        sqlExecuted: true
      }
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('🔍 Checking Telegram users table status...');

    // Check if table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'telegram_users'
      )
    ` as Array<{ exists: boolean }>;

    let userRecord = null;
    if (tableExists[0].exists) {
      // Check if user's Chat ID is stored
      const telegramUsers = await prisma.$queryRaw`
        SELECT id, user_id, telegram_chat_id, telegram_username, is_active, created_at
        FROM telegram_users
        WHERE telegram_chat_id = '6894679353'
      ` as Array<{ id: number; user_id: string; telegram_chat_id: string; telegram_username?: string; is_active: boolean; created_at: Date }>;
      userRecord = telegramUsers[0] || null;
    }

    return NextResponse.json({
      success: true,
      data: {
        tableExists: tableExists[0].exists,
        userConfigured: userRecord !== null,
        record: userRecord
      }
    });

  } catch (error) {
    console.error('❌ Status check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Status check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
