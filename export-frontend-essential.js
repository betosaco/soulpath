#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Frontend Essential Code Export Script
 *
 * This script exports all essential frontend code from the wellness monorepo
 * into a single text file for code review, documentation, or analysis purposes.
 *
 * Includes:
 * - All React components (.tsx, .jsx)
 * - All TypeScript/JavaScript files (.ts, .js)
 * - Configuration files (next.config.js, tailwind.config.ts, etc.)
 * - API routes and utilities
 * - Styles and CSS files
 * - Essential documentation
 *
 * Excludes:
 * - node_modules directory
 * - .next build directory
 * - Log files and temporary files
 * - Binary files (images, videos, etc.)
 * - Lock files and cache files
 */

const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-essential-code-export.txt';
const MAX_FILE_SIZE = 500 * 1024; // 500KB per file limit
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total limit

// File patterns to include
const INCLUDE_EXTENSIONS = [
  '.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.sass', '.json'
];

// File patterns to exclude
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
  'backups'
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
  'next-env.d.ts'
];

// Binary file extensions to exclude
const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot',
  '.mp3', '.mp4', '.wav', '.avi', '.mov',
  '.zip', '.tar.gz', '.rar', '.7z'
];

let totalFiles = 0;
let totalSize = 0;
let excludedFiles = 0;

/**
 * Check if file should be excluded
 */
function shouldExcludeFile(filePath, fileName) {
  // Check if file is in excluded patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (filePath.includes(pattern)) {
      return true;
    }
  }

  // Check specific excluded files
  if (EXCLUDE_FILES.includes(fileName)) {
    return true;
  }

  // Check binary file extensions
  const ext = path.extname(fileName).toLowerCase();
  if (BINARY_EXTENSIONS.includes(ext)) {
    return true;
  }

  // Only include specified extensions
  if (!INCLUDE_EXTENSIONS.includes(ext)) {
    return true;
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
      const priorityDirs = ['app', 'components', 'lib', 'hooks', 'utils', 'api', 'styles'];
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
function exportFrontendEssential() {
  console.log('🚀 Starting Frontend Essential Code Export...');
  console.log(`📁 Source: ${FRONTEND_DIR}`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`📏 Max file size: ${(MAX_FILE_SIZE / 1024).toFixed(0)}KB`);
  console.log(`📊 Max total size: ${(MAX_TOTAL_SIZE / 1024 / 1024).toFixed(0)}MB`);
  console.log('');

  // Check if frontend directory exists
  if (!fs.existsSync(FRONTEND_DIR)) {
    console.error(`❌ Frontend directory not found: ${FRONTEND_DIR}`);
    return;
  }

  // Create output stream
  const outputStream = fs.createWriteStream(OUTPUT_FILE);

  // Write header
  const header = `# 🚀 FRONTEND ESSENTIAL CODE EXPORT
# Generated: ${new Date().toISOString()}
# Source: ${FRONTEND_DIR}
#
# This export contains all essential frontend code including:
# - React Components (.tsx, .jsx)
# - TypeScript/JavaScript files (.ts, .js)
# - Configuration files (next.config.js, tailwind.config.ts, etc.)
# - API routes and utilities
# - Styles and CSS files
# - Essential documentation
#
# Excluded: node_modules, build files, logs, binary files, lock files
#
${'='.repeat(80)}

## 📊 EXPORT SUMMARY
- Generated: ${new Date().toISOString()}
- Source Directory: ${FRONTEND_DIR}

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

## 📁 FILE TYPES INCLUDED
${INCLUDE_EXTENSIONS.map(ext => `- ${ext.toUpperCase().replace('.', '')} files`).join('\n')}

## 🚫 EXCLUDED PATTERNS
${EXCLUDE_PATTERNS.map(pattern => `- ${pattern}`).join('\n')}

${'='.repeat(80)}
`;

  outputStream.write(footer);
  outputStream.end();

  console.log('');
  console.log('🎉 Frontend Essential Code Export Completed!');
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
  exportFrontendEssential();
}

module.exports = { exportFrontendEssential };