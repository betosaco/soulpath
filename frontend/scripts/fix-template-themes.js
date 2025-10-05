import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixTemplateThemes() {
  try {
    console.log('🎨 Fixing template themes to use consistent green theme...\n');
    
    // Get all templates that need fixing
    const templates = await prisma.communicationTemplate.findMany({
      where: {
        OR: [
          { content: { contains: '#E24A4A' } }, // Red theme
          { content: { contains: 'background: #E24A4A' } },
          { content: { contains: 'border-left: 4px solid #E24A4A' } }
        ]
      },
      include: {
        translations: true
      }
    });

    console.log(`Found ${templates.length} templates with red theme that need fixing`);

    for (const template of templates) {
      console.log(`\n🔧 Fixing template: ${template.name}`);
      
      // Update each translation
      for (const translation of template.translations) {
        let updatedContent = translation.content;
        
        // Replace red theme colors with green theme
        updatedContent = updatedContent.replace(/#E24A4A/g, '#4a7c2e');
        updatedContent = updatedContent.replace(/background: #E24A4A/g, 'background: #4a7c2e');
        updatedContent = updatedContent.replace(/border-left: 4px solid #E24A4A/g, 'border-left: 4px solid #4a7c2e');
        
        // Update header background to use green gradient
        updatedContent = updatedContent.replace(
          /background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;/g,
          'background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;'
        );
        
        // Update section borders to use green
        updatedContent = updatedContent.replace(/border-left: 4px solid #E24A4A/g, 'border-left: 4px solid #4a7c2e');
        
        // Update any remaining red references
        updatedContent = updatedContent.replace(/#E24A4A/g, '#4a7c2e');
        
        // Update the translation
        await prisma.communicationTemplateTranslation.update({
          where: { id: translation.id },
          data: { content: updatedContent }
        });
        
        console.log(`  ✅ Fixed ${translation.language} translation`);
      }
    }

    console.log('\n🎉 All templates have been updated to use the green theme!');
    
  } catch (error) {
    console.error('❌ Error fixing template themes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTemplateThemes();
