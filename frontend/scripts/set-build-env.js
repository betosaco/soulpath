#!/usr/bin/env node

/**
 * Set Build Environment Variables
 * This script sets fallback environment variables for the build process
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting build environment variables...');

// Create .env.production file with fallback values
const envContent = `# Production environment variables for Vercel deployment
# These are fallback values to allow the build to succeed
# Replace with actual values in Vercel dashboard

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wellness_db

# Supabase (replace with actual values)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_anon_key
SUPABASE_SERVICE_ROLE_KEY=placeholder_service_key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=placeholder_project_id

# NextAuth
NEXTAUTH_SECRET=placeholder_nextauth_secret
NEXTAUTH_URL=https://placeholder.vercel.app

# JWT
JWT_SECRET=placeholder_jwt_secret

# Redis
REDIS_URL=redis://localhost:6379

# Other required variables
NODE_ENV=production
`;

const envPath = path.join(process.cwd(), '.env.production');
fs.writeFileSync(envPath, envContent);

console.log('✅ Build environment variables set');
console.log('📝 Note: Replace placeholder values with actual values in Vercel dashboard');
