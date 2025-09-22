#!/bin/bash

# Telegram Bot Service - Webhook Setup Script
# This script configures the Telegram webhook for the deployed bot service

echo "🔗 Setting up Telegram Webhook..."
echo "================================="

# Get the Vercel URL
if [ -z "$TELEGRAM_WEBHOOK_URL" ]; then
    echo "Enter your Vercel deployment URL (e.g., https://telegram-bot-service.vercel.app):"
    read -r TELEGRAM_WEBHOOK_URL
fi

if [ -z "$TELEGRAM_WEBHOOK_URL" ]; then
    echo "❌ Vercel URL is required"
    exit 1
fi

# Ensure URL ends with /api/telegram/webhook
if [[ ! "$TELEGRAM_WEBHOOK_URL" =~ /api/telegram/webhook$ ]]; then
    TELEGRAM_WEBHOOK_URL="${TELEGRAM_WEBHOOK_URL}/api/telegram/webhook"
fi

# Get bot token from environment or ask for it
BOT_TOKEN=${TELEGRAM_BOT_TOKEN:-"8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU"}

if [ "$BOT_TOKEN" = "8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU" ]; then
    echo "Using default bot token. Set TELEGRAM_BOT_TOKEN environment variable to override."
else
    echo "Using bot token from environment variable."
fi

echo "🔧 Configuring webhook: $TELEGRAM_WEBHOOK_URL"

# Set the webhook
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${TELEGRAM_WEBHOOK_URL}\", \"allowed_updates\": [\"message\", \"callback_query\"]}")

# Check if successful
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Webhook configured successfully!"

    # Get webhook info to verify
    echo "🔍 Verifying webhook configuration..."
    WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")

    WEBHOOK_URL=$(echo "$WEBHOOK_INFO" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    PENDING_UPDATES=$(echo "$WEBHOOK_INFO" | grep -o '"pending_update_count":[0-9]*' | cut -d':' -f2)

    echo "📋 Webhook Info:"
    echo "   URL: $WEBHOOK_URL"
    echo "   Pending Updates: $PENDING_UPDATES"

    echo ""
    echo "🧪 Test your bot:"
    echo "   • Send /start to your bot on Telegram"
    echo "   • Send /register to see linking instructions"
    echo "   • Ask about packages to see responses"
    echo ""
    echo "📱 Bot Status:"
    echo "   curl 'https://api.telegram.org/bot${BOT_TOKEN}/getMe'"
    echo ""
    echo "🔗 Webhook Status:"
    echo "   curl 'https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo'"

else
    echo "❌ Failed to configure webhook"
    echo "Response: $RESPONSE"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check if the URL is accessible: curl '$TELEGRAM_WEBHOOK_URL'"
    echo "2. Verify bot token is correct"
    echo "3. Check Vercel function logs"
    exit 1
fi
