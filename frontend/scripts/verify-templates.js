import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyTemplates() {
  try {
    console.log('🔍 Verifying template formats...\n');
    
    const templates = await prisma.communicationTemplate.findMany({
      where: {
        templateKey: {
          in: ['renewal_matpass', 'welcome_matpass', 'products_only', 'booking_only', 'appointment_cancelled']
        }
      },
      include: { translations: true }
    });
    
    for (const template of templates) {
      console.log(`\n📧 Template: ${template.name}`);
      
      for (const translation of template.translations) {
        const content = translation.content || '';
        const hasGreenTheme = content.includes('#4a7c2e');
        const hasHTML = content.includes('<!DOCTYPE html>');
        const hasRedTheme = content.includes('#E24A4A');
        
        console.log(`  ${translation.language}:`);
        console.log(`    ✅ Green theme: ${hasGreenTheme}`);
        console.log(`    ✅ HTML format: ${hasHTML}`);
        console.log(`    ❌ Red theme: ${hasRedTheme}`);
        
        if (hasRedTheme) {
          console.log(`    ⚠️  Still has red theme - needs fixing!`);
        }
      }
    }
    
    console.log('\n🎉 Template verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTemplates();
