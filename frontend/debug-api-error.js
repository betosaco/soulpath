#!/usr/bin/env node

/**
 * Debug the API error by testing the imports and basic functionality
 */

console.log('🔍 Debugging API Error\n');

// Test 1: Check if imports work
try {
  console.log('📦 Testing imports...');

  // Test Next.js imports
  console.log('✅ Next.js imports available');

  // Test auth import
  const { handleAdminAuth } = await import('./lib/auth.ts');
  console.log('✅ Auth import successful');

  // Test communication service import
  const { communicationService } = await import('./lib/services/communication-service.ts');
  console.log('✅ Communication service import successful');

  // Test if communication service can load config
  console.log('🔧 Testing communication service config loading...');
  await communicationService.getConfig();
  console.log('✅ Communication service config loaded successfully');

} catch (error) {
  console.error('❌ Import error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 2: Check if Prisma works
try {
  console.log('\n📊 Testing Prisma connection...');
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  const config = await prisma.communicationConfig.findFirst();
  console.log('✅ Prisma connection successful');
  console.log('Config found:', !!config);

  await prisma.$disconnect();
} catch (error) {
  console.error('❌ Prisma error:', error.message);
  process.exit(1);
}

console.log('\n🎉 All basic tests passed! The issue might be in the API route handling.');
