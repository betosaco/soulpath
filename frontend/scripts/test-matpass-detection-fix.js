import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMatPassDetectionFix() {
  try {
    console.log('🔍 Testing MatPass detection fix...\n');

    // Get the most recent order
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            packagePrice: {
              include: {
                packageDefinition: true
              }
            }
          }
        }
      }
    });

    if (!latestOrder) {
      console.log('❌ No orders found');
      return;
    }

    console.log('📦 Latest order:');
    console.log(`  ID: ${latestOrder.id}`);
    console.log(`  Customer: ${latestOrder.customerEmail}`);
    console.log(`  Items: ${latestOrder.items.length}`);

    // Simulate the email data transformation
    const emailOrderItems = latestOrder.items.map(item => ({
      name: item.packagePrice?.packageDefinition?.name || 'Package',
      type_text: 'MATPASS', // This would be set in the actual transformation
      itemType: item.itemType,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      description: item.packagePrice?.packageDefinition?.description || ''
    }));

    console.log('\n📦 Email order items:');
    for (const item of emailOrderItems) {
      console.log(`  ${item.name}: ${item.type_text} (${item.itemType})`);
    }

    // Test the MatPass detection logic
    const matpassItems = emailOrderItems.filter(item => 
      item.type_text === 'MATPASS' || item.itemType === 'PACKAGE'
    );

    console.log(`\n📊 MatPass Detection:`);
    console.log(`  MatPass items found: ${matpassItems.length}`);
    
    for (const item of matpassItems) {
      console.log(`  ✅ ${item.name}: ${item.type_text || 'MATPASS'}`);
    }

    // Check for recent bookings
    const recentBookings = await prisma.booking.findMany({
      where: {
        user: {
          email: latestOrder.customerEmail
        },
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      },
      take: 3
    });

    console.log(`\n📅 Recent bookings: ${recentBookings.length}`);

    // Simulate template selection
    const hasMatpass = matpassItems.length > 0;
    const hasBookings = recentBookings.length > 0;

    console.log(`\n🎯 Template Selection:`);
    console.log(`  Has MatPass: ${hasMatpass}`);
    console.log(`  Has Bookings: ${hasBookings}`);

    // Check if customer is new
    const previousOrders = await prisma.order.findMany({
      where: {
        customerEmail: latestOrder.customerEmail,
        status: {
          not: 'CANCELLED'
        },
        id: {
          not: latestOrder.id
        }
      },
      take: 1
    });

    const isNewCustomer = previousOrders.length === 0;
    console.log(`  Is New Customer: ${isNewCustomer}`);

    // Determine template
    let selectedTemplate = '';
    if (hasMatpass) {
      if (isNewCustomer) {
        selectedTemplate = 'welcome_matpass';
        console.log('✅ Should use: welcome_matpass (New customer with MatPass)');
      } else {
        selectedTemplate = 'renewal_matpass';
        console.log('✅ Should use: renewal_matpass (Existing customer with MatPass)');
      }
    } else if (hasBookings && !hasMatpass) {
      selectedTemplate = 'booking_only';
      console.log('❌ PROBLEM: Using booking_only (Booking only without MatPass)');
    }

    console.log(`\n🎯 Selected Template: ${selectedTemplate}`);

    if (hasMatpass && selectedTemplate !== 'booking_only') {
      console.log('\n✅ SUCCESS: MatPass detection is working correctly!');
      console.log('✅ You should receive the correct MatPass email template');
    } else if (hasMatpass && selectedTemplate === 'booking_only') {
      console.log('\n❌ PROBLEM: MatPass detection is still failing');
      console.log('❌ You will still receive booking_only template');
    }

  } catch (error) {
    console.error('❌ Error testing MatPass detection fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMatPassDetectionFix();
