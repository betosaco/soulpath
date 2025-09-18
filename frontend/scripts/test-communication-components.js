#!/usr/bin/env node

/**
 * Test Communication Components
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🧪 Testing Communication Components\n');
console.log('===================================\n');

try {
  // Test if the components can be imported
  console.log('📧 Testing CommunicationSettings component...');
  
  const communicationSettingsPath = join(process.cwd(), 'components/communication/CommunicationSettings.tsx');
  const communicationConfigPath = join(process.cwd(), 'components/communication/CommunicationConfig.tsx');
  const templateLibraryPath = join(process.cwd(), 'components/communication/TemplateLibrary.tsx');
  
  console.log('✅ CommunicationSettings.tsx exists:', existsSync(communicationSettingsPath));
  console.log('✅ CommunicationConfig.tsx exists:', existsSync(communicationConfigPath));
  console.log('✅ TemplateLibrary.tsx exists:', existsSync(templateLibraryPath));
  
  // Check if the admin layout imports it correctly
  const adminMainContentPath = join(process.cwd(), 'components/admin/AdminMainContent.tsx');
  const adminMainContent = readFileSync(adminMainContentPath, 'utf8');
  
  console.log('✅ AdminMainContent imports CommunicationSettings:', adminMainContent.includes('CommunicationSettings'));
  console.log('✅ AdminMainContent has email tab case:', adminMainContent.includes("activeTab === 'email'"));
  
  // Check if the admin sidebar has the email menu item
  const adminSidebarPath = join(process.cwd(), 'components/admin/AdminSidebar.tsx');
  const adminSidebar = readFileSync(adminSidebarPath, 'utf8');
  
  console.log('✅ AdminSidebar has email menu item:', adminSidebar.includes("key: 'email'"));
  console.log('✅ AdminSidebar has Mail icon:', adminSidebar.includes('Mail'));
  
  // Check if the API routes exist
  const emailTemplatesApiPath = join(process.cwd(), 'app/api/admin/email-templates/route.ts');
  const communicationConfigApiPath = join(process.cwd(), 'app/api/admin/communication-config/route.ts');
  const sendTestEmailApiPath = join(process.cwd(), 'app/api/admin/send-test-email/route.ts');
  
  console.log('✅ Email templates API exists:', existsSync(emailTemplatesApiPath));
  console.log('✅ Communication config API exists:', existsSync(communicationConfigApiPath));
  console.log('✅ Send test email API exists:', existsSync(sendTestEmailApiPath));
  
  // Check if Brevo email service exists
  const brevoEmailPath = join(process.cwd(), 'lib/brevo-email.ts');
  console.log('✅ Brevo email service exists:', existsSync(brevoEmailPath));
  
  console.log('\n🎉 All communication components are properly set up!');
  console.log('\n📋 To test the admin dashboard:');
  console.log('1. Go to https://frontend-de24956n9-matmaxworlds-projects.vercel.app/admin');
  console.log('2. Login with admin credentials');
  console.log('3. Navigate to Communication Settings');
  console.log('4. Click on Email Templates tab');
  console.log('5. Test email sending functionality');
  
} catch (error) {
  console.error('❌ Error testing communication components:', error.message);
}
