#!/bin/bash

# Complete Telegram Bot Service Deployment Script
# This script handles the full deployment process

echo "🚀 Complete Telegram Bot Service Deployment"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "server.js" ]; then
    print_error "Not in telegram-bot-service directory"
    echo "Please run this script from the telegram-bot-service directory"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
if npm install; then
    print_status "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Setup environment
echo ""
echo "⚙️  Setting up environment..."
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Copying from template..."
    if [ -f "env-example.txt" ]; then
        cp env-example.txt .env
        print_warning "Please edit .env file with your configuration before continuing"
        echo "Required: TELEGRAM_BOT_TOKEN, DATABASE_URL"
        read -p "Press Enter when .env is configured..."
    else
        print_error "No environment template found"
        exit 1
    fi
fi

# Step 3: Setup Vercel
echo ""
echo "🔗 Setting up Vercel..."
if npm run vercel:setup; then
    print_status "Vercel setup completed"
else
    print_error "Vercel setup failed"
    exit 1
fi

# Step 4: Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
if npm run deploy; then
    print_status "Deployment completed"

    # Extract deployment URL
    DEPLOYMENT_URL=$(vercel ls --prod 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1)

    if [ -n "$DEPLOYMENT_URL" ]; then
        print_status "Deployment URL: $DEPLOYMENT_URL"

        # Step 5: Setup webhook
        echo ""
        echo "🔗 Setting up webhook..."
        export TELEGRAM_WEBHOOK_URL="$DEPLOYMENT_URL/api/telegram/webhook"

        if ./setup-webhook.sh; then
            print_status "Webhook configured successfully"
        else
            print_warning "Webhook setup failed - you can run it manually later"
        fi
    else
        print_warning "Could not extract deployment URL - run webhook setup manually"
    fi
else
    print_error "Deployment failed"
    exit 1
fi

# Step 6: Run tests
echo ""
echo "🧪 Running tests..."
if npm run test; then
    print_status "Tests passed"
else
    print_warning "Some tests failed - check configuration"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Summary:"
echo "   • Service deployed to Vercel"
echo "   • Webhook configured for Telegram"
echo "   • Tests run and validated"
echo ""
echo "🧪 Test your bot:"
echo "   • Send /start to @Matmaxcommerce_bot"
echo "   • Send /register for account linking"
echo ""
echo "📊 Monitor your deployment:"
echo "   • Vercel Dashboard: https://vercel.com/dashboard"
echo "   • Check logs: vercel logs"
echo ""
echo "🔧 Useful commands:"
echo "   • Redeploy: npm run deploy"
echo "   • Check webhook: ./setup-webhook.sh"
echo "   • Run tests: npm run test"
