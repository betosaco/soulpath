#!/usr/bin/env node

/**
 * Test Brevo API key validation
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBrevoValidation() {
  console.log('🔍 Testing Brevo API Key Validation\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config || !config.brevoApiKey) {
      console.log('❌ No Brevo API key found in configuration');
      return;
    }

    console.log('🔧 Testing Brevo API key validation...');

    const response = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'api-key': config.brevoApiKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Brevo API key is valid!');
      console.log('Account Email:', data.email);
      console.log('Company Name:', data.companyName);
      console.log('Plan Type:', data.plan?.type);
    } else {
      const errorText = await response.text();
      console.log('❌ Brevo API key validation failed');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Error testing Brevo validation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBrevoValidation();
