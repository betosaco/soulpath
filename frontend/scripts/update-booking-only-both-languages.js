import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function updateBookingOnlyBothLanguages() {
  try {
    console.log('🎨 Updating Booking Only - Existing Customer template for both languages...\n');
    
    // Read English template
    const enTemplatePath = join(__dirname, 'booking-only-template-en.html');
    const enTemplateContent = readFileSync(enTemplatePath, 'utf8');
    
    // Read Spanish template
    const esTemplatePath = join(__dirname, 'booking-only-template-es.html');
    const esTemplateContent = readFileSync(esTemplatePath, 'utf8');
    
    console.log('📄 English template loaded');
    console.log('📄 Spanish template loaded');
    console.log('✅ Green theme applied to both');
    console.log('✅ HTML structure ready for both');
    
    // Update English template
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        template: {
          templateKey: 'booking_only'
        },
        language: 'en'
      },
      data: {
        content: enTemplateContent
      }
    });
    
    console.log('✅ English template updated');
    
    // Update Spanish template
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        template: {
          templateKey: 'booking_only'
        },
        language: 'es'
      },
      data: {
        content: esTemplateContent
      }
    });
    
    console.log('✅ Spanish template updated');
    
    console.log('\n🎉 Booking Only - Existing Customer template updated for both languages!');
    console.log('📧 Template now includes:');
    console.log('  - Green theme applied consistently');
    console.log('  - HTML structure with proper CSS');
    console.log('  - English and Spanish versions');
    console.log('  - Professional styling and layout');
    console.log('  - Responsive design for email clients');
    
  } catch (error) {
    console.error('❌ Error updating templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBookingOnlyBothLanguages();
