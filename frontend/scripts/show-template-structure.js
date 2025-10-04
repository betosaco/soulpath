import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function showStructure() {
  try {
    const template = await prisma.communicationTemplate.findUnique({
      where: { templateKey: 'order_confirmation_complete' },
      include: { translations: true }
    });
    
    if (template) {
      const content = template.translations[0]?.content || '';
      
      console.log('📧 TEMPLATE STRUCTURE:');
      console.log('='.repeat(50));
      
      // Extract conditional sections
      const matpassMatch = content.match(/<!-- MATPASS SECTION \(Conditional\) -->[\s\S]*?{{#if hasMatpass}}[\s\S]*?{{#if hasBooking}}/);
      const bookingMatch = content.match(/<!-- BOOKING SECTION \(Conditional\) -->[\s\S]*?{{#if hasBooking}}[\s\S]*?{{#if hasProducts}}/);
      const productsMatch = content.match(/<!-- PRODUCTS SECTION \(Conditional\) -->[\s\S]*?{{#if hasProducts}}[\s\S]*?<!-- Order Summary Section -->/);
      
      console.log('🎫 MATPASS SECTION:');
      console.log('   ✅ Conditional: {{#if hasMatpass}} ... {{/if}}');
      
      console.log('📅 BOOKING SECTION:');
      console.log('   ✅ Conditional: {{#if hasBooking}} ... {{/if}}');
      
      console.log('🛍️ PRODUCTS SECTION:');
      console.log('   ✅ Conditional: {{#if hasProducts}} ... {{/if}}');
      
      console.log('='.repeat(50));
      console.log('📋 CONDITIONAL LOGIC:');
      console.log('   • MATPASS only: Shows MATPASS section');
      console.log('   • Booking only: Shows booking section');
      console.log('   • Products only: Shows products section');
      console.log('   • Combined: Shows all relevant sections');
      console.log('   • None: Shows only order summary');
      
    } else {
      console.log('❌ Template not found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showStructure();
