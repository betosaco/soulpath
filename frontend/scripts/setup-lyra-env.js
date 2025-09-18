#!/usr/bin/env node

/**
 * Script to help set up Lyra environment variables
 * Run with: node scripts/setup-lyra-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_FILE = '.env.local';
const ENV_EXAMPLE_FILE = '.env.example';

// Lyra environment variables template
const LYRA_ENV_VARS = `
# Lyra Payment Integration (Peruvian Market)
LYRA_USERNAME="your_lyra_username"
LYRA_PASSWORD="your_lyra_password"
LYRA_PUBLIC_KEY="your_lyra_public_key"
`;

console.log('🔧 Setting up Lyra Payment Integration Environment Variables\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', ENV_FILE);
const envExamplePath = path.join(__dirname, '..', ENV_EXAMPLE_FILE);

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Creating .env.local file...');
  
  // Create .env.local with basic structure
  const basicEnvContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wellness_db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Lyra Payment Integration (Peruvian Market)
LYRA_USERNAME="your_lyra_username"
LYRA_PASSWORD="your_lyra_password"
LYRA_PUBLIC_KEY="your_lyra_public_key"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Other
NODE_ENV="development"
`;

  fs.writeFileSync(envPath, basicEnvContent);
  console.log('✅ .env.local file created');
} else {
  console.log('✅ .env.local file found');
  
  // Read existing .env.local
  const existingContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if Lyra variables already exist
  if (existingContent.includes('LYRA_USERNAME')) {
    console.log('✅ Lyra environment variables already exist');
    console.log('📋 Current Lyra configuration:');
    
    const lines = existingContent.split('\n');
    lines.forEach(line => {
      if (line.startsWith('LYRA_')) {
        const [key, value] = line.split('=');
        const displayValue = value && value !== '""' && value !== "''" 
          ? `${value.substring(0, 10)}...` 
          : 'Not set';
        console.log(`   ${key}=${displayValue}`);
      }
    });
  } else {
    console.log('📝 Adding Lyra environment variables...');
    
    // Append Lyra variables to existing file
    const updatedContent = existingContent + '\n' + LYRA_ENV_VARS;
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ Lyra environment variables added');
  }
}

// Create or update .env.example
if (!fs.existsSync(envExamplePath)) {
  console.log('📝 Creating .env.example file...');
  fs.writeFileSync(envExamplePath, LYRA_ENV_VARS);
  console.log('✅ .env.example file created');
} else {
  console.log('✅ .env.example file found');
}

console.log('\n🎯 Next Steps:');
console.log('1. Update your .env.local file with your actual Lyra credentials:');
console.log('   - LYRA_USERNAME: Your Lyra username');
console.log('   - LYRA_PASSWORD: Your Lyra password');
console.log('   - LYRA_PUBLIC_KEY: Your Lyra public key');
console.log('\n2. Test the integration by visiting: http://localhost:3000/test-lyra');
console.log('\n3. For production, make sure to use production credentials');
console.log('\n📚 Documentation: See frontend/LYRA_INTEGRATION_README.md for detailed usage');

console.log('\n🔐 Security Notes:');
console.log('- Never commit your .env.local file to version control');
console.log('- Use different credentials for development and production');
console.log('- The password should never be exposed on the client side');
console.log('- Form tokens are always generated server-side for security');
