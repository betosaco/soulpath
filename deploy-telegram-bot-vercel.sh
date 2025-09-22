#!/bin/bash

# Telegram Bot Deployment Script for Vercel
# This script deploys the Telegram bot to Vercel and configures the webhook

echo "🤖 Deploying Telegram Bot to Vercel..."
echo "========================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd frontend || { echo "❌ Frontend directory not found"; exit 1; }

# Check if project is linked to Vercel
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking project to Vercel..."
    vercel link
fi

# Set Telegram Bot Token
echo "🔑 Setting up Telegram Bot Token..."
echo "Enter your Telegram Bot Token (from @BotFather):"
read -r TELEGRAM_BOT_TOKEN

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ Bot token is required"
    exit 1
fi

# Add Telegram bot token to Vercel environment
vercel env add TELEGRAM_BOT_TOKEN --environment production << EOF
$TELEGRAM_BOT_TOKEN
EOF

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
DEPLOY_OUTPUT=$(vercel --prod)

# Extract the deployment URL from the output
VERCEL_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*' | head -1)

if [ -z "$VERCEL_URL" ]; then
    echo "❌ Could not extract Vercel URL from deployment output"
    echo "Manual webhook setup required. Please run:"
    echo "python ../backend/setup-telegram-bot.py"
    exit 1
fi

echo "✅ Deployed successfully to: $VERCEL_URL"

# Set webhook URL
WEBHOOK_URL="$VERCEL_URL/api/telegram/webhook"
echo "🔗 Configuring webhook: $WEBHOOK_URL"

# Use the existing setup script to configure the webhook
cd ../backend
python setup-telegram-bot.py << EOF
$WEBHOOK_URL
EOF

echo ""
echo "🎉 Telegram Bot Deployment Complete!"
echo "=================================="
echo ""
echo "📋 Bot Details:"
echo "   • Bot Token: ${TELEGRAM_BOT_TOKEN:0:10}..."
echo "   • Webhook URL: $WEBHOOK_URL"
echo "   • Vercel URL: $VERCEL_URL"
echo ""
echo "🧪 Test Commands:"
echo "   • Send /start to your bot on Telegram"
echo "   • Send /register to link your account"
echo "   • Check webhook: curl '$WEBHOOK_URL'"
echo ""
echo "📊 Monitoring:"
echo "   • Check Vercel dashboard for logs"
echo "   • Monitor bot status: curl 'https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo'"
echo ""
echo "🔧 Useful Commands:"
echo "   • vercel logs              - View deployment logs"
echo "   • vercel env ls            - List environment variables"
echo "   • npm run redis:check      - Test Redis connection"
echo ""
echo "Next: Create an order to test the notification system!"
