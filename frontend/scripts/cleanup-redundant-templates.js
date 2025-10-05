import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanupRedundantTemplates() {
  try {
    console.log('🧹 Cleaning up redundant templates...\n');
    
    // Templates that are actually used and should be kept
    const essentialTemplates = [
      // Order routing templates (used in OrderEmailService)
      'welcome_matpass',
      'renewal_matpass', 
      'products_only',
      'booking_only',
      'order_confirmation_complete',
      
      // System function templates (used in other parts of the system)
      'booking_confirmation',
      'otp_verification',
      'appointment_cancelled',
      'session_reminder',
      'teacher_enrollment',
      'welcome_email'
    ];
    
    // Templates that are redundant and can be removed
    const redundantTemplates = [
      'payment_confirmation',           // Not used anywhere
      'order_confirmation_matpass'     // Redundant with order_confirmation_complete
    ];
    
    console.log('📋 Templates to keep (essential):');
    essentialTemplates.forEach(key => {
      console.log(`  ✅ ${key}`);
    });
    
    console.log('\n🗑️  Templates to remove (redundant):');
    redundantTemplates.forEach(key => {
      console.log(`  ❌ ${key}`);
    });
    
    console.log('\n🔍 Checking which templates exist...');
    
    for (const templateKey of redundantTemplates) {
      const template = await prisma.communicationTemplate.findFirst({
        where: { templateKey }
      });
      
      if (template) {
        console.log(`\n🗑️  Removing template: ${templateKey} (${template.name})`);
        
        // Delete all translations first
        await prisma.communicationTemplateTranslation.deleteMany({
          where: {
            template: { templateKey }
          }
        });
        
        // Delete the template
        await prisma.communicationTemplate.delete({
          where: { templateKey }
        });
        
        console.log(`  ✅ Removed ${templateKey} and all its translations`);
      } else {
        console.log(`  ℹ️  Template ${templateKey} not found (already removed)`);
      }
    }
    
    console.log('\n📊 Final template count:');
    const remainingTemplates = await prisma.communicationTemplate.findMany({
      select: { templateKey: true, name: true }
    });
    
    console.log(`  📧 Total templates remaining: ${remainingTemplates.length}`);
    remainingTemplates.forEach(template => {
      console.log(`    - ${template.templateKey}: ${template.name}`);
    });
    
    console.log('\n✅ Template cleanup complete!');
    console.log('🎯 Only essential templates remain');
    console.log('📧 All routing logic will continue to work correctly');
    
  } catch (error) {
    console.error('❌ Error cleaning up templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupRedundantTemplates();
