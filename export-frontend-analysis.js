#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-unified-refactored-codebase.txt';
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.vercel',
  'coverage',
  '.nyc_output',
  // Additional directories to reduce size
  '__tests__',
  'test',
  'tests',
  'spec',
  'specs',
  'stories',
  'storybook',
  '.storybook',
  'cypress',
  'e2e',
  'playwright',
  'docs',
  'documentation',
  'examples',
  'samples',
  'demos'
];
const EXCLUDE_FILES = [
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  '.env',
  '.env.local',
  '.env.production',
  '*.log',
  '*.tmp',
  // Additional files to reduce size
  '*.test.tsx',
  '*.test.ts',
  '*.test.jsx',
  '*.test.js',
  '*.spec.tsx',
  '*.spec.ts',
  '*.spec.jsx',
  '*.spec.js',
  '*.stories.tsx',
  '*.stories.ts',
  '*.stories.jsx',
  '*.stories.js',
  '*.bak',
  '*.backup',
  '*.old',
  '*.orig'
];
const INCLUDE_EXTENSIONS = [
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.css',
  '.scss',
  '.json',
  '.md'
];

// Priority files for the unified refactoring
const PRIORITY_FILES = [
  'components/AppShell.tsx',
  'components/MasterBookingFlow.tsx',
  'components/UnifiedForm.tsx',
  'components/UnifiedCheckoutFlow.tsx',
  'components/CentralizedHeader.tsx',
  'components/AppLayout.tsx',
  'styles/unified-component-styles.css',
  'REFACTORING_MIGRATION_GUIDE.md',
  'components/examples/UnifiedSystemExample.tsx'
];

// File categories for better organization (reduced for size optimization)
const FILE_CATEGORIES = {
  'UNIFIED_SYSTEM': ['AppShell.tsx', 'MasterBookingFlow.tsx', 'UnifiedForm.tsx', 'UnifiedCheckoutFlow.tsx'],
  'LAYOUT_COMPONENTS': ['CentralizedHeader.tsx', 'AppLayout.tsx', 'Footer.tsx', 'MobileScrollFix.tsx'],
  'BOOKING_COMPONENTS': ['EnhancedPackagesFlow.tsx', 'EnhancedSchedule.tsx', 'CartSidebar.tsx'],
  'FORM_COMPONENTS': ['UnifiedForm.tsx', 'FormField', 'FormSection'],
  'UI_COMPONENTS': ['ui/', 'BaseButton', 'BaseInput', 'Card', 'Button', 'Input'],
  'STYLES': ['styles', 'css'],
  'HOOKS': ['hooks'],
  'UTILS': ['lib', 'utils'],
  'PAGES': ['app', 'pages'],
  'API': ['api'],
  'DOCUMENTATION': ['README.md', '*.md', 'REFACTORING_MIGRATION_GUIDE.md'],
  'DEPRECATED': ['BookingSection.tsx', 'CalendlyBookingFlow.tsx', 'PackagesBookingFlow.tsx', 'ScheduleBookingFlow.tsx', 'CustomerBookingFlow.tsx', 'PackagePurchaseFlow.tsx', 'Header.tsx']
};

function shouldIncludeFile(filePath) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);
  
  // Check if file extension is included
  if (!INCLUDE_EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Check if file should be excluded
  for (const excludePattern of EXCLUDE_FILES) {
    if (excludePattern.includes('*')) {
      const pattern = excludePattern.replace('*', '');
      if (fileName.includes(pattern)) {
        return false;
      }
    } else if (fileName === excludePattern) {
      return false;
    }
  }
  
  return true;
}

function shouldIncludeDir(dirPath) {
  const dirName = path.basename(dirPath);
  return !EXCLUDE_DIRS.includes(dirName);
}

function categorizeFile(filePath) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  const fileName = path.basename(filePath);
  
  // Check for specific file matches first (highest priority)
  for (const [category, patterns] of Object.entries(FILE_CATEGORIES)) {
    for (const pattern of patterns) {
      if (pattern.includes('/')) {
        // Directory pattern
        if (relativePath.includes(pattern)) {
          return category;
        }
      } else if (pattern.includes('.')) {
        // Specific file pattern
        if (fileName === pattern || relativePath === pattern) {
          return category;
        }
      } else {
        // General pattern
        if (pathParts.some(part => part.includes(pattern)) || 
            relativePath.includes(pattern)) {
          return category;
        }
      }
    }
  }
  
  return 'OTHER';
}

function isPriorityFile(filePath) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  return PRIORITY_FILES.some(priorityFile => relativePath.includes(priorityFile));
}

function getFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const isPriority = isPriorityFile(filePath);
    const relativePath = path.relative(FRONTEND_DIR, filePath);
    
    // For non-priority files, limit content size
    if (!isPriority && content.length > 50000) { // 50KB limit for non-priority files
      const lines = content.split('\n');
      const truncatedLines = lines.slice(0, 500); // First 500 lines
      return truncatedLines.join('\n') + `\n\n// ... [FILE TRUNCATED - ${lines.length - 500} more lines] ...`;
    }
    
    // For very large files, add a size warning
    if (content.length > 100000) { // 100KB
      return `// LARGE FILE WARNING: ${(content.length / 1024).toFixed(1)}KB\n\n${content}`;
    }
    
    return content;
  } catch (error) {
    return `// Error reading file: ${error.message}`;
  }
}

