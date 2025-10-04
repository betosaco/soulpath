import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkExistingTemplates() {
  try {
    console.log('📧 Checking existing email templates...\n');
    
    const templates = await prisma.communicationTemplate.findMany({
      include: {
        translations: {
          orderBy: {
            language: 'asc'
          }
        }
      },
      orderBy: {
        templateKey: 'asc'
      }
    });

    console.log(`📊 Found ${templates.length} templates:\n`);
    
    templates.forEach(template => {
      console.log(`🔹 ${template.templateKey}`);
      console.log(`   Name: ${template.name}`);
      console.log(`   Category: ${template.category}`);
      console.log(`   Type: ${template.type}`);
      console.log(`   Active: ${template.isActive ? '✅' : '❌'}`);
      console.log(`   Translations: ${template.translations.length}`);
      
      template.translations.forEach(translation => {
        console.log(`     - ${translation.language}: ${translation.subject}`);
      });
      console.log('');
    });

    console.log('🎯 Template Analysis for Routing System:');
    console.log('');
    console.log('✅ Available for routing:');
    console.log('  - order_confirmation_complete (comprehensive template)');
    console.log('  - booking_confirmation (booking-specific)');
    console.log('  - welcome_email (new customer welcome)');
    console.log('  - teacher_enrollment (teacher onboarding)');
    console.log('');
    console.log('❌ Missing for routing system:');
    console.log('  - welcome_matpass (new customer with MatPass)');
    console.log('  - renewal_matpass (existing customer renewal)');
    console.log('  - products_only (products without MatPass)');
    console.log('  - booking_only (booking from existing account)');
    
  } catch (error) {
    console.error('❌ Error checking templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingTemplates();
