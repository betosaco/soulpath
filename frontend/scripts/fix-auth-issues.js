#!/usr/bin/env node

/**
 * Authentication Fix Script
 * 
 * This script systematically fixes all authentication issues in API endpoints
 * and admin components by adding proper auth checks and updating to use adminApi.
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

// Standard auth check template
const AUTH_CHECK_TEMPLATE = `    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }`;

// Standard import template
const AUTH_IMPORT_TEMPLATE = `import { requireAuth } from '@/lib/auth';`;

// AdminApi import template
const ADMIN_API_IMPORT_TEMPLATE = `import { adminApi } from '@/lib/api/admin';`;

function fixApiEndpoint(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  let changes = [];

  // Add auth import if missing
  if (!content.includes("from '@/lib/auth'")) {
    const importMatch = content.match(/import.*from 'next\/server';/);
    if (importMatch) {
      updated = updated.replace(
        importMatch[0],
        `${importMatch[0]}\n${AUTH_IMPORT_TEMPLATE}`
      );
      changes.push('Added auth import');
    }
  }

  // Add auth check to GET method
  if (content.includes('export async function GET(') && !content.includes('requireAuth(request)')) {
    const getMatch = content.match(/export async function GET\([^)]*\)\s*\{[^}]*try\s*\{/);
    if (getMatch) {
      const replacement = getMatch[0].replace(
        /try\s*\{/,
        `try {\n${AUTH_CHECK_TEMPLATE}\n`
      );
      updated = updated.replace(getMatch[0], replacement);
      changes.push('Added auth check to GET method');
    }
  }

  // Add auth check to POST method
  if (content.includes('export async function POST(') && !content.includes('requireAuth(request)')) {
    const postMatch = content.match(/export async function POST\([^)]*\)\s*\{[^}]*try\s*\{/);
    if (postMatch) {
      const replacement = postMatch[0].replace(
        /try\s*\{/,
        `try {\n${AUTH_CHECK_TEMPLATE}\n`
      );
      updated = updated.replace(postMatch[0], replacement);
      changes.push('Added auth check to POST method');
    }
  }

  // Add auth check to PUT method
  if (content.includes('export async function PUT(') && !content.includes('requireAuth(request)')) {
    const putMatch = content.match(/export async function PUT\([^)]*\)\s*\{[^}]*try\s*\{/);
    if (putMatch) {
      const replacement = putMatch[0].replace(
        /try\s*\{/,
        `try {\n${AUTH_CHECK_TEMPLATE}\n`
      );
      updated = updated.replace(putMatch[0], replacement);
      changes.push('Added auth check to PUT method');
    }
  }

  // Add auth check to DELETE method
  if (content.includes('export async function DELETE(') && !content.includes('requireAuth(request)')) {
    const deleteMatch = content.match(/export async function DELETE\([^)]*\)\s*\{[^}]*try\s*\{/);
    if (deleteMatch) {
      const replacement = deleteMatch[0].replace(
        /try\s*\{/,
        `try {\n${AUTH_CHECK_TEMPLATE}\n`
      );
      updated = updated.replace(deleteMatch[0], replacement);
      changes.push('Added auth check to DELETE method');
    }
  }

  // Update error responses to include success: false
  updated = updated.replace(
    /return NextResponse\.json\(\s*\{\s*error:/g,
    'return NextResponse.json({ success: false, error:'
  );

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    return changes;
  }

  return [];
}

function fixAdminComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  let changes = [];

  // Add adminApi import if missing and component uses /api/admin/
  if (content.includes('/api/admin/') && !content.includes("from '@/lib/api/admin'")) {
    const importMatch = content.match(/import.*from 'react';/);
    if (importMatch) {
      updated = updated.replace(
        importMatch[0],
        `${importMatch[0]}\n${ADMIN_API_IMPORT_TEMPLATE}`
      );
      changes.push('Added adminApi import');
    }
  }

  // Replace direct fetch calls with adminApi calls
  const fetchMatches = content.matchAll(/const response = await fetch\(\s*`([^`]+)`[^`]*`[^`]*,\s*\{[^}]*headers:\s*\{[^}]*Authorization:\s*`Bearer \$\{user\.access_token\}`[^}]*\}[^}]*\}\);/g);
  
  for (const match of fetchMatches) {
    const url = match[1];
    const fullMatch = match[0];
    
    // Extract API method from URL
    let apiMethod = 'get';
    if (url.includes('/api/admin/users')) {
      apiMethod = 'adminApi.getUsers()';
    } else if (url.includes('/api/admin/bookings')) {
      apiMethod = 'adminApi.getBookings()';
    } else if (url.includes('/api/admin/stats')) {
      apiMethod = 'adminApi.getDashboardStats()';
    } else if (url.includes('/api/admin/content')) {
      apiMethod = 'adminApi.getContent()';
    } else if (url.includes('/api/admin/bug-reports')) {
      apiMethod = 'adminApi.getBugReports()';
    } else {
      // Generic replacement
      apiMethod = `adminApi.makeRequest('${url}')`;
    }
    
    const replacement = `const response = await ${apiMethod};`;
    updated = updated.replace(fullMatch, replacement);
    changes.push(`Replaced fetch with ${apiMethod}`);
  }

  // Update response handling to check success
  updated = updated.replace(
    /if \(response\.ok\)/g,
    'if (response.success)'
  );

  updated = updated.replace(
    /const data = await response\.json\(\);/g,
    'const data = response.data;'
  );

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    return changes;
  }

  return [];
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
      } else if (item.endsWith('.tsx') && (
        item.includes('Management') || 
        item.includes('Admin') ||
        item.includes('Config')
      )) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(componentsDir);
  return files;
}

function main() {
  log('cyan', '🔧 Fixing Authentication Issues');
  log('cyan', '================================\n');
  
  let totalFixed = 0;
  
  // Fix API endpoints
  log('blue', '📡 Fixing API Endpoints...');
  const apiFiles = findApiFiles();
  
  for (const file of apiFiles) {
    const relativePath = path.relative(__dirname, file);
    const changes = fixApiEndpoint(file);
    
    if (changes.length > 0) {
      log('green', `✅ ${relativePath}`);
      for (const change of changes) {
        log('yellow', `   - ${change}`);
        totalFixed++;
      }
    } else {
      log('blue', `⚪ ${relativePath} (no changes needed)`);
    }
  }
  
  log('');
  
  // Fix components
  log('blue', '🧩 Fixing Admin Components...');
  const componentFiles = findComponentFiles();
  
  for (const file of componentFiles) {
    const relativePath = path.relative(__dirname, file);
    const changes = fixAdminComponent(file);
    
    if (changes.length > 0) {
      log('green', `✅ ${relativePath}`);
      for (const change of changes) {
        log('yellow', `   - ${change}`);
        totalFixed++;
      }
    } else {
      log('blue', `⚪ ${relativePath} (no changes needed)`);
    }
  }
  
  log('');
  
  // Summary
  if (totalFixed > 0) {
    log('green', `🎉 Fixed ${totalFixed} authentication issues!`);
  } else {
    log('blue', 'ℹ️  No issues found to fix.');
  }
  
  log('');
  log('cyan', '📋 Next Steps:');
  log('yellow', '1. Run the verification script to check remaining issues');
  log('yellow', '2. Test the admin dashboard to ensure everything works');
  log('yellow', '3. Check for any TypeScript errors');
  
  process.exit(0);
}

main();
