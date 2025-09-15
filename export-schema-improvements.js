#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Schema Improvements Export
 * 
 * This script exports all the new schema improvements and relationship updates including:
 * - Enhanced Prisma schema with enums and relationships
 * - Updated admin components with new relationship handling
 * - New API routes for centralized data management
 * - Updated interfaces and type definitions
 * - Migration scripts and documentation
 * 
 * Focus: Schema refactoring, relationship improvements, and data integrity
 */

const OUTPUT_FILE = './schema-improvements-export.txt';
const MAX_FILE_SIZE = 200 * 1024; // 200KB per file
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB total

// Schema improvement patterns to include
const SCHEMA_IMPROVEMENT_PATTERNS = [
  // Core Schema Files
  '**/schema.prisma',
  '**/migrations/**',
  
  // New API Routes for Relationships
  '**/api/admin/amenities/**',
  '**/api/admin/specialties/**',
  '**/api/admin/languages/**',
  '**/api/admin/teachers/**',
  '**/api/admin/venues/**',
  '**/api/admin/service-types/**',
  '**/api/services/**',
  '**/api/teachers/**',
  
  // Updated Admin Components
  '**/components/admin/TeacherManagement.tsx',
  '**/components/admin/VenueManagement.tsx',
  '**/components/admin/ServiceTypeManagement.tsx',
  '**/components/admin/AdminSidebar.tsx',
  '**/components/admin/AdminMainContent.tsx',
  '**/components/admin/AdminLayout.tsx',
  '**/components/admin/AdminHeader.tsx',
  
  // Public Components with New Filtering
  '**/components/ServiceGrid.tsx',
  '**/components/ServiceDisplay.tsx',
  '**/components/ServiceDetailPage.tsx',
  '**/components/TeacherGrid.tsx',
  '**/components/TeacherProfilePage.tsx',
  
  // API Utilities and Types
  '**/lib/api/admin.ts',
  '**/lib/validations.ts',
  '**/lib/api-utils.ts',
  
  // Hooks and State Management
  '**/hooks/usePackages.tsx',
  '**/hooks/useAuth.tsx',
  
  // Documentation
  '**/SCHEMA_IMPROVEMENTS_README.md',
  '**/AUTH_REFACTORING_README.md',
  '**/PACKAGES_DATABASE_INTEGRATION.md',
  
  // Configuration
  '**/middleware.ts',
  '**/package.json',
  '**/tsconfig.json',
  '**/next.config.*',
  '**/tailwind.config.*',
  
  // Styles
  '**/styles/**',
  '**/globals.css',
  
  // Core Layout and Pages
  '**/app/(admin)/**',
  '**/app/login/**',
  '**/app/packages/**',
  '**/app/layout.tsx',
  '**/app/page.tsx',
  '**/app/globals.css'
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/coverage/**',
  '**/logs/**',
  '**/*.log',
  '**/rasa_env/**',
  '**/models/**',
  '**/results/**',
  '**/__pycache__/**',
  '**/venv/**',
  '**/.env*',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml'
];

function shouldIncludeFile(filePath, content) {
  // Check file size
  if (content.length > MAX_FILE_SIZE) {
    return false;
  }
  
  // Check exclude patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (minimatch(filePath, pattern)) {
      return false;
    }
  }
  
  // Check include patterns
  for (const pattern of SCHEMA_IMPROVEMENT_PATTERNS) {
    if (minimatch(filePath, pattern)) {
      return true;
    }
  }
  
  return false;
}

function minimatch(str, pattern) {
  const regex = new RegExp(
    pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.')
  );
  return regex.test(str);
}

function getAllFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllFiles(fullPath, allFiles);
    } else {
      allFiles.push(fullPath);
    }
  }
  
  return allFiles;
}

function formatFileContent(filePath, content) {
  const relativePath = path.relative(process.cwd(), filePath);
  const lines = content.split('\n');
  const lineCount = lines.length;
  
  return `\n${'='.repeat(80)}
FILE: ${relativePath}
LINES: ${lineCount}
${'='.repeat(80)}

${content}

`;
}

