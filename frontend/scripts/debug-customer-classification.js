import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debugCustomerClassification() {
  try {
    console.log('🔍 Debugging Customer Classification...\n');
    
    // Test with a sample email to see what orders are found
    const testEmail = 'test@example.com'; // Replace with your actual email if needed
    
    console.log(`📧 Checking orders for: ${testEmail}`);
    
    // Check what orders exist for this email
    const allOrders = await prisma.order.findMany({
      where: {
        customerEmail: testEmail
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        total: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\n📊 Found ${allOrders.length} orders for this email:`);
    allOrders.forEach((order, index) => {
      console.log(`  ${index + 1}. Order ${order.orderNumber}:`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Date: ${order.createdAt}`);
      console.log(`     Amount: $${order.total}`);
    });
    
    // Check what the current logic considers as "previous orders"
    const previousOrders = await prisma.order.findMany({
      where: {
        customerEmail: testEmail,
        status: {
          not: 'CANCELLED'
        }
      },
      take: 1
    });
    
    console.log(`\n🔍 Current Logic Analysis:`);
    console.log(`  - Total orders found: ${allOrders.length}`);
    console.log(`  - Non-cancelled orders: ${previousOrders.length}`);
    console.log(`  - Would be classified as: ${previousOrders.length === 0 ? 'NEW customer' : 'EXISTING customer'}`);
    
    // Check for potential issues
    console.log(`\n⚠️  Potential Issues:`);
    
    if (allOrders.length > 0) {
      const cancelledOrders = allOrders.filter(o => o.status === 'CANCELLED');
      const nonCancelledOrders = allOrders.filter(o => o.status !== 'CANCELLED');
      
      console.log(`  - Cancelled orders: ${cancelledOrders.length}`);
      console.log(`  - Non-cancelled orders: ${nonCancelledOrders.length}`);
      
      if (cancelledOrders.length > 0) {
        console.log(`  ⚠️  Found cancelled orders that might be affecting classification`);
      }
      
      if (nonCancelledOrders.length > 0) {
        console.log(`  ⚠️  Found non-cancelled orders - customer will be classified as EXISTING`);
        console.log(`  📅 Most recent order: ${nonCancelledOrders[0].createdAt}`);
      }
    }
    
    // Check for test orders or incomplete orders
    const testOrders = allOrders.filter(o => 
      o.orderNumber.includes('TEST') || 
      o.orderNumber.includes('test') ||
      o.total === 0
    );
    
    if (testOrders.length > 0) {
      console.log(`\n🧪 Found ${testOrders.length} test orders that might be causing issues:`);
      testOrders.forEach(order => {
        console.log(`  - ${order.orderNumber} (${order.status}, $${order.total})`);
      });
    }
    
    console.log(`\n💡 Recommendations:`);
    if (previousOrders.length > 0) {
      console.log(`  🔧 The customer is being classified as EXISTING because of previous orders`);
      console.log(`  🔧 Consider if these orders should count for customer classification:`);
      previousOrders.forEach(order => {
        console.log(`    - Order ${order.orderNumber} (${order.status}, $${order.total})`);
      });
    } else {
      console.log(`  ✅ Customer would be correctly classified as NEW`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging customer classification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCustomerClassification();
