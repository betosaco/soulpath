#!/usr/bin/env node

import fs from 'fs';
import path from 'path';


// Configuration for minimal essential files only
const OUTPUT_FILE = 'frontend-minimal-essential.txt';

// Minimal essential files - only the absolute core for analysis
const MINIMAL_ESSENTIAL_PATHS = [
  // Core app structure
  'app/layout.tsx',
  'app/page.tsx',
  
  // Main user-facing pages (simplified)
  'app/products/page.tsx',
  'app/product/[id]/page.tsx',
  'app/packages/page.tsx',
  'app/checkout/page.tsx',
  
  // Essential API routes
  'app/api/products/route.ts',
  'app/api/products/[id]/route.ts',
  'app/api/packages/route.ts',
  
  // Core cart system only
  'lib/cart-context.tsx',
  'components/CartIcon.tsx',
  'components/CartSidebar.tsx',
  
  // Essential layout
  'components/AppLayout.tsx',
  'components/CentralizedHeader.tsx',
  
  // Core configuration
  'middleware.ts',
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

function createMinimalEssentialExport() {
  console.log('🚀 Starting minimal essential frontend export...');
  
  const startTime = Date.now();
  let content = '';
  
  // Add header
  content += '='.repeat(80) + '\n';
  content += 'MATMAX YOGA STUDIO - MINIMAL ESSENTIAL FRONTEND CODE\n';
  content += 'Generated: ' + new Date().toISOString() + '\n';
  content += 'Absolute core files for analysis only\n';
  content += '='.repeat(80) + '\n';
  
  // Add project overview
  content += '\nMINIMAL ESSENTIAL FEATURES:\n';
  content += '🛒 Cart System (context, icon, sidebar)\n';
  content += '🛍️  Product E-commerce (listing, individual, checkout)\n';
  content += '📦 Package System (packages page)\n';
  content += '🗄️  Database Integration (Prisma schema)\n';
  content += '⚛️  Next.js 14 App Router + TypeScript\n';
  content += '\n';
  
  // Process minimal essential files
  const currentDir = process.cwd();
  let filesProcessed = 0;
  
  for (const filePath of MINIMAL_ESSENTIAL_PATHS) {
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
  content += `MINIMAL ESSENTIAL EXPORT SUMMARY\n`;
  content += `Files processed: ${filesProcessed}\n`;
  content += `Generated: ${new Date().toISOString()}\n`;
  content += `Focus: Absolute core functionality only\n`;
  content += '='.repeat(80) + '\n';
  
  // Write to file
  try {
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Minimal essential export completed!`);
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
  createMinimalEssentialExport();
}

export { createMinimalEssentialExport };
