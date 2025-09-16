#!/bin/bash

# Setup Vercel Environment Variables
echo "Setting up Vercel environment variables..."

# Database configuration
vercel env add DATABASE_URL production <<< "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

vercel env add DIRECT_URL production <<< "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# Supabase configuration
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eHJzdHFldW91ZWZ5cndqc2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MjAxNzksImV4cCI6MjA3MjA5NjE3OX0.Hilhox23MDA-G4r5t-QYdlchRNyrzhlV5a425a9x69w"

vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://hwxrstqeuouefyrwjsjt.supabase.co"

vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eHJzdHFldW91ZWZ5cndqc2p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjUyMDE3OSwiZXhwIjoyMDcyMDk2MTc5fQ.KVXASY94u9SVY7DGscrd0T5mJoswGEmS9CqP3-jRWfA"

# JWT and Auth secrets
vercel env add JWT_SECRET production <<< "your_secure_jwt_secret_here_generate_random_string_$(date +%s)"

vercel env add NEXTAUTH_SECRET production <<< "your_nextauth_secret_here_generate_random_string_$(date +%s)"

# Application configuration
vercel env add NODE_ENV production <<< "production"

vercel env add NEXT_PUBLIC_APP_URL production <<< "https://frontend-vercel.app"

echo "Environment variables added successfully!"

