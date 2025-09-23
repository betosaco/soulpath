#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration for concise export
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-code-concise.txt';
const MAX_FILE_SIZE = 50 * 1024; // 50KB per file max
const MAX_TOTAL_SIZE = 1024 * 1024; // 1MB total max

// Priority files to always include (even if large)
const PRIORITY_FILES = [
  'components/ScheduleBookingFlow.tsx',
  'components/UnifiedCheckoutFlow.tsx',
  'components/EnhancedPackagesFlow.tsx',
  'components/CartSidebar.tsx',
  'components/MobileCartToggle.tsx',
  'components/CentralizedHeader.tsx',
  'components/EnhancedSchedule.tsx',
  'app/globals.css',
  'components/ui/mobile-booking.css',
  'lib/cart-context.tsx',
  'hooks/usePackages.ts',
  'hooks/useTranslations.ts'
];

// Exclude patterns for concise export
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.vercel',
  'coverage',
  'test',
  'spec',
  '__tests__',
  '*.test.',
  '*.spec.',
  '*.stories.',
  '*.d.ts',
  'package-lock.json',
  'yarn.lock',
  '.env',
  '*.log',
  '*.tmp',
  '*.cache'
];

// File size limits by type
const SIZE_LIMITS = {
  '.tsx': 30 * 1024, // 30KB for components
  '.ts': 20 * 1024,  // 20KB for utilities
  '.js': 15 * 1024,  // 15KB for JS files
  '.css': 10 * 1024, // 10KB for styles
  '.json': 5 * 1024, // 5KB for config
  '.md': 3 * 1024    // 3KB for docs
};

function shouldExcludeFile(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  
  // Check exclude patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      if (regex.test(fileName) || regex.test(relativePath)) {
        return true;
      }
    } else if (fileName.includes(pattern) || relativePath.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

function isPriorityFile(filePath) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  return PRIORITY_FILES.some(priority => relativePath.includes(priority));
}

function getFileSizeLimit(filePath) {
  const ext = path.extname(filePath);
  return SIZE_LIMITS[ext] || MAX_FILE_SIZE;
}

function truncateContent(content, maxSize) {
  if (content.length <= maxSize) {
    return content;
  }
  
  // Try to truncate at a reasonable point (end of function/component)
  const truncated = content.substring(0, maxSize);
  const lastCompleteLine = truncated.lastIndexOf('\n');
  
  if (lastCompleteLine > maxSize * 0.8) {
    return content.substring(0, lastCompleteLine) + '\n\n// ... [CONTENT TRUNCATED] ...\n';
  }
  
  return truncated + '\n\n// ... [CONTENT TRUNCATED] ...\n';
}

function getFileContent(filePath, maxSize) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return truncateContent(content, maxSize);
  } catch (error) {
    return `// Error reading file: ${error.message}`;
  }
}

function formatFileHeader(filePath, content, originalSize) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  const lines = content.split('\n').length;
  const isTruncated = content.includes('[CONTENT TRUNCATED]');
  
  return `
${'='.repeat(60)}
FILE: ${relativePath}
LINES: ${lines}${isTruncated ? ' (TRUNCATED)' : ''}
SIZE: ${(originalSize / 1024).toFixed(1)}KB${isTruncated ? ' (original)' : ''}
${'='.repeat(60)}

`;
}

