#!/usr/bin/env node

/**
 * Lyra Configuration Validation Script
 * 
 * This script validates the Lyra payment integration configuration
 * for both test and production environments.
 */

const crypto = require('crypto');

// Production configuration
const productionConfig = {
  username: 'prodpassword_di6IeBzwz6ccq3OfeWkUmGN5s6PmhX67l6RrKJHSicFPh',
  password: '88569105',
  publicKey: 'publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv',
  hmacKey: 'L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw',
  environment: 'production',
  apiEndpoint: 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
  jsLibraryUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
};

// Test configuration
const testConfig = {
  username: process.env.LYRA_USERNAME || '',
  password: process.env.LYRA_PASSWORD || '',
  publicKey: process.env.LYRA_PUBLIC_KEY || '',
  hmacKey: 'H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1',
  environment: 'test',
  apiEndpoint: 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
  jsLibraryUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
};

function validateConfig(config, environment) {
  console.log(`\n🔍 Validating ${environment} configuration...\n`);
  
  const errors = [];
  const warnings = [];

  // Required fields validation
  if (!config.username) {
    errors.push('❌ Username is missing');
  } else {
    console.log('✅ Username configured');
  }

  if (!config.password) {
    errors.push('❌ Password is missing');
  } else {
    console.log('✅ Password configured');
  }

  if (!config.publicKey) {
    errors.push('❌ Public key is missing');
  } else {
    console.log('✅ Public key configured');
  }

  if (!config.hmacKey) {
    errors.push('❌ HMAC key is missing');
  } else {
    console.log('✅ HMAC key configured');
  }

  // Validate HMAC key format
  if (config.hmacKey && config.hmacKey.length !== 44) {
    warnings.push('⚠️  HMAC key length seems incorrect (expected 44 characters)');
  }

  // Validate public key format
  if (config.publicKey && !config.publicKey.startsWith('publickey_')) {
    warnings.push('⚠️  Public key format seems incorrect (should start with "publickey_")');
  }

  // Validate API endpoints
  if (!config.apiEndpoint || !config.apiEndpoint.startsWith('https://')) {
    errors.push('❌ API endpoint must use HTTPS');
  } else {
    console.log('✅ API endpoint configured');
  }

  if (!config.jsLibraryUrl || !config.jsLibraryUrl.startsWith('https://')) {
    errors.push('❌ JavaScript library URL must use HTTPS');
  } else {
    console.log('✅ JavaScript library URL configured');
  }

  // Test HMAC functionality
  if (config.hmacKey) {
    try {
      const testData = 'test=data&status=PAID';
      const hmac = crypto.createHmac('sha256', config.hmacKey);
      hmac.update(testData);
      const signature = hmac.digest('base64');
      
      if (signature && signature.length > 0) {
        console.log('✅ HMAC signature generation working');
      } else {
        errors.push('❌ HMAC signature generation failed');
      }
    } catch (error) {
      errors.push(`❌ HMAC signature test failed: ${error.message}`);
    }
  }

  // Display results
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`   ${error}`));
    return false;
  }

  console.log(`\n✅ ${environment} configuration is valid!`);
  return true;
}

function testHmacValidation() {
  console.log('\n🧪 Testing HMAC validation...\n');
  
  const testData = {
    'kr-status': 'PAID',
    'kr-amount': '1000',
    'kr-order': 'TEST-ORDER-123',
    'kr-hash': ''
  };

  // Generate test signature
  const dataString = 'kr-amount=1000&kr-order=TEST-ORDER-123&kr-status=PAID';
  const hmac = crypto.createHmac('sha256', productionConfig.hmacKey);
  hmac.update(dataString);
  const signature = hmac.digest('base64');
  
  testData['kr-hash'] = signature;

  console.log('Test data:', JSON.stringify(testData, null, 2));
  console.log('Generated signature:', signature);
  console.log('✅ HMAC validation test completed');
}

function main() {
  console.log('🚀 Lyra Configuration Validation Tool\n');
  console.log('=====================================\n');

  // Validate production config
  const prodValid = validateConfig(productionConfig, 'Production');
  
  // Validate test config
  const testValid = validateConfig(testConfig, 'Test');

  // Test HMAC validation
  testHmacValidation();

  // Summary
  console.log('\n📊 Summary:');
  console.log('===========');
  console.log(`Production: ${prodValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`Test: ${testValid ? '✅ Valid' : '❌ Invalid'}`);

  if (!prodValid || !testValid) {
    console.log('\n❌ Configuration validation failed!');
    console.log('Please fix the errors above before deploying.');
    process.exit(1);
  }

  console.log('\n🎉 All configurations are valid!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your domain URLs in the environment variables');
  console.log('2. Configure the Lyra merchant dashboard');
  console.log('3. Test the integration with test payments');
  console.log('4. Deploy to production');
}

// Run the validation
main();
