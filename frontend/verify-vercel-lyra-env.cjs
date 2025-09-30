#!/usr/bin/env node

/**
 * Verify and Update Lyra Environment Variables on Vercel
 * 
 * This script compares local .env variables with Vercel and helps set missing ones
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read local environment variables
function readLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
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

// Get current Vercel environment variables
function getVercelEnv() {
  try {
    const output = execSync('vercel env ls --json', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error('❌ Error getting Vercel env vars:', error.message);
    return [];
  }
}

// Set environment variable on Vercel
function setVercelEnv(key, value, environment = 'Production') {
  try {
    console.log(`🔄 Setting ${key} for ${environment}...`);
    execSync(`vercel env add ${key} ${environment}`, {
      input: value,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(`✅ Set ${key} for ${environment}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to set ${key} for ${environment}:`, error.message);
    return false;
  }
}

// Main verification function
async function verifyLyraEnv() {
  console.log('🔍 Verifying Lyra Environment Variables on Vercel...\n');
  
  // Read local environment
  const localEnv = readLocalEnv();
  console.log('📋 Local Environment Variables Found:');
  Object.keys(localEnv)
    .filter(key => key.includes('LYRA'))
    .forEach(key => {
      const value = localEnv[key];
      const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
      console.log(`  ${key}: ${displayValue}`);
    });
  
  console.log('\n');
  
  // Get Vercel environment
  const vercelEnv = getVercelEnv();
  const vercelKeys = new Set(vercelEnv.map(item => item.key));
  
  console.log('🌐 Vercel Environment Variables Found:');
  vercelEnv
    .filter(item => item.key.includes('LYRA'))
    .forEach(item => {
      console.log(`  ${item.key}: [ENCRYPTED] (${item.environments.join(', ')})`);
    });
  
  console.log('\n');
  
  // Check for missing variables
  const requiredLyraVars = [
    'LYRA_USERNAME',
    'LYRA_PASSWORD', 
    'LYRA_PUBLIC_KEY',
    'LYRA_API_ENDPOINT',
    'LYRA_JS_LIBRARY_URL',
    'LYRA_HMAC_PROD_KEY',
    'LYRA_HMAC_TEST_KEY',
    'LYRA_RETURN_URL_SUCCESS',
    'LYRA_RETURN_URL_ERROR',
    'LYRA_RETURN_URL_CANCEL',
    'LYRA_WEBHOOK_URL',
    'NEXT_PUBLIC_LYRA_PUBLIC_KEY'
  ];
  
  const missingVars = [];
  const environments = ['Production', 'Preview', 'Development'];
  
  for (const varName of requiredLyraVars) {
    for (const env of environments) {
      const hasVar = vercelEnv.some(item => 
        item.key === varName && item.environments.includes(env)
      );
      
      if (!hasVar && localEnv[varName]) {
        missingVars.push({ key: varName, environment: env, value: localEnv[varName] });
      }
    }
  }
  
  if (missingVars.length === 0) {
    console.log('✅ All Lyra environment variables are properly configured on Vercel!');
    return;
  }
  
  console.log(`❌ Found ${missingVars.length} missing environment variables:`);
  missingVars.forEach(({ key, environment }) => {
    console.log(`  ${key} (${environment})`);
  });
  
  console.log('\n🔧 Would you like to set the missing variables? (y/n)');
  
  // For automated execution, we'll set them directly
  console.log('🔄 Setting missing variables automatically...\n');
  
  let successCount = 0;
  for (const { key, environment, value } of missingVars) {
    if (setVercelEnv(key, value, environment)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Summary: ${successCount}/${missingVars.length} variables set successfully`);
  
  if (successCount === missingVars.length) {
    console.log('🎉 All missing Lyra environment variables have been set on Vercel!');
    console.log('💡 You may need to redeploy your application for the changes to take effect.');
  } else {
    console.log('⚠️  Some variables failed to set. Please check the errors above.');
  }
}

// Run the verification
verifyLyraEnv().catch(console.error);
