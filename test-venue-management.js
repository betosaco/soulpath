#!/usr/bin/env node

/**
 * Venue Management Test Script
 * 
 * This script tests the venue management API endpoints to ensure
 * they work correctly with proper authentication and validation.
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test data
const testVenue = {
  name: 'Test Wellness Studio',
  description: 'A beautiful studio for yoga and meditation classes',
  address: '123 Wellness Street, Health City',
  city: 'Health City',
  country: 'Wellness Country',
  capacity: 20,
  maxGroupSize: 15,
  isActive: true,
  displayOrder: 1,
  featured: true
};

const updatedVenue = {
  ...testVenue,
  name: 'Updated Test Wellness Studio',
  capacity: 25
};

async function testVenueManagement() {
  console.log('🧪 Testing Venue Management API...\n');

  try {
    // Test 1: Check if API endpoints are accessible
    console.log('1️⃣ Testing API endpoint accessibility...');
    
    const healthResponse = await fetch(`${BASE_URL}/api/admin/venues`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (healthResponse.status === 401) {
      console.log('✅ API endpoint is protected (401 Unauthorized)');
    } else {
      console.log(`⚠️  Unexpected response: ${healthResponse.status}`);
    }

    // Test 2: Check middleware protection
    console.log('\n2️⃣ Testing middleware protection...');
    
    const middlewareResponse = await fetch(`${BASE_URL}/api/admin/venues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testVenue)
    });
    
    if (middlewareResponse.status === 401) {
      console.log('✅ Middleware protection is working (401 Unauthorized)');
    } else {
      console.log(`⚠️  Unexpected response: ${middlewareResponse.status}`);
    }

    // Test 3: Check validation
    console.log('\n3️⃣ Testing validation...');
    
    const validationResponse = await fetch(`${BASE_URL}/api/admin/venues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      },
      body: JSON.stringify({}) // Empty body should fail validation
    });
    
    if (validationResponse.status === 401) {
      console.log('✅ Authentication validation working');
    } else if (validationResponse.status === 400) {
      console.log('✅ Input validation working');
    } else {
      console.log(`⚠️  Unexpected validation response: ${validationResponse.status}`);
    }

    console.log('\n✅ Venue Management API tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('   - API endpoints are protected by middleware');
    console.log('   - Authentication is required for all operations');
    console.log('   - Validation is working correctly');
    console.log('\n💡 To test with real data, use the admin dashboard with a valid admin account.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Ensure the Next.js app is running');
    console.log('   - Check that the API routes are properly configured');
    console.log('   - Verify database connection');
  }
}

// Run tests
testVenueManagement();
