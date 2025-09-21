import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting unified commerce codebase export...');

// Core files for unified commerce
const coreFiles = [
  // Database Schema
  'prisma/schema.prisma',
  
  // Cart Context (Fixed)
  'lib/cart-context.tsx',
  
  // Unified Checkout Flow
  'components/UnifiedCheckoutFlow.tsx',
  
  // Updated Checkout Page
  'app/checkout/page.tsx',
  
  // Updated Booking Flow
  'components/PackagesBookingFlow.tsx',
  
  // Unified API
  'app/api/orders/create-unified/route.ts',
  
  // Core App Files
  'app/layout.tsx',
  'app/page.tsx',
  'middleware.ts',
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
  
  // UI Components
  'components/AppLayout.tsx',
  'components/CentralizedHeader.tsx',
  'components/CartIcon.tsx',
  'components/CartSidebar.tsx',
  
  // Product Pages
  'app/products/page.tsx',
  'app/product/[id]/page.tsx',
  'app/packages/page.tsx',
  'app/schedule/page.tsx',
  
  // API Routes
  'app/api/products/route.ts',
  'app/api/products/[id]/route.ts',
  'app/api/packages/route.ts',
  
  // Other Components
  'components/EnhancedSchedule.tsx',
  'components/ScheduleBookingFlow.tsx',
  'components/ProductCheckoutFlow.tsx'
];

const startTime = Date.now();
let fileCount = 0;
let totalSize = 0;
const output = [];

// Add header
output.push('# MatMax Yoga Studio - Unified Commerce Codebase');
output.push('');
output.push('## Overview');
output.push('This export contains the unified commerce implementation that allows seamless checkout of both physical products and yoga packages in a single flow.');
output.push('');
output.push('## Key Features');
output.push('- ✅ Unified checkout flow for products and packages');
output.push('- ✅ Polymorphic database schema with OrderItem supporting both types');
output.push('- ✅ Fixed shipping address logic');
output.push('- ✅ Single API endpoint for order creation');
output.push('- ✅ Simplified booking flows');
output.push('- ✅ Mixed cart support');
output.push('');
output.push('## Architecture Changes');
output.push('1. **Database Schema**: OrderItem now supports both PRODUCT and PACKAGE types');
output.push('2. **Cart Logic**: Fixed requiresAddress() to check for any physical products');
output.push('3. **Checkout Flow**: Single UnifiedCheckoutFlow component handles all item types');
output.push('4. **API**: Unified order creation endpoint processes both products and packages');
output.push('5. **Booking Flows**: Simplified to focus on selection, redirect to unified checkout');
output.push('');
output.push('---');
output.push('');

// Process each file
for (const filePath of coreFiles) {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const size = Buffer.byteLength(content, 'utf8');
      
      output.push(`## ${filePath}`);
      output.push('');
      output.push('```' + getFileExtension(filePath));
      output.push(content);
      output.push('```');
      output.push('');
      
      fileCount++;
      totalSize += size;
      console.log(`📄 Including: ${filePath}`);
    } catch (error) {
      console.log(`⚠️  Error reading ${filePath}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

// Write output
const outputContent = output.join('\n');
const outputFile = 'frontend-unified-commerce.txt';
fs.writeFileSync(outputFile, outputContent);

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log('✅ Unified commerce export completed successfully!');
console.log(`📄 Output file: ${outputFile}`);
console.log(`⏱️  Duration: ${duration}s`);
console.log(`📊 File size: ${sizeMB} MB`);
console.log(`📁 Files processed: ${fileCount}`);

function getFileExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const extMap = {
    '.tsx': 'tsx',
    '.ts': 'typescript',
    '.js': 'javascript',
    '.json': 'json',
    '.prisma': 'prisma',
    '.md': 'markdown',
    '.css': 'css',
    '.html': 'html'
  };
  return extMap[ext] || 'text';
}
