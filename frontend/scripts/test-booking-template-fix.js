import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testBookingTemplateFix() {
  try {
    console.log('🧪 Testing booking template fix...\n');
    
    // Simulate the booking data structure that would be sent
    const mockBookingData = {
      // Customer Information
      customerName: 'betosaco@gmail.com',
      customerEmail: 'betosaco@gmail.com',
      customerPhone: '',
      
      // Order Information (for booking context)
      orderNumber: 'BOOKING-12345',
      orderDate: new Date().toISOString(),
      totalAmount: 0, // Bookings don't have cost
      currency: 'PEN',
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      
      // Order Items (empty for bookings)
      orderItems: [],
      
      // MATPASS Information (check if user has active MatPass)
      matpassItems: [], // This is the key issue - it's empty!
      
      // Booking Information
      bookings: [{
        bookingId: '12345',
        bookingDate: '2025-01-22',
        bookingTime: '10:00 AM',
        sessionType: 'Hatha Yoga',
        teacherName: 'Ana Martínez',
        venue: 'MATMAX Yoga Studio',
        duration: 60
      }],
      
      // Product Information (empty for bookings)
      products: [],
      
      // URLs
      orderUrl: 'https://matmax.world/bookings',
      websiteUrl: 'https://matmax.world'
    };
    
    console.log('📊 Mock Booking Data:');
    console.log(`  Customer: ${mockBookingData.customerName}`);
    console.log(`  Order: ${mockBookingData.orderNumber}`);
    console.log(`  Has MatPass: ${mockBookingData.matpassItems.length > 0}`);
    console.log(`  Has Booking: ${mockBookingData.bookings.length > 0}`);
    console.log(`  Has Products: ${mockBookingData.products.length > 0}`);
    
    // Simulate the routing logic
    const hasMatpass = mockBookingData.matpassItems && mockBookingData.matpassItems.length > 0;
    const hasBookings = mockBookingData.bookings && mockBookingData.bookings.length > 0;
    const hasProducts = mockBookingData.products && mockBookingData.products.length > 0;
    
    console.log('\n🔍 Routing Logic Analysis:');
    console.log(`  hasMatpass: ${hasMatpass}`);
    console.log(`  hasBookings: ${hasBookings}`);
    console.log(`  hasProducts: ${hasProducts}`);
    
    let templateKey;
    if (hasMatpass) {
      // This would be renewal_matpass for existing customers
      templateKey = 'renewal_matpass';
      console.log('  → Would use: renewal_matpass (MatPass + Booking)');
    } else if (hasBookings && !hasMatpass && !hasProducts) {
      // This is what's happening now
      templateKey = 'booking_only';
      console.log('  → Currently using: booking_only (Booking only)');
    } else {
      templateKey = 'order_confirmation_complete';
      console.log('  → Fallback: order_confirmation_complete');
    }
    
    console.log(`\n📧 Template Selected: ${templateKey}`);
    
    if (templateKey === 'booking_only') {
      console.log('\n❌ ISSUE IDENTIFIED:');
      console.log('  The system is using booking_only template because:');
      console.log('  - matpassItems is empty (no MatPass detected)');
      console.log('  - hasBookings is true');
      console.log('  - hasProducts is false');
      console.log('  - This triggers the "booking only" routing logic');
      
      console.log('\n🔧 SOLUTION:');
      console.log('  The getUserActiveMatPass() function needs to:');
      console.log('  1. Check if user has active MatPass packages');
      console.log('  2. Return the MatPass information if found');
      console.log('  3. This will make hasMatpass = true');
      console.log('  4. Which will trigger renewal_matpass template');
    } else {
      console.log('\n✅ Template routing is correct!');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('  1. Implement proper getUserActiveMatPass() function');
    console.log('  2. Test with real user data');
    console.log('  3. Verify template routing works correctly');
    
  } catch (error) {
    console.error('❌ Error testing booking template fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBookingTemplateFix();
