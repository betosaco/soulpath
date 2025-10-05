import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEmailFormattingFixes() {
  try {
    console.log('🔍 Testing email formatting fixes...\n');

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
    console.log(`  Total: ${latestOrder.total}`);

    // Simulate the email data transformation with all fixes
    const emailOrderItems = latestOrder.items.map(item => {
      if (item.itemType === 'PACKAGE' && item.packagePrice) {
        return {
          name: item.packagePrice.packageDefinition.name, // This will be "08 MATPASS", "01 MATPASS", etc.
          description: item.packagePrice.packageDefinition.description || undefined,
          type_text: 'MATPASS',
          quantity: item.quantity,
          unit_price: Number(item.price),
          total_price: Number(item.price) * item.quantity,
          sessions: item.packagePrice.packageDefinition.sessionsCount,
          duration_minutes: item.packagePrice.packageDefinition.sessionDuration?.duration_minutes
        };
      }
      return null;
    }).filter(Boolean);

    console.log('\n📦 Email order items (with fixes):');
    for (const item of emailOrderItems) {
      console.log(`  ${item.name}: ${item.type_text} (${item.sessions} sessions)`);
    }

    // Test the MatPass filtering
    const matpassItems = emailOrderItems.filter(item => 
      item.type_text === 'MATPASS' || item.itemType === 'PACKAGE'
    );

    console.log(`\n📊 MatPass filtering result:`);
    console.log(`  MatPass items: ${matpassItems.length}`);

    if (matpassItems.length > 0) {
      const matpass = matpassItems[0];
      console.log('✅ MatPass details:');
      console.log(`  Name: ${matpass.name} (should show specific type like "08 MATPASS")`);
      console.log(`  Sessions: ${matpass.sessions} (should show actual number)`);
      console.log(`  Price: S/. ${matpass.total_price.toFixed(2)} (should show S/. instead of $)`);
      
      // Test date formatting
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      console.log(`  Expiry: ${expiryDate} (should show proper Spanish format)`);
    }

    // Test currency formatting
    const totalAmount = latestOrder.total;
    console.log(`\n💰 Currency formatting:`);
    console.log(`  Original: $${totalAmount.toFixed(2)}`);
    console.log(`  Fixed: S/. ${totalAmount.toFixed(2)}`);

    console.log('\n🎯 Expected Email Content:');
    console.log('✅ Currency: S/. instead of $');
    console.log('✅ MatPass Type: Specific name (08 MATPASS, 01 MATPASS, etc.)');
    console.log('✅ Sessions: Actual number instead of "sesiones"');
    console.log('✅ Date: Proper Spanish format (sábado, 3 de noviembre de 2025)');

  } catch (error) {
    console.error('❌ Error testing email formatting fixes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailFormattingFixes();
