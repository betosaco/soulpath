#!/bin/bash

# Redis Setup Script for Vercel
# This script helps configure Redis for your Vercel deployment

set -e

echo "🚀 Setting up Redis for Vercel deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

print_status "Vercel CLI found"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in:"
    vercel login
fi

print_status "Logged in to Vercel"

# Function to setup Upstash Redis
setup_upstash() {
    print_info "Setting up Upstash Redis..."
    
    echo "Please choose an option:"
    echo "1) Use Vercel addon (recommended)"
    echo "2) Manual setup with existing Upstash account"
    read -p "Enter your choice (1 or 2): " choice
    
    case $choice in
        1)
            print_info "Creating Upstash Redis addon..."
            vercel addons create upstash
            print_status "Upstash Redis addon created"
            ;;
        2)
            print_info "Manual Upstash setup"
            echo "Please go to https://console.upstash.com/ and create a Redis database"
            echo "Then copy the connection details and run:"
            echo ""
            echo "vercel env add REDIS_URL"
            echo "vercel env add REDIS_REST_URL" 
            echo "vercel env add REDIS_REST_TOKEN"
            echo ""
            read -p "Press Enter when you've added the environment variables..."
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Function to setup Redis Cloud
setup_redis_cloud() {
    print_info "Setting up Redis Cloud..."
    echo "Please go to https://redis.com/try-free/ and create a free account"
    echo "Then create a new database and copy the connection details"
    echo ""
    echo "Run these commands with your Redis Cloud details:"
    echo ""
    echo "vercel env add REDIS_HOST"
    echo "vercel env add REDIS_PORT"
    echo "vercel env add REDIS_PASSWORD"
    echo ""
    read -p "Press Enter when you've added the environment variables..."
}

# Function to setup self-hosted Redis
setup_self_hosted() {
    print_info "Setting up self-hosted Redis..."
    echo "Please provide your Redis connection details:"
    echo ""
    read -p "Redis Host: " redis_host
    read -p "Redis Port (default 6379): " redis_port
    redis_port=${redis_port:-6379}
    read -p "Redis Password (optional): " redis_password
    read -p "Redis Username (optional): " redis_username
    
    # Add environment variables
    vercel env add REDIS_HOST "$redis_host"
    vercel env add REDIS_PORT "$redis_port"
    
    if [ ! -z "$redis_password" ]; then
        vercel env add REDIS_PASSWORD "$redis_password"
    fi
    
    if [ ! -z "$redis_username" ]; then
        vercel env add REDIS_USERNAME "$redis_username"
    fi
    
    print_status "Self-hosted Redis environment variables added"
}

# Main setup menu
echo ""
echo "Choose your Redis provider:"
echo "1) Upstash Redis (recommended for Vercel)"
echo "2) Redis Cloud"
echo "3) Self-hosted Redis"
echo "4) Skip Redis setup"
echo ""

read -p "Enter your choice (1-4): " provider_choice

case $provider_choice in
    1)
        setup_upstash
        ;;
    2)
        setup_redis_cloud
        ;;
    3)
        setup_self_hosted
        ;;
    4)
        print_warning "Skipping Redis setup"
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Add additional Redis configuration
print_info "Adding additional Redis configuration..."

# Add Redis connection timeout
vercel env add REDIS_CONNECT_TIMEOUT 10000

# Add Redis command timeout
vercel env add REDIS_COMMAND_TIMEOUT 5000

# Add Redis retry configuration
vercel env add REDIS_MAX_RETRIES 3

print_status "Additional Redis configuration added"

# Pull environment variables for local development
print_info "Pulling environment variables for local development..."
vercel env pull .env.local

print_status "Environment variables pulled to .env.local"

# Install Redis dependencies
print_info "Installing Redis dependencies..."
npm install ioredis

print_status "Redis dependencies installed"

# Create local Redis configuration
print_info "Creating local Redis configuration..."
cat > .env.local.example << EOF
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_USERNAME=default
REDIS_CONNECT_TIMEOUT=10000
REDIS_COMMAND_TIMEOUT=5000
REDIS_MAX_RETRIES=3
EOF

print_status "Local Redis configuration created"

# Test Redis connection
print_info "Testing Redis connection..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        print_status "Local Redis is running"
    else
        print_warning "Local Redis is not running. Start it with: brew services start redis"
    fi
else
    print_warning "Redis CLI not found. Install Redis locally for development:"
    echo "macOS: brew install redis"
    echo "Ubuntu: sudo apt install redis-server"
fi

# Deploy to Vercel
echo ""
read -p "Deploy to Vercel now? (y/n): " deploy_choice

if [ "$deploy_choice" = "y" ] || [ "$deploy_choice" = "Y" ]; then
    print_info "Deploying to Vercel..."
    vercel --prod
    print_status "Deployed to Vercel"
else
    print_info "You can deploy later with: vercel --prod"
fi

# Final instructions
echo ""
print_status "Redis setup completed!"
echo ""
echo "Next steps:"
echo "1. Test your Redis connection in your API routes"
echo "2. Monitor Redis usage in your provider's dashboard"
echo "3. Check Vercel function logs: vercel logs"
echo ""
echo "Redis configuration files created:"
echo "- lib/redis.ts (Redis client configuration)"
echo "- .env.local (Local environment variables)"
echo "- .env.local.example (Example configuration)"
echo ""
echo "For troubleshooting, see: vercel-redis-setup.md"

print_status "Setup complete! 🎉"
