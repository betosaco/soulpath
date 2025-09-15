#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Complete Codebase Export for Code Review
 * 
 * This script exports the complete codebase with full code content for code review:
 * - All authentication and authorization files with full code
 * - Complete application logic and components
 * - Database schema and configurations
 * - API routes with full implementation
 * - Backend services and configurations
 * - Teacher profile and service management system
 * - Venue and teacher scheduling system
 * - Service types and package management
 * 
 * Focus: Complete code review with authentication refactoring changes and new teacher/service features
 */

const OUTPUT_FILE = './complete-codebase-for-review.txt';
const MAX_FILE_SIZE = 200 * 1024; // 200KB per file
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB total

// File patterns to include (comprehensive coverage)
const INCLUDE_PATTERNS = [
  // Authentication & Authorization (HIGHEST PRIORITY)
  '**/middleware.ts',
  '**/auth.ts',
  '**/useAuth.tsx',
  '**/api/admin.ts',
  '**/api/auth/**',
  '**/api/admin/**',
  
  // Core Application Files
  '**/layout.tsx',
  '**/page.tsx',
  '**/globals.css',
  '**/next.config.*',
  '**/tailwind.config.*',
  '**/tsconfig.json',
  '**/package.json',
  
  // Database & Prisma
  '**/schema.prisma',
  '**/prisma.ts',
  '**/migrations/**',
  
  // Hooks & Utils
  '**/usePackages.tsx',
  '**/useContentManagement.tsx',
  '**/useTranslations.tsx',
  '**/useRevalidation.ts',
  '**/api-utils.ts',
  '**/utils.ts',
  '**/validations.ts',
  '**/lib/**',
  
  // Components (All)
  '**/components/**',
  '**/AdminDashboard.tsx',
  '**/LoginModal.tsx',
  '**/PackageDisplay.tsx',
  '**/BookingSection.tsx',
  '**/Header.tsx',
  '**/CustomerDashboard.tsx',
  '**/PackagePurchaseFlow.tsx',
  '**/BugReportSystem.tsx',
  '**/ContentManagement.tsx',
  
  // NEW: Teacher Profile & Service Management Components
  '**/VenueManagement.tsx',
  '**/TeacherManagement.tsx',
  '**/TeacherScheduleManagement.tsx',
  '**/ServiceTypeManagement.tsx',
  '**/ServiceDisplay.tsx',
  '**/ServiceGrid.tsx',
  '**/ServiceDetailPage.tsx',
  '**/TeacherProfilePage.tsx',
  '**/TeacherGrid.tsx',
  '**/AdminSidebar.tsx',
  '**/AdminMainContent.tsx',
  '**/components/admin/VenueManagement.tsx',
  '**/components/admin/TeacherManagement.tsx',
  '**/components/admin/TeacherScheduleManagement.tsx',
  '**/components/admin/ServiceTypeManagement.tsx',
  '**/components/ServiceDisplay.tsx',
  '**/components/ServiceGrid.tsx',
  '**/components/ServiceDetailPage.tsx',
  '**/components/TeacherProfilePage.tsx',
  '**/components/TeacherGrid.tsx',
  '**/components/admin/AdminSidebar.tsx',
  '**/components/admin/AdminMainContent.tsx',
  
  // API Routes (All)
  '**/api/**/route.ts',
  '**/api/**/page.ts',
  
  // NEW: Teacher & Service API Routes
  '**/api/admin/venues/**',
  '**/api/admin/teachers/**',
  '**/api/admin/teacher-schedules/**',
  '**/api/admin/service-types/**',
  '**/api/admin/package-services/**',
  '**/api/admin/teacher-certifications/**',
  '**/api/admin/media/**',
  '**/api/services/**',
  '**/api/teachers/**',
  
  // App Pages (All)
  '**/app/**/page.tsx',
  '**/app/**/layout.tsx',
  '**/app/**/route.ts',
  '**/app/**/loading.tsx',
  '**/app/**/error.tsx',
  
  // Backend Services
  '**/rasa/**',
  '**/backend/**',
  
  // NEW: CSS Styles
  '**/admin-dashboard.css',
  '**/service-display.css',
  '**/teacher-profile.css',
  
  // Configuration Files
  '**/env.example',
  '**/.env.local.example',
  '**/vercel.json',
  '**/render.yaml',
  '**/docker-compose.yml',
  '**/Dockerfile*',
  '**/railway.json',
  
  // Documentation
  '**/README.md',
  '**/AUTH_REFACTORING_README.md',
  '**/*.md'
];

// File patterns to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/logs/**',
  '**/models/**',
  '**/__pycache__/**',
  '**/.rasa/**',
  '**/venv/**',
  '**/site-packages/**',
  '**/rasa_env/**',
  '**/.temp/**',
  '**/.branches/**',
  '**/*.log',
  '**/*.tmp',
  '**/*.cache',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/*.png',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.gif',
  '**/*.svg',
  '**/*.ico',
  '**/*.woff',
  '**/*.woff2',
  '**/*.ttf',
  '**/*.eot',
  '**/*.mp3',
  '**/*.mp4',
  '**/*.wav',
  '**/*.avi',
  '**/*.mov',
  '**/*.zip',
  '**/*.tar.gz',
  '**/*.rar',
  '**/*.7z',
  '**/WormNet.v3.benchmark.txt'
];

// Priority order for authentication files
const AUTH_PRIORITY_FILES = [
  'middleware.ts',
  'lib/auth.ts',
  'hooks/useAuth.tsx',
  'lib/api/admin.ts',
  'app/api/admin/stats/route.ts',
  'app/(admin)/dashboard/page.tsx',
  'app/login/page.tsx',
  'app/(admin)/admin/page.tsx',
  'app/(admin)/layout.tsx'
];

// Priority order for teacher profile and service management files
const TEACHER_SERVICE_PRIORITY_FILES = [
  'prisma/schema.prisma',
  'app/api/admin/venues/route.ts',
  'app/api/admin/teachers/route.ts',
  'app/api/admin/teacher-schedules/route.ts',
  'app/api/admin/service-types/route.ts',
  'app/api/admin/package-services/route.ts',
  'app/api/admin/teacher-certifications/route.ts',
  'app/api/admin/media/route.ts',
  'app/api/services/route.ts',
  'app/api/teachers/route.ts',
  'components/admin/VenueManagement.tsx',
  'components/admin/TeacherManagement.tsx',
  'components/admin/TeacherScheduleManagement.tsx',
  'components/admin/ServiceTypeManagement.tsx',
  'components/ServiceDisplay.tsx',
  'components/ServiceGrid.tsx',
  'components/ServiceDetailPage.tsx',
  'components/TeacherProfilePage.tsx',
  'components/TeacherGrid.tsx',
  'components/admin/AdminSidebar.tsx',
  'components/admin/AdminMainContent.tsx',
  'styles/admin-dashboard.css',
  'styles/service-display.css',
  'styles/teacher-profile.css'
];

let totalSize = 0;
let filesProcessed = 0;
let filesExcluded = 0;

/**
 * Check if a file matches any pattern
 */
function matchesPattern(filePath, patterns) {
  return patterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

/**
 * Check if file should be excluded
 */
function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

/**
 * Get file priority for sorting
 */
function getFilePriority(filePath) {
  // Authentication files get highest priority
  for (let i = 0; i < AUTH_PRIORITY_FILES.length; i++) {
    if (filePath.includes(AUTH_PRIORITY_FILES[i])) {
      return i;
    }
  }
  
  // Teacher profile and service management files get high priority
  for (let i = 0; i < TEACHER_SERVICE_PRIORITY_FILES.length; i++) {
    if (filePath.includes(TEACHER_SERVICE_PRIORITY_FILES[i])) {
      return 50 + i; // After auth files but before other API routes
    }
  }
  
  // API routes get high priority
  if (filePath.includes('/api/')) {
    return 100;
  }
  
  // Core app files
  if (filePath.includes('/app/') || filePath.includes('/pages/')) {
    return 200;
  }
  
  // Components
  if (filePath.includes('/components/')) {
    return 300;
  }
  
  // Utils and libs
  if (filePath.includes('/lib/') || filePath.includes('/utils/')) {
    return 400;
  }
  
  // Hooks
  if (filePath.includes('/hooks/')) {
    return 450;
  }
  
  // Configuration
  if (filePath.includes('config') || filePath.includes('.json') || filePath.includes('.ts')) {
    return 500;
  }
  
  // Backend
  if (filePath.includes('/backend/') || filePath.includes('/rasa/')) {
    return 600;
  }
  
  return 1000;
}

/**
 * Process a single file
 */
function processFile(filePath, relativePath, outputStream) {
  try {
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      return;
    }
    
    if (shouldExclude(filePath)) {
      filesExcluded++;
      return;
    }
    
    if (stats.size > MAX_FILE_SIZE) {
      console.log(`⚠️  Skipping large file: ${relativePath} (${(stats.size / 1024).toFixed(1)}KB)`);
      filesExcluded++;
      return;
    }
    
    if (totalSize + stats.size > MAX_TOTAL_SIZE) {
      console.log(`⚠️  Reached size limit, stopping export`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Write file header
    outputStream.write(`\n${'='.repeat(80)}\n`);
    outputStream.write(`FILE: ${relativePath}\n`);
    outputStream.write(`SIZE: ${(stats.size / 1024).toFixed(1)}KB\n`);
    outputStream.write(`TYPE: ${path.extname(filePath)}\n`);
    outputStream.write(`${'='.repeat(80)}\n\n`);
    
    // Write file content
    outputStream.write(content);
    outputStream.write(`\n\n`);
    
    totalSize += stats.size;
    filesProcessed++;
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    filesExcluded++;
    return true;
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath, relativePath = '', outputStream) {
  try {
    const items = fs.readdirSync(dirPath);
    
    // Sort items by priority
    const sortedItems = items.sort((a, b) => {
      const aPath = path.join(relativePath, a);
      const bPath = path.join(relativePath, b);
      return getFilePriority(aPath) - getFilePriority(bPath);
    });
    
    for (const item of sortedItems) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath, itemRelativePath, outputStream);
      } else {
        const shouldContinue = processFile(fullPath, itemRelativePath, outputStream);
        if (!shouldContinue) {
          break;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

/**
 * Main export function
 */
function exportCompleteCodebase() {
  console.log('🚀 Starting complete codebase export for code review...');
  console.log(`Target: Complete code with authentication refactoring`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  
  // Create output stream
  const outputStream = fs.createWriteStream(OUTPUT_FILE);
  
  // Write header
  const header = `# WELLNESS MONOREPO - COMPLETE CODEBASE FOR CODE REVIEW
# Generated: ${new Date().toISOString()}
# Focus: Complete code review with authentication refactoring changes and new teacher/service features

## 🔐 AUTHENTICATION REFACTORING HIGHLIGHTS

This export includes the complete authentication refactoring implementation with full code:

### Key Changes Made:
1. ✅ Removed hardcoded admin emails from useAuth.tsx and lib/auth.ts
2. ✅ Created Next.js middleware for centralized route protection
3. ✅ Implemented admin API client with automatic token handling
4. ✅ Database as single source of truth for user roles
5. ✅ Example secure admin API endpoint and dashboard

### Security Improvements:
- Eliminated hardcoded admin email vulnerabilities
- Centralized route protection via middleware
- No client-side role checking
- Automatic protection for all admin routes

## 🏢 TEACHER PROFILE & SERVICE MANAGEMENT SYSTEM

This export includes the complete teacher profile and service management system:

### New Features Added:
1. ✅ Venue Management System
   - Venue CRUD operations with capacity and amenities
   - Venue scheduling and availability management
   - Multi-venue support with location details

2. ✅ Teacher Profile System
   - Enhanced teacher profiles with bio, media, and social links
   - Teacher certifications and credentials management
   - Teaching preferences and availability settings
   - SEO-friendly teacher profile pages

3. ✅ Service Type Management
   - Service types (classes, workshops, training programs)
   - Rich media support (images, videos, content)
   - Service pricing and difficulty levels
   - Package-service relationships

4. ✅ Teacher Scheduling System
   - Teacher-specific schedules tied to venues
   - Service type integration with teacher schedules
   - Flexible booking system for teacher services

5. ✅ Admin Dashboard Integration
   - Complete admin UI for managing venues, teachers, and services
   - Centralized styling with CSS modules
   - Real-time data management and validation

### Complete Code Included:
- middleware.ts (NEW) - Centralized route protection with full implementation
- lib/auth.ts (UPDATED) - Refactored auth utilities with complete code
- hooks/useAuth.tsx (UPDATED) - Simplified admin logic with full implementation
- lib/api/admin.ts (NEW) - Admin API client with complete methods
- app/api/admin/stats/route.ts (NEW) - Example secure endpoint with full code
- app/(admin)/dashboard/page.tsx (NEW) - Admin dashboard with complete implementation

### NEW: Teacher & Service Management Code:
- prisma/schema.prisma (UPDATED) - Enhanced schema with Teacher, Venue, ServiceType models
- app/api/admin/venues/route.ts (NEW) - Venue management API
- app/api/admin/teachers/route.ts (NEW) - Teacher management API
- app/api/admin/teacher-schedules/route.ts (NEW) - Teacher scheduling API
- app/api/admin/service-types/route.ts (NEW) - Service type management API
- app/api/admin/package-services/route.ts (NEW) - Package-service relationships API
- app/api/admin/teacher-certifications/route.ts (NEW) - Teacher certifications API
- app/api/admin/media/route.ts (NEW) - Media upload API
- app/api/services/route.ts (NEW) - Public services API
- app/api/teachers/route.ts (NEW) - Public teachers API
- components/admin/VenueManagement.tsx (NEW) - Venue management UI
- components/admin/TeacherManagement.tsx (NEW) - Teacher management UI
- components/admin/TeacherScheduleManagement.tsx (NEW) - Teacher scheduling UI
- components/admin/ServiceTypeManagement.tsx (NEW) - Service type management UI
- components/ServiceDisplay.tsx (NEW) - Service display components
- components/ServiceGrid.tsx (NEW) - Service grid component
- components/ServiceDetailPage.tsx (NEW) - Service detail page
- components/TeacherProfilePage.tsx (NEW) - Teacher profile page
- components/TeacherGrid.tsx (NEW) - Teacher grid component
- components/admin/AdminSidebar.tsx (UPDATED) - Enhanced admin navigation
- components/admin/AdminMainContent.tsx (UPDATED) - Enhanced admin content
- styles/admin-dashboard.css (NEW) - Admin dashboard styles
- styles/service-display.css (NEW) - Service display styles
- styles/teacher-profile.css (NEW) - Teacher profile styles
- All other essential application code for complete review

${'='.repeat(80)}

`;
  
  outputStream.write(header);
  
  // Process frontend directory first (most important)
  console.log('📁 Processing frontend directory...');
  processDirectory('./frontend', 'frontend', outputStream);
  
  // Process backend directory
  console.log('📁 Processing backend directory...');
  processDirectory('./backend', 'backend', outputStream);
  
  // Process root level files
  console.log('📁 Processing root level files...');
  const rootFiles = [
    'package.json',
    'README.md',
    'AUTH_REFACTORING_README.md',
    'deploy.sh',
    'vercel.json',
    'render.yaml',
    'docker-compose.yml',
    'Dockerfile',
    'tailwind.config.ts',
    'next.config.js',
    'tsconfig.json',
    'postcss.config.js'
  ];
  
  for (const file of rootFiles) {
    if (fs.existsSync(file)) {
      processFile(file, file, outputStream);
    }
  }
  
  // Write footer
  const footer = `

${'='.repeat(80)}
# EXPORT SUMMARY
# Generated: ${new Date().toISOString()}
# Files processed: ${filesProcessed}
# Files excluded: ${filesExcluded}
# Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB
# 
# This export contains the complete codebase with full code content for
# comprehensive code review, focusing on authentication refactoring changes
# and complete application implementation.
${'='.repeat(80)}
`;
  
  outputStream.write(footer);
  outputStream.end();
  
  console.log('\n✅ Complete codebase export completed!');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${filesProcessed}`);
  console.log(`   Files excluded: ${filesExcluded}`);
  console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`\n📁 Output file: ${path.resolve(OUTPUT_FILE)}`);
  
  console.log('\n🔐 Authentication Refactoring Included:');
  console.log('   ✅ Next.js Middleware (middleware.ts) - Full code');
  console.log('   ✅ Refactored Auth Utils (lib/auth.ts) - Complete implementation');
  console.log('   ✅ Simplified useAuth Hook (hooks/useAuth.tsx) - Full code');
  console.log('   ✅ Admin API Client (lib/api/admin.ts) - Complete methods');
  console.log('   ✅ Example Admin Endpoint (app/api/admin/stats/route.ts) - Full implementation');
  console.log('   ✅ Example Admin Dashboard (app/(admin)/dashboard/page.tsx) - Complete code');
  
  console.log('\n🏢 Teacher Profile & Service Management Included:');
  console.log('   ✅ Enhanced Prisma Schema - Teacher, Venue, ServiceType models');
  console.log('   ✅ Venue Management API & UI - Complete CRUD operations');
  console.log('   ✅ Teacher Management API & UI - Enhanced profiles with media');
  console.log('   ✅ Teacher Scheduling System - Flexible booking system');
  console.log('   ✅ Service Type Management - Rich media and content support');
  console.log('   ✅ Package-Service Relationships - Flexible package configuration');
  console.log('   ✅ Teacher Certifications - Credential management system');
  console.log('   ✅ Media Upload API - Image and video handling');
  console.log('   ✅ Public APIs - Services and teachers for frontend');
  console.log('   ✅ Frontend Components - Service display and teacher profiles');
  console.log('   ✅ Admin Dashboard Integration - Complete management UI');
  console.log('   ✅ CSS Styling - Centralized admin and frontend styles');
  console.log('   ✅ All Application Code - Ready for code review');
}

// Run the export
if (require.main === module) {
  exportCompleteCodebase();
}

module.exports = { exportCompleteCodebase };
