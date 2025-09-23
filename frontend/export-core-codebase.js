#!/usr/bin/env node

import fs from 'fs';
import path from 'path';


// Configuration for core files only
const OUTPUT_FILE = 'frontend-core-codebase.txt';

// Core files and directories to include (most essential)
const CORE_PATHS = [
  // Main app structure
  'app/layout.tsx',
  'app/page.tsx',
  'app/products/page.tsx',
  'app/product/[id]/page.tsx',
  'app/packages/page.tsx',
  'app/schedule/page.tsx',
  'app/checkout/page.tsx',
  
  // API routes
  'app/api/products/route.ts',
  'app/api/products/[id]/route.ts',
  'app/api/packages/route.ts',
  
  // Core components
  'components/AppLayout.tsx',
  'components/CentralizedHeader.tsx',
  'components/CartIcon.tsx',
  'components/CartSidebar.tsx',
  'components/PackagesBookingFlow.tsx',
  'components/ProductCheckoutFlow.tsx',
  'components/EnhancedSchedule.tsx',
  'components/ScheduleBookingFlow.tsx',
  
  // Core utilities and context
  'lib/cart-context.tsx',
  'hooks/usePackages.ts',
  'hooks/useTranslations.ts',
  'hooks/useLanguage.ts',
  
  // Configuration
  'middleware.ts',
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
  'prisma/schema.prisma'
];

function getFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return `// Error reading file: ${error.message}\n`;
  }
}

function formatFileHeader(filePath, relativePath) {
  const separator = '='.repeat(80);
  return `\n${separator}\nFILE: ${relativePath}\n${separator}\n`;
}

function createCoreExport() {
  console.log('🚀 Starting core frontend codebase export...');
  
  const startTime = Date.now();
  let content = '';
  
  // Add header
  content += '='.repeat(80) + '\n';
  content += 'MATMAX YOGA STUDIO - CORE FRONTEND CODEBASE\n';
  content += 'Generated: ' + new Date().toISOString() + '\n';
  content += 'Essential files for analysis only\n';
  content += '='.repeat(80) + '\n';
  
  // Add project overview
  content += '\nCORE FEATURES INCLUDED:\n';
  content += '✅ Cart system with currency support (PEN)\n';
  content += '✅ Product e-commerce functionality\n';
  content += '✅ Package booking system\n';
  content += '✅ Schedule booking system\n';
  content += '✅ Smart checkout flow (address only when mixed)\n';
  content += '✅ Database integration with Prisma\n';
  content += '✅ Next.js 14 App Router\n';
  content += '✅ TypeScript + React components\n';
  content += '✅ Tailwind CSS styling\n';
  content += '\n';
  
  // Process core files
  const currentDir = process.cwd();
  let filesProcessed = 0;
  
  for (const corePath of CORE_PATHS) {
    const fullPath = path.join(currentDir, corePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`📄 Including: ${corePath}`);
      content += formatFileHeader(fullPath, corePath);
      content += getFileContent(fullPath);
      content += '\n';
      filesProcessed++;
    } else {
      console.log(`⚠️  File not found: ${corePath}`);
    }
  }
  
  // Add summary
  content += '\n' + '='.repeat(80) + '\n';
  content += `EXPORT SUMMARY\n`;
  content += `Files processed: ${filesProcessed}\n`;
  content += `Generated: ${new Date().toISOString()}\n`;
  content += '='.repeat(80) + '\n';
  
  // Write to file
  try {
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Core export completed successfully!`);
    console.log(`📄 Output file: ${OUTPUT_FILE}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📊 File size: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📁 Files processed: ${filesProcessed}`);
    
  } catch (error) {
    console.error('❌ Error writing output file:', error.message);
    process.exit(1);
  }
}

// Run the export
if (import.meta.url === `file://${process.argv[1]}`) {
  createCoreExport();
}

export { createCoreExport };
