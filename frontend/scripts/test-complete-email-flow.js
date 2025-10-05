import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCompleteEmailFlow() {
  try {
    console.log('🔍 Testing complete email flow...\n');

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

    // Simulate the email data transformation that happens in create-unified
    const emailOrderItems = latestOrder.items.map(item => ({
      name: item.packagePrice?.packageDefinition?.name || 'Package',
      type_text: 'MATPASS', // This should be set correctly
      itemType: item.itemType,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      description: item.packagePrice?.packageDefinition?.description || ''
    }));

    console.log('\n📦 Email order items (simulated):');
    for (const item of emailOrderItems) {
      console.log(`  ${item.name}: type_text=${item.type_text}, itemType=${item.itemType}`);
    }

    // Simulate the matpassItems filtering
    const matpassItems = emailOrderItems.filter(item => 
      item.type_text === 'MATPASS' || item.itemType === 'PACKAGE'
    );

    console.log(`\n📊 MatPass filtering result:`);
    console.log(`  Original items: ${emailOrderItems.length}`);
    console.log(`  MatPass items: ${matpassItems.length}`);

    if (matpassItems.length > 0) {
      console.log('✅ MatPass items found:');
      for (const item of matpassItems) {
        console.log(`  - ${item.name}: ${item.type_text || 'MATPASS'}`);
      }
    } else {
      console.log('❌ No MatPass items found - this is the problem!');
    }

    // Simulate the template selection
    const hasMatpass = matpassItems.length > 0;
    console.log(`\n🎯 Template selection:`);
    console.log(`  Has MatPass: ${hasMatpass}`);

    if (hasMatpass) {
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

      if (isNewCustomer) {
        console.log('✅ SELECTED: welcome_matpass (New customer with MatPass)');
      } else {
        console.log('✅ SELECTED: renewal_matpass (Existing customer with MatPass)');
      }
    } else {
      console.log('❌ PROBLEM: No MatPass detected - will use fallback template');
      console.log('❌ This is why you\'re getting "Confirmación de Reserva"');
    }

  } catch (error) {
    console.error('❌ Error testing complete email flow:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteEmailFlow();
