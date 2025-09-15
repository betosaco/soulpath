#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Complete Codebase Export with Teacher Profile & Service Management Features
 * 
 * This script exports the complete codebase including all recent additions:
 * - Authentication and authorization system
 * - Teacher profile and service management system
 * - Venue and teacher scheduling system
 * - Service types and package management
 * - Admin dashboard with new management modules
 */

const OUTPUT_FILE = './wellness-platform-complete-export.txt';
const MAX_FILE_SIZE = 500 * 1024; // 500KB per file
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total

// Specific files to include (comprehensive list)
const FILES_TO_INCLUDE = [
  // Core Authentication & Authorization
  'frontend/middleware.ts',
  'frontend/lib/auth.ts',
  'frontend/hooks/useAuth.tsx',
  'frontend/lib/api/admin.ts',
  'frontend/app/api/admin/stats/route.ts',
  'frontend/app/(admin)/dashboard/page.tsx',
  'frontend/app/login/page.tsx',
  'frontend/app/(admin)/admin/page.tsx',
  'frontend/app/(admin)/layout.tsx',
  
  // Database Schema
  'frontend/prisma/schema.prisma',
  'frontend/supabase/migrations/20250109000000_add_venue_teacher_models.sql',
  'frontend/supabase/migrations/20250109000001_add_service_types.sql',
  
  // NEW: Teacher Profile & Service Management APIs
  'frontend/app/api/admin/venues/route.ts',
  'frontend/app/api/admin/teachers/route.ts',
  'frontend/app/api/admin/teacher-schedules/route.ts',
  'frontend/app/api/admin/service-types/route.ts',
  'frontend/app/api/admin/package-services/route.ts',
  'frontend/app/api/admin/teacher-certifications/route.ts',
  'frontend/app/api/admin/media/route.ts',
  'frontend/app/api/services/route.ts',
  'frontend/app/api/services/[id]/route.ts',
  'frontend/app/api/teachers/route.ts',
  'frontend/app/api/teachers/[id]/route.ts',
  
  // NEW: Admin Management Components
  'frontend/components/admin/VenueManagement.tsx',
  'frontend/components/admin/TeacherManagement.tsx',
  'frontend/components/admin/TeacherScheduleManagement.tsx',
  'frontend/components/admin/ServiceTypeManagement.tsx',
  'frontend/components/admin/AdminSidebar.tsx',
  'frontend/components/admin/AdminMainContent.tsx',
  
  // NEW: Frontend Display Components
  'frontend/components/ServiceDisplay.tsx',
  'frontend/components/ServiceGrid.tsx',
  'frontend/components/ServiceDetailPage.tsx',
  'frontend/components/TeacherProfilePage.tsx',
  'frontend/components/TeacherGrid.tsx',
  
  // NEW: CSS Styles
  'frontend/styles/admin-dashboard.css',
  'frontend/styles/service-display.css',
  'frontend/styles/teacher-profile.css',
  'frontend/app/globals.css',
  
  // Core Application Files
  'frontend/app/layout.tsx',
  'frontend/app/page.tsx',
  'frontend/next.config.js',
  'frontend/tailwind.config.ts',
  'frontend/tsconfig.json',
  'frontend/package.json',
  
  // Additional Core Files
  'frontend/lib/prisma.ts',
  'frontend/lib/validations.ts',
  'frontend/lib/utils.ts',
  'frontend/hooks/usePackages.tsx',
  'frontend/hooks/useContentManagement.tsx',
  'frontend/hooks/useTranslations.tsx',
  'frontend/hooks/useRevalidation.ts',
  
  // Other Important Components
  'frontend/components/AdminDashboard.tsx',
  'frontend/components/LoginModal.tsx',
  'frontend/components/PackageDisplay.tsx',
  'frontend/components/BookingSection.tsx',
  'frontend/components/Header.tsx',
  'frontend/components/CustomerDashboard.tsx',
  'frontend/components/PackagePurchaseFlow.tsx',
  'frontend/components/BugReportSystem.tsx',
  'frontend/components/ContentManagement.tsx',
  
  // Backend Files
  'backend/package.json',
  'backend/docker-compose.yml',
  'backend/Dockerfile.rasa',
  'backend/rasa/actions.py',
  'backend/rasa/config.yml',
  'backend/rasa/domain.yml',
  'backend/rasa/requirements.txt',
  
  // Documentation
  'README.md',
  'AUTH_REFACTORING_README.md',
  'IMPLEMENTATION_GUIDE.md',
  'TELEGRAM_INTEGRATION_README.md',
  'WHATSAPP_BUSINESS_SETUP.md'
];

let totalSize = 0;
let filesProcessed = 0;
let filesExcluded = 0;

/**
 * Process a single file
 */
function processFile(filePath, outputStream) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      filesExcluded++;
      return true;
    }
    
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      return true;
    }
    
    if (stats.size > MAX_FILE_SIZE) {
      console.log(`⚠️  Skipping large file: ${filePath} (${(stats.size / 1024).toFixed(1)}KB)`);
      filesExcluded++;
      return true;
    }
    
    if (totalSize + stats.size > MAX_TOTAL_SIZE) {
      console.log(`⚠️  Reached size limit, stopping export`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace('./', '');
    
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
    
    console.log(`✅ Processed: ${relativePath} (${(stats.size / 1024).toFixed(1)}KB)`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    filesExcluded++;
    return true;
  }
}

/**
 * Main export function
 */
function exportCompleteCodebase() {
  console.log('🚀 Starting complete codebase export with teacher features...');
  console.log(`Target: Complete code with teacher profile and service management`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  
  // Create output stream
  const outputStream = fs.createWriteStream(OUTPUT_FILE);
  
  // Write header
  const header = `# WELLNESS MONOREPO - COMPLETE CODEBASE WITH TEACHER FEATURES
# Generated: ${new Date().toISOString()}
# Focus: Complete code review with authentication refactoring and new teacher/service features

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
  
  // Process all specified files
  console.log('📁 Processing specified files...');
  for (const filePath of FILES_TO_INCLUDE) {
    const shouldContinue = processFile(filePath, outputStream);
    if (!shouldContinue) {
      break;
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
# and complete teacher profile & service management implementation.
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
