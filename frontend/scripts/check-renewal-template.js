import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkRenewalTemplate() {
  try {
    console.log('🔍 Checking current renewal_matpass template...\n');
    
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'renewal_matpass'
      },
      include: {
        translations: true
      }
    });
    
    if (!template) {
      console.log('❌ Template not found!');
      return;
    }
    
    console.log(`📧 Template: ${template.name}`);
    console.log(`📝 Description: ${template.description}`);
    console.log(`🌐 Languages: ${template.translations.length}`);
    
    // Check English version
    const enTranslation = template.translations.find(t => t.language === 'en');
    if (enTranslation) {
      console.log('\n📄 English Template Content:');
      console.log('---');
      console.log(enTranslation.content.substring(0, 500) + '...');
      console.log('---');
      
      // Check for pricing information
      const hasPricing = enTranslation.content.includes('price') || 
                        enTranslation.content.includes('total') || 
                        enTranslation.content.includes('amount') ||
                        enTranslation.content.includes('tax');
      
      console.log(`\n💰 Contains pricing information: ${hasPricing ? 'YES' : 'NO'}`);
      
      if (!hasPricing) {
        console.log('❌ ISSUE: Template is missing pricing information!');
        console.log('   The template should include:');
        console.log('   - MatPass price');
        console.log('   - Tax amount');
        console.log('   - Total amount paid');
        console.log('   - Order summary');
      }
    }
    
    // Check Spanish version
    const esTranslation = template.translations.find(t => t.language === 'es');
    if (esTranslation) {
      console.log('\n📄 Spanish Template Content:');
      console.log('---');
      console.log(esTranslation.content.substring(0, 500) + '...');
      console.log('---');
    }
    
  } catch (error) {
    console.error('❌ Error checking template:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRenewalTemplate();