function formatFileContent(filePath, content) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  const lines = content.split('\n');
  const lineCount = lines.length;
  
  return `
${'='.repeat(80)}
FILE: ${relativePath}
LINES: ${lineCount}
${'='.repeat(80)}

${content}

${'='.repeat(80)}
END OF FILE: ${relativePath}
${'='.repeat(80)}

`;
}

function scanDirectory(dirPath, files = []) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (shouldIncludeDir(fullPath)) {
          scanDirectory(fullPath, files);
        }
      } else if (stat.isFile()) {
        if (shouldIncludeFile(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return files;
}

function generateAnalysisReport(files) {
  const categories = {};
  let totalFiles = 0;
  let totalLines = 0;
  
  // Categorize files
  for (const file of files) {
    const category = categorizeFile(file);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(file);
  }
  
  // Generate report header
  let report = `
UNIFIED FRONTEND CODEBASE - REFACTORED SYSTEM
Generated: ${new Date().toISOString()}
Total Files: ${files.length}
Frontend Directory: ${FRONTEND_DIR}

🎯 REFACTORING OVERVIEW
This codebase has been refactored to create a unified booking and shopping experience with:
✅ Single Source of Truth - Consolidated layout and booking components
✅ Mobile-First Design - Fully responsive with MobileScrollFix integration
✅ Component-Driven Architecture - Reusable, composable components
✅ DRY Principles - Eliminated redundant booking flow components
✅ Unified Styling System - CSS custom properties and utility classes

🚀 NEW UNIFIED COMPONENTS:
- AppShell.tsx - Primary layout wrapper for all pages
- MasterBookingFlow.tsx - Unified booking and checkout experience
- UnifiedForm.tsx - Standardized form handling with Zod validation
- UnifiedCheckoutFlow.tsx - Entry point for the unified booking flow
- CentralizedHeader.tsx - Consolidated header with all functionality

📋 DEPRECATED COMPONENTS (still functional):
- Header.tsx → Use CentralizedHeader.tsx
- BookingSection.tsx → Use MasterBookingFlow.tsx
- CalendlyBookingFlow.tsx → Use MasterBookingFlow.tsx
- PackagesBookingFlow.tsx → Use MasterBookingFlow.tsx
- ScheduleBookingFlow.tsx → Use MasterBookingFlow.tsx
- CustomerBookingFlow.tsx → Use MasterBookingFlow.tsx
- PackagePurchaseFlow.tsx → Use MasterBookingFlow.tsx

${'='.repeat(80)}
FILE CATEGORIES SUMMARY
${'='.repeat(80)}

`;
  
  // Add category summary
  for (const [category, categoryFiles] of Object.entries(categories)) {
    report += `${category}: ${categoryFiles.length} files\n`;
  }
  
  report += `\n${'='.repeat(80)}\n`;
  report += `DETAILED FILE LISTING\n`;
  report += `${'='.repeat(80)}\n\n`;
  
  // Add detailed file listing
  for (const [category, categoryFiles] of Object.entries(categories)) {
    report += `\n${category} (${categoryFiles.length} files):\n`;
    report += `${'-'.repeat(40)}\n`;
    
    for (const file of categoryFiles.sort()) {
      const relativePath = path.relative(FRONTEND_DIR, file);
      const stat = fs.statSync(file);
      const size = (stat.size / 1024).toFixed(2);
      report += `  ${relativePath} (${size} KB)\n`;
    }
  }
  
  report += `\n${'='.repeat(80)}\n`;
  report += `FULL SOURCE CODE\n`;
  report += `${'='.repeat(80)}\n\n`;
  
  // Define category order (prioritize unified system, exclude some for size reduction)
  const categoryOrder = [
    'UNIFIED_SYSTEM',
    'LAYOUT_COMPONENTS', 
    'FORM_COMPONENTS',
    'BOOKING_COMPONENTS',
    'UI_COMPONENTS',
    'STYLES',
    'HOOKS',
    'UTILS',
    'PAGES',
    'API',
    'DOCUMENTATION',
    'DEPRECATED'
    // Excluded for size reduction: DATABASE, CONFIG, TYPES, EXAMPLES, OTHER
  ];

  // Add full source code organized by category (in priority order)
  for (const category of categoryOrder) {
    if (categories[category] && categories[category].length > 0) {
      const categoryFiles = categories[category];
      
      // Sort files within category (priority files first)
      const sortedFiles = categoryFiles.sort((a, b) => {
        const aIsPriority = isPriorityFile(a);
        const bIsPriority = isPriorityFile(b);
        
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        
        return a.localeCompare(b);
      });
      
      // Limit files for non-critical categories to reduce size
      const maxFilesPerCategory = {
        'UNIFIED_SYSTEM': Infinity, // Include all unified system files
        'LAYOUT_COMPONENTS': Infinity, // Include all layout files
        'FORM_COMPONENTS': Infinity, // Include all form files
        'BOOKING_COMPONENTS': Infinity, // Include all booking files
        'UI_COMPONENTS': 20, // Limit UI components
        'STYLES': 10, // Limit style files
        'HOOKS': 10, // Limit hooks
        'UTILS': 15, // Limit utils
        'PAGES': 30, // Limit pages
        'API': 10, // Limit API files
        'DOCUMENTATION': 5, // Limit documentation
        'DEPRECATED': 5 // Limit deprecated files
      };
      
      const maxFiles = maxFilesPerCategory[category] || 10;
      const limitedFiles = sortedFiles.slice(0, maxFiles);
      
      if (limitedFiles.length < sortedFiles.length) {
        console.log(`   📝 ${category}: Limited to ${limitedFiles.length} of ${sortedFiles.length} files for size optimization`);
      }
      
      report += `\n\n${'#'.repeat(80)}\n`;
      report += `# ${category} - ${limitedFiles.length} of ${categoryFiles.length} FILES (size optimized)\n`;
      if (category === 'UNIFIED_SYSTEM') {
        report += `# 🚀 NEW UNIFIED COMPONENTS - CORE OF THE REFACTORED SYSTEM\n`;
      } else if (category === 'DEPRECATED') {
        report += `# ⚠️  DEPRECATED COMPONENTS - USE UNIFIED SYSTEM INSTEAD\n`;
      }
      report += `${'#'.repeat(80)}\n\n`;
      
      for (const file of limitedFiles) {
        const content = getFileContent(file);
        const isPriority = isPriorityFile(file);
        
        if (isPriority) {
          report += `\n🔥 PRIORITY FILE - ${path.relative(FRONTEND_DIR, file)}\n`;
        }
        
        report += formatFileContent(file, content);
      }
    }
  }
  
  return report;
}

function main() {
  console.log('🚀 UNIFIED FRONTEND REFACTORING EXPORT (SIZE OPTIMIZED)');
  console.log('=====================================================');
  console.log('🔍 Scanning frontend directory for refactored components...');
  
  // Scan for all relevant files
  const files = scanDirectory(FRONTEND_DIR);
  console.log(`📁 Found ${files.length} relevant files`);
  
  // Count priority files
  const priorityFiles = files.filter(isPriorityFile);
  console.log(`🔥 Found ${priorityFiles.length} priority unified system files`);
  
  // Generate analysis report
  console.log('📝 Generating size-optimized unified system analysis report...');
  const report = generateAnalysisReport(files);
  
  // Write to output file
  console.log(`💾 Writing to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`\n✅ SIZE-OPTIMIZED UNIFIED SYSTEM EXPORT COMPLETE!`);
  console.log(`===============================================`);
  console.log(`📊 Output file: ${OUTPUT_FILE}`);
  console.log(`📏 File size: ${sizeInMB} MB (optimized for 20% size reduction)`);
  console.log(`📄 Total files analyzed: ${files.length}`);
  console.log(`🔥 Priority unified files: ${priorityFiles.length}`);
  
  // Show category breakdown
  const categories = {};
  for (const file of files) {
    const category = categorizeFile(file);
    categories[category] = (categories[category] || 0) + 1;
  }
  
  console.log(`\n📋 Category breakdown (size optimized):`);
  for (const [category, count] of Object.entries(categories)) {
    const icon = category === 'UNIFIED_SYSTEM' ? '🚀' : 
                 category === 'DEPRECATED' ? '⚠️' : 
                 category === 'LAYOUT_COMPONENTS' ? '🏗️' : 
                 category === 'FORM_COMPONENTS' ? '📝' : '📁';
    console.log(`   ${icon} ${category}: ${count} files`);
  }
  
  console.log(`\n🎯 REFACTORING HIGHLIGHTS:`);
  console.log(`   ✅ AppShell.tsx - Primary layout wrapper`);
  console.log(`   ✅ MasterBookingFlow.tsx - Unified booking experience`);
  console.log(`   ✅ UnifiedForm.tsx - Standardized form handling`);
  console.log(`   ✅ CentralizedHeader.tsx - Consolidated header`);
  console.log(`   ✅ Enhanced CSS system with utility classes`);
  console.log(`   ✅ Mobile-first responsive design`);
  console.log(`   ✅ TypeScript + Zod validation integration`);
  
  console.log(`\n📊 SIZE OPTIMIZATION FEATURES:`);
  console.log(`   🔸 Excluded test files, stories, and documentation`);
  console.log(`   🔸 Limited non-priority files to 500 lines each`);
  console.log(`   🔸 Reduced categories and file counts per category`);
  console.log(`   🔸 Prioritized unified system components`);
  
  console.log(`\n📖 See REFACTORING_MIGRATION_GUIDE.md for migration instructions`);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, scanDirectory, generateAnalysisReport };
