import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function updateRenewalComplete() {
  try {
    console.log('🔧 Updating renewal_matpass template with complete information...\n');
    
    // Read the complete template files
    const enTemplatePath = join(__dirname, 'renewal-template-complete.html');
    const esTemplatePath = join(__dirname, 'renewal-template-complete-es.html');
    
    const enContent = readFileSync(enTemplatePath, 'utf8');
    const esContent = readFileSync(esTemplatePath, 'utf8');
    
    console.log('📄 Template content loaded:');
    console.log(`  English: ${enContent.length} characters`);
    console.log(`  Spanish: ${esContent.length} characters`);
    
    // Update English translation
    console.log('\n🔄 Updating English translation...');
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        template: {
          templateKey: 'renewal_matpass'
        },
        language: 'en'
      },
      data: {
        content: enContent,
        subject: 'Your MatPass has been Renewed - {{userName}}'
      }
    });
    
    // Update Spanish translation
    console.log('🔄 Updating Spanish translation...');
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        template: {
          templateKey: 'renewal_matpass'
        },
        language: 'es'
      },
      data: {
        content: esContent,
        subject: 'Tu MatPass ha sido Renovado - {{userName}}'
      }
    });
    
    console.log('\n✅ Renewal MatPass template updated successfully!');
    console.log('📧 Template now includes:');
    console.log('  ✅ MatPass details (type, sessions, validity)');
    console.log('  ✅ Booking information (if applicable)');
    console.log('  ✅ Product information (if applicable)');
    console.log('  ✅ Complete pricing breakdown');
    console.log('  ✅ Order summary with taxes');
    console.log('  ✅ Payment information');
    console.log('  ✅ Green theme styling');
    console.log('  ✅ Both English and Spanish versions');
    
    console.log('\n🎯 The template now shows:');
    console.log('  💰 MatPass price');
    console.log('  💰 Booking fees (if any)');
    console.log('  💰 Product prices (if any)');
    console.log('  💰 Subtotal');
    console.log('  💰 Tax amount');
    console.log('  💰 Total amount paid');
    console.log('  📋 Order number and payment method');
    
  } catch (error) {
    console.error('❌ Error updating template:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRenewalComplete();
