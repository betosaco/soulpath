#!/bin/bash

# Izipay Environment Variables Setup Script
# This script sets up Izipay environment variables for both local and Vercel

set -e

echo "🚀 Setting up Izipay environment variables..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI is not installed. Please install it first:${NC}"
        echo "npm install -g vercel"
        exit 1
    fi
}

# Create local .env.local file
setup_local_env() {
    echo -e "${BLUE}📝 Setting up local environment variables...${NC}"
    
    # Check if .env.local already exists
    if [ -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  .env.local already exists. Backing up to .env.local.backup${NC}"
        cp .env.local .env.local.backup
    fi
    
    # Create .env.local with Izipay variables
    cat > .env.local << EOF
# Izipay Configuration
# Test Environment
IZIPAY_TEST_USERNAME=88569105
IZIPAY_TEST_PASSWORD=testpassword_NS]pdOEIQsM4RMu16WF89kCViBW9ddilhEdsq02sHA2T
IZIPAY_TEST_PUBLIC_KEY=88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSXx
IZIPAY_TEST_HMAC_KEY=H9ataKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRL<HZM1

# Production Environment
IZIPAY_PROD_USERNAME=88569105
IZIPAY_PROD_PASSWORD=prodpassword_di6IeBzwz6ccq30feWkUmGN5s6PmhX67|6RrKJHSicFPh
IZIPAY_PROD_PUBLIC_KEY=88569105:publickey UKrWazicOvfMEi40dXuBAcGK1TaTK6izIIJZYWWHGCakv
IZIPAY_PROD_HMAC_KEY=XnvOuum4jpXuY9U1BbpoY3tPK0KRy3|vBfw1ZKmp2G2Sz

# Izipay API Configuration
IZIPAY_API_BASE_URL=https://api.micuentaweb.pe
IZIPAY_JAVASCRIPT_URL=https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js
EOF

    echo -e "${GREEN}✅ Local environment variables created in .env.local${NC}"
}

# Setup Vercel environment variables
setup_vercel_env() {
    echo -e "${BLUE}☁️  Setting up Vercel environment variables...${NC}"
    
    # Check if we're in a Vercel project
    if [ ! -f "vercel.json" ] && [ ! -d ".vercel" ]; then
        echo -e "${YELLOW}⚠️  No Vercel project detected. Initializing Vercel project...${NC}"
        vercel --yes
    fi
    
    echo -e "${BLUE}Adding environment variables to Vercel...${NC}"
    
    # Add test environment variables
    echo "Adding test environment variables..."
    vercel env add IZIPAY_TEST_USERNAME production <<< "88569105"
    vercel env add IZIPAY_TEST_PASSWORD production <<< "testpassword_NS]pdOEIQsM4RMu16WF89kCViBW9ddilhEdsq02sHA2T"
    vercel env add IZIPAY_TEST_PUBLIC_KEY production <<< "88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSXx"
    vercel env add IZIPAY_TEST_HMAC_KEY production <<< "H9ataKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRL<HZM1"
    
    # Add production environment variables
    echo "Adding production environment variables..."
    vercel env add IZIPAY_PROD_USERNAME production <<< "88569105"
    vercel env add IZIPAY_PROD_PASSWORD production <<< "prodpassword_di6IeBzwz6ccq30feWkUmGN5s6PmhX67|6RrKJHSicFPh"
    vercel env add IZIPAY_PROD_PUBLIC_KEY production <<< "88569105:publickey UKrWazicOvfMEi40dXuBAcGK1TaTK6izIIJZYWWHGCakv"
    vercel env add IZIPAY_PROD_HMAC_KEY production <<< "XnvOuum4jpXuY9U1BbpoY3tPK0KRy3|vBfw1ZKmp2G2Sz"
    
    # Add API configuration
    echo "Adding API configuration..."
    vercel env add IZIPAY_API_BASE_URL production <<< "https://api.micuentaweb.pe"
    vercel env add IZIPAY_JAVASCRIPT_URL production <<< "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
    
    echo -e "${GREEN}✅ Vercel environment variables added successfully${NC}"
}

# Verify environment variables
verify_env() {
    echo -e "${BLUE}🔍 Verifying environment variables...${NC}"
    
    # Check local .env.local
    if [ -f ".env.local" ]; then
        echo -e "${GREEN}✅ Local .env.local file exists${NC}"
        echo "Local environment variables:"
        grep "IZIPAY_" .env.local | sed 's/=.*/=***/' # Hide sensitive values
    else
        echo -e "${RED}❌ Local .env.local file not found${NC}"
    fi
    
    # Check Vercel environment variables
    echo -e "${BLUE}Checking Vercel environment variables...${NC}"
    vercel env ls 2>/dev/null | grep "IZIPAY_" || echo -e "${YELLOW}⚠️  No Izipay variables found in Vercel${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🎯 Izipay Environment Setup Script${NC}"
    echo "=================================="
    
    # Setup local environment
    setup_local_env
    
    # Check if Vercel CLI is available
    if command -v vercel &> /dev/null; then
        echo -e "${BLUE}Vercel CLI found. Setting up Vercel environment...${NC}"
        setup_vercel_env
    else
        echo -e "${YELLOW}⚠️  Vercel CLI not found. Skipping Vercel setup.${NC}"
        echo "To install Vercel CLI: npm install -g vercel"
        echo "Then run: vercel login"
        echo "And run this script again to setup Vercel environment variables."
    fi
    
    # Verify setup
    verify_env
    
    echo -e "${GREEN}🎉 Izipay environment setup complete!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Restart your development server: npm run dev"
    echo "2. Test the payment integration on the packages page"
    echo "3. Deploy to Vercel: vercel --prod"
    echo ""
    echo -e "${YELLOW}⚠️  Important:${NC}"
    echo "- Test environment variables are configured for development"
    echo "- Production environment variables are configured for Vercel deployment"
    echo "- Make sure to test payments in both environments"
}

# Run main function
main "$@"
