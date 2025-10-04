import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addPhoneToFooters() {
  try {
    console.log('🔄 Adding mobile phone number to all email template footers...');
    
    // Get all templates with their translations
    const templates = await prisma.communicationTemplate.findMany({
      include: {
        translations: true
      }
    });
    
    for (const template of templates) {
      console.log(`📧 Updating template: ${template.name}`);
      
      for (const translation of template.translations) {
        console.log(`  📝 Updating ${translation.language} translation...`);
        
        // Add phone number to footer - look for the contact section and add phone
        let updatedContent = translation.content;
        
        // Find the contact section and add phone number
        const phonePattern = /📧\s*\{\{adminEmail\}\}\s*\|\s*🌐\s*matmax\.world/;
        const phoneReplacement = '📧 {{adminEmail}} | 📱 +51 916 172 368 | 🌐 matmax.world';
        
        if (phonePattern.test(updatedContent)) {
          updatedContent = updatedContent.replace(phonePattern, phoneReplacement);
        } else {
          // If the pattern doesn't exist, look for other contact patterns and add phone
          const alternativePattern = /📧\s*\{\{adminEmail\}\}/;
          const alternativeReplacement = '📧 {{adminEmail}} | 📱 +51 916 172 368';
          
          if (alternativePattern.test(updatedContent)) {
            updatedContent = updatedContent.replace(alternativePattern, alternativeReplacement);
          } else {
            // Look for any contact section and add phone
            const contactPattern = /(📧\s*\{\{adminEmail\}\}.*?)(\n|$)/;
            const contactReplacement = '$1 | 📱 +51 916 172 368$2';
            
            if (contactPattern.test(updatedContent)) {
              updatedContent = updatedContent.replace(contactPattern, contactReplacement);
            }
          }
        }
        
        // Update the translation
        await prisma.communicationTemplateTranslation.update({
          where: {
            id: translation.id
          },
          data: {
            content: updatedContent
          }
        });
        
        console.log(`    ✅ Updated ${translation.language} footer with phone number`);
      }
    }
    
    console.log('🎉 All email templates updated with mobile phone number in footers!');
    
  } catch (error) {
    console.error('❌ Error updating footers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPhoneToFooters();
