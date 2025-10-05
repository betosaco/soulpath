import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDynamicTitles() {
  try {
    console.log('🔍 Testing dynamic email titles...\n');

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
    console.log(`  Items: ${latestOrder.items.length}`);

    // Analyze order items
    const matpassItems = [];
    const productItems = [];

    for (const item of latestOrder.items) {
      if (item.itemType === 'PACKAGE') {
        matpassItems.push(item);
      } else if (item.itemType === 'PRODUCT') {
        productItems.push(item);
      }
    }

    console.log(`\n📊 Order Analysis:`);
    console.log(`  MatPass Items: ${matpassItems.length}`);
    console.log(`  Product Items: ${productItems.length}`);

    // Simulate the email data
    const hasMatpass = matpassItems.length > 0;
    const hasProducts = productItems.length > 0;

    console.log(`\n🎯 Email Title Logic:`);
    console.log(`  Has MatPass: ${hasMatpass}`);
    console.log(`  Has Products: ${hasProducts}`);

    // Simulate the dynamic title logic
    let spanishTitle = '';
    let englishTitle = '';

    if (hasMatpass && hasProducts) {
      spanishTitle = 'Tu MatPass y Productos han sido Renovados';
      englishTitle = 'Your MatPass and Products have been Renewed';
      console.log('✅ Scenario: MatPass + Products');
    } else if (hasMatpass && !hasProducts) {
      spanishTitle = 'Tu MatPass ha sido Renovado';
      englishTitle = 'Your MatPass has been Renewed';
      console.log('✅ Scenario: MatPass only');
    } else if (!hasMatpass && hasProducts) {
      spanishTitle = 'Tus Productos han sido Confirmados';
      englishTitle = 'Your Products have been Confirmed';
      console.log('✅ Scenario: Products only');
    } else {
      spanishTitle = 'Tu Orden ha sido Confirmada';
      englishTitle = 'Your Order has been Confirmed';
      console.log('✅ Scenario: Other');
    }

    console.log(`\n📧 Generated Titles:`);
    console.log(`  Spanish: ${spanishTitle} - ${latestOrder.customerEmail}`);
    console.log(`  English: ${englishTitle} - ${latestOrder.customerEmail}`);

    // Test different scenarios
    console.log(`\n🌍 Title Scenarios:`);
    
    const scenarios = [
      { matpass: true, products: false, desc: 'MatPass only' },
      { matpass: true, products: true, desc: 'MatPass + Products' },
      { matpass: false, products: true, desc: 'Products only' },
      { matpass: false, products: false, desc: 'Other' }
    ];

    for (const scenario of scenarios) {
      let title = '';
      if (scenario.matpass && scenario.products) {
        title = 'Tu MatPass y Productos han sido Renovados';
      } else if (scenario.matpass && !scenario.products) {
        title = 'Tu MatPass ha sido Renovado';
      } else if (!scenario.matpass && scenario.products) {
        title = 'Tus Productos han sido Confirmados';
      } else {
        title = 'Tu Orden ha sido Confirmada';
      }
      
      console.log(`  ${scenario.desc}: "${title}"`);
    }

    console.log(`\n🎯 Expected Result:`);
    if (hasMatpass && hasProducts) {
      console.log('✅ You should receive: "Tu MatPass y Productos han sido Renovados"');
    } else if (hasMatpass && !hasProducts) {
      console.log('✅ You should receive: "Tu MatPass ha sido Renovado"');
    } else {
      console.log('✅ You should receive the appropriate title based on your order');
    }

  } catch (error) {
    console.error('❌ Error testing dynamic titles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDynamicTitles();
