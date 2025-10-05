import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugProductTemplate() {
  try {
    console.log('🔍 Debugging product template selection...\n');

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
            },
            product: true
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
    console.log(`  Currency: ${latestOrder.currency}`);
    console.log(`  Total: ${latestOrder.total}`);
    console.log(`  Items: ${latestOrder.items.length}`);

    // Analyze order items
    const matpassItems = [];
    const productItems = [];
    const bookingItems = [];

    for (const item of latestOrder.items) {
      console.log(`\n📦 Order Item ${item.id}:`);
      console.log(`  Type: ${item.itemType}`);
      console.log(`  Quantity: ${item.quantity}`);
      console.log(`  Price: ${item.price}`);

      if (item.itemType === 'PACKAGE') {
        matpassItems.push(item);
        console.log(`  MatPass: ${item.packagePrice?.packageDefinition?.name}`);
      } else if (item.itemType === 'PRODUCT') {
        productItems.push(item);
        console.log(`  Product: ${item.product?.name}`);
      } else if (item.itemType === 'BOOKING') {
        bookingItems.push(item);
        console.log(`  Booking: ${item.id}`);
      }
    }

    console.log(`\n📊 Order Analysis:`);
    console.log(`  MatPass Items: ${matpassItems.length}`);
    console.log(`  Product Items: ${productItems.length}`);
    console.log(`  Booking Items: ${bookingItems.length}`);

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

    // Simulate template selection logic
    const hasMatpass = matpassItems.length > 0;
    const hasProducts = productItems.length > 0;
    const hasBookings = recentBookings.length > 0;

    console.log(`\n🎯 Template Selection Logic:`);
    console.log(`  Has MatPass: ${hasMatpass}`);
    console.log(`  Has Products: ${hasProducts}`);
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

    // Determine what template should be selected
    let selectedTemplate = '';
    if (hasMatpass) {
      if (isNewCustomer) {
        selectedTemplate = 'welcome_matpass';
        console.log('✅ Should use: welcome_matpass (New customer with MatPass + Products)');
      } else {
        selectedTemplate = 'renewal_matpass';
        console.log('✅ Should use: renewal_matpass (Existing customer with MatPass + Products)');
      }
    } else if (hasProducts && !hasMatpass) {
      selectedTemplate = 'products_only';
      console.log('✅ Should use: products_only (Products only)');
    } else if (hasBookings && !hasMatpass && !hasProducts) {
      selectedTemplate = 'booking_only';
      console.log('✅ Should use: booking_only (Booking only)');
    } else {
      selectedTemplate = 'order_confirmation_complete';
      console.log('⚠️ Fallback: order_confirmation_complete');
    }

    console.log(`\n🎯 Selected Template: ${selectedTemplate}`);

    // Check if the template exists
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: selectedTemplate,
        isActive: true
      }
    });

    if (template) {
      console.log(`✅ Template exists: ${template.name}`);
    } else {
      console.log(`❌ Template not found: ${selectedTemplate}`);
    }

    console.log(`\n🎯 Expected Result:`);
    if (hasMatpass && hasProducts) {
      console.log('✅ You should receive a MatPass + Products email');
      console.log('✅ The email should show both MatPass and product details');
    } else if (hasProducts && !hasMatpass) {
      console.log('✅ You should receive a products-only email');
    } else {
      console.log('❌ You will receive the wrong email template');
    }

  } catch (error) {
    console.error('❌ Error debugging product template:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProductTemplate();
