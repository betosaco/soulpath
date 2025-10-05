import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function analyzeTemplateUsage() {
  try {
    console.log('🔍 Analyzing Template Usage...\n');
    
    // Get all templates from database
    const allTemplates = await prisma.communicationTemplate.findMany({
      include: {
        translations: true
      }
    });
    
    console.log('📊 Current Templates in Database:');
    allTemplates.forEach(template => {
      console.log(`  - ${template.templateKey}: ${template.name}`);
    });
    
    console.log('\n🎯 Templates Actually Used in Code:');
    
    // Templates used in OrderEmailService routing
    const orderRoutingTemplates = [
      'welcome_matpass',
      'renewal_matpass', 
      'products_only',
      'booking_only',
      'order_confirmation_complete'
    ];
    
    console.log('\n📧 Order Email Routing Templates:');
    orderRoutingTemplates.forEach(key => {
      const template = allTemplates.find(t => t.templateKey === key);
      console.log(`  ✅ ${key}: ${template ? template.name : 'NOT FOUND'}`);
    });
    
    // Templates used in other parts of the system
    const systemTemplates = [
      'booking_confirmation',
      'booking_reminder', 
      'booking_cancellation',
      'otp_verification',
      'appointment_cancelled',
      'session_reminder',
      'teacher_enrollment',
      'welcome_email'
    ];
    
    console.log('\n🔧 System Function Templates:');
    systemTemplates.forEach(key => {
      const template = allTemplates.find(t => t.templateKey === key);
      console.log(`  ✅ ${key}: ${template ? template.name : 'NOT FOUND'}`);
    });
    
    // Find unused templates
    const usedTemplates = [...orderRoutingTemplates, ...systemTemplates];
    const unusedTemplates = allTemplates.filter(t => !usedTemplates.includes(t.templateKey));
    
    console.log('\n❌ Potentially Unused Templates:');
    if (unusedTemplates.length === 0) {
      console.log('  🎉 All templates are being used!');
    } else {
      unusedTemplates.forEach(template => {
        console.log(`  ❌ ${template.templateKey}: ${template.name}`);
      });
    }
    
    // Identify redundant templates
    console.log('\n🔄 Redundant Templates Analysis:');
    
    const redundantAnalysis = [
      {
        category: 'Order Confirmation Templates',
        templates: allTemplates.filter(t => 
          t.name.includes('Order Confirmation') || 
          t.name.includes('MATPASS') && t.name.includes('Products')
        ),
        issue: 'Multiple order confirmation templates that might overlap'
      },
      {
        category: 'Booking Templates',
      templates: allTemplates.filter(t => 
        t.name.includes('Booking') && t.name.includes('Complete')
      ),
      issue: 'Multiple "Complete" booking templates'
    }
    ];
    
    redundantAnalysis.forEach(analysis => {
      if (analysis.templates.length > 1) {
        console.log(`\n  🔄 ${analysis.category}:`);
        analysis.templates.forEach(template => {
          console.log(`    - ${template.templateKey}: ${template.name}`);
        });
        console.log(`    ⚠️  ${analysis.issue}`);
      }
    });
    
    console.log('\n📋 Recommendations:');
    console.log('  1. Keep only the templates actually used in routing logic');
    console.log('  2. Remove redundant "Complete" templates that overlap');
    console.log('  3. Consolidate similar templates into one comprehensive template');
    console.log('  4. Use conditional sections within templates instead of multiple templates');
    
  } catch (error) {
    console.error('❌ Error analyzing templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeTemplateUsage();
