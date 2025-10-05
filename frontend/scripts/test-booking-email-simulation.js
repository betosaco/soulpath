import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBookingEmailSimulation() {
  try {
    console.log('🔍 Testing booking email simulation...\n');

    // Get the booking_only template
    const template = await prisma.communicationTemplate.findFirst({
      where: { templateKey: 'booking_only' },
      include: { 
        translations: {
          where: { language: 'es' }
        }
      }
    });

    if (!template || !template.translations[0]) {
      console.log('❌ booking_only template not found');
      return;
    }

    const templateContent = template.translations[0].content;
    console.log('📧 Template content preview:');
    console.log(templateContent.substring(0, 500) + '...\n');

    // Simulate the template data that would be sent
    const templateData = {
      userName: 'Julio Ad',
      userEmail: 'julio@example.com',
      userPhone: '',
      orderNumber: 'BOOKING-70',
      submissionDate: new Date().toISOString(),
      orderTotal: '0.00',
      subtotal: '0.00',
      taxAmount: '0.00',
      taxRate: '0',
      shippingAmount: '0.00',
      totalAmount: '0.00',
      orderUrl: 'https://matmax.world/bookings',
      websiteUrl: 'https://matmax.world',
      adminEmail: 'info@matmax.world',
      hasMatpass: false,
      hasBooking: true,
      hasProducts: false,
      bookings: [{
        bookingId: '70',
        bookingDate: '2025-10-05',
        bookingTime: '10:00 AM',
        sessionType: 'Hatha Yoga',
        teacherName: 'Lucia Meza',
        venue: 'MATMAX Yoga Studio',
        duration: 60
      }],
      bookingId: '70',
      bookingDate: '2025-10-05',
      bookingTime: '10:00 AM',
      sessionType: 'Hatha Yoga',
      teacherName: 'Lucia Meza',
      venue: 'MATMAX Yoga Studio',
      bookingPrice: '0.00'
    };

    console.log('🎯 Template data:');
    console.log('  📅 bookingDate:', templateData.bookingDate);
    console.log('  ⏰ bookingTime:', templateData.bookingTime);
    console.log('  📝 sessionType:', templateData.sessionType);
    console.log('  👤 teacherName:', templateData.teacherName);
    console.log('  🏢 venue:', templateData.venue);

    // Simulate template processing (simple string replacement)
    let processedContent = templateContent;
    
    // Replace all placeholders
    Object.entries(templateData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), String(value));
    });

    console.log('\n📧 Processed content preview:');
    console.log(processedContent.substring(0, 1000) + '...\n');

    // Check if placeholders were replaced
    const hasUnreplacedPlaceholders = processedContent.includes('{{') && processedContent.includes('}}');
    if (hasUnreplacedPlaceholders) {
      console.log('❌ Some placeholders were not replaced');
      const unreplaced = processedContent.match(/\{\{[^}]+\}\}/g);
      if (unreplaced) {
        console.log('Unreplaced placeholders:', [...new Set(unreplaced)]);
      }
    } else {
      console.log('✅ All placeholders were replaced');
    }

    // Check specific booking fields
    const bookingFields = ['bookingDate', 'bookingTime', 'sessionType', 'teacherName', 'venue'];
    const missingFields = [];
    
    bookingFields.forEach(field => {
      if (processedContent.includes(`{{${field}}}`)) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      console.log('❌ Missing booking fields:', missingFields);
    } else {
      console.log('✅ All booking fields are present in processed content');
    }

  } catch (error) {
    console.error('❌ Error testing booking email simulation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBookingEmailSimulation();
