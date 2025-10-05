/**
 * Script to add email provider columns to the database
 */

const { PrismaClient } = require('@prisma/client');

async function addEmailColumns() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Adding email provider columns...');

    // Add email provider and resend API key columns
    await prisma.$executeRaw`
      ALTER TABLE communication_config
      ADD COLUMN IF NOT EXISTS email_provider TEXT DEFAULT 'brevo',
      ADD COLUMN IF NOT EXISTS resend_api_key TEXT DEFAULT ''
    `;

    // Add comments for documentation
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.email_provider IS 'Email service provider (brevo or resend)'`;
    await prisma.$executeRaw`COMMENT ON COLUMN communication_config.resend_api_key IS 'Resend email service API key'`;

    // Verify the columns were added
    console.log('🔍 Verifying email columns were added...');
    const columns = await prisma.$queryRaw`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'communication_config'
      AND column_name IN ('email_provider', 'resend_api_key')
      ORDER BY column_name
    `;

    console.log('✅ Email provider columns added successfully!');
    console.table(columns);

  } catch (error) {
    console.error('❌ Failed to add email columns:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addEmailColumns();
