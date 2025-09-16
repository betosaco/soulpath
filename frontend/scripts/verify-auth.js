#!/usr/bin/env node

/**
 * Authentication Verification Script
 * 
 * This script verifies that all admin API endpoints properly require authentication
 * and that all admin components use the centralized adminApi client.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// API endpoints that should require authentication
// const ADMIN_API_ENDPOINTS = [
//   '/api/admin/users',
//   '/api/admin/bookings',
//   '/api/admin/stats',
//   '/api/admin/content',
//   '/api/admin/communication',
//   '/api/admin/bug-reports',
//   '/api/admin/health',
//   '/api/admin/external-apis',
//   '/api/admin/package-definitions',
//   '/api/admin/schedule-templates',
//   '/api/admin/schedule-slots',
//   '/api/admin/session-durations',
//   '/api/admin/payment-methods',
//   '/api/admin/payment-records',
//   '/api/admin/purchases',
//   '/api/admin/images',
//   '/api/admin/seo',
//   '/api/admin/live-session-config',
//   '/api/admin/telegram-config',
//   '/api/admin/sms-config',
//   '/api/admin/email',
//   '/api/admin/rasa',
//   '/api/admin/conversation-logs'
// ];

// Components that should use adminApi
const ADMIN_COMPONENTS = [
  'ClientManagement',
  'BookingsManagement',
  'ScheduleManagement',
  'PackagesAndPricing',
  'ContentManagement',
  'CommunicationSettings',
  'ImageManagement',
  'SeoManagement',
  'PaymentMethodManagement',
  'PaymentRecordsManagement',
  'PurchaseHistoryManagement',
  'SettingsManagement',
  'BugReportManagement',
  'LiveSessionConfigManagement',
  'ExternalAPIManagement',
  'RasaMonitoring',
  'RasaModelTuning',
  'ConversationLogsManagement'
];

function checkApiEndpointAuth(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check if endpoint requires authentication
  if (!content.includes('requireAuth') && !content.includes('getAuthenticatedUser')) {
    issues.push('Missing authentication check');
  }
  
  // Check if endpoint validates admin role
  if (content.includes('requireAuth') && !content.includes("role !== 'admin'")) {
    issues.push('Missing admin role validation');
  }
  
  // Check for proper error responses
  if (!content.includes('401') && !content.includes('Unauthorized')) {
    issues.push('Missing 401 Unauthorized response');
  }
  
  return issues;
}

function checkComponentAuth(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check if component uses adminApi instead of direct fetch
  if (content.includes('fetch(') && content.includes('/api/admin/') && !content.includes('adminApi')) {
    issues.push('Using direct fetch instead of adminApi');
  }
  
  // Check if component imports adminApi
  if (content.includes('/api/admin/') && !content.includes("from '@/lib/api/admin'")) {
    issues.push('Missing adminApi import');
  }
  
  // Check if component handles authentication errors
  if (content.includes('adminApi') && !content.includes('response.success')) {
    issues.push('Missing success response handling');
  }
  
  return issues;
}

function findApiFiles() {
  const apiDir = path.join(__dirname, '../app/api/admin');
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item === 'route.ts') {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(apiDir);
  return files;
}

function findComponentFiles() {
  const componentsDir = path.join(__dirname, '../components');
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.tsx') && ADMIN_COMPONENTS.some(comp => item.includes(comp))) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(componentsDir);
  return files;
}

function main() {
  log('cyan', '🔐 Authentication Verification Report');
  log('cyan', '=====================================\n');
  
  let totalIssues = 0;
  
  // Check API endpoints
  log('blue', '📡 Checking API Endpoints...');
  const apiFiles = findApiFiles();
  
  for (const file of apiFiles) {
    const relativePath = path.relative(__dirname, file);
    const issues = checkApiEndpointAuth(file);
    
    if (issues.length === 0) {
      log('green', `✅ ${relativePath}`);
    } else {
      log('red', `❌ ${relativePath}`);
      for (const issue of issues) {
        log('yellow', `   - ${issue}`);
        totalIssues++;
      }
    }
  }
  
  log('');
  
  // Check components
  log('blue', '🧩 Checking Admin Components...');
  const componentFiles = findComponentFiles();
  
  for (const file of componentFiles) {
    const relativePath = path.relative(__dirname, file);
    const issues = checkComponentAuth(file);
    
    if (issues.length === 0) {
      log('green', `✅ ${relativePath}`);
    } else {
      log('red', `❌ ${relativePath}`);
      for (const issue of issues) {
        log('yellow', `   - ${issue}`);
        totalIssues++;
      }
    }
  }
  
  log('');
  
  // Summary
  if (totalIssues === 0) {
    log('green', '🎉 All authentication checks passed!');
  } else {
    log('red', `⚠️  Found ${totalIssues} authentication issues that need to be fixed.`);
  }
  
  log('');
  log('cyan', '📋 Recommendations:');
  log('yellow', '1. All API endpoints should use requireAuth() and check for admin role');
  log('yellow', '2. All admin components should use adminApi instead of direct fetch');
  log('yellow', '3. All API calls should handle authentication errors properly');
  log('yellow', '4. All components should check response.success before using data');
  
  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
