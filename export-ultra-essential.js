#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * ULTRA ESSENTIAL Frontend Code Export Script (with UI Components)
 *
 * This script exports essential frontend code including UI component libraries:
 * - Core lib files (auth, api, utils, validations)
 * - Essential hooks (useAuth, usePackages, etc.)
 * - Critical components (PaymentForm, LoginModal, Header)
 * - UI Component Libraries (buttons, forms, modals, etc.)
 * - Theme and styling utilities
 * - Core API routes (auth, admin, payments)
 * - Essential configuration files
 *
 * Excludes admin components, scripts, and non-essential files.
 */

const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-ultra-essential-with-ui-code.txt';
const MAX_FILE_SIZE = 300 * 1024; // 300KB per file limit
const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB total limit

// ONLY ESSENTIAL FILES - Highly selective
const ESSENTIAL_FILES = [
  // 🔐 AUTH & SECURITY - MOST CRITICAL
  'lib/auth.ts',
  'lib/api/admin.ts',
  'lib/api/index.ts',
  'hooks/useAuth.tsx',
  'middleware.ts',

  // 💳 PAYMENT - CRITICAL
  'lib/stripe/config.ts',
  'lib/stripe/payment-service.ts',
  'components/PaymentForm.tsx',

  // 🗄️ DATABASE & DATA
  'lib/prisma.ts',
  'lib/redis.ts',
  'prisma/schema.prisma',

  // 🔧 CORE UTILITIES
  'lib/utils.ts',
  'lib/validations.ts',
  'lib/api-utils.ts',
  'lib/safe-fetch.ts',

  // 🎣 HOOKS - ESSENTIAL
  'hooks/usePackages.tsx',
  'hooks/useTranslations.tsx',
  'hooks/useContentManagement.tsx',

  // 🎨 UI COMPONENTS - CORE ONLY
  'components/LoginModal.tsx',
  'components/Header.tsx',
  'components/CentralizedHeader.tsx',
  'components/AdminDashboard.tsx',

  // 🧩 UI COMPONENT LIBRARIES - ESSENTIAL
  'components/ui/**',  // All UI components
  'lib/theme/**',      // Theme utilities
  'lib/styles/**',     // Style utilities

  // 🚀 API ROUTES - ESSENTIAL ONLY
  'app/api/auth/login/route.ts',
  'app/api/auth/reset-password/route.ts',
  'app/api/auth/verify/route.ts',
  'app/api/admin/stats/route.ts',
  'app/api/packages/route.ts',
  'app/api/health/route.ts',

  // ⚙️ CONFIGURATION - ESSENTIAL
  'next.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  'package.json',
  'tsconfig.json',
  'app/layout.tsx',
  'app/globals.css'
];

// File patterns to exclude (very restrictive)
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'coverage',
  'logs',
  '__pycache__',
  '.temp',
  '.branches',
  'backups',
  'scripts',
  'rasa',
  'models',
  'public',
  'types',
  'utils',
  'components/admin', // Exclude admin components except core
  'components/modals', // Exclude modals except LoginModal
  'components/stripe', // Exclude stripe components except core
  'lib/services', // Exclude services except core
  'lib/communication', // Exclude communication libs
  'lib/data', // Exclude data files
  'lib/types', // Exclude type definitions
  'app/api' // Exclude all API routes except specified ones
];

// Specific files to exclude
const EXCLUDE_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.gitignore',
  '.eslintrc.json',
  '.prettierrc',
  'tsconfig.tsbuildinfo',
  'next-env.d.ts',
  'postcss.config.js',
  'vercel.json',
  'README.md'
];

let totalFiles = 0;
let totalSize = 0;
let excludedFiles = 0;

/**
 * Check if file should be included based on essential files list
 */
function shouldIncludeFile(filePath) {
  // Remove frontend/ prefix if present
  const relativePath = filePath.replace(/^frontend\//, '');

  // Check if file is in essential files list
  return ESSENTIAL_FILES.some(essentialFile => {
    // Exact match
    if (relativePath === essentialFile) {
      return true;
    }

    // Pattern match (for directories like lib/api/**)
    if (essentialFile.includes('**')) {
      const pattern = essentialFile.replace('**', '.*');
      const regex = new RegExp(pattern.replace(/\*/g, '[^/]*'));
      return regex.test(relativePath);
    }

    return false;
  });
}

/**
 * Check if file should be excluded
 */
function shouldExcludeFile(filePath, fileName) {
  // Check if file is in excluded files
  if (EXCLUDE_FILES.includes(fileName)) {
    return true;
  }

  // Check if file path contains excluded patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (filePath.includes(pattern)) {
      return true;
    }
  }

  return false;
}

