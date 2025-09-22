#!/usr/bin/env node

/**
 * Simple CSS Comparison Tool
 * This script identifies common CSS differences between localhost and production
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Analyzing CSS differences between localhost and production...\n');

// Check if .next directory exists (production build)
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ No .next directory found. Please run "npm run build" first.');
  process.exit(1);
}

// Check CSS files in .next/static/css
const cssDir = path.join(nextDir, 'static', 'css');
if (!fs.existsSync(cssDir)) {
  console.log('❌ No CSS directory found in .next/static/css');
  process.exit(1);
}

const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
console.log(`📁 Found ${cssFiles.length} CSS files in build output:`);

cssFiles.forEach(file => {
  const filePath = path.join(cssDir, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`   - ${file} (${sizeKB} KB)`);
});

// Analyze CSS content for common issues
console.log('\n🔍 Analyzing CSS content for common issues...');

const issues = [];

cssFiles.forEach(file => {
  const filePath = path.join(cssDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for common CSS issues
  if (content.includes('undefined')) {
    issues.push(`❌ Found "undefined" in ${file} - possible CSS variable issue`);
  }
  
  if (content.includes('calc(') && content.includes('var(')) {
    const calcMatches = content.match(/calc\([^)]*var\([^)]*\)[^)]*\)/g);
    if (calcMatches) {
      issues.push(`⚠️  Found ${calcMatches.length} calc() expressions with CSS variables in ${file}`);
    }
  }
  
  if (content.includes('!important')) {
    const importantMatches = content.match(/!important/g);
    if (importantMatches) {
      issues.push(`⚠️  Found ${importantMatches.length} !important declarations in ${file}`);
    }
  }
  
  // Check for Tailwind classes that might be purged
  const tailwindClasses = [
    'btn-primary', 'btn-secondary', 'unified-primary', 'unified-bg-primary',
    'header-button-account', 'header-button-language-inactive', 'header-button-menu'
  ];
  
  tailwindClasses.forEach(className => {
    if (!content.includes(className)) {
      issues.push(`⚠️  Tailwind class "${className}" not found in ${file} - might be purged`);
    }
  });
});

if (issues.length > 0) {
  console.log('\n🚨 Issues found:');
  issues.forEach(issue => console.log(`   ${issue}`));
} else {
  console.log('\n✅ No obvious CSS issues found');
}

// Check for environment-specific differences
console.log('\n🔍 Checking for environment-specific configurations...');

// Check Next.js config
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  if (nextConfig.includes('optimizeCss: false')) {
    console.log('   ✅ CSS optimization is disabled in next.config.js');
  } else {
    console.log('   ⚠️  CSS optimization might be enabled');
  }
  
  if (nextConfig.includes('swcMinify: false')) {
    console.log('   ✅ SWC minification is disabled');
  } else {
    console.log('   ⚠️  SWC minification might be enabled');
  }
}

// Check Tailwind config
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
if (fs.existsSync(tailwindConfigPath)) {
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
  
  if (tailwindConfig.includes('safelist')) {
    console.log('   ✅ Tailwind safelist is configured');
  } else {
    console.log('   ⚠️  No Tailwind safelist found - classes might be purged');
  }
}

// Check PostCSS config
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssConfigPath)) {
  const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
  
  if (postcssConfig.includes('cssnano')) {
    console.log('   ⚠️  CSSnano is enabled - might cause differences');
  } else {
    console.log('   ✅ CSSnano is disabled');
  }
}

console.log('\n📊 Analysis complete!');
console.log('\n💡 To fix common issues:');
console.log('   1. Ensure all CSS variables are properly defined');
console.log('   2. Check that Tailwind classes are not being purged');
console.log('   3. Verify CSS optimization settings');
console.log('   4. Test with identical viewport sizes and browser settings');
