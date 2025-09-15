#!/usr/bin/env node

/**
 * Izipay Setup Script
 * Helps set up the Izipay integration by checking configuration and running necessary migrations
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function checkEnvironmentVariables() {
  console.log('🔍 Checking Izipay environment variables...');
  
  const requiredVars = [
    'IZIPAY_MERCHANT_ID',
    'IZIPAY_USERNAME', 
    'IZIPAY_PASSWORD',
    'IZIPAY_PUBLIC_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n📝 Please add these to your .env.local file:');
    console.log('   IZIPAY_MERCHANT_ID=your_merchant_id');
    console.log('   IZIPAY_USERNAME=your_username');
    console.log('   IZIPAY_PASSWORD=your_password');
    console.log('   IZIPAY_PUBLIC_KEY=your_public_key');
    console.log('   IZIPAY_ENVIRONMENT=sandbox');
    console.log('\n📖 See IZIPAY_INTEGRATION.md for detailed setup instructions.');
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  console.log(`   Environment: ${process.env.IZIPAY_ENVIRONMENT || 'sandbox'}`);
  return true;
}

async function checkDatabase() {
  console.log('🗄️  Checking database setup...');
  
  try {
    // Check if PEN currency exists
    const penCurrency = await prisma.currency.findUnique({
      where: { code: 'PEN' }
    });
    
    if (!penCurrency) {
      console.log('❌ PEN currency not found in database');
      console.log('   Run: npx prisma db seed');
      return false;
    }
    
    // Check if Izipay payment method exists
    const izipayMethod = await prisma.paymentMethodConfig.findFirst({
      where: { type: 'izipay' }
    });
    
    if (!izipayMethod) {
      console.log('❌ Izipay payment method not found in database');
      console.log('   Run: node scripts/seed-payment-methods-with-icons.js');
      return false;
    }
    
    console.log('✅ Database setup is complete');
    console.log(`   PEN currency: ${penCurrency.name} (${penCurrency.symbol})`);
    console.log(`   Izipay method: ${izipayMethod.name} (${izipayMethod.isActive ? 'active' : 'inactive'})`);
    
    return true;
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    return false;
  }
}

async function testIzipayConnection() {
  console.log('🔌 Testing Izipay connection...');
  
  try {
    // Import Izipay config
    const { getIzipayConfig, validateIzipayConfig } = await import('../lib/izipay/config.js');
    
    const config = getIzipayConfig();
    if (!config) {
      console.log('❌ Failed to load Izipay configuration');
      return false;
    }
    
    if (!validateIzipayConfig(config)) {
      console.log('❌ Invalid Izipay configuration');
      return false;
    }
    
    console.log('✅ Izipay configuration is valid');
    console.log(`   Merchant ID: ${config.merchantId}`);
    console.log(`   Environment: ${config.environment}`);
    console.log(`   Currency: ${config.currency}`);
    
    return true;
  } catch (error) {
    console.error('❌ Izipay connection test failed:', error.message);
    return false;
  }
}

async function displaySetupSummary() {
  console.log('\n📋 Izipay Integration Setup Summary');
  console.log('=====================================');
  
  const envCheck = await checkEnvironmentVariables();
  const dbCheck = await checkDatabase();
  const connectionCheck = await testIzipayConnection();
  
  console.log('\n🎯 Next Steps:');
  
  if (!envCheck) {
    console.log('1. ❌ Configure environment variables in .env.local');
  } else {
    console.log('1. ✅ Environment variables configured');
  }
  
  if (!dbCheck) {
    console.log('2. ❌ Set up database (run migrations and seeds)');
  } else {
    console.log('2. ✅ Database setup complete');
  }
  
  if (!connectionCheck) {
    console.log('3. ❌ Fix Izipay configuration');
  } else {
    console.log('3. ✅ Izipay configuration valid');
  }
  
  if (envCheck && dbCheck && connectionCheck) {
    console.log('\n🎉 Izipay integration is ready to use!');
    console.log('\n📝 Usage Examples:');
    console.log('   - Import: import { IzipayPaymentButton } from "@/components/izipay/IzipayPaymentButton"');
    console.log('   - API: POST /api/izipay/create-payment-intent');
    console.log('   - Webhook: POST /api/izipay/webhook');
    console.log('\n📖 See IZIPAY_INTEGRATION.md for detailed documentation.');
  } else {
    console.log('\n⚠️  Please complete the failed steps above before using Izipay.');
  }
  
  console.log('\n🔗 Useful Links:');
  console.log('   - Izipay Dashboard: https://www.izipay.pe/');
  console.log('   - API Documentation: https://developers.izipay.pe/');
  console.log('   - Integration Guide: ./IZIPAY_INTEGRATION.md');
}

async function main() {
  console.log('🚀 Izipay Integration Setup');
  console.log('===========================\n');
  
  try {
    await displaySetupSummary();
  } catch (error) {
    console.error('❌ Setup check failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup check
main().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
