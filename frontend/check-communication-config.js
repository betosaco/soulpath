#!/usr/bin/env node

/**
 * Check current communication configuration in database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCommunicationConfig() {
  console.log('🔍 Checking Communication Configuration\n');

  try {
    const config = await prisma.communicationConfig.findFirst();

    if (!config) {
      console.log('❌ No communication config found in database');
      return;
    }

    console.log('📋 Current Configuration:');
    console.log('ID:', config.id);
    console.log('Email Enabled:', config.emailEnabled);
    console.log('Email Provider:', config.emailProvider);
    console.log('Sender Email:', config.senderEmail);
    console.log('Sender Name:', config.senderName);
    console.log('Admin Email:', config.adminEmail);
    console.log('Brevo API Key configured:', !!config.brevoApiKey);
    console.log('Resend API Key configured:', !!config.resendApiKey);
    console.log('SMS Enabled:', config.smsEnabled);
    console.log('SMS Provider:', config.smsProvider);
    console.log('LabsMobile Username configured:', !!config.labsmobileUsername);
    console.log('LabsMobile Token configured:', !!config.labsmobileToken);
    console.log('Telegram Enabled:', config.telegramEnabled);
    console.log('Telegram Bot Token configured:', !!config.telegramBotToken);
    console.log('WhatsApp Enabled:', config.whatsappEnabled);
    console.log('Instagram Enabled:', config.instagramEnabled);
    console.log('Created:', config.createdAt);
    console.log('Updated:', config.updatedAt);

    // Test Brevo API key format
    if (config.brevoApiKey) {
      console.log('\n🔧 Brevo API Key Analysis:');
      console.log('Length:', config.brevoApiKey.length);
      console.log('Starts with xkeysib-:', config.brevoApiKey.startsWith('xkeysib-'));
      console.log('Contains expected pattern:', config.brevoApiKey.includes('-'));
    }

  } catch (error) {
    console.error('❌ Error checking configuration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCommunicationConfig();
