#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Frontend Code Export Script
 * Exports essential frontend code to a text file for analysis
 */

const FRONTEND_ROOT = __dirname;
const OUTPUT_FILE = path.join(FRONTEND_ROOT, 'frontend-code-analysis.txt');

// File patterns to include in the export
const INCLUDE_PATTERNS = [
  // Configuration files
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.js',
  
  // App directory structure
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'app/error.tsx',
  'app/loading.tsx',
  'app/not-found.tsx',
  
  // API routes (essential ones)
  'app/api/health/route.ts',
  'app/api/auth/**/*.ts',
  'app/api/client/**/*.ts',
  'app/api/admin/**/*.ts',
  'app/api/stripe/**/*.ts',
  'app/api/izipay/**/*.ts',
  'app/api/chat/**/*.ts',
  'app/api/booking/route.ts',
  'app/api/packages/route.ts',
  'app/api/schedules/route.ts',
  'app/api/schedule-slots/route.ts',
  'app/api/content/route.ts',
  'app/api/email/**/*.ts',
  'app/api/sms/**/*.ts',
  'app/api/telegram/**/*.ts',
  'app/api/whatsapp/**/*.ts',
  
  // Client pages
  'app/(client)/**/*.tsx',
  
  // Admin pages
  'app/(admin)/**/*.tsx',
  
  // Components (essential ones)
  'components/AdminDashboard.tsx',
  'components/ClientAuthModal.tsx',
  'components/CustomerDashboard.tsx',
  'components/BookingSection.tsx',
  'components/PackagesAndPricing.tsx',
  'components/PackagePurchaseFlow.tsx',
  'components/PaymentMethodManagement.tsx',
  'components/ScheduleManagement.tsx',
  'components/ContentManagement.tsx',
  'components/EmailManagement.tsx',
  'components/BugReportSystem.tsx',
  'components/ChatWindow.tsx',
  'components/Header.tsx',
  'components/MobileMenu.tsx',
  'components/LoginModal.tsx',
  'components/App.tsx',
  'components/MainPageClient.tsx',
  'components/HeroSection.tsx',
  'components/AboutSection.tsx',
  'components/ApproachSection.tsx',
  'components/SessionSection.tsx',
  'components/BookingSectionWithReminder.tsx',
  'components/CustomerBookingFlow.tsx',
  'components/CalendlyBookingFlow.tsx',
  'components/AstralChart.tsx',
  'components/ConstellationBackground.tsx',
  'components/FullPageSlider.tsx',
  'components/PackageDisplay.tsx',
  'components/PurchaseHistory.tsx',
  'components/ErrorBoundary.tsx',
  'components/DynamicSectionRenderer.tsx',
  'components/ImageManagement.tsx',
  'components/SeoManagement.tsx',
  'components/SettingsManagement.tsx',
  'components/RasaModelTuning.tsx',
  'components/RasaMonitoring.tsx',
  'components/BookingsManagement.tsx',
  'components/ClientManagement.tsx',
  'components/PaymentRecordsManagement.tsx',
  'components/PurchaseHistoryManagement.tsx',
  'components/LiveSessionConfigManagement.tsx',
  'components/TelegramConfigManagement.tsx',
  'components/ExternalAPIManagement.tsx',
  'components/ContentManagementDashboard.tsx',
  'components/AuthTest.tsx',
  'components/BugReportButton.tsx',
  'components/BugReportManagement.tsx',
  'components/BugReportTrigger.tsx',
  
  // CMS components
  'components/cms/**/*.tsx',
  
  // Communication components
  'components/communication/**/*.tsx',
  
  // Payment components
  'components/payment/**/*.tsx',
  'components/stripe/**/*.tsx',
  'components/izipay/**/*.tsx',
  
  // UI components
  'components/ui/**/*.tsx',
  'components/ui/**/*.ts',
  
  // Modals
  'components/modals/**/*.tsx',
  
  // Theme
  'components/theme/**/*.tsx',
  
  // Hooks
  'hooks/**/*.tsx',
  'hooks/**/*.ts',
  
  // Lib utilities
  'lib/**/*.ts',
  'lib/**/*.tsx',
  
  // Types
  'types/**/*.ts',
  
  // Utils
  'utils/**/*.ts',
  
  // Prisma schema
  'prisma/schema.prisma',
  'prisma/seed.ts',
];

// File patterns to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'build',
  'dist',
  '.git',
  '*.log',
  '*.backup',
  '*.bak',
  '*.tmp',
  '*.cache',
  'logs',
  'models',
  'results',
  '__pycache__',
  '*.pyc',
  '*.pyo',
  '*.pyd',
  '.env*',
  '*.env*',
  'vercel.json',
  'railway.json',
  'render*.yaml',
  'render*.yml',
  'Dockerfile*',
  'docker-compose*.yml',
  '*.md',
  '*.txt',
  '*.sql',
  '*.sh',
  '*.js',
  '*.mjs',
  '*.cjs',
  '*.json',
  '*.png',
  '*.jpg',
  '*.jpeg',
  '*.gif',
  '*.svg',
  '*.ico',
  '*.mp3',
  '*.wav',
  '*.mp4',
  '*.mov',
  '*.avi',
  '*.zip',
  '*.tar',
  '*.gz',
  '*.rar',
  '*.7z',
  '*.pdf',
  '*.doc',
  '*.docx',
  '*.xls',
  '*.xlsx',
  '*.ppt',
  '*.pptx',
];

/**
 * Check if a file should be included based on patterns
 */
