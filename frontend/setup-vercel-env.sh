#!/bin/bash

# Vercel Environment Variables Setup Script
# This script adds environment variables from .env.local to Vercel

echo "🚀 Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if project is linked to Vercel
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking project to Vercel..."
    vercel link
fi

echo "📝 Adding environment variables to Vercel..."

# Supabase Configuration
echo "Adding Supabase configuration..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production << EOF
https://hwxrstqeuouefyrwjsjt.supabase.co
EOF

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production << EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eHJzdHFldW91ZWZ5cndqc2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MjAxNzksImV4cCI6MjA3MjA5NjE3OX0.Hilhox23MDA-G4r5t-QYdlchRNyrzhlV5a425a9x69w
EOF

vercel env add SUPABASE_SERVICE_ROLE_KEY production << EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eHJzdHFldW91ZWZ5cndqc2p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjUyMDE3OSwiZXhwIjoyMDcyMDk2MTc5fQ.KVXASY94u9SVY7DGscrd0T5mJoswGEmS9CqP3-jRWfA
EOF

# Izipay Configuration
echo "Adding Izipay configuration..."
vercel env add IZIPAY_ENVIRONMENT production << EOF
sandbox
EOF

vercel env add IZIPAY_TEST_MERCHANT_ID production << EOF
88569105
EOF

vercel env add IZIPAY_TEST_USERNAME production << EOF
88569105
EOF

vercel env add IZIPAY_TEST_PASSWORD production << EOF
testpassword_NSJpdOElQsM4RMu16WF89ykCViBW9ddilhEdsq02sHA2T
EOF

vercel env add IZIPAY_TEST_PUBLIC_KEY production << EOF
88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYzYOWgXqwSx
EOF

vercel env add IZIPAY_TEST_HMAC_KEY production << EOF
H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1
EOF

vercel env add IZIPAY_API_BASE_URL production << EOF
https://api.micuentaweb.pe
EOF

vercel env add IZIPAY_JAVASCRIPT_URL production << EOF
https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js
EOF

vercel env add IZIPAY_MOCK_MODE production << EOF
false
EOF

# Base URL Configuration
echo "Adding base URL configuration..."
vercel env add NEXT_PUBLIC_BASE_URL production << EOF
https://frontend-ap707pb1e-matmaxworlds-projects.vercel.app
EOF

# Optional: Add JWT Secret for production
echo "Generating JWT secret for production..."
JWT_SECRET=$(openssl rand -base64 32)
vercel env add JWT_SECRET production << EOF
$JWT_SECRET
EOF

# Optional: Add NextAuth Secret for production
echo "Generating NextAuth secret for production..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
vercel env add NEXTAUTH_SECRET production << EOF
$NEXTAUTH_SECRET
EOF

# Set NextAuth URL
vercel env add NEXTAUTH_URL production << EOF
https://frontend-ap707pb1e-matmaxworlds-projects.vercel.app
EOF

echo "✅ Environment variables added successfully!"
echo ""
echo "📋 Environment variables added:"
echo "• NEXT_PUBLIC_SUPABASE_URL"
echo "• NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "• SUPABASE_SERVICE_ROLE_KEY"
echo "• IZIPAY_ENVIRONMENT"
echo "• IZIPAY_TEST_MERCHANT_ID"
echo "• IZIPAY_TEST_USERNAME"
echo "• IZIPAY_TEST_PASSWORD"
echo "• IZIPAY_TEST_PUBLIC_KEY"
echo "• IZIPAY_TEST_HMAC_KEY"
echo "• IZIPAY_API_BASE_URL"
echo "• IZIPAY_JAVASCRIPT_URL"
echo "• IZIPAY_MOCK_MODE"
echo "• NEXT_PUBLIC_BASE_URL"
echo "• JWT_SECRET"
echo "• NEXTAUTH_SECRET"
echo "• NEXTAUTH_URL"
echo ""
echo "🔄 Redeploying to apply environment variables..."
vercel --prod

echo "✅ Setup complete!"
echo ""
echo "🔧 Useful commands:"
echo "• vercel env ls           - List all environment variables"
echo "• vercel env rm <name>    - Remove an environment variable"
echo "• vercel --prod           - Deploy to production"