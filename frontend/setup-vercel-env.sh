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