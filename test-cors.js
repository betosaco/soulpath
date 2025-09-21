#!/usr/bin/env node

/**
 * CORS Test Script
 * Tests CORS configuration for the wellness application
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_ENDPOINTS = [
  '/api/packages',
  '/api/health',
  '/api/content',
  '/api/sections'
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const options = {
      method,
      headers: {
        'Origin': 'http://localhost:3001', // Simulate cross-origin request
        'Access-Control-Request-Method': method,
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    };

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testCorsHeaders(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    log(`\n🔍 Testing ${endpoint}...`, 'blue');
    
    // Test OPTIONS preflight request
    log('  Testing OPTIONS preflight...', 'yellow');
    const optionsResponse = await makeRequest(url, 'OPTIONS');
    
    const corsHeaders = {
      'access-control-allow-origin': optionsResponse.headers['access-control-allow-origin'],
      'access-control-allow-methods': optionsResponse.headers['access-control-allow-methods'],
      'access-control-allow-headers': optionsResponse.headers['access-control-allow-headers'],
      'access-control-allow-credentials': optionsResponse.headers['access-control-allow-credentials'],
      'access-control-max-age': optionsResponse.headers['access-control-max-age']
    };

    log(`  Status: ${optionsResponse.statusCode}`, optionsResponse.statusCode === 200 ? 'green' : 'red');
    
    // Check CORS headers
    const hasOrigin = corsHeaders['access-control-allow-origin'] === '*';
    const hasMethods = corsHeaders['access-control-allow-methods']?.includes('GET');
    const hasHeaders = corsHeaders['access-control-allow-headers']?.includes('Content-Type');
    const hasCredentials = corsHeaders['access-control-allow-credentials'] === 'true';

    log(`  CORS Headers:`, 'yellow');
    log(`    Access-Control-Allow-Origin: ${corsHeaders['access-control-allow-origin'] || 'MISSING'}`, hasOrigin ? 'green' : 'red');
    log(`    Access-Control-Allow-Methods: ${corsHeaders['access-control-allow-methods'] || 'MISSING'}`, hasMethods ? 'green' : 'red');
    log(`    Access-Control-Allow-Headers: ${corsHeaders['access-control-allow-headers'] || 'MISSING'}`, hasHeaders ? 'green' : 'red');
    log(`    Access-Control-Allow-Credentials: ${corsHeaders['access-control-allow-credentials'] || 'MISSING'}`, hasCredentials ? 'green' : 'red');

    // Test actual GET request
    log('  Testing GET request...', 'yellow');
    const getResponse = await makeRequest(url, 'GET');
    log(`  Status: ${getResponse.statusCode}`, getResponse.statusCode < 400 ? 'green' : 'red');

    const allCorsHeadersPresent = hasOrigin && hasMethods && hasHeaders && hasCredentials;
    return {
      endpoint,
      success: allCorsHeadersPresent && optionsResponse.statusCode === 200,
      corsHeaders,
      statusCode: optionsResponse.statusCode
    };

  } catch (error) {
    log(`  ❌ Error testing ${endpoint}: ${error.message}`, 'red');
    return {
      endpoint,
      success: false,
      error: error.message
    };
  }
}

async function main() {
  log('🚀 CORS Configuration Test', 'bold');
  log('============================', 'bold');
  log(`Testing against: ${BASE_URL}`, 'blue');
  
  const results = [];
  
  for (const endpoint of TEST_ENDPOINTS) {
    const result = await testCorsHeaders(endpoint);
    results.push(result);
  }

  // Summary
  log('\n📊 Test Summary', 'bold');
  log('================', 'bold');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    log(`${status} ${result.endpoint}`, result.success ? 'green' : 'red');
  });
  
  log(`\nResults: ${successful}/${total} endpoints passed CORS tests`, successful === total ? 'green' : 'red');
  
  if (successful === total) {
    log('\n🎉 All CORS tests passed! Your application should work from different IPs.', 'green');
  } else {
    log('\n⚠️  Some CORS tests failed. Check the configuration above.', 'yellow');
  }
}

// Run the test
main().catch(console.error);
