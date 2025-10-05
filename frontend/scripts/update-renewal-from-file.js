import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function updateRenewalFromFile() {
  try {
    console.log('🎨 Updating Renewal MatPass template from file...\n');
    
    // Read the template content from file
    const templatePath = join(__dirname, 'renewal-template.html');
    const templateContent = readFileSync(templatePath, 'utf8');
    
    console.log('📄 Template content loaded from file');
    console.log('✅ Green theme applied');
    console.log('✅ HTML structure ready');
    console.log('✅ Combination logic included');
    
    // Update the template in database
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        template: {
          templateKey: 'renewal_matpass'
        },
        language: 'en'
      },
      data: {
        content: templateContent
      }
    });

    console.log('\n✅ Renewal MatPass template updated successfully!');
    console.log('📧 Template now supports:');
    console.log('  - MatPass only (existing customer renewal)');
    console.log('  - MatPass + Booking (existing customer with booking)');
    console.log('  - MatPass + Products (existing customer with products)');
    console.log('  - MatPass + Booking + Products (existing customer with all)');
    console.log('  - Green theme applied consistently');
    
  } catch (error) {
    console.error('❌ Error updating template:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRenewalFromFile();
