import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSimplifiedEmailLogic() {
  try {
    console.log('🔍 Testing simplified email logic...\n');

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
      type_text: 'MATPASS',
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

    // Test the simplified MatPass detection logic
    const matpassItems = emailOrderItems.filter(item => 
      item.type_text === 'MATPASS' || item.itemType === 'PACKAGE'
    );

    console.log(`\n📊 Simplified Logic Test:`);
    console.log(`  MatPass items found: ${matpassItems.length}`);
    
    // Simulate the simplified template selection
    const hasMatpass = matpassItems.length > 0;
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
      console.log('✅ You should receive a MatPass email (welcome_matpass or renewal_matpass)');
      console.log('✅ NOT a booking-only email');
    } else {
      console.log('❌ You will receive the wrong email template');
    }

  } catch (error) {
    console.error('❌ Error testing simplified email logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimplifiedEmailLogic();
