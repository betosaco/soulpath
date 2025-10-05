#!/bin/bash

# Fix Telegram Environment Variables in Vercel
echo "🔧 Fixing Telegram Environment Variables in Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

echo "📱 Setting up Telegram environment variables..."
echo ""

# Set TELEGRAM_BOT_TOKEN
echo "Setting TELEGRAM_BOT_TOKEN..."
vercel env add TELEGRAM_BOT_TOKEN production
if [ $? -eq 0 ]; then
    echo "✅ TELEGRAM_BOT_TOKEN set successfully"
else
    echo "⚠️  TELEGRAM_BOT_TOKEN may already exist or failed to set"
fi

# Set TELEGRAM_CHAT_ID
echo "Setting TELEGRAM_CHAT_ID..."
vercel env add TELEGRAM_CHAT_ID production
if [ $? -eq 0 ]; then
    echo "✅ TELEGRAM_CHAT_ID set successfully"
else
    echo "⚠️  TELEGRAM_CHAT_ID may already exist or failed to set"
fi

echo ""
echo "🎯 NEXT STEPS:"
echo ""
echo "1. Get your Chat ID:"
echo "   - Open Telegram and message @matmaxworld_bot"
echo "   - Send the /register command"
echo "   - Copy the Chat ID number from the bot's response"
echo ""
echo "2. Update the TELEGRAM_CHAT_ID in Vercel:"
echo "   - Go to Vercel dashboard → Your project → Settings → Environment Variables"
echo "   - Set TELEGRAM_CHAT_ID to the Chat ID you got from the bot"
echo "   - Also ensure TELEGRAM_BOT_TOKEN is: 8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU"
echo ""
echo "3. Redeploy your application:"
echo "   vercel --prod"
echo ""
echo "4. Test the notifications:"
echo "   - Place a test order"
echo "   - Check if you receive Telegram notifications"
echo ""

echo "📱 Current Environment Variables:"
vercel env ls | grep TELEGRAM || echo "No Telegram environment variables found"

echo ""
echo "✅ Setup complete! Follow the steps above to finish configuration."

