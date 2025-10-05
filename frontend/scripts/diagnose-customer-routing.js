import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function diagnoseCustomerRouting() {
  try {
    console.log('🔍 Diagnosing Customer Routing Issues...\n');
    
    // Get recent orders to see what might be causing the issue
    const recentOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        status: true,
        createdAt: true,
        total: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    console.log('📊 Recent Orders in Database:');
    recentOrders.forEach((order, index) => {
      console.log(`  ${index + 1}. ${order.orderNumber}:`);
      console.log(`     Email: ${order.customerEmail}`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Date: ${order.createdAt}`);
      console.log(`     Amount: $${order.total}`);
    });
    
    // Check for potential issues with customer classification
    console.log('\n🔍 Customer Classification Analysis:');
    
    // Group orders by email
    const ordersByEmail = {};
    recentOrders.forEach(order => {
      if (!ordersByEmail[order.customerEmail]) {
        ordersByEmail[order.customerEmail] = [];
      }
      ordersByEmail[order.customerEmail].push(order);
    });
    
    console.log(`\n📧 Orders by Email:`);
    Object.keys(ordersByEmail).forEach(email => {
      const orders = ordersByEmail[email];
      const nonCancelledOrders = orders.filter(o => o.status !== 'CANCELLED');
      
      console.log(`\n  📧 ${email}:`);
      console.log(`     Total orders: ${orders.length}`);
      console.log(`     Non-cancelled orders: ${nonCancelledOrders.length}`);
      console.log(`     Would be classified as: ${nonCancelledOrders.length === 0 ? 'NEW' : 'EXISTING'}`);
      
      if (nonCancelledOrders.length > 0) {
        console.log(`     Recent non-cancelled orders:`);
        nonCancelledOrders.slice(0, 3).forEach(order => {
          console.log(`       - ${order.orderNumber} (${order.status}, $${order.total})`);
        });
      }
    });
    
    // Check for potential issues
    console.log('\n⚠️  Potential Issues Found:');
    
    const issues = [];
    
    // Check for test orders
    const testOrders = recentOrders.filter(o => 
      o.orderNumber.includes('TEST') || 
      o.orderNumber.includes('test') ||
      o.customerEmail.includes('test')
    );
    
    if (testOrders.length > 0) {
      issues.push(`🧪 Found ${testOrders.length} test orders that might affect classification`);
    }
    
    // Check for zero-amount orders
    const zeroAmountOrders = recentOrders.filter(o => o.total === 0);
    if (zeroAmountOrders.length > 0) {
      issues.push(`💰 Found ${zeroAmountOrders.length} zero-amount orders`);
    }
    
    // Check for cancelled orders that might be counted
    const cancelledOrders = recentOrders.filter(o => o.status === 'CANCELLED');
    if (cancelledOrders.length > 0) {
      issues.push(`❌ Found ${cancelledOrders.length} cancelled orders (these should not count)`);
    }
    
    if (issues.length === 0) {
      console.log('  ✅ No obvious issues found');
    } else {
      issues.forEach(issue => console.log(`  ${issue}`));
    }
    
    console.log('\n💡 Recommendations:');
    console.log('  1. Check if the customer has any previous orders in the database');
    console.log('  2. Verify that cancelled orders are not being counted');
    console.log('  3. Consider if test orders should be excluded from customer classification');
    console.log('  4. Check if the customer email is being matched correctly');
    
    console.log('\n🔧 To fix the issue:');
    console.log('  - If customer should be NEW: Check for any previous orders with their email');
    console.log('  - If customer should be EXISTING: Verify the classification logic is working');
    console.log('  - Consider adding more specific criteria for "new customer" detection');
    
  } catch (error) {
    console.error('❌ Error diagnosing customer routing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseCustomerRouting();