function scanDirectory(dirPath, files = []) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeFile(fullPath)) {
          scanDirectory(fullPath, files);
        }
      } else if (stat.isFile()) {
        if (!shouldExcludeFile(fullPath)) {
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
  const pathParts = relativePath.split(path.sep);
  
  if (pathParts.includes('components')) return 'COMPONENTS';
  if (pathParts.includes('app') || pathParts.includes('pages')) return 'PAGES';
  if (pathParts.includes('hooks')) return 'HOOKS';
  if (pathParts.includes('lib') || pathParts.includes('utils')) return 'UTILS';
  if (pathParts.includes('api')) return 'API';
  if (pathParts.includes('prisma') || pathParts.includes('supabase')) return 'DATABASE';
  if (relativePath.includes('.css') || relativePath.includes('styles')) return 'STYLES';
  if (relativePath.includes('.json') || relativePath.includes('config')) return 'CONFIG';
  if (relativePath.includes('.md')) return 'DOCS';
  
  return 'OTHER';
}

function generateConciseReport(files) {
  // Sort files: priority first, then by size (smaller first)
  const sortedFiles = files.sort((a, b) => {
    const aPriority = isPriorityFile(a);
    const bPriority = isPriorityFile(b);
    
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;
    
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
  
  let report = `FRONTEND CODEBASE - CONCISE ANALYSIS
Generated: ${new Date().toISOString()}
Total Files: ${files.length}
Max Size: 1MB

${'='.repeat(60)}
SUMMARY
${'='.repeat(60)}

`;
  
  // Add category summary
  for (const [category, categoryFiles] of Object.entries(categories)) {
    report += `${category}: ${categoryFiles.length} files\n`;
  }
  
  report += `\n${'='.repeat(60)}\n`;
  report += `SOURCE CODE\n`;
  report += `${'='.repeat(60)}\n\n`;
  
  let totalSize = 0;
  let includedFiles = 0;
  
  // Add files by category, respecting size limits
  for (const [category, categoryFiles] of Object.entries(categories)) {
    report += `\n\n# ${category} (${categoryFiles.length} files)\n`;
    report += `${'#'.repeat(40)}\n\n`;
    
    for (const file of categoryFiles) {
      if (totalSize >= MAX_TOTAL_SIZE) {
        report += `\n// ... [REMAINING FILES EXCLUDED DUE TO SIZE LIMIT] ...\n`;
        break;
      }
      
      const stat = fs.statSync(file);
      const originalSize = stat.size;
      const maxSize = isPriorityFile(file) ? MAX_FILE_SIZE : getFileSizeLimit(file);
      
      const content = getFileContent(file, maxSize);
      const contentSize = Buffer.byteLength(content, 'utf8');
      
      if (totalSize + contentSize > MAX_TOTAL_SIZE) {
        report += `\n// ... [REMAINING FILES EXCLUDED DUE TO SIZE LIMIT] ...\n`;
        break;
      }
      
      report += formatFileHeader(file, content, originalSize);
      report += content;
      report += `\n${'='.repeat(60)}\n\n`;
      
      totalSize += contentSize;
      includedFiles++;
    }
    
    if (totalSize >= MAX_TOTAL_SIZE) break;
  }
  
  report += `\n${'='.repeat(60)}\n`;
  report += `ANALYSIS COMPLETE\n`;
  report += `${'='.repeat(60)}\n`;
  report += `Files included: ${includedFiles}/${files.length}\n`;
  report += `Total size: ${(totalSize / 1024).toFixed(1)}KB\n`;
  report += `Generated: ${new Date().toISOString()}\n`;
  
  return report;
}

function main() {
  console.log('🔍 Scanning frontend directory for concise export...');
  
  const files = scanDirectory(FRONTEND_DIR);
  console.log(`📁 Found ${files.length} relevant files`);
  
  console.log('📝 Generating concise analysis report...');
  const report = generateConciseReport(files);
  
  console.log(`💾 Writing to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeInKB = (stats.size / 1024).toFixed(1);
  
  console.log(`✅ Concise analysis complete!`);
  console.log(`📊 Output file: ${OUTPUT_FILE}`);
  console.log(`📏 File size: ${sizeInKB}KB`);
  console.log(`📄 Files included: ${report.match(/FILE:/g)?.length || 0}`);
  
  if (stats.size > MAX_TOTAL_SIZE) {
    console.log(`⚠️  Warning: File size (${sizeInKB}KB) exceeds 1MB limit`);
  } else {
    console.log(`✅ File size within 1MB limit`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, scanDirectory, generateConciseReport };
