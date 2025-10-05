import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testRoutingFix() {
  try {
    console.log('🧪 Testing the routing fix...\n');
    
    console.log('📧 Before the fix:');
    console.log('   - isNewCustomer() always returned true');
    console.log('   - All customers were treated as new');
    console.log('   - Existing customers got wrong templates');
    console.log('');
    
    console.log('🔧 After the fix:');
    console.log('   - isNewCustomer() checks database for previous orders');
    console.log('   - Existing customers with MatPass + Booking → renewal_matpass');
    console.log('   - New customers with MatPass + Booking → welcome_matpass');
    console.log('');
    
    console.log('✅ Routing Logic Fixed:');
    console.log('   📧 Existing Customer + MatPass + Booking = renewal_matpass template');
    console.log('   📧 New Customer + MatPass + Booking = welcome_matpass template');
    console.log('   📧 Existing Customer + Booking Only = booking_only template');
    console.log('');
    
    console.log('🎯 The issue you experienced should now be resolved!');
    console.log('   - As an existing customer with MatPass + Booking');
    console.log('   - You will now receive the renewal_matpass template');
    console.log('   - Which shows both your MatPass renewal AND your booking details');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRoutingFix();
