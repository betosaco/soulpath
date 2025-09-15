import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.hwxrstqeuouefyrwjsjt:SIo1ahTJ3L0GoIMP@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
  // Enhanced logging for debugging
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn', 'info'] : ['error'],
  errorFormat: 'pretty',
});

// Ensure connection is established
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Connect to database on startup
prisma.$connect().catch((error) => {
  console.error('❌ Failed to connect to database:', error);
});

export default prisma;
