import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('🔍 Testing Prisma connection...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgresql://postgres.hwxrstqeuouefyrwjsjt:SIo1ahTJ3L0GoIMP@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
      },
    },
    log: ['query', 'error', 'warn', 'info'],
    errorFormat: 'pretty',
  });

  try {
    console.log('📡 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    
    console.log('🔍 Testing payment methods query...');
    const paymentMethods = await prisma.paymentMethodConfig.findMany({
      where: { isActive: true },
      take: 1
    });
    
    console.log('✅ Query successful! Found:', paymentMethods.length, 'payment methods');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

testConnection();
