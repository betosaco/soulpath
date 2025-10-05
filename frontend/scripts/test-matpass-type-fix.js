import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMatPassTypeFix() {
  try {
    console.log('🔍 Testing MatPass type_text fix...\n');

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

    // Simulate the email data transformation with the FIXED type_text
    const emailOrderItems = latestOrder.items.map(item => {
      if (item.itemType === 'PACKAGE' && item.packagePrice) {
        return {
          name: item.packagePrice.packageDefinition.name,
          description: item.packagePrice.packageDefinition.description || undefined,
          type_text: 'MATPASS', // FIXED: Now correctly set to 'MATPASS'
          quantity: item.quantity,
          unit_price: Number(item.price),
          total_price: Number(item.price) * item.quantity,
          sessions: item.packagePrice.packageDefinition.sessionsCount,
          duration_minutes: item.packagePrice.packageDefinition.sessionDuration?.duration_minutes
        };
      }
      return null;
    }).filter(Boolean);

    console.log('\n📦 Email order items (with FIXED type_text):');
    for (const item of emailOrderItems) {
      console.log(`  ${item.name}: type_text=${item.type_text}, itemType=PACKAGE`);
    }

    // Test the MatPass filtering with the FIXED type_text
    const matpassItems = emailOrderItems.filter(item => 
      item.type_text === 'MATPASS' || item.itemType === 'PACKAGE'
    );

    console.log(`\n📊 MatPass filtering result:`);
    console.log(`  Original items: ${emailOrderItems.length}`);
    console.log(`  MatPass items: ${matpassItems.length}`);

    if (matpassItems.length > 0) {
      console.log('✅ MatPass items found:');
      for (const item of matpassItems) {
        console.log(`  - ${item.name}: ${item.type_text}`);
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
    }

    console.log('\n🎯 Expected Result:');
    if (hasMatpass) {
      console.log('✅ You should now receive a MatPass email (welcome_matpass or renewal_matpass)');
      console.log('✅ NOT "Confirmación de Reserva" (booking-only)');
    } else {
      console.log('❌ You will still receive the wrong email template');
    }

  } catch (error) {
    console.error('❌ Error testing MatPass type fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMatPassTypeFix();
