import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTelegramConfigTable() {
  try {
    console.log('🔧 Creating telegram_config table...');

    // Create the telegram_config table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS telegram_config (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_token TEXT NOT NULL,
          webhook_url TEXT,
          is_active BOOLEAN DEFAULT FALSE,
          bot_username TEXT,
          bot_name TEXT,
          webhook_set BOOLEAN DEFAULT FALSE,
          last_webhook_error TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create indexes
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_telegram_config_active ON telegram_config(is_active);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_telegram_config_updated ON telegram_config(updated_at);
    `;

    // Create trigger function
    await prisma.$executeRaw`
      CREATE OR REPLACE FUNCTION update_telegram_config_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    // Create trigger
    await prisma.$executeRaw`
      CREATE TRIGGER trigger_update_telegram_config_updated_at
          BEFORE UPDATE ON telegram_config
          FOR EACH ROW
          EXECUTE FUNCTION update_telegram_config_updated_at();
    `;

    // Add comments
    await prisma.$executeRaw`
      COMMENT ON TABLE telegram_config IS 'Stores Telegram bot configuration and webhook settings';
    `;

    await prisma.$executeRaw`
      COMMENT ON COLUMN telegram_config.bot_token IS 'Telegram bot token from BotFather';
    `;

    await prisma.$executeRaw`
      COMMENT ON COLUMN telegram_config.webhook_url IS 'Webhook URL for receiving Telegram updates';
    `;

    await prisma.$executeRaw`
      COMMENT ON COLUMN telegram_config.is_active IS 'Whether the bot is currently active';
    `;

    console.log('✅ telegram_config table created successfully!');

    // Check if table exists and has data
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM telegram_config;
    `;
    
    console.log('📊 Current records in telegram_config:', result[0].count);

  } catch (error) {
    console.error('❌ Error creating telegram_config table:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
createTelegramConfigTable()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
