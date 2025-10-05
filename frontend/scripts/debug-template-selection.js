import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugTemplateSelection() {
  try {
    console.log('🔍 Debugging template selection for MatPass + booking scenario...\n');

    // Get the most recent order
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true
      }
    });

    if (!latestOrder) {
      console.log('❌ No orders found');
      return;
    }

    console.log('📦 Latest order details:');
    console.log(`  ID: ${latestOrder.id}`);
    console.log(`  Customer: ${latestOrder.customerEmail}`);
    console.log(`  Status: ${latestOrder.status}`);
    console.log(`  Total: ${latestOrder.total}`);
    console.log(`  Order Items: ${latestOrder.items.length}`);

    // Analyze order items
    const matpassItems = [];
    const bookingItems = [];
    const productItems = [];

    for (const item of latestOrder.items) {
      console.log(`\n📦 Order Item ${item.id}:`);
      console.log(`  Type: ${item.itemType}`);
      console.log(`  Quantity: ${item.quantity}`);
      console.log(`  Price: ${item.price}`);

      if (item.itemType === 'PACKAGE') {
        matpassItems.push({
          name: 'MatPass Package',
          type: 'MATPASS',
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          sessions: 0,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
      } else if (item.itemType === 'BOOKING') {
        bookingItems.push({
          bookingId: item.id?.toString() || '',
          bookingDate: '',
          bookingTime: '',
          sessionType: 'Yoga',
          teacherName: 'To be assigned',
          venue: 'MATMAX Yoga Studio',
          duration: 60
        });
      } else if (item.itemType === 'PRODUCT') {
        productItems.push({
          name: 'Product',
          type: 'PRODUCT',
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          description: ''
        });
      }
    }

    console.log(`\n📊 Order Analysis:`);
    console.log(`  MatPass Items: ${matpassItems.length}`);
    console.log(`  Booking Items: ${bookingItems.length}`);
    console.log(`  Product Items: ${productItems.length}`);

    // Simulate the template selection logic
    const hasMatpass = matpassItems.length > 0;
    const hasBookings = bookingItems.length > 0;
    const hasProducts = productItems.length > 0;

    console.log(`\n🎯 Template Selection Logic:`);
    console.log(`  Has MatPass: ${hasMatpass}`);
    console.log(`  Has Bookings: ${hasBookings}`);
    console.log(`  Has Products: ${hasProducts}`);

    // Check if customer is new
    const previousOrders = await prisma.order.findMany({
      where: {
        customerEmail: latestOrder.customerEmail,
        status: {
          not: 'CANCELLED'
        },
        id: {
          not: latestOrder.id // Exclude current order
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
      } else {
        selectedTemplate = 'renewal_matpass';
      }
    } else if (hasBookings) {
      selectedTemplate = 'booking_only';
    } else if (hasProducts) {
      selectedTemplate = 'products_only';
    } else {
      selectedTemplate = 'order_confirmation_complete';
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

    console.log(`\n🎯 Expected Behavior:`);
    if (hasMatpass && hasBookings) {
      if (isNewCustomer) {
        console.log('✅ Should use: welcome_matpass (New customer with MatPass + Booking)');
      } else {
        console.log('✅ Should use: renewal_matpass (Existing customer with MatPass + Booking)');
      }
    } else if (hasBookings && !hasMatpass) {
      console.log('❌ PROBLEM: Should use booking_only (Booking only without MatPass)');
      console.log('❌ This is why you\'re getting booking confirmation email');
    }

  } catch (error) {
    console.error('❌ Error debugging template selection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTemplateSelection();
