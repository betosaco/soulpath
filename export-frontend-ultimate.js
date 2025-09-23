#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration for ultimate complete understanding export
const FRONTEND_DIR = './frontend';
const OUTPUT_FILE = './frontend-code-ultimate.txt';
const MAX_TOTAL_SIZE = 900 * 1024; // 900KB to be safe

// Ultimate essential files for complete understanding
const ULTIMATE_ESSENTIAL_FILES = [
  // Core booking flow (existing)
  'components/ScheduleBookingFlow.tsx',
  'components/UnifiedCheckoutFlow.tsx',
  'components/EnhancedPackagesFlow.tsx',
  'components/EnhancedSchedule.tsx',
  
  // Cart and UI (existing)
  'components/CartSidebar.tsx',
  'components/MobileCartToggle.tsx',
  'components/CentralizedHeader.tsx',
  'components/AppLayout.tsx',
  
  // Core hooks and context (existing)
  'lib/cart-context.tsx',
  'hooks/usePackages.ts',
  'hooks/useTranslations.ts',
  
  // Critical styles (existing)
  'app/globals.css',
  'components/ui/mobile-booking.css',
  
  // Main pages (existing)
  'app/schedule/page.tsx',
  'app/packages/page.tsx',
  'app/checkout/page.tsx',
  'app/products/page.tsx',
  
  // Key utilities (existing)
  'lib/email-validation.ts',
  'lib/countries.ts',
  
  // Configuration (existing)
  'next.config.js',
  'tailwind.config.js',
  'package.json',
  
  // API routes (existing)
  'app/api/booking/route.ts',
  'app/api/packages/route.ts',
  'app/api/schedules/route.ts',
  'app/api/orders/create-unified/route.ts',
  'app/api/client/purchase/route.ts',
  'app/api/health/route.ts',
  
  // Database schema (existing)
  'prisma/schema.prisma',
  'supabase/migrations/20250901040135_refactor_unified_user_model.sql',
  
  // Service classes (existing)
  'lib/services/conversational-orchestrator.ts',
  'lib/services/api-service.ts',
  'lib/services/ml-pipeline-service.ts',
  'lib/services/twilio-service.ts',
  'lib/services/openrouter-service.ts',
  'lib/services/rasa-service.ts',
  
  // Authentication (existing)
  'lib/auth.ts',
  'middleware.ts',
  
  // Payment integration (existing)
  'app/api/stripe/create-checkout-session/route.ts',
  'app/api/stripe/webhook/route.ts',
  
  // Telegram integration (existing)
  'app/api/telegram/webhook/route.ts',
  'app/api/telegram/register-user/route.ts',
  
  // Admin & Client APIs (existing)
  'app/api/admin/bookings/route.ts',
  'app/api/client/bookings/route.ts',
  'app/api/client/dashboard/summary/route.ts',
  
  // Data layer (existing)
  'lib/prisma.ts',
  'lib/supabase.ts',
  
  // Type definitions (existing)
  'lib/types/conversational-orchestrator.ts',
  'lib/types/index.ts',
  
  // NEW: Design System & UI Components
  'components/ui/BaseButton.tsx',
  'components/ui/BaseModal.tsx',
  'components/ui/BaseCard.tsx',
  'components/ui/BaseInput.tsx',
  'components/ui/button.tsx',
  'components/ui/card.tsx',
  'components/ui/input.tsx',
  'components/ui/dialog.tsx',
  'components/ui/utils.ts',
  
  // NEW: Design System Core
  'lib/design-system.ts',
  'styles/unified-component-styles.css',
  
  // NEW: Deployment & Configuration
  'vercel.json',
  'Dockerfile',
  '.env.example',
  'scripts/setup-render-deployment.sh',
  'vercel-deploy.sh',
  
  // NEW: Rasa AI Configuration
  'rasa/config.yml',
  'rasa/domain.yml',
  'rasa/endpoints.yml',
  'rasa/credentials.yml',
  'rasa/data/nlu.yml',
  'rasa/data/rules.yml',
  'rasa/actions/actions.py',
  'rasa/README.md',
  
  // NEW: Additional Critical APIs
  'app/api/chat/hybrid/route.ts',
  'app/api/chat/web/route.ts',
  'app/api/auth/login/route.ts',
  'app/api/products/route.ts',
  'app/api/orchestrator/route.ts',
  
  // NEW: Additional Services
  'lib/services/external-api-service.ts',
  'lib/services/logging-service.ts',
  
  // NEW: Additional Utilities
  'lib/utils.ts',
  'lib/validations.ts',
  'lib/constants.ts',
  
  // NEW: Additional Types
  'lib/types/api.ts',
  'lib/types/booking.ts',
  'lib/types/user.ts'
];

