#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration for essential export (under 1MB)
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-code-essential.txt';
const MAX_TOTAL_SIZE = 900 * 1024; // 900KB to be safe

// Essential files only - core functionality
const ESSENTIAL_FILES = [
  // Core booking flow
  'components/ScheduleBookingFlow.tsx',
  'components/UnifiedCheckoutFlow.tsx',
  'components/EnhancedPackagesFlow.tsx',
  'components/EnhancedSchedule.tsx',
  
  // Cart and UI
  'components/CartSidebar.tsx',
  'components/MobileCartToggle.tsx',
  'components/CentralizedHeader.tsx',
  'components/AppLayout.tsx',
  
  // Core hooks and context
  'lib/cart-context.tsx',
  'hooks/usePackages.ts',
  'hooks/useTranslations.ts',
  
  // Critical styles
  'app/globals.css',
  'components/ui/mobile-booking.css',
  
  // Main pages
  'app/schedule/page.tsx',
  'app/packages/page.tsx',
  'app/checkout/page.tsx',
  'app/products/page.tsx',
  
  // Key utilities
  'lib/email-validation.ts',
  'lib/countries.ts',
  
  // Configuration
  'next.config.js',
  'tailwind.config.js',
  'package.json'
];

// File size limits (more aggressive)
const SIZE_LIMITS = {
  '.tsx': 20 * 1024, // 20KB for components
  '.ts': 10 * 1024,  // 10KB for utilities
  '.js': 8 * 1024,   // 8KB for JS files
  '.css': 5 * 1024,  // 5KB for styles
  '.json': 2 * 1024, // 2KB for config
  '.md': 1 * 1024    // 1KB for docs
};

function isEssentialFile(filePath) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  return ESSENTIAL_FILES.some(essential => relativePath.includes(essential));
}

function getFileSizeLimit(filePath) {
  const ext = path.extname(filePath);
  return SIZE_LIMITS[ext] || 5 * 1024; // 5KB default
}

function truncateContent(content, maxSize) {
  if (content.length <= maxSize) {
    return content;
  }
  
  // More aggressive truncation - keep only first part
  const truncated = content.substring(0, maxSize);
  const lastCompleteLine = truncated.lastIndexOf('\n');
  
  if (lastCompleteLine > maxSize * 0.7) {
    return content.substring(0, lastCompleteLine) + '\n\n// ... [TRUNCATED] ...\n';
  }
  
  return truncated + '\n\n// ... [TRUNCATED] ...\n';
}

function getFileContent(filePath, maxSize) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return truncateContent(content, maxSize);
  } catch (error) {
    return `// Error: ${error.message}`;
  }
}

function formatFileHeader(filePath, content, originalSize) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  const lines = content.split('\n').length;
  const isTruncated = content.includes('[TRUNCATED]');
  
  return `
${'='.repeat(50)}
FILE: ${relativePath}
LINES: ${lines}${isTruncated ? ' (TRUNCATED)' : ''}
SIZE: ${(originalSize / 1024).toFixed(1)}KB
${'='.repeat(50)}

`;
}

function scanDirectory(dirPath, files = []) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Only scan essential directories
        const dirName = path.basename(fullPath);
        if (['components', 'app', 'lib', 'hooks', 'styles'].includes(dirName)) {
          scanDirectory(fullPath, files);
        }
      } else if (stat.isFile()) {
        if (isEssentialFile(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error.message);
  }
  
  return files;
}

function categorizeFile(filePath) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  
  if (relativePath.includes('components')) return 'COMPONENTS';
  if (relativePath.includes('app')) return 'PAGES';
  if (relativePath.includes('hooks')) return 'HOOKS';
  if (relativePath.includes('lib')) return 'UTILS';
  if (relativePath.includes('.css')) return 'STYLES';
  if (relativePath.includes('.json') || relativePath.includes('.js')) return 'CONFIG';
  
  return 'OTHER';
}

function generateEssentialReport(files) {
  // Sort by importance (essential files first)
  const sortedFiles = files.sort((a, b) => {
    const aEssential = isEssentialFile(a);
    const bEssential = isEssentialFile(b);
    
    if (aEssential && !bEssential) return -1;
    if (!aEssential && bEssential) return 1;
    
    // Then by size (smaller first)
    const aSize = fs.statSync(a).size;
    const bSize = fs.statSync(b).size;
    return aSize - bSize;
  });
  
  // Categorize files
  const categories = {};
  for (const file of sortedFiles) {
    const category = categorizeFile(file);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(file);
  }
  
  let report = `FRONTEND CODEBASE - ESSENTIAL FILES ONLY
Generated: ${new Date().toISOString()}
Files: ${files.length}
Target: <1MB

${'='.repeat(50)}
SUMMARY
${'='.repeat(50)}

`;
  
  // Add category summary
  for (const [category, categoryFiles] of Object.entries(categories)) {
    report += `${category}: ${categoryFiles.length} files\n`;
  }
  
  report += `\n${'='.repeat(50)}\n`;
  report += `ESSENTIAL SOURCE CODE\n`;
  report += `${'='.repeat(50)}\n\n`;
  
  let totalSize = 0;
  let includedFiles = 0;
  
  // Add files by category, respecting size limits
  for (const [category, categoryFiles] of Object.entries(categories)) {
    report += `\n\n# ${category}\n`;
    report += `${'#'.repeat(30)}\n\n`;
    
    for (const file of categoryFiles) {
      if (totalSize >= MAX_TOTAL_SIZE) {
        report += `\n// ... [REMAINING FILES EXCLUDED] ...\n`;
        break;
      }
      
      const stat = fs.statSync(file);
      const originalSize = stat.size;
      const maxSize = getFileSizeLimit(file);
      
      const content = getFileContent(file, maxSize);
      const contentSize = Buffer.byteLength(content, 'utf8');
      
      if (totalSize + contentSize > MAX_TOTAL_SIZE) {
        report += `\n// ... [REMAINING FILES EXCLUDED] ...\n`;
        break;
      }
      
      report += formatFileHeader(file, content, originalSize);
      report += content;
      report += `\n${'='.repeat(50)}\n\n`;
      
      totalSize += contentSize;
      includedFiles++;
    }
    
    if (totalSize >= MAX_TOTAL_SIZE) break;
  }
  
  report += `\n${'='.repeat(50)}\n`;
  report += `ANALYSIS COMPLETE\n`;
  report += `${'='.repeat(50)}\n`;
  report += `Files included: ${includedFiles}/${files.length}\n`;
  report += `Total size: ${(totalSize / 1024).toFixed(1)}KB\n`;
  report += `Generated: ${new Date().toISOString()}\n`;
  
  return report;
}

function main() {
  console.log('🔍 Scanning for essential files only...');
  
  const files = scanDirectory(FRONTEND_DIR);
  console.log(`📁 Found ${files.length} essential files`);
  
  console.log('📝 Generating essential analysis report...');
  const report = generateEssentialReport(files);
  
  console.log(`💾 Writing to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeInKB = (stats.size / 1024).toFixed(1);
  
  console.log(`✅ Essential analysis complete!`);
  console.log(`📊 Output file: ${OUTPUT_FILE}`);
  console.log(`📏 File size: ${sizeInKB}KB`);
  console.log(`📄 Files included: ${report.match(/FILE:/g)?.length || 0}`);
  
  if (stats.size > MAX_TOTAL_SIZE) {
    console.log(`⚠️  Warning: File size (${sizeInKB}KB) exceeds target`);
  } else {
    console.log(`✅ File size within 1MB limit`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, scanDirectory, generateEssentialReport };