#!/usr/bin/env node

/**
 * Debug script to test packages loading
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugPackages() {
  console.log('🔍 Debugging packages loading...\n');

  try {
    // Test 1: Check API directly
    console.log('1️⃣ Testing API directly...');
    const response = await fetch('http://localhost:3000/api/packages?currency=PEN&active=true');
    const result = await response.json();
    
    console.log('✅ API Response:');
    console.log('  - Success:', result.success);
    console.log('  - Data length:', result.data ? result.data.length : 'no data');
    console.log('  - First package:', result.data ? result.data[0] : 'none');
    
    // Test 2: Check packages page HTML
    console.log('\n2️⃣ Testing packages page...');
    const pageResponse = await fetch('http://localhost:3000/packages');
    const pageHtml = await pageResponse.text();
    
    const hasPackages = pageHtml.includes('01 MATPASS') || pageHtml.includes('04 MATPASS');
    const hasNoPackages = pageHtml.includes('No packages available');
    
    console.log('✅ Page Analysis:');
    console.log('  - Contains package names:', hasPackages);
    console.log('  - Shows "No packages":', hasNoPackages);
    console.log('  - Page loads successfully:', pageResponse.ok);
    
    // Test 3: Check for JavaScript errors
    console.log('\n3️⃣ Checking for common issues...');
    
    if (result.success && result.data && result.data.length > 0) {
      console.log('✅ API is working correctly');
      
      if (hasNoPackages && !hasPackages) {
        console.log('❌ Frontend issue: API has data but page shows "No packages"');
        console.log('🔧 This suggests a client-side JavaScript issue');
        console.log('🔧 Possible causes:');
        console.log('   - JavaScript error preventing packages from loading');
        console.log('   - Data structure mismatch between API and frontend');
        console.log('   - Timing issue with API call');
        console.log('   - Client-side hydration issue');
      } else if (hasPackages) {
        console.log('✅ Packages are being displayed correctly');
      }
    } else {
      console.log('❌ API issue: No packages returned');
    }

  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
  }
}

debugPackages();
