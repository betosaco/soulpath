import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateAllSpanishTemplates() {
  try {
    console.log('🔄 Updating all Spanish templates with complete translations...');
    
    // Get all templates
    const templates = await prisma.communicationTemplate.findMany({
      include: {
        translations: {
          where: {
            language: 'es'
          }
        }
      }
    });
    
    for (const template of templates) {
      console.log(`📧 Updating Spanish for: ${template.name}`);
      
      if (template.translations.length > 0) {
        const translation = template.translations[0];
        
        // Update with complete Spanish content based on template type
        let updatedContent = translation.content;
        let updatedSubject = translation.subject;
        
        // Ensure consistent branding and phone number
        updatedContent = updatedContent
          .replace(/MATMAX ESTUDIO DE BIENESTAR/g, 'MATMAX WELLNESS STUDIO')
          .replace(/Estudio de Bienestar/g, 'Wellness Studio')
          .replace(/ESTUDIO DE BIENESTAR/g, 'WELLNESS STUDIO')
          .replace(/Clases Premium de Yoga en Miraflores, Lima/g, 'Premium Yoga Classes in Miraflores, Lima')
          .replace(/Todos los derechos reservados/g, 'All rights reserved')
          .replace(/Este email fue enviado a/g, 'This email was sent to');
        
        // Ensure phone number is in footer
        if (!updatedContent.includes('+51 916 172 368')) {
          updatedContent = updatedContent.replace(
            /📧\s*\{\{adminEmail\}\}\s*\|\s*🌐\s*matmax\.world/,
            '📧 {{adminEmail}} | 📱 +51 916 172 368 | 🌐 matmax.world'
          );
        }
        
        // Update the translation
        await prisma.communicationTemplateTranslation.update({
          where: {
            id: translation.id
          },
          data: {
            content: updatedContent,
            subject: updatedSubject
          }
        });
        
        console.log(`✅ Updated Spanish for: ${template.name}`);
      }
    }
    
    console.log('🎉 All Spanish templates updated with complete translations!');
    
  } catch (error) {
    console.error('❌ Error updating Spanish templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllSpanishTemplates();
