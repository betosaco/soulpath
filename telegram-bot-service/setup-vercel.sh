#!/bin/bash

# Telegram Bot Service - Vercel Setup Script
# This script sets up the Telegram bot service on Vercel

echo "🤖 Setting up Telegram Bot Service on Vercel..."
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if project is linked to Vercel
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking project to Vercel..."
    vercel link
else
    echo "✅ Project already linked to Vercel"
fi

# Set up environment variables
echo "🔑 Setting up environment variables..."

# Telegram Bot Token
echo "Enter your Telegram Bot Token (from @BotFather):"
read -r TELEGRAM_BOT_TOKEN

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ Bot token is required"
    exit 1
fi

vercel env add TELEGRAM_BOT_TOKEN --environment production << EOF
$TELEGRAM_BOT_TOKEN
EOF

# Database URL
echo "Enter your DATABASE_URL:"
read -r DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Database URL is required"
    exit 1
fi

vercel env add DATABASE_URL --environment production << EOF
$DATABASE_URL
EOF

# Optional: Other environment variables
echo "🔧 Setting up additional environment variables..."

# Node environment
vercel env add NODE_ENV --environment production << EOF
production
EOF

echo "✅ Environment variables configured"
echo ""
echo "🚀 Ready to deploy!"
echo "Run: npm run deploy"
echo ""
echo "📋 After deployment:"
echo "1. Copy the deployment URL"
echo "2. Run the webhook setup script:"
echo "   TELEGRAM_WEBHOOK_URL=<your-vercel-url> ./setup-webhook.sh"
