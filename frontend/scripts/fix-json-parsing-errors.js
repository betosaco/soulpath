#!/usr/bin/env node

/**
 * Script to fix JSON parsing errors by replacing direct response.json() calls
 * with safe JSON parsing utilities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to fix (add more as needed)
const filesToFix = [
  'components/admin/TeacherScheduleManagement.tsx',
  'components/admin/VenueManagementEnhanced.tsx',
  'components/admin/VenueManagement.tsx',
  'components/admin/TeacherManagementEnhanced.tsx',
  'components/admin/TeacherManagement.tsx',
  'components/admin/ServiceTypeManagementEnhanced.tsx',
  'components/admin/ServiceTypeManagement.tsx',
  'components/TeacherProfilePage.tsx',
  'components/ServiceDetailPage.tsx',
  'components/TelegramConfigManagement.tsx',
  'components/SettingsManagement.tsx',
  'components/SeoManagement.tsx',
  'components/ScheduleManagement.tsx',
  'components/PurchaseHistoryManagement.tsx',
  'components/PaymentRecordsManagement.tsx',
  'components/CustomerDashboard.tsx',
  'app/packages/page.tsx'
];

// Pattern to match direct response.json() calls
const responseJsonPattern = /(\s+)(const\s+data\s*=\s*await\s+response\.json\(\);)/g;

// Replacement pattern with safe JSON parsing
const safeJsonReplacement = `$1// Check content type before parsing JSON
$1const contentType = response.headers.get('content-type');
$1if (!contentType || !contentType.includes('application/json')) {
$1  const errorText = await response.text();
$1  console.error('❌ [COMPONENT_NAME]: Non-JSON response received:', {
$1    status: response.status,
$1    statusText: response.statusText,
$1    contentType,
$1    body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
$1  });
$1  throw new Error(\`API returned \${response.status} \${response.statusText} instead of JSON\`);
$1}
$1
$1const data = await response.json();`;

function fixFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Extract component name for logging
  const componentName = path.basename(filePath, '.tsx');
  
  // Replace response.json() calls
  content = content.replace(responseJsonPattern, (match, indent) => {
    return safeJsonReplacement.replace(/\[COMPONENT_NAME\]/g, componentName).replace(/\$1/g, indent);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
    return false;
  }
}

function main() {
  console.log('🔧 Starting JSON parsing error fixes...\n');
  
  let fixedCount = 0;
  
  filesToFix.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ Fixed ${fixedCount} files`);
  console.log('\n📝 Next steps:');
  console.log('1. Test the application to ensure JSON parsing errors are resolved');
  console.log('2. Consider using the safe-json-parse utility for new fetch calls');
  console.log('3. Monitor console for any remaining JSON parsing issues');
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixFile, main };
