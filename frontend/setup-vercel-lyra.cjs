#!/usr/bin/env node

/**
 * Setup Lyra Environment Variables on Vercel
 * 
 * This script sets up the missing Lyra environment variables on Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Read local environment variables
function readLocalEnv() {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
      envVars[key.trim()] = value;
    }
  });
  
  return envVars;
}

// Set environment variable on Vercel using the correct environment names
function setVercelEnv(key, value, environment) {
  try {
    console.log(`🔄 Setting ${key} for ${environment}...`);
    
    // Use the correct Vercel CLI command format
    const command = `echo "${value}" | vercel env add ${key} ${environment}`;
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ Set ${key} for ${environment}`);
    return true;
  } catch (error) {
    if (error.message.includes('already been added')) {
      console.log(`⚠️  ${key} already exists for ${environment}`);
      return true;
    }
    console.error(`❌ Failed to set ${key} for ${environment}:`, error.message);
    return false;
  }
}

// Main setup function
async function setupLyraEnv() {
  console.log('🔧 Setting up Lyra Environment Variables on Vercel...\n');
  
  // Read local environment
  const localEnv = readLocalEnv();
  
  // Key Lyra variables that need to be set
  const keyLyraVars = [
    'LYRA_USERNAME',
    'LYRA_PASSWORD', 
    'LYRA_PUBLIC_KEY',
    'LYRA_API_ENDPOINT',
    'LYRA_JS_LIBRARY_URL',
    'NEXT_PUBLIC_LYRA_PUBLIC_KEY'
  ];
  
  // Vercel environment names (from the vercel env ls output)
  const environments = ['production', 'preview', 'development'];
  
  let totalSet = 0;
  let totalAttempted = 0;
  
  for (const varName of keyLyraVars) {
    if (!localEnv[varName]) {
      console.log(`⚠️  ${varName} not found in local .env file, skipping...`);
      continue;
    }
    
    for (const env of environments) {
      totalAttempted++;
      if (setVercelEnv(varName, localEnv[varName], env)) {
        totalSet++;
      }
    }
  }
  
  console.log(`\n📊 Summary: ${totalSet}/${totalAttempted} variables set successfully`);
  
  if (totalSet === totalAttempted) {
    console.log('🎉 All Lyra environment variables have been set on Vercel!');
    console.log('💡 You may need to redeploy your application for the changes to take effect.');
  } else {
    console.log('⚠️  Some variables failed to set. Please check the errors above.');
  }
  
  console.log('\n🔍 To verify, run: vercel env ls');
}

// Run the setup
setupLyraEnv().catch(console.error);
