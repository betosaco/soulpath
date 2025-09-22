#!/usr/bin/env node

/**
 * CSS Build Test Script
 * This script helps identify CSS differences between development and production builds
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing CSS Build Process...\n');

// Test 1: Check if CSS files are being generated correctly
console.log('1. Checking CSS file generation...');
try {
  // Run build
  console.log('   Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check for CSS files in .next/static/css
  const cssDir = path.join(process.cwd(), '.next/static/css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    console.log(`   ✅ Found ${cssFiles.length} CSS files in build output`);
    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   - ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    });
  } else {
    console.log('   ❌ No CSS directory found in build output');
  }
} catch (error) {
  console.log('   ❌ Build failed:', error.message);
}

// Test 2: Check for CSS purging issues
console.log('\n2. Checking for CSS purging issues...');
try {
  const globalsCss = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
  const customClasses = [
    'admin-dashboard',
    'mobile-menu',
    'chat-window',
    'dashboard-button-primary',
    'cosmic-glow',
    'mobile-container'
  ];
  
  const missingClasses = customClasses.filter(className => 
    !globalsCss.includes(className)
  );
  
  if (missingClasses.length === 0) {
    console.log('   ✅ All custom classes found in globals.css');
  } else {
    console.log('   ⚠️  Missing custom classes:', missingClasses.join(', '));
  }
} catch (error) {
  console.log('   ❌ Error reading globals.css:', error.message);
}

// Test 3: Check Tailwind configuration
console.log('\n3. Checking Tailwind configuration...');
try {
  const tailwindConfig = fs.readFileSync(path.join(process.cwd(), 'tailwind.config.ts'), 'utf8');
  
  if (tailwindConfig.includes('safelist')) {
    console.log('   ✅ Safelist found in Tailwind config');
  } else {
    console.log('   ⚠️  No safelist found in Tailwind config');
  }
  
  if (tailwindConfig.includes('optimizeCss: false')) {
    console.log('   ✅ CSS optimization disabled in Next.js config');
  } else {
    console.log('   ⚠️  CSS optimization not explicitly disabled');
  }
} catch (error) {
  console.log('   ❌ Error reading Tailwind config:', error.message);
}

// Test 4: Check PostCSS configuration
console.log('\n4. Checking PostCSS configuration...');
try {
  const postcssConfig = fs.readFileSync(path.join(process.cwd(), 'postcss.config.js'), 'utf8');
  
  if (postcssConfig.includes('cssnano')) {
    console.log('   ✅ CSS minification configured');
  } else {
    console.log('   ⚠️  No CSS minification configured');
  }
} catch (error) {
  console.log('   ❌ Error reading PostCSS config:', error.message);
}

console.log('\n🎯 CSS Build Test Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Deploy to Vercel and compare with localhost');
console.log('2. Use ?debug=css in URL to see CSS debugger');
console.log('3. Check browser dev tools for missing styles');
console.log('4. Verify all custom classes are preserved in production');
