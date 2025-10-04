import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkTemplate() {
  try {
    const template = await prisma.communicationTemplate.findUnique({
      where: { templateKey: 'order_confirmation_complete' },
      include: { translations: true }
    });
    
    if (template) {
      console.log('📧 Template found:', template.name);
      console.log('�� Template Key:', template.templateKey);
      console.log('📝 Content length:', template.translations[0]?.content?.length || 0);
      
      // Check if booking section exists
      const content = template.translations[0]?.content || '';
      const hasBookingSection = content.includes('BOOKING SECTION');
      const hasBookingConditional = content.includes('{{#if hasBooking}}');
      
      console.log('🔍 Has BOOKING SECTION text:', hasBookingSection);
      console.log('🔍 Has booking conditional:', hasBookingConditional);
      
      if (hasBookingConditional) {
        console.log('✅ Booking section is properly conditional');
      } else {
        console.log('❌ Booking section is NOT conditional - needs fix');
      }
    } else {
      console.log('❌ Template not found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplate();
