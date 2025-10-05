/**
 * Script to run the WhatsApp and Instagram database migration
 * This safely adds the new columns without resetting the database
 */

import { PrismaClient } from '@prisma/client';

async function runMigration() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Starting WhatsApp and Instagram migration...');

    // Add Telegram columns (if not already added)
    console.log('📱 Adding Telegram columns...');
    await prisma.$executeRaw`
      ALTER TABLE communication_config
      ADD COLUMN IF NOT EXISTS telegram_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS telegram_bot_token TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS telegram_webhook_url TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS telegram_chat_ids JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS telegram_username TEXT DEFAULT 'MatMaxYogaBot'
    `;

    // Add WhatsApp columns
    console.log('💬 Adding WhatsApp columns...');
    await prisma.$executeRaw`
      ALTER TABLE communication_config
      ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS whatsapp_business_account_id TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS whatsapp_access_token TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS whatsapp_webhook_verify_token TEXT DEFAULT ''
    `;

    // Add Instagram columns
    console.log('📷 Adding Instagram columns...');
    await prisma.$executeRaw`
      ALTER TABLE communication_config
      ADD COLUMN IF NOT EXISTS instagram_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS instagram_access_token TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS instagram_business_account_id TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS instagram_webhook_verify_token TEXT DEFAULT ''
    `;

    // Add comments
    console.log('📝 Adding column comments...');
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.telegram_enabled IS 'Enable Telegram bot integration'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.telegram_bot_token IS 'Telegram bot API token'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.telegram_webhook_url IS 'Telegram webhook URL for receiving messages'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.telegram_chat_ids IS 'Array of Telegram chat IDs for notifications'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.telegram_username IS 'Telegram bot username'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.whatsapp_enabled IS 'Enable WhatsApp Business API integration'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.whatsapp_business_account_id IS 'WhatsApp Business Account ID'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.whatsapp_access_token IS 'WhatsApp API access token'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.whatsapp_phone_number_id IS 'WhatsApp Phone Number ID'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.whatsapp_webhook_verify_token IS 'WhatsApp webhook verification token'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.instagram_enabled IS 'Enable Instagram Business API integration'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.instagram_access_token IS 'Instagram API access token'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.instagram_business_account_id IS 'Instagram Business Account ID'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.instagram_webhook_verify_token IS 'Instagram webhook verification token'`;

    // Verify columns were added
    console.log('🔍 Verifying columns were added...');
    const columns = await prisma.$queryRaw`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'communication_config'
      AND (column_name LIKE '%telegram%' OR column_name LIKE '%whatsapp%' OR column_name LIKE '%instagram%')
      ORDER BY column_name
    `;

    console.log('✅ Migration completed successfully!');
    console.log('📊 New columns added:', columns.length);
    console.table(columns);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
