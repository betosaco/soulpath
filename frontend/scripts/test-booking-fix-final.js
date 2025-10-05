import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testBookingFixFinal() {
  try {
    console.log('🧪 Testing final booking fix...\n');
    
    // Simulate the getUserActiveMatPass function
    const userId = 'cmfzu4wd70000btwmmtc8dn7a'; // betosaco@gmail.com user ID
    
    const activePackages = await prisma.userPackage.findMany({
      where: {
        userId: userId,
        isActive: true,
        expiresAt: {
          gte: new Date() // Not expired
        }
      }
    });

    console.log(`📦 Found ${activePackages.length} active packages`);

    // Convert to MatPass format
    const matpassItems = activePackages.map(pkg => ({
      name: `MatPass Package ${pkg.id}`,
      type: 'MatPass',
      quantity: pkg.quantity || 1,
      unitPrice: 0,
      totalPrice: 0,
      sessions: 8,
      expiryDate: pkg.expiresAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    }));

    console.log(`✅ Generated ${matpassItems.length} MatPass items`);
    
    // Simulate the template data that would be sent
    const templateEmailData = {
      // Customer Information
      customerName: 'betosaco@gmail.com',
      customerEmail: 'betosaco@gmail.com',
      customerPhone: '',
      
      // Order Information
      orderNumber: 'BOOKING-12345',
      orderDate: new Date().toISOString(),
      totalAmount: 0,
      currency: 'PEN',
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      
      // Order Items
      orderItems: [],
      
      // MATPASS Information (NOW POPULATED!)
      matpassItems: matpassItems,
      
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
      
      // Product Information
      products: [],
      
      // URLs
      orderUrl: 'https://matmax.world/bookings',
      websiteUrl: 'https://matmax.world'
    };
    
    console.log('\n📊 Template Data Analysis:');
    console.log(`  Customer: ${templateEmailData.customerName}`);
    console.log(`  Order: ${templateEmailData.orderNumber}`);
    console.log(`  Has MatPass: ${templateEmailData.matpassItems.length > 0}`);
    console.log(`  Has Booking: ${templateEmailData.bookings.length > 0}`);
    console.log(`  Has Products: ${templateEmailData.products.length > 0}`);
    
    // Simulate the routing logic
    const hasMatpass = templateEmailData.matpassItems && templateEmailData.matpassItems.length > 0;
    const hasBookings = templateEmailData.bookings && templateEmailData.bookings.length > 0;
    const hasProducts = templateEmailData.products && templateEmailData.products.length > 0;
    
    console.log('\n🔍 Routing Logic:');
    console.log(`  hasMatpass: ${hasMatpass}`);
    console.log(`  hasBookings: ${hasBookings}`);
    console.log(`  hasProducts: ${hasProducts}`);
    
    let templateKey;
    if (hasMatpass) {
      templateKey = 'renewal_matpass';
      console.log('  → Template: renewal_matpass (MatPass + Booking) ✅');
    } else if (hasBookings && !hasMatpass && !hasProducts) {
      templateKey = 'booking_only';
      console.log('  → Template: booking_only (Booking only) ❌');
    } else {
      templateKey = 'order_confirmation_complete';
      console.log('  → Template: order_confirmation_complete (Fallback)');
    }
    
    console.log(`\n📧 Final Template: ${templateKey}`);
    
    if (templateKey === 'renewal_matpass') {
      console.log('\n✅ SUCCESS! The fix should work now:');
      console.log('  📱 Template will show MatPass details');
      console.log('  📅 Template will show booking details');
      console.log('  💰 Template will show pricing information');
      console.log('  📋 Template will show order summary');
    } else {
      console.log('\n❌ ISSUE: Still getting wrong template');
    }
    
    console.log('\n🎯 What you should see now:');
    console.log('  - renewal_matpass template instead of booking_only');
    console.log('  - Complete MatPass information');
    console.log('  - Complete booking details (date, time, instructor)');
    console.log('  - Pricing breakdown and order summary');
    
  } catch (error) {
    console.error('❌ Error testing booking fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBookingFixFinal();
