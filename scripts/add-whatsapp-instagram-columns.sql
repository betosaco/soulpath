-- Add WhatsApp and Instagram columns to communication_config table
-- Run this script manually or through your database admin tool

-- Add Telegram columns (if not already added)
ALTER TABLE communication_config
ADD COLUMN IF NOT EXISTS telegram_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS telegram_bot_token TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS telegram_webhook_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS telegram_chat_ids JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS telegram_username TEXT DEFAULT 'MatMaxYogaBot';

-- Add WhatsApp columns
ALTER TABLE communication_config
ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_business_account_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS whatsapp_access_token TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS whatsapp_webhook_verify_token TEXT DEFAULT '';

-- Add Instagram columns
ALTER TABLE communication_config
ADD COLUMN IF NOT EXISTS instagram_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS instagram_access_token TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS instagram_business_account_id TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS instagram_webhook_verify_token TEXT DEFAULT '';

-- Add comments for documentation
COMMENT ON COLUMN communication_config.telegram_enabled IS 'Enable Telegram bot integration';
COMMENT ON COLUMN communication_config.telegram_bot_token IS 'Telegram bot API token';
COMMENT ON COLUMN communication_config.telegram_webhook_url IS 'Telegram webhook URL for receiving messages';
COMMENT ON COLUMN communication_config.telegram_chat_ids IS 'Array of Telegram chat IDs for notifications';
COMMENT ON COLUMN communication_config.telegram_username IS 'Telegram bot username';
COMMENT ON COLUMN communication_config.whatsapp_enabled IS 'Enable WhatsApp Business API integration';
COMMENT ON COLUMN communication_config.whatsapp_business_account_id IS 'WhatsApp Business Account ID';
COMMENT ON COLUMN communication_config.whatsapp_access_token IS 'WhatsApp API access token';
COMMENT ON COLUMN communication_config.whatsapp_phone_number_id IS 'WhatsApp Phone Number ID';
COMMENT ON COLUMN communication_config.whatsapp_webhook_verify_token IS 'WhatsApp webhook verification token';
COMMENT ON COLUMN communication_config.instagram_enabled IS 'Enable Instagram Business API integration';
COMMENT ON COLUMN communication_config.instagram_access_token IS 'Instagram API access token';
COMMENT ON COLUMN communication_config.instagram_business_account_id IS 'Instagram Business Account ID';
COMMENT ON COLUMN communication_config.instagram_webhook_verify_token IS 'Instagram webhook verification token';

-- Verify the columns were added
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'communication_config'
AND column_name LIKE '%telegram%' OR column_name LIKE '%whatsapp%' OR column_name LIKE '%instagram%'
ORDER BY column_name;