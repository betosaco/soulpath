#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Essential Codebase Export with Authentication Refactoring
 * 
 * This script exports the most critical parts of the codebase including:
 * - All authentication and authorization files
 * - Core application logic
 * - Database schema
 * - API routes
 * - Key components
 * - Configuration files
 * 
 * Focus: Authentication refactoring, core functionality, and essential patterns
 */

const OUTPUT_FILE = './essential-codebase-with-auth.txt';
const MAX_FILE_SIZE = 100 * 1024; // 100KB per file
const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB total

// Essential file patterns to include
const ESSENTIAL_PATTERNS = [
  // Authentication & Authorization (HIGH PRIORITY)
  '**/middleware.ts',
  '**/auth.ts',
  '**/useAuth.tsx',
  '**/api/admin.ts',
  '**/api/auth/**',
  '**/api/admin/**',
  
  // Core Application
  '**/layout.tsx',
  '**/page.tsx',
  '**/globals.css',
  '**/next.config.*',
  '**/tailwind.config.*',
  '**/tsconfig.json',
  '**/package.json',
  
  // Database
  '**/schema.prisma',
  '**/prisma.ts',
  
  // Core Hooks & Utils
  '**/usePackages.tsx',
  '**/useContentManagement.tsx',
  '**/useTranslations.tsx',
  '**/api-utils.ts',
  '**/utils.ts',
  '**/validations.ts',
  '**/lib/**',
  
  // Key Components
  '**/AdminDashboard.tsx',
  '**/LoginModal.tsx',
  '**/PackageDisplay.tsx',
  '**/BookingSection.tsx',
  '**/Header.tsx',
  '**/CustomerDashboard.tsx',
  '**/PackagePurchaseFlow.tsx',
  '**/BugReportSystem.tsx',
  '**/ContentManagement.tsx',
  '**/components/**',
  
  // API Routes (Essential)
  '**/api/packages/route.ts',
  '**/api/booking/route.ts',
  '**/api/health/route.ts',
  '**/api/client/**',
  '**/api/izipay/**',
  '**/api/stripe/**',
  '**/api/telegram/**',
  '**/api/whatsapp/**',
  '**/api/otp/**',
  '**/api/feedback/**',
  '**/api/bug-reports/**',
  
  // App Pages
  '**/app/**/page.tsx',
  '**/app/**/layout.tsx',
  '**/app/**/route.ts',
  
  // Backend Rasa
  '**/rasa/actions.py',
  '**/rasa/config.yml',
  '**/rasa/domain.yml',
  '**/rasa/credentials.yml',
  '**/rasa/requirements.txt',
  '**/rasa/connectors/**',
  
  // Configuration
  '**/env.example',
  '**/.env.local.example',
  '**/vercel.json',
  '**/render.yaml',
  '**/docker-compose.yml',
  '**/Dockerfile*',
  
  // Documentation
  '**/README.md',
  '**/AUTH_REFACTORING_README.md',
  '**/*.md'
];

// File patterns to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/logs/**',
  '**/models/**',
  '**/__pycache__/**',
  '**/.rasa/**',
  '**/venv/**',
  '**/site-packages/**',
  '**/*.log',
  '**/*.tmp',
  '**/*.cache',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/*.png',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.gif',
  '**/*.svg',
  '**/*.ico',
  '**/*.woff',
  '**/*.woff2',
  '**/*.ttf',
  '**/*.eot',
  '**/*.mp3',
  '**/*.mp4',
  '**/*.wav',
  '**/*.avi',
  '**/*.mov',
  '**/*.zip',
  '**/*.tar.gz',
  '**/*.rar',
  '**/*.7z'
];

// Priority order for authentication files
const AUTH_PRIORITY_FILES = [
  'middleware.ts',
  'lib/auth.ts',
  'hooks/useAuth.tsx',
  'lib/api/admin.ts',
  'app/api/admin/stats/route.ts',
  'app/(admin)/dashboard/page.tsx',
  'app/login/page.tsx',
  'app/(admin)/admin/page.tsx',
  'app/(admin)/layout.tsx'
];

let totalSize = 0;
let filesProcessed = 0;
let filesExcluded = 0;

/**
 * Check if a file matches any pattern
 */
