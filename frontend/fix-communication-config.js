#!/usr/bin/env node

/**
 * Fix communication configuration in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCommunicationConfig() {
  console.log('🔧 Fixing Communication Configuration\n');

  try {
    // Get current config
    const currentConfig = await prisma.communicationConfig.findFirst();
    
    if (!currentConfig) {
      console.log('❌ No communication config found');
      return;
    }

    console.log('📊 Current configuration:');
    console.log('- Email enabled:', currentConfig.emailEnabled);
    console.log('- Email provider:', currentConfig.emailProvider);
    console.log('- SMS enabled:', currentConfig.smsEnabled);
    console.log('- Telegram enabled:', currentConfig.telegramEnabled);
    console.log('- Brevo API key:', currentConfig.brevoApiKey ? 'Set' : 'Not set');
    console.log('- Telegram bot token:', currentConfig.telegramBotToken ? 'Set' : 'Not set');

    // Update configuration to enable email and telegram
    const updatedConfig = await prisma.communicationConfig.update({
      where: { id: currentConfig.id },
      data: {
        emailEnabled: true,
        telegramEnabled: true,
        smsEnabled: false, // Keep SMS disabled for now
        whatsappEnabled: false,
        instagramEnabled: false,
      }
    });

    console.log('\n✅ Configuration updated successfully!');
    console.log('📊 New configuration:');
    console.log('- Email enabled:', updatedConfig.emailEnabled);
    console.log('- Email provider:', updatedConfig.emailProvider);
    console.log('- SMS enabled:', updatedConfig.smsEnabled);
    console.log('- Telegram enabled:', updatedConfig.telegramEnabled);

  } catch (error) {
    console.error('❌ Error fixing communication config:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCommunicationConfig();
