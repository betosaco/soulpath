#!/usr/bin/env node

/**
 * Script to add Lyra credentials to .env.local
 * Run with: node scripts/add-lyra-credentials.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_FILE = path.join(__dirname, '..', '.env.local');

// Your Lyra test credentials
const LYRA_CREDENTIALS = `
# Lyra Payment Integration (Peruvian Market) - TEST CREDENTIALS
LYRA_USERNAME="88569105"
LYRA_PASSWORD="testpassword_NSJpdOElQsM4RMu16WF89ykCViBW9ddilhEdsq02sHA2T"
LYRA_PUBLIC_KEY="88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYzYOWgXqwSXx"
`;

console.log('🔧 Adding Lyra Test Credentials to .env.local\n');

try {
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(ENV_FILE)) {
    envContent = fs.readFileSync(ENV_FILE, 'utf8');
    console.log('✅ Found existing .env.local file');
    
    // Remove existing Lyra credentials if they exist
    const lines = envContent.split('\n');
    const filteredLines = lines.filter(line => 
      !line.startsWith('LYRA_USERNAME') && 
      !line.startsWith('LYRA_PASSWORD') && 
      !line.startsWith('LYRA_PUBLIC_KEY') &&
      !line.includes('Lyra Payment Integration')
    );
    envContent = filteredLines.join('\n');
  } else {
    console.log('📝 Creating new .env.local file');
  }
  
  // Add Lyra credentials
  envContent += LYRA_CREDENTIALS;
  
  // Write the updated content
  fs.writeFileSync(ENV_FILE, envContent);
  
  console.log('✅ Lyra credentials added successfully!');
  console.log('\n📋 Added credentials:');
  console.log('   LYRA_USERNAME="88569105"');
  console.log('   LYRA_PASSWORD="testpassword_NSJpdOElQsM4RMu16WF89ykCViBW9ddilhEdsq02sHA2T"');
  console.log('   LYRA_PUBLIC_KEY="88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYzYOWgXqwSXx"');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Test the integration: http://localhost:3000/test-lyra');
  console.log('3. Check the browser console for any errors');
  
  console.log('\n⚠️  Security Note:');
  console.log('These are TEST credentials. For production, use your live credentials.');
  
} catch (error) {
  console.error('❌ Error adding Lyra credentials:', error.message);
  process.exit(1);
}