// File size limits (very aggressive for ultimate export)
const SIZE_LIMITS = {
  '.tsx': 12 * 1024, // 12KB for components
  '.ts': 6 * 1024,   // 6KB for utilities
  '.js': 4 * 1024,   // 4KB for JS files
  '.css': 3 * 1024,  // 3KB for styles
  '.json': 2 * 1024, // 2KB for config
  '.md': 1 * 1024,   // 1KB for docs
  '.sql': 2 * 1024,  // 2KB for SQL
  '.prisma': 4 * 1024, // 4KB for Prisma schema
  '.yml': 2 * 1024,  // 2KB for YAML
  '.py': 3 * 1024,   // 3KB for Python
  '.sh': 2 * 1024    // 2KB for shell scripts
};

function isUltimateEssentialFile(filePath) {
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  return ULTIMATE_ESSENTIAL_FILES.some(essential => relativePath.includes(essential));
}

function getFileSizeLimit(filePath) {
  const ext = path.extname(filePath);
  return SIZE_LIMITS[ext] || 2 * 1024; // 2KB default
}

function truncateContent(content, maxSize) {
  if (content.length <= maxSize) {
    return content;
  }
  
  // Very aggressive truncation - keep only first part
  const truncated = content.substring(0, maxSize);
  const lastCompleteLine = truncated.lastIndexOf('\n');
  
  if (lastCompleteLine > maxSize * 0.5) {
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
        // Scan all relevant directories
        const dirName = path.basename(fullPath);
        if (['components', 'app', 'lib', 'hooks', 'styles', 'prisma', 'supabase', 'rasa', 'scripts'].includes(dirName)) {
          scanDirectory(fullPath, files);
        }
      } else if (stat.isFile()) {
        if (isUltimateEssentialFile(fullPath)) {
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
  
  if (relativePath.includes('components/ui')) return 'UI_COMPONENTS';
  if (relativePath.includes('components/')) return 'COMPONENTS';
  if (relativePath.includes('app/api')) return 'API_ROUTES';
  if (relativePath.includes('app/') && !relativePath.includes('api')) return 'PAGES';
  if (relativePath.includes('hooks')) return 'HOOKS';
  if (relativePath.includes('lib/services')) return 'SERVICES';
  if (relativePath.includes('lib/')) return 'UTILS';
  if (relativePath.includes('prisma') || relativePath.includes('supabase')) return 'DATABASE';
  if (relativePath.includes('rasa')) return 'AI_CONFIG';
  if (relativePath.includes('.css') || relativePath.includes('styles')) return 'STYLES';
  if (relativePath.includes('scripts')) return 'DEPLOYMENT';
  if (relativePath.includes('.json') || relativePath.includes('.js')) return 'CONFIG';
  if (relativePath.includes('types')) return 'TYPES';
  
  return 'OTHER';
}

function generateUltimateReport(files) {
  // Sort by importance (essential files first)
  const sortedFiles = files.sort((a, b) => {
    const aEssential = isUltimateEssentialFile(a);
    const bEssential = isUltimateEssentialFile(b);
    
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
  
  let report = `FRONTEND CODEBASE - ULTIMATE COMPLETE UNDERSTANDING
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
  report += `ULTIMATE SOURCE CODE\n`;
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
  report += `ULTIMATE ANALYSIS COMPLETE\n`;
  report += `${'='.repeat(50)}\n`;
  report += `Files included: ${includedFiles}/${files.length}\n`;
  report += `Total size: ${(totalSize / 1024).toFixed(1)}KB\n`;
  report += `Generated: ${new Date().toISOString()}\n`;
  
  return report;
}

function main() {
  console.log('🔍 Scanning for ultimate complete understanding files...');
  
  const files = scanDirectory(FRONTEND_DIR);
  console.log(`📁 Found ${files.length} ultimate essential files`);
  
  console.log('📝 Generating ultimate analysis report...');
  const report = generateUltimateReport(files);
  
  console.log(`💾 Writing to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeInKB = (stats.size / 1024).toFixed(1);
  
  console.log(`✅ Ultimate analysis complete!`);
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

module.exports = { main, scanDirectory, generateUltimateReport };
