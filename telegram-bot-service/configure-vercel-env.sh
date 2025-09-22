#!/bin/bash

# Configure Vercel Environment Variables for Telegram Bot Service
# This script sets up the database URLs and other environment variables

echo "🔧 Configuring Vercel Environment Variables for Telegram Bot Service"
echo "======================================================================"

# Function to URL encode a string
url_encode() {
    local string="$1"
    local encoded=""
    local length="${#string}"
    for (( i = 0; i < length; i++ )); do
        local c="${string:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) encoded+="$c" ;;
            *) printf -v encoded '%s%%%02X' "$encoded" "'$c" ;;
        esac
    done
    echo "$encoded"
}

# Database URLs (provided by user)
DATABASE_URL="postgresql://postgres.kskfipeskxrdfwfwtjum:zx@db.kskfipeskxrdfwfwtjum.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres.kskfipeskxrdfwfwtjum:zx@db.kskfipeskxrdfwfwtjum.supabase.co:5432/postgres"

echo "📋 Database URLs to configure:"
echo "   DATABASE_URL: $DATABASE_URL"
echo "   DIRECT_URL: $DIRECT_URL"
echo ""

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

# Check if we're in a Vercel project
if [ ! -f ".vercel/project.json" ]; then
    echo "❌ Not in a Vercel project. Please run 'vercel link' first."
    exit 1
fi

echo "🔄 Adding environment variables to Vercel..."

# Add DATABASE_URL
echo "Adding DATABASE_URL..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
if [ $? -eq 0 ]; then
    echo "✅ DATABASE_URL added successfully"
else
    echo "❌ Failed to add DATABASE_URL"
fi

# Add DIRECT_URL
echo "Adding DIRECT_URL..."
echo "$DIRECT_URL" | vercel env add DIRECT_URL production
if [ $? -eq 0 ]; then
    echo "✅ DIRECT_URL added successfully"
else
    echo "❌ Failed to add DIRECT_URL"
fi

# Add TELEGRAM_BOT_TOKEN (if not already set)
echo "Checking TELEGRAM_BOT_TOKEN..."
if ! vercel env ls | grep -q "TELEGRAM_BOT_TOKEN"; then
    echo "Adding TELEGRAM_BOT_TOKEN..."
    echo "8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU" | vercel env add TELEGRAM_BOT_TOKEN production
    if [ $? -eq 0 ]; then
        echo "✅ TELEGRAM_BOT_TOKEN added successfully"
    else
        echo "❌ Failed to add TELEGRAM_BOT_TOKEN"
    fi
else
    echo "✅ TELEGRAM_BOT_TOKEN already exists"
fi

# Add NODE_ENV
echo "Adding NODE_ENV..."
echo "production" | vercel env add NODE_ENV production
if [ $? -eq 0 ]; then
    echo "✅ NODE_ENV added successfully"
else
    echo "⚠️ NODE_ENV may already exist or failed to add"
fi

echo ""
echo "📋 Environment Variables Summary:"
echo "=================================="
vercel env ls | grep -E "(DATABASE_URL|DIRECT_URL|TELEGRAM_BOT_TOKEN|NODE_ENV)" | head -10

echo ""
echo "🎉 Environment configuration complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Deploy the bot: npm run deploy"
echo "2. Set up webhook: ./setup-webhook.sh"
echo "3. Test the bot by sending /start to @Matmaxcommerce_bot"
echo ""
echo "🔍 Check deployment: https://vercel.com/dashboard"
