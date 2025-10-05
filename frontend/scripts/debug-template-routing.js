import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debugTemplateRouting() {
  try {
    console.log('🔍 Debugging template routing issue...\n');
    
    // Check recent orders to see what's happening
    const recentOrders = await prisma.order.findMany({
      where: {
        customerEmail: 'betosaco@gmail.com' // Your email
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });
    
    console.log('📊 Recent Orders for betosaco@gmail.com:');
    recentOrders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order ${order.orderNumber}:`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Date: ${order.createdAt}`);
      console.log(`   Total: $${order.total}`);
      
      // Check if this order has MatPass items
      const hasMatpass = order.items && order.items.some(item => 
        item.type === 'matpass' || item.name.toLowerCase().includes('matpass')
      );
      console.log(`   Has MatPass: ${hasMatpass}`);
      
      // Check if this order has booking items
      const hasBooking = order.items && order.items.some(item => 
        item.type === 'booking' || item.name.toLowerCase().includes('booking')
      );
      console.log(`   Has Booking: ${hasBooking}`);
    });
    
    // Check the current booking_only template
    const bookingTemplate = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'booking_only'
      },
      include: {
        translations: true
      }
    });
    
    if (bookingTemplate) {
      console.log('\n📧 Current booking_only template:');
      console.log(`   Name: ${bookingTemplate.name}`);
      console.log(`   Description: ${bookingTemplate.description}`);
      
      const esTranslation = bookingTemplate.translations.find(t => t.language === 'es');
      if (esTranslation) {
        console.log(`   Spanish subject: ${esTranslation.subject}`);
        console.log(`   Content preview: ${esTranslation.content.substring(0, 200)}...`);
      }
    }
    
    console.log('\n🔍 Analysis:');
    console.log('  The issue is that you\'re getting the booking_only template instead of renewal_matpass');
    console.log('  This means the system thinks you\'re making a booking without a MatPass purchase');
    console.log('  The routing logic should be:');
    console.log('    - Existing customer + MatPass + Booking → renewal_matpass');
    console.log('    - Existing customer + Booking only → booking_only');
    
    console.log('\n💡 Possible causes:');
    console.log('  1. The order data doesn\'t include MatPass items');
    console.log('  2. The MatPass items aren\'t being detected correctly');
    console.log('  3. The routing logic is being bypassed');
    console.log('  4. A different email service is being used');
    
    console.log('\n🔧 To fix this:');
    console.log('  1. Check if the order includes MatPass items');
    console.log('  2. Verify the routing logic is working');
    console.log('  3. Check if there\'s a separate booking confirmation system');
    
  } catch (error) {
    console.error('❌ Error debugging template routing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTemplateRouting();
