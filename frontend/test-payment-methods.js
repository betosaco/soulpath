import { PrismaClient } from '@prisma/client';

async function testPaymentMethods() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing payment methods query...');
    
    const paymentMethods = await prisma.paymentMethodConfig.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        icon: true,
        requiresConfirmation: true,
        autoAssignPackage: true,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log('✅ Payment methods found:', paymentMethods.length);
    console.log('📋 Data:', JSON.stringify(paymentMethods, null, 2));
    
    // Check if table exists
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'PaymentMethodConfig'
    `;
    
    console.log('📊 Table structure:', tableInfo);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentMethods();
