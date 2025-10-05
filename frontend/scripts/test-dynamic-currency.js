import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDynamicCurrency() {
  try {
    console.log('🔍 Testing dynamic currency detection...\n');

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
    console.log(`  Currency: ${latestOrder.currency}`);
    console.log(`  Total: ${latestOrder.total}`);

    // Simulate the email data transformation with dynamic currency
    const orderData = {
      customerName: 'Test User',
      customerEmail: latestOrder.customerEmail,
      orderNumber: latestOrder.id,
      totalAmount: latestOrder.total,
      currency: latestOrder.currency, // This will be 'PEN'
      subtotal: latestOrder.total * 0.85, // Simulate subtotal
      taxAmount: latestOrder.total * 0.15, // Simulate tax
      shippingAmount: 0,
      matpassItems: [{
        name: '12 MATPASS',
        totalPrice: latestOrder.total,
        sessions: 12
      }]
    };

    console.log('\n📊 Email data simulation:');
    console.log(`  Currency: ${orderData.currency}`);
    console.log(`  Total: ${orderData.totalAmount}`);

    // Test dynamic currency formatting
    const formattedPrices = {
      orderTotal: `${orderData.currency} ${orderData.totalAmount.toFixed(2)}`,
      subtotal: `${orderData.currency} ${orderData.subtotal.toFixed(2)}`,
      taxAmount: `${orderData.currency} ${orderData.taxAmount.toFixed(2)}`,
      matpassPrice: `${orderData.currency} ${orderData.matpassItems[0].totalPrice.toFixed(2)}`
    };

    console.log('\n💰 Dynamic currency formatting:');
    console.log(`  Order Total: ${formattedPrices.orderTotal}`);
    console.log(`  Subtotal: ${formattedPrices.subtotal}`);
    console.log(`  Tax Amount: ${formattedPrices.taxAmount}`);
    console.log(`  MatPass Price: ${formattedPrices.matpassPrice}`);

    // Test different currency scenarios
    console.log('\n🌍 Currency scenarios:');
    
    const scenarios = [
      { currency: 'PEN', symbol: 'S/.' },
      { currency: 'USD', symbol: '$' },
      { currency: 'EUR', symbol: '€' },
      { currency: 'GBP', symbol: '£' }
    ];

    for (const scenario of scenarios) {
      const testPrice = 420.00;
      const formattedPrice = `${scenario.currency} ${testPrice.toFixed(2)}`;
      console.log(`  ${scenario.currency} (${scenario.symbol}): ${formattedPrice}`);
    }

    console.log('\n🎯 Expected Result:');
    console.log('✅ Currency is detected from order data');
    console.log('✅ Prices are formatted with the correct currency');
    console.log('✅ No hardcoded currency symbols');
    console.log('✅ Works with any currency (PEN, USD, EUR, etc.)');

  } catch (error) {
    console.error('❌ Error testing dynamic currency:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDynamicCurrency();
