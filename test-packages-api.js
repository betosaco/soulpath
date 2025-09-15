#!/usr/bin/env node

/**
 * Test script to verify packages API endpoint
 * This script tests the /api/packages endpoint to ensure it returns data correctly
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPackagesAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Packages API...\n');
  
  try {
    // Test 1: Fetch packages with default currency (PEN)
    console.log('1️⃣ Testing GET /api/packages (default currency)...');
    const response1 = await fetch(`${baseUrl}/api/packages`);
    
    if (!response1.ok) {
      throw new Error(`HTTP ${response1.status}: ${response1.statusText}`);
    }
    
    const result1 = await response1.json();
    const packages1 = result1.data || [];
    console.log(`✅ Success! Found ${packages1.length} packages`);
    console.log('📦 Sample package:', packages1[0] ? {
      id: packages1[0].id,
      name: packages1[0].packageDefinition?.name,
      price: packages1[0].price,
      currency: packages1[0].currency?.code
    } : 'No packages found');
    
    // Test 2: Fetch packages with specific currency
    console.log('\n2️⃣ Testing GET /api/packages?currency=PEN...');
    const response2 = await fetch(`${baseUrl}/api/packages?currency=PEN`);
    
    if (!response2.ok) {
      throw new Error(`HTTP ${response2.status}: ${response2.statusText}`);
    }
    
    const result2 = await response2.json();
    const packages2 = result2.data || [];
    console.log(`✅ Success! Found ${packages2.length} packages for PEN currency`);
    
    // Test 3: Test with active filter
    console.log('\n3️⃣ Testing GET /api/packages?active=true...');
    const response3 = await fetch(`${baseUrl}/api/packages?active=true`);
    
    if (!response3.ok) {
      throw new Error(`HTTP ${response3.status}: ${response3.statusText}`);
    }
    
    const result3 = await response3.json();
    const packages3 = result3.data || [];
    console.log(`✅ Success! Found ${packages3.length} active packages`);
    
    // Test 4: Test with inactive packages
    console.log('\n4️⃣ Testing GET /api/packages?active=false...');
    const response4 = await fetch(`${baseUrl}/api/packages?active=false`);
    
    if (!response4.ok) {
      throw new Error(`HTTP ${response4.status}: ${response4.statusText}`);
    }
    
    const result4 = await response4.json();
    const packages4 = result4.data || [];
    console.log(`✅ Success! Found ${packages4.length} inactive packages`);
    
    console.log('\n🎉 All tests passed! Packages API is working correctly.');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`   - Default packages: ${packages1.length}`);
    console.log(`   - PEN currency packages: ${packages2.length}`);
    console.log(`   - Active packages: ${packages3.length}`);
    console.log(`   - Inactive packages: ${packages4.length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the Next.js dev server is running (npm run dev)');
    console.log('   2. Check if the database is connected');
    console.log('   3. Verify the API route exists at /api/packages');
    console.log('   4. Check the server logs for errors');
    process.exit(1);
  }
}

// Run the test
testPackagesAPI();