function shouldIncludeFile(filePath, relativePath) {
  // Check exclude patterns first
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(relativePath) || regex.test(path.basename(filePath))) {
        return false;
      }
    } else if (relativePath.includes(pattern) || path.basename(filePath) === pattern) {
      return false;
    }
  }
  
  // Check include patterns
  for (const pattern of INCLUDE_PATTERNS) {
    if (pattern.includes('**')) {
      // Convert ** pattern to proper regex - ** matches any number of directories (including zero)
      // Use a simpler approach: replace ** with .* and * with [^/]*
      const regexPattern = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
      const regex = new RegExp('^' + regexPattern + '$');
      if (regex.test(relativePath)) {
        return true;
      }
    } else if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(relativePath) || regex.test(path.basename(filePath))) {
        return true;
      }
    } else if (relativePath === pattern || path.basename(filePath) === pattern) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get all files recursively
 */
function getAllFiles(dir, relativePath = '') {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDE_PATTERNS.some(pattern => 
          pattern.includes('*') ? 
            new RegExp(pattern.replace(/\*/g, '.*')).test(itemRelativePath) :
            itemRelativePath.includes(pattern) || item === pattern
        )) {
          files.push(...getAllFiles(fullPath, itemRelativePath));
        }
      } else if (stat.isFile()) {
        if (shouldIncludeFile(fullPath, itemRelativePath)) {
          files.push({
            fullPath,
            relativePath: itemRelativePath,
            size: stat.size
          });
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Read file content safely
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return `// Error reading file: ${error.message}\n`;
  }
}

/**
 * Format file content for export
 */
function formatFileContent(file, content) {
  const lines = content.split('\n');
  const maxLines = 1000; // Limit lines per file to avoid huge output
  
  let formattedContent = content;
  if (lines.length > maxLines) {
    formattedContent = lines.slice(0, maxLines).join('\n') + 
      `\n\n// ... (${lines.length - maxLines} more lines truncated) ...\n`;
  }
  
  return `\n${'='.repeat(80)}
FILE: ${file.relativePath}
SIZE: ${file.size} bytes
LINES: ${lines.length}
${'='.repeat(80)}

${formattedContent}

${'='.repeat(80)}
END OF FILE: ${file.relativePath}
${'='.repeat(80)}

`;
}

/**
 * Main export function
 */
function exportFrontendCode() {
  console.log('🚀 Starting frontend code export...');
  console.log(`📁 Frontend root: ${FRONTEND_ROOT}`);
  console.log(`📄 Output file: ${OUTPUT_FILE}`);
  
  // Get all files to export
  const files = getAllFiles(FRONTEND_ROOT);
  
  // Manually add Izipay files that might be missed by the pattern matching
  const izipayFiles = [
    'components/izipay/IzipayForm.tsx',
    'app/api/izipay/webhook/route.ts'
  ];
  
  for (const izipayFile of izipayFiles) {
    const fullPath = path.join(FRONTEND_ROOT, izipayFile);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      const existingFile = files.find(f => f.relativePath === izipayFile);
      if (!existingFile) {
        files.push({
          fullPath,
          relativePath: izipayFile,
          size: stat.size
        });
        console.log(`📁 Added Izipay file: ${izipayFile}`);
      }
    }
  }
  
  console.log(`📊 Found ${files.length} files to export`);
  
  // Sort files by relative path for better organization
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  
  // Create export content
  let exportContent = `FRONTEND CODE ANALYSIS EXPORT
Generated: ${new Date().toISOString()}
Frontend Root: ${FRONTEND_ROOT}
Total Files: ${files.length}

${'='.repeat(80)}
TABLE OF CONTENTS
${'='.repeat(80)}

`;

  // Add table of contents
  files.forEach((file, index) => {
    exportContent += `${index + 1}. ${file.relativePath} (${file.size} bytes)\n`;
  });
  
  exportContent += `\n${'='.repeat(80)}
FILE CONTENTS
${'='.repeat(80)}

`;

  // Add file contents
  let processedFiles = 0;
  for (const file of files) {
    console.log(`📖 Processing ${file.relativePath}...`);
    const content = readFileContent(file.fullPath);
    exportContent += formatFileContent(file, content);
    processedFiles++;
    
    // Progress indicator
    if (processedFiles % 10 === 0) {
      console.log(`   Progress: ${processedFiles}/${files.length} files processed`);
    }
  }
  
  // Add summary
  exportContent += `\n${'='.repeat(80)}
EXPORT SUMMARY
${'='.repeat(80)}

Export completed: ${new Date().toISOString()}
Total files processed: ${processedFiles}
Total files found: ${files.length}
Output file: ${OUTPUT_FILE}

File breakdown by type:
${files.reduce((acc, file) => {
  const ext = path.extname(file.relativePath);
  acc[ext] = (acc[ext] || 0) + 1;
  return acc;
}, {})}

Largest files:
${files
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map(f => `  ${f.relativePath}: ${f.size} bytes`)
  .join('\n')}

${'='.repeat(80)}
END OF EXPORT
${'='.repeat(80)}
`;

  // Write to file
  try {
    fs.writeFileSync(OUTPUT_FILE, exportContent, 'utf8');
    console.log(`✅ Export completed successfully!`);
    console.log(`📄 Output written to: ${OUTPUT_FILE}`);
    console.log(`📊 Total size: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error(`❌ Error writing output file:`, error.message);
    process.exit(1);
  }
}

// Run the export
if (import.meta.url === `file://${process.argv[1]}`) {
  exportFrontendCode();
}

export { exportFrontendCode };
