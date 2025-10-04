import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateSpanishBranding() {
  try {
    console.log('🔄 Updating Spanish templates to use consistent MATMAX WELLNESS STUDIO branding...');
    
    // Get all Spanish translations
    const spanishTranslations = await prisma.communicationTemplateTranslation.findMany({
      where: {
        language: 'es'
      },
      include: {
        template: true
      }
    });
    
    for (const translation of spanishTranslations) {
      console.log(`📧 Updating Spanish template: ${translation.template.name}`);
      
      // Update content to use consistent branding
      let updatedContent = translation.content
        .replace(/MATMAX ESTUDIO DE BIENESTAR/g, 'MATMAX WELLNESS STUDIO')
        .replace(/Estudio de Bienestar/g, 'Wellness Studio')
        .replace(/ESTUDIO DE BIENESTAR/g, 'WELLNESS STUDIO')
        .replace(/Clases Premium de Yoga en Miraflores, Lima/g, 'Premium Yoga Classes in Miraflores, Lima')
        .replace(/Todos los derechos reservados/g, 'All rights reserved')
        .replace(/Este email fue enviado a/g, 'This email was sent to');
      
      // Update subject if needed
      let updatedSubject = translation.subject;
      
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
      
      console.log(`✅ Updated Spanish template: ${translation.template.name}`);
    }
    
    console.log('🎉 All Spanish templates updated with consistent branding!');
    
  } catch (error) {
    console.error('❌ Error updating Spanish branding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSpanishBranding();