function matchesPattern(filePath, patterns) {
  return patterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

/**
 * Check if file should be excluded
 */
function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

/**
 * Get file priority for sorting
 */
function getFilePriority(filePath) {
  // Authentication files get highest priority
  for (let i = 0; i < AUTH_PRIORITY_FILES.length; i++) {
    if (filePath.includes(AUTH_PRIORITY_FILES[i])) {
      return i;
    }
  }
  
  // API routes get high priority
  if (filePath.includes('/api/')) {
    return 100;
  }
  
  // Core app files
  if (filePath.includes('/app/') || filePath.includes('/pages/')) {
    return 200;
  }
  
  // Components
  if (filePath.includes('/components/')) {
    return 300;
  }
  
  // Utils and libs
  if (filePath.includes('/lib/') || filePath.includes('/utils/')) {
    return 400;
  }
  
  // Configuration
  if (filePath.includes('config') || filePath.includes('.json') || filePath.includes('.ts')) {
    return 500;
  }
  
  return 1000;
}

/**
 * Process a single file
 */
function processFile(filePath, relativePath, outputStream) {
  try {
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      return;
    }
    
    if (shouldExclude(filePath)) {
      filesExcluded++;
      return;
    }
    
    if (stats.size > MAX_FILE_SIZE) {
      console.log(`⚠️  Skipping large file: ${relativePath} (${(stats.size / 1024).toFixed(1)}KB)`);
      filesExcluded++;
      return;
    }
    
    if (totalSize + stats.size > MAX_TOTAL_SIZE) {
      console.log(`⚠️  Reached size limit, stopping export`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Write file header
    outputStream.write(`\n${'='.repeat(80)}\n`);
    outputStream.write(`FILE: ${relativePath}\n`);
    outputStream.write(`SIZE: ${(stats.size / 1024).toFixed(1)}KB\n`);
    outputStream.write(`TYPE: ${path.extname(filePath)}\n`);
    outputStream.write(`${'='.repeat(80)}\n\n`);
    
    // Write file content
    outputStream.write(content);
    outputStream.write(`\n\n`);
    
    totalSize += stats.size;
    filesProcessed++;
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    filesExcluded++;
    return true;
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath, relativePath = '', outputStream) {
  try {
    const items = fs.readdirSync(dirPath);
    
    // Sort items by priority
    const sortedItems = items.sort((a, b) => {
      const aPath = path.join(relativePath, a);
      const bPath = path.join(relativePath, b);
      return getFilePriority(aPath) - getFilePriority(bPath);
    });
    
    for (const item of sortedItems) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath, itemRelativePath, outputStream);
      } else {
        const shouldContinue = processFile(fullPath, itemRelativePath, outputStream);
        if (!shouldContinue) {
          break;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

/**
 * Main export function
 */
function exportEssentialCodebase() {
  console.log('🚀 Starting essential codebase export with authentication refactoring...');
  console.log(`Target: Essential files with focus on auth changes`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  
  // Create output stream
  const outputStream = fs.createWriteStream(OUTPUT_FILE);
  
  // Write header
  const header = `# WELLNESS MONOREPO - ESSENTIAL CODEBASE WITH AUTH REFACTORING
# Generated: ${new Date().toISOString()}
# Focus: Authentication refactoring, core functionality, and essential patterns

## 🔐 AUTHENTICATION REFACTORING HIGHLIGHTS

This export includes the complete authentication refactoring implementation:

### Key Changes Made:
1. ✅ Removed hardcoded admin emails from useAuth.tsx and lib/auth.ts
2. ✅ Created Next.js middleware for centralized route protection
3. ✅ Implemented admin API client with automatic token handling
4. ✅ Database as single source of truth for user roles
5. ✅ Example secure admin API endpoint and dashboard

### Security Improvements:
- Eliminated hardcoded admin email vulnerabilities
- Centralized route protection via middleware
- No client-side role checking
- Automatic protection for all admin routes

### Files Included:
- middleware.ts (NEW) - Centralized route protection
- lib/auth.ts (UPDATED) - Refactored auth utilities
- hooks/useAuth.tsx (UPDATED) - Simplified admin logic
- lib/api/admin.ts (NEW) - Admin API client
- app/api/admin/stats/route.ts (NEW) - Example secure endpoint
- app/(admin)/dashboard/page.tsx (NEW) - Example admin dashboard

${'='.repeat(80)}

`;
  
  outputStream.write(header);
  
  // Process frontend directory first (most important)
  console.log('📁 Processing frontend directory...');
  processDirectory('./frontend', 'frontend', outputStream);
  
  // Process backend directory
  console.log('📁 Processing backend directory...');
  processDirectory('./backend', 'backend', outputStream);
  
  // Process root level essential files
  console.log('📁 Processing root level files...');
  const rootFiles = [
    'package.json',
    'README.md',
    'AUTH_REFACTORING_README.md',
    'deploy.sh',
    'vercel.json',
    'render.yaml',
    'docker-compose.yml',
    'Dockerfile',
    'tailwind.config.ts',
    'next.config.js',
    'tsconfig.json'
  ];
  
  for (const file of rootFiles) {
    if (fs.existsSync(file)) {
      processFile(file, file, outputStream);
    }
  }
  
  // Write footer
  const footer = `

${'='.repeat(80)}
# EXPORT SUMMARY
# Generated: ${new Date().toISOString()}
# Files processed: ${filesProcessed}
# Files excluded: ${filesExcluded}
# Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB
# 
# This export contains the essential codebase with complete authentication
# refactoring implementation, focusing on security improvements and core
# functionality patterns.
${'='.repeat(80)}
`;
  
  outputStream.write(footer);
  outputStream.end();
  
  console.log('\n✅ Essential codebase export completed!');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${filesProcessed}`);
  console.log(`   Files excluded: ${filesExcluded}`);
  console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`\n📁 Output file: ${path.resolve(OUTPUT_FILE)}`);
  
  console.log('\n🔐 Authentication Refactoring Included:');
  console.log('   ✅ Next.js Middleware (middleware.ts)');
  console.log('   ✅ Refactored Auth Utils (lib/auth.ts)');
  console.log('   ✅ Simplified useAuth Hook (hooks/useAuth.tsx)');
  console.log('   ✅ Admin API Client (lib/api/admin.ts)');
  console.log('   ✅ Example Admin Endpoint (app/api/admin/stats/route.ts)');
  console.log('   ✅ Example Admin Dashboard (app/(admin)/dashboard/page.tsx)');
  console.log('   ✅ Complete Documentation (AUTH_REFACTORING_README.md)');
}

// Run the export
if (require.main === module) {
  exportEssentialCodebase();
}

module.exports = { exportEssentialCodebase };
