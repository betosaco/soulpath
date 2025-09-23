#!/usr/bin/env node

import fs from 'fs';
import path from 'path';


// Configuration for ultra-essential files only
const OUTPUT_FILE = 'frontend-ultra-essential.txt';

// Ultra-essential files - only the most critical for analysis
const ULTRA_ESSENTIAL_PATHS = [
  // Core app structure
  'app/layout.tsx',
  'app/page.tsx',
  
  // Main user-facing pages
  'app/products/page.tsx',
  'app/product/[id]/page.tsx',
  'app/packages/page.tsx',
  'app/schedule/page.tsx',
  'app/checkout/page.tsx',
  
  // Essential API routes
  'app/api/products/route.ts',
  'app/api/products/[id]/route.ts',
  'app/api/packages/route.ts',
  
  // Core cart and booking system
  'lib/cart-context.tsx',
  'components/CartIcon.tsx',
  'components/CartSidebar.tsx',
  'components/PackagesBookingFlow.tsx',
  'components/ProductCheckoutFlow.tsx',
  'components/EnhancedSchedule.tsx',
  'components/ScheduleBookingFlow.tsx',
  
  // Essential layout components
  'components/AppLayout.tsx',
  'components/CentralizedHeader.tsx',
  
  // Core configuration
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

function createUltraEssentialExport() {
  console.log('🚀 Starting ultra-essential frontend export...');
  
  const startTime = Date.now();
  let content = '';
  
  // Add header
  content += '='.repeat(80) + '\n';
  content += 'MATMAX YOGA STUDIO - ULTRA-ESSENTIAL FRONTEND CODE\n';
  content += 'Generated: ' + new Date().toISOString() + '\n';
  content += 'Most critical files for analysis only\n';
  content += '='.repeat(80) + '\n';
  
  // Add project overview
  content += '\nULTRA-ESSENTIAL FEATURES:\n';
  content += '🛒 Cart System with PEN currency support\n';
  content += '🛍️  Product E-commerce (products, individual product, checkout)\n';
  content += '📦 Package Booking (packages, booking flow)\n';
  content += '📅 Schedule Booking (schedule, enhanced schedule)\n';
  content += '💳 Smart Checkout (address only when mixed products+packages)\n';
  content += '🗄️  Database Integration (Prisma schema)\n';
  content += '⚛️  Next.js 14 App Router + TypeScript + React\n';
  content += '🎨 Tailwind CSS styling\n';
  content += '\n';
  
  // Process ultra-essential files
  const currentDir = process.cwd();
  let filesProcessed = 0;
  
  for (const filePath of ULTRA_ESSENTIAL_PATHS) {
    const fullPath = path.join(currentDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`📄 Including: ${filePath}`);
      content += formatFileHeader(fullPath, filePath);
      content += getFileContent(fullPath);
      content += '\n';
      filesProcessed++;
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  }
  
  // Add summary
  content += '\n' + '='.repeat(80) + '\n';
  content += `ULTRA-ESSENTIAL EXPORT SUMMARY\n`;
  content += `Files processed: ${filesProcessed}\n`;
  content += `Generated: ${new Date().toISOString()}\n`;
  content += `Focus: Core functionality only\n`;
  content += '='.repeat(80) + '\n';
  
  // Write to file
  try {
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Ultra-essential export completed!`);
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
  createUltraEssentialExport();
}

export { createUltraEssentialExport };
