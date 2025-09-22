-- Create telegram_users table for storing user Telegram chat information
-- This table links system users with their Telegram chat IDs for sending notifications

CREATE TABLE IF NOT EXISTS telegram_users (
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_telegram_users_user_id ON telegram_users(user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_users_chat_id ON telegram_users(telegram_chat_id);
CREATE INDEX IF NOT EXISTS idx_telegram_users_active ON telegram_users(is_active);
CREATE INDEX IF NOT EXISTS idx_telegram_users_last_interaction ON telegram_users(last_interaction);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_telegram_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_telegram_users_updated_at
    BEFORE UPDATE ON telegram_users
    FOR EACH ROW
    EXECUTE FUNCTION update_telegram_users_updated_at();

-- Add comments for documentation
COMMENT ON TABLE telegram_users IS 'Links system users with their Telegram chat IDs for notifications';
COMMENT ON COLUMN telegram_users.user_id IS 'Reference to the User table';
COMMENT ON COLUMN telegram_users.telegram_chat_id IS 'Telegram chat ID for sending messages';
COMMENT ON COLUMN telegram_users.telegram_user_id IS 'Telegram user ID';
COMMENT ON COLUMN telegram_users.telegram_username IS 'Telegram username (optional)';
COMMENT ON COLUMN telegram_users.telegram_first_name IS 'User first name from Telegram';
COMMENT ON COLUMN telegram_users.telegram_last_name IS 'User last name from Telegram';
COMMENT ON COLUMN telegram_users.is_active IS 'Whether this Telegram link is active';
COMMENT ON COLUMN telegram_users.last_interaction IS 'Last time user interacted with bot';
COMMENT ON COLUMN telegram_users.notification_preferences IS 'User notification preferences as JSON';