/**
 * Clean and format file content
 */
function cleanFileContent(content, filePath) {
  let cleaned = content;

  // Remove debug statements and console logs
  cleaned = cleaned.replace(/console\.(log|debug|warn|error)\([^)]*\);?/g, '');
  cleaned = cleaned.replace(/debugger;?/g, '');

  // Remove empty lines (keep some structure)
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Remove trailing whitespace
  cleaned = cleaned.replace(/[ \t]+$/gm, '');

  return cleaned;
}

/**
 * Process a single file
 */
function processFile(filePath, relativePath, outputStream) {
  try {
    const fileName = path.basename(filePath);
    const stats = fs.statSync(filePath);

    // Skip directories
    if (stats.isDirectory()) {
      return true;
    }

    // Check if file should be excluded
    if (shouldExcludeFile(filePath, fileName)) {
      excludedFiles++;
      return true;
    }

    // Check if file should be included (essential files only)
    if (!shouldIncludeFile(filePath)) {
      excludedFiles++;
      return true;
    }

    // Check file size limits
    if (stats.size > MAX_FILE_SIZE) {
      console.log(`⚠️  Skipping large file: ${relativePath} (${(stats.size / 1024).toFixed(1)}KB)`);
      excludedFiles++;
      return true;
    }

    if (totalSize + stats.size > MAX_TOTAL_SIZE) {
      console.log(`⚠️  Reached total size limit, stopping export`);
      return false;
    }

    // Read and process file content
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = cleanFileContent(content, filePath);

    // Skip empty files
    if (cleanedContent.trim().length === 0) {
      console.log(`⚠️  Skipping empty file: ${relativePath}`);
      excludedFiles++;
      return true;
    }

    // Write file header
    const fileSizeKB = (stats.size / 1024).toFixed(1);
    outputStream.write(`\n${'='.repeat(80)}\n`);
    outputStream.write(`📄 FILE: ${relativePath}\n`);
    outputStream.write(`📏 SIZE: ${fileSizeKB} KB\n`);
    outputStream.write(`🏷️  TYPE: ${path.extname(filePath)}\n`);
    outputStream.write(`${'='.repeat(80)}\n\n`);

    // Write file content
    outputStream.write(cleanedContent);
    outputStream.write('\n\n');

    totalFiles++;
    totalSize += stats.size;

    console.log(`✅ Processed: ${relativePath} (${fileSizeKB}KB)`);

    return true;

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    excludedFiles++;
    return true;
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath, relativePath = '', outputStream) {
  try {
    const items = fs.readdirSync(dirPath);

    // Sort items for consistent output
    const sortedItems = items.sort((a, b) => {
      // Prioritize important directories
      const priorityDirs = ['lib', 'hooks', 'components', 'app', 'prisma'];
      const aPriority = priorityDirs.indexOf(a);
      const bPriority = priorityDirs.indexOf(b);

      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }
      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;

      return a.localeCompare(b);
    });

    for (const item of sortedItems) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);

      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDE_PATTERNS.includes(item)) {
          processDirectory(fullPath, itemRelativePath, outputStream);
        }
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
function exportUltraEssential() {
  console.log('🚀 Starting ULTRA ESSENTIAL Frontend Code Export...');
  console.log(`📁 Source: ${FRONTEND_DIR}`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`📏 Max file size: ${(MAX_FILE_SIZE / 1024).toFixed(0)}KB`);
  console.log(`📊 Max total size: ${(MAX_TOTAL_SIZE / 1024 / 1024).toFixed(0)}MB`);
  console.log('');
  console.log('🎯 FOCUS: Essential lib files, core components, and UI component libraries');
  console.log('');

  // Check if frontend directory exists
  if (!fs.existsSync(FRONTEND_DIR)) {
    console.error(`❌ Frontend directory not found: ${FRONTEND_DIR}`);
    return;
  }

  // Create output stream
  const outputStream = fs.createWriteStream(OUTPUT_FILE);

  // Write header
  const header = `# 🚀 ULTRA ESSENTIAL FRONTEND CODE EXPORT (with UI Components)
# Generated: ${new Date().toISOString()}
# Source: ${FRONTEND_DIR}
#
# This export contains essential frontend code including UI component libraries:
# - 🔐 AUTH & SECURITY (auth.ts, middleware.ts, useAuth.tsx)
# - 💳 PAYMENT SYSTEMS (Stripe payment services)
# - 🗄️ DATABASE & REDIS (prisma.ts, redis.ts, schema.prisma)
# - 🔧 CORE UTILITIES (utils.ts, validations.ts, api-utils.ts)
# - 🎣 ESSENTIAL HOOKS (usePackages, useTranslations, useContentManagement)
# - 🎨 CORE COMPONENTS (PaymentForm, LoginModal, Header, AdminDashboard)
# - 🧩 UI COMPONENT LIBRARIES (buttons, forms, modals, inputs, etc.)
# - 🎨 THEME & STYLES (theme utilities, style helpers)
# - 🚀 ESSENTIAL API ROUTES (auth, admin, payments, packages)
# - ⚙️ CONFIGURATION (next.config.js, tailwind.config.ts, postcss.config.js)
#
# Excludes admin components, scripts, and non-essential files.
#
${'='.repeat(80)}

## 📊 EXPORT SUMMARY
- Generated: ${new Date().toISOString()}
- Source Directory: ${FRONTEND_DIR}
- Focus: Essential lib files and core components only

${'='.repeat(80)}

`;

  outputStream.write(header);

  // Process frontend directory
  console.log('📂 Processing frontend directory...');
  processDirectory(FRONTEND_DIR, 'frontend', outputStream);

  // Write footer
  const footer = `
${'='.repeat(80)}
## 📈 FINAL EXPORT STATISTICS
- **Files Processed:** ${totalFiles}
- **Files Excluded:** ${excludedFiles}
- **Total Size:** ${(totalSize / 1024 / 1024).toFixed(2)} MB
- **Generated:** ${new Date().toISOString()}

## 🎯 ESSENTIAL FILES INCLUDED
### 🔐 AUTH & SECURITY
- lib/auth.ts, lib/api/admin.ts, hooks/useAuth.tsx, middleware.ts

### 💳 PAYMENT SYSTEMS
- lib/stripe/**, components/PaymentForm.tsx

### 🗄️ DATABASE & DATA
- lib/prisma.ts, lib/redis.ts, prisma/schema.prisma

### 🔧 CORE UTILITIES
- lib/utils.ts, lib/validations.ts, lib/api-utils.ts, lib/safe-fetch.ts

### 🎣 ESSENTIAL HOOKS
- hooks/usePackages.tsx, hooks/useTranslations.tsx, hooks/useContentManagement.tsx

### 🎨 CORE COMPONENTS
- components/LoginModal.tsx, components/Header.tsx, components/AdminDashboard.tsx

### 🧩 UI COMPONENT LIBRARIES
- components/ui/** (buttons, forms, modals, inputs, dialogs, etc.)

### 🎨 THEME & STYLES
- lib/theme/**, lib/styles/**, theme utilities and style helpers

### 🚀 ESSENTIAL API ROUTES
- app/api/auth/**, app/api/admin/stats/**, app/api/packages/**

${'='.repeat(80)}
`;

  outputStream.write(footer);
  outputStream.end();

  console.log('');
  console.log('🎉 ULTRA ESSENTIAL Frontend Code Export Completed!');
  console.log(`📊 Statistics:`);
  console.log(`   ✅ Files processed: ${totalFiles}`);
  console.log(`   🚫 Files excluded: ${excludedFiles}`);
  console.log(`   📏 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log('');
  console.log(`📄 Output file: ${path.resolve(OUTPUT_FILE)}`);

  // Log file location for easy access
  console.log('');
  console.log('💡 To view the exported code:');
  console.log(`   cat ${OUTPUT_FILE}`);
  console.log('   # or open in your favorite text editor');
}

// Handle command line execution
if (require.main === module) {
  exportUltraEssential();
}

module.exports = { exportUltraEssential };
