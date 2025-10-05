import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTelegramConfig() {
  try {
    console.log('🔧 Fixing Telegram configuration...');

    // Check if telegram_config table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'telegram_config'
      );
    `;

    console.log('📊 telegram_config table exists:', tableExists[0].exists);

    if (!tableExists[0].exists) {
      console.log('🔧 Creating telegram_config table...');
      
      await prisma.$executeRaw`
        CREATE TABLE telegram_config (
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
        CREATE INDEX idx_telegram_config_active ON telegram_config(is_active);
      `;
      
      await prisma.$executeRaw`
        CREATE INDEX idx_telegram_config_updated ON telegram_config(updated_at);
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

      console.log('✅ telegram_config table created successfully!');
    }

    // Check current records
    const count = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM telegram_config;
    `;
    
    console.log('📊 Current records in telegram_config:', count[0].count);

    // Test insert/update
    console.log('🧪 Testing insert/update functionality...');
    
    const testData = {
      bot_token: 'test-token-123',
      webhook_url: 'https://test.com/webhook',
      is_active: false,
      bot_username: 'testbot',
      bot_name: 'Test Bot',
      webhook_set: false,
      last_webhook_error: null
    };

    // Try to insert or update
    const result = await prisma.$executeRaw`
      INSERT INTO telegram_config (bot_token, webhook_url, is_active, bot_username, bot_name, webhook_set, last_webhook_error)
      VALUES (${testData.bot_token}, ${testData.webhook_url}, ${testData.is_active}, ${testData.bot_username}, ${testData.bot_name}, ${testData.webhook_set}, ${testData.last_webhook_error})
      ON CONFLICT (id) DO UPDATE SET
        bot_token = EXCLUDED.bot_token,
        webhook_url = EXCLUDED.webhook_url,
        is_active = EXCLUDED.is_active,
        bot_username = EXCLUDED.bot_username,
        bot_name = EXCLUDED.bot_name,
        webhook_set = EXCLUDED.webhook_set,
        last_webhook_error = EXCLUDED.last_webhook_error,
        updated_at = NOW();
    `;

    console.log('✅ Test insert/update successful!');

    // Clean up test data
    await prisma.$executeRaw`
      DELETE FROM telegram_config WHERE bot_token = 'test-token-123';
    `;

    console.log('🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Error fixing Telegram config:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixTelegramConfig()
  .then(() => {
    console.log('🎉 Telegram configuration fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fix failed:', error);
    process.exit(1);
  });
