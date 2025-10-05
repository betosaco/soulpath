import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProductDetectionFix() {
  try {
    console.log('🔍 Testing product detection fix...\n');

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

    // Simulate the email data transformation
    const emailOrderItems = latestOrder.items.map(item => {
      if (item.itemType === 'PRODUCT' && item.product) {
        return {
          name: item.product.name,
          description: item.product.description || undefined,
          type_text: 'Producto', // This is what gets set in the transformation
          itemType: item.itemType,
          quantity: item.quantity,
          unit_price: Number(item.price),
          total_price: Number(item.price) * item.quantity
        };
      } else if (item.itemType === 'PACKAGE' && item.packagePrice) {
        return {
          name: item.packagePrice.packageDefinition.name,
          description: item.packagePrice.packageDefinition.description || undefined,
          type_text: 'MATPASS',
          itemType: item.itemType,
          quantity: item.quantity,
          unit_price: Number(item.price),
          total_price: Number(item.price) * item.quantity,
          sessions: item.packagePrice.packageDefinition.sessionsCount
        };
      }
      return null;
    }).filter(Boolean);

    console.log('\n📦 Email order items (simulated):');
    for (const item of emailOrderItems) {
      console.log(`  ${item.name}: type_text=${item.type_text}, itemType=${item.itemType}`);
    }

    // Test the product filtering with the FIXED logic
    const products = emailOrderItems.filter(item => 
      item.type_text === 'Producto' || item.itemType === 'PRODUCT'
    );

    console.log(`\n📊 Product filtering result:`);
    console.log(`  Original items: ${emailOrderItems.length}`);
    console.log(`  Product items: ${products.length}`);

    if (products.length > 0) {
      console.log('✅ Product items found:');
      for (const item of products) {
        console.log(`  - ${item.name}: ${item.type_text} (${item.quantity}x ${item.unit_price})`);
      }
    } else {
      console.log('❌ No product items found - this is the problem!');
    }

    // Test MatPass filtering
    const matpassItems = emailOrderItems.filter(item => 
      item.type_text === 'MATPASS' || item.itemType === 'PACKAGE'
    );

    console.log(`\n📊 MatPass filtering result:`);
    console.log(`  MatPass items: ${matpassItems.length}`);

    // Simulate template selection
    const hasMatpass = matpassItems.length > 0;
    const hasProducts = products.length > 0;

    console.log(`\n🎯 Template Selection:`);
    console.log(`  Has MatPass: ${hasMatpass}`);
    console.log(`  Has Products: ${hasProducts}`);

    if (hasMatpass && hasProducts) {
      console.log('✅ Should use: renewal_matpass (Existing customer with MatPass + Products)');
      console.log('✅ Email should show both MatPass and product details');
    } else if (hasProducts && !hasMatpass) {
      console.log('✅ Should use: products_only (Products only)');
    } else if (hasMatpass && !hasProducts) {
      console.log('✅ Should use: renewal_matpass (MatPass only)');
    } else {
      console.log('❌ PROBLEM: No items detected correctly');
    }

    console.log('\n🎯 Expected Result:');
    if (hasMatpass && hasProducts) {
      console.log('✅ You should receive a MatPass + Products email');
      console.log('✅ The email should show both MatPass and product details');
    } else {
      console.log('❌ You will receive the wrong email template');
    }

  } catch (error) {
    console.error('❌ Error testing product detection fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductDetectionFix();
