import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixTemplateColors() {
  try {
    console.log('🎨 Fixing template colors to use green theme...\n');
    
    // Get all templates that need fixing
    const templates = await prisma.communicationTemplate.findMany({
      include: {
        translations: true
      }
    });

    console.log(`Found ${templates.length} templates to check`);

    for (const template of templates) {
      console.log(`\n🔧 Checking template: ${template.name}`);
      
      let hasUpdates = false;
      
      // Update each translation
      for (const translation of template.translations) {
        let updatedContent = translation.content;
        let originalContent = translation.content;
        
        // Replace red theme colors with green theme
        if (updatedContent.includes('#E24A4A')) {
          updatedContent = updatedContent.replace(/#E24A4A/g, '#4a7c2e');
          hasUpdates = true;
        }
        
        if (updatedContent.includes('background: #E24A4A')) {
          updatedContent = updatedContent.replace(/background: #E24A4A/g, 'background: #4a7c2e');
          hasUpdates = true;
        }
        
        if (updatedContent.includes('border-left: 4px solid #E24A4A')) {
          updatedContent = updatedContent.replace(/border-left: 4px solid #E24A4A/g, 'border-left: 4px solid #4a7c2e');
          hasUpdates = true;
        }
        
        // Update header background to use green gradient
        if (updatedContent.includes('background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;')) {
          updatedContent = updatedContent.replace(
            /background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;/g,
            'background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;'
          );
          hasUpdates = true;
        }
        
        // Update any remaining red references
        if (updatedContent.includes('#E24A4A')) {
          updatedContent = updatedContent.replace(/#E24A4A/g, '#4a7c2e');
          hasUpdates = true;
        }
        
        // Update the translation if there were changes
        if (hasUpdates && updatedContent !== originalContent) {
          await prisma.communicationTemplateTranslation.update({
            where: { id: translation.id },
            data: { content: updatedContent }
          });
          
          console.log(`  ✅ Fixed ${translation.language} translation`);
        } else {
          console.log(`  ⏭️  No changes needed for ${translation.language} translation`);
        }
      }
    }

    console.log('\n🎉 All templates have been checked and updated!');
    
  } catch (error) {
    console.error('❌ Error fixing template colors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTemplateColors();
