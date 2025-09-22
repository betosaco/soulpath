#!/bin/bash

# Setup Telegram Webhook for Vercel Deployment
# This script configures the Telegram webhook after Vercel deployment

echo "🔗 Setting up Telegram Webhook for Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first: npm install -g vercel"
    exit 1
fi

# Navigate to frontend directory
cd frontend || { echo "❌ Frontend directory not found"; exit 1; }

# Get the production URL from Vercel
echo "📡 Getting Vercel deployment URL..."
VERCEL_URL=$(vercel ls --prod | grep -o 'https://[^[:space:]]*' | head -1)

if [ -z "$VERCEL_URL" ]; then
    echo "❌ Could not find Vercel production URL"
    echo "Please provide your Vercel domain manually:"
    read -r VERCEL_URL
fi

if [ -z "$VERCEL_URL" ]; then
    echo "❌ Vercel URL is required"
    exit 1
fi

# Set webhook URL
WEBHOOK_URL="$VERCEL_URL/api/telegram/webhook"
echo "🔗 Configuring webhook: $WEBHOOK_URL"

# Navigate to backend and run setup
cd ../backend
python setup-telegram-bot.py << EOF
$WEBHOOK_URL
EOF

echo ""
echo "✅ Telegram webhook configured successfully!"
echo "📱 Your bot is now ready to receive messages and send order notifications."
echo ""
echo "🧪 Test your bot:"
echo "   • Send /start to @Matmaxcommerce_bot on Telegram"
echo "   • Send /register to link your account"
echo "   • Create a test order to receive notifications"
