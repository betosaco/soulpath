// Test email configuration
console.log('🔍 Email Configuration Test');

// Check if we're in the right environment
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);

// Check for environment files
const fs = require('fs');
const path = require('path');

const envFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.example'
];

console.log('\n📄 Environment Files:');
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasBrevoKey = content.includes('BREVO_API_KEY');
      const hasBaseUrl = content.includes('NEXT_PUBLIC_BASE_URL');
      console.log(`   BREVO_API_KEY: ${hasBrevoKey ? 'Found' : 'Not found'}`);
      console.log(`   NEXT_PUBLIC_BASE_URL: ${hasBaseUrl ? 'Found' : 'Not found'}`);
    } catch (error) {
      console.log(`   Error reading file: ${error.message}`);
    }
  } else {
    console.log(`❌ ${file} not found`);
  }
});

console.log('\n🔧 RECOMMENDED ACTIONS:');
console.log('1. Check your Vercel dashboard for environment variables');
console.log('2. Ensure BREVO_API_KEY is set in production environment');
console.log('3. Set NEXT_PUBLIC_BASE_URL to your production domain');
console.log('4. Redeploy after setting environment variables');
console.log('5. Check Vercel function logs for email sending errors');

console.log('\n📧 WHY EMAILS AREN\'T SENDING:');
console.log('❌ BREVO_API_KEY is not configured in the deployment environment');
console.log('❌ Email service cannot authenticate with Brevo API');
console.log('❌ Emails fail silently, order creation succeeds');
console.log('❌ No error logs visible to user');