function main() {
  console.log('🚀 Starting schema improvements export...');
  console.log('Target: Schema refactoring and relationship improvements');
  console.log(`Output file: ${OUTPUT_FILE}`);
  
  let totalSize = 0;
  let processedFiles = 0;
  let excludedFiles = 0;
  let output = '';
  
  // Add header
  output += `SCHEMA IMPROVEMENTS EXPORT
Generated: ${new Date().toISOString()}
Target: Enhanced Prisma schema with relationships and improved admin components

This export includes:
✨ Enhanced Prisma schema with 8 enums and proper relationships
🔗 Many-to-many relationships for amenities, specialties, and languages
🏗️ New models: Amenity, Specialty, Language, Testimonial, FAQ, ServicePrice
🔧 Updated admin components with relationship handling
📡 New API routes for centralized data management
🎨 Improved UI components with checkbox-based selection
📊 Better data integrity and type safety
🚀 Foundation for advanced filtering and search features

${'='.repeat(80)}

`;
  
  // Process frontend directory
  console.log('📁 Processing frontend directory...');
  const frontendFiles = getAllFiles('./frontend');
  
  for (const file of frontendFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (shouldIncludeFile(file, content)) {
        const fileSize = Buffer.byteLength(content, 'utf8');
        
        if (totalSize + fileSize > MAX_TOTAL_SIZE) {
          console.log(`⚠️  Total size limit reached, stopping export`);
          break;
        }
        
        output += formatFileContent(file, content);
        totalSize += fileSize;
        processedFiles++;
      } else {
        excludedFiles++;
      }
    } catch (error) {
      console.log(`⚠️  Error reading file ${file}: ${error.message}`);
      excludedFiles++;
    }
  }
  
  // Process root level files
  console.log('📁 Processing root level files...');
  const rootFiles = fs.readdirSync('.')
    .filter(file => {
      const fullPath = path.join('.', file);
      return fs.statSync(fullPath).isFile();
    });
  
  for (const file of rootFiles) {
    try {
      const fullPath = path.join('.', file);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (shouldIncludeFile(fullPath, content)) {
        const fileSize = Buffer.byteLength(content, 'utf8');
        
        if (totalSize + fileSize > MAX_TOTAL_SIZE) {
          console.log(`⚠️  Total size limit reached, stopping export`);
          break;
        }
        
        output += formatFileContent(fullPath, content);
        totalSize += fileSize;
        processedFiles++;
      } else {
        excludedFiles++;
      }
    } catch (error) {
      console.log(`⚠️  Error reading file ${file}: ${error.message}`);
      excludedFiles++;
    }
  }
  
  // Write output file
  fs.writeFileSync(OUTPUT_FILE, output);
  
  console.log('\n✅ Schema improvements export completed!');
  console.log('📊 Statistics:');
  console.log(`   Files processed: ${processedFiles}`);
  console.log(`   Files excluded: ${excludedFiles}`);
  console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`\n📁 Output file: ${path.resolve(OUTPUT_FILE)}`);
  
  console.log('\n🔧 Schema Improvements Included:');
  console.log('   ✅ Enhanced Prisma Schema - 8 enums, proper relationships');
  console.log('   ✅ New Models - Amenity, Specialty, Language, Testimonial, FAQ, ServicePrice');
  console.log('   ✅ Many-to-Many Relationships - VenueAmenity, TeacherSpecialty, TeacherLanguage');
  console.log('   ✅ Updated Admin Components - TeacherManagement, VenueManagement');
  console.log('   ✅ New API Routes - Centralized data management endpoints');
  console.log('   ✅ Improved UI - Checkbox-based selection, better UX');
  console.log('   ✅ Type Safety - Comprehensive interfaces and validations');
  console.log('   ✅ Documentation - Complete implementation guides');
}

main();
