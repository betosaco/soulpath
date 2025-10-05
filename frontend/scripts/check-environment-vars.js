// Check environment variables
console.log('🔍 Environment Variables Check:');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || '❌ NOT SET - Using fallback');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? '✅ SET' : '❌ NOT SET');

// Check if we can import the email service
console.log('\n📧 Testing Email Service Import:');
try {
  // This will fail because we're not in the Next.js environment, but let's see what happens
  console.log('ℹ️ Email service testing requires Next.js runtime environment');
} catch (error) {
  console.log('❌ Import test failed:', error.message);
}

console.log('\n⚠️ ISSUES IDENTIFIED:');
if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.log('❌ NEXT_PUBLIC_BASE_URL is not set - this will cause broken links in emails');
  console.log('   Defaulting to: https://matmax.world');
}

if (!process.env.BREVO_API_KEY) {
  console.log('❌ BREVO_API_KEY is not set - emails cannot be sent');
}

console.log('\n🔧 RECOMMENDED FIXES:');
console.log('1. Set NEXT_PUBLIC_BASE_URL=https://matmax.world (or your production domain)');
console.log('2. Ensure BREVO_API_KEY is properly configured');
console.log('3. Check Vercel environment variables if deploying there');
