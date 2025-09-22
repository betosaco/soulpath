#!/usr/bin/env node

/**
 * Setup MatMax Email Configuration
 * 
 * This script sets up the communication configuration for MatMax Yoga Studio
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function setupMatMaxEmailConfig() {
  console.log('📧 Setting up MatMax Email Configuration\n');
  console.log('=======================================\n');

  try {
    // Check if BREVO_API_KEY is set
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.log('⚠️  BREVO_API_KEY environment variable not set');
      console.log('Please set your Brevo API key:');
      console.log('export BREVO_API_KEY="your-brevo-api-key"');
      console.log('\nYou can get your API key from: https://app.brevo.com/settings/keys/api');
      return;
    }

    console.log('✅ BREVO_API_KEY found');

    // Update communication configuration for MatMax
    console.log('🔧 Updating communication configuration for MatMax...');
    
    const commConfig = await prisma.communicationConfig.upsert({
      where: { id: 1 },
      update: {
        email_enabled: true,
        brevo_api_key: brevoApiKey,
        sender_email: 'info@matmax.store',
        sender_name: 'MatMax Yoga Studio',
        admin_email: 'info@matmax.store'
      },
      create: {
        email_enabled: true,
        brevo_api_key: brevoApiKey,
        sender_email: 'info@matmax.store',
        sender_name: 'MatMax Yoga Studio',
        admin_email: 'info@matmax.store'
      }
    });

    console.log('✅ Communication configuration updated successfully');
    console.log('📧 Sender Email:', commConfig.sender_email);
    console.log('👤 Sender Name:', commConfig.sender_name);
    console.log('🔑 API Key configured:', commConfig.brevo_api_key ? 'Yes' : 'No');

    // Test the email service
    console.log('\n🧪 Testing email service...');
    
    try {
      // Import the email service
      const { createEmailService } = await import('./lib/brevo-email-service.ts');
      const emailService = await createEmailService();
      
      if (emailService) {
        console.log('✅ Email service created successfully');
        
        // Send a test email
        const testResult = await emailService.sendEmail({
          to: 'info@matmax.store',
          subject: 'MatMax Email Configuration Test',
          html: `
            <h2>MatMax Email Configuration Test</h2>
            <p>This is a test email to verify that the Brevo email configuration is working correctly.</p>
            <p>Configuration completed at: ${new Date().toLocaleString()}</p>
          `
        });
        
        if (testResult) {
          console.log('✅ Test email sent successfully to info@matmax.store');
        } else {
          console.log('❌ Failed to send test email');
        }
      } else {
        console.log('❌ Failed to create email service');
      }
    } catch (error) {
      console.log('⚠️  Could not test email service:', error.message);
    }

    console.log('\n🎉 MatMax email configuration setup complete!');
    console.log('\nNext steps:');
    console.log('1. Visit the admin dashboard to verify the configuration');
    console.log('2. Test the contact form on the about page');
    console.log('3. Check that emails are being sent to info@matmax.store');

  } catch (error) {
    console.error('❌ Error setting up email configuration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupMatMaxEmailConfig();
