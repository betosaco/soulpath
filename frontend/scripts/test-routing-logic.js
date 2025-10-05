import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testRoutingLogic() {
  try {
    console.log('🧪 Testing Email Routing Logic...\n');
    
    // Test scenarios for different customer types
    const testScenarios = [
      {
        name: 'New Customer - First MatPass',
        email: 'newcustomer@example.com',
        hasMatpass: true,
        hasBooking: false,
        hasProducts: false,
        expectedTemplate: 'welcome_matpass',
        description: 'Brand new customer buying their first MatPass'
      },
      {
        name: 'Existing Customer - MatPass Renewal',
        email: 'betosaco@gmail.com', // Your actual email
        hasMatpass: true,
        hasBooking: false,
        hasProducts: false,
        expectedTemplate: 'renewal_matpass',
        description: 'Existing customer renewing their MatPass'
      },
      {
        name: 'Existing Customer - MatPass + Booking',
        email: 'betosaco@gmail.com', // Your actual email
        hasMatpass: true,
        hasBooking: true,
        hasProducts: false,
        expectedTemplate: 'renewal_matpass',
        description: 'Existing customer buying MatPass and booking a class'
      }
    ];
    
    console.log('📊 Testing Routing Scenarios:\n');
    
    for (const scenario of testScenarios) {
      console.log(`🔍 Testing: ${scenario.name}`);
      console.log(`   Description: ${scenario.description}`);
      console.log(`   Email: ${scenario.email}`);
      console.log(`   Has MatPass: ${scenario.hasMatpass}`);
      console.log(`   Has Booking: ${scenario.hasBooking}`);
      console.log(`   Has Products: ${scenario.hasProducts}`);
      
      // Check if customer exists in database
      const existingOrders = await prisma.order.findMany({
        where: {
          customerEmail: scenario.email,
          status: {
            not: 'CANCELLED'
          }
        },
        take: 1
      });
      
      const isNewCustomer = existingOrders.length === 0;
      console.log(`   Is New Customer: ${isNewCustomer}`);
      
      // Determine template based on routing logic
      let determinedTemplate;
      
      if (scenario.hasMatpass) {
        if (isNewCustomer) {
          determinedTemplate = 'welcome_matpass';
        } else {
          determinedTemplate = 'renewal_matpass';
        }
      } else if (scenario.hasBooking && !scenario.hasMatpass && !scenario.hasProducts) {
        determinedTemplate = 'booking_only';
      } else if (scenario.hasProducts && !scenario.hasMatpass) {
        determinedTemplate = 'products_only';
      } else {
        determinedTemplate = 'order_confirmation_complete';
      }
      
      const isCorrect = determinedTemplate === scenario.expectedTemplate;
      console.log(`   Expected Template: ${scenario.expectedTemplate}`);
      console.log(`   Determined Template: ${determinedTemplate}`);
      console.log(`   Result: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
      
      if (!isCorrect) {
        console.log(`   ⚠️  MISMATCH: Expected ${scenario.expectedTemplate}, got ${determinedTemplate}`);
      }
      
      console.log('');
    }
    
    console.log('🎯 Routing Logic Analysis:');
    console.log('  📧 New customers with MatPass → welcome_matpass');
    console.log('  📧 Existing customers with MatPass → renewal_matpass');
    console.log('  📧 Existing customers with MatPass + Booking → renewal_matpass');
    
    console.log('\n💡 If you want to be treated as NEW customer:');
    console.log('  1. Remove your previous orders from the database, OR');
    console.log('  2. Modify the customer detection logic to be more specific, OR');
    console.log('  3. Use a different email address for your new MatPass');
    
    console.log('\n💡 If the routing is working correctly:');
    console.log('  - You have previous orders, so you ARE an existing customer');
    console.log('  - You should get the renewal_matpass template');
    console.log('  - This template should show both your MatPass renewal AND any booking details');
    
  } catch (error) {
    console.error('❌ Error testing routing logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRoutingLogic();
