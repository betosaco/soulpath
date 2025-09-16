import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with enhanced configuration
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.hwxrstqeuouefyrwjsjt:SIo1ahTJ3L0GoIMP@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn', 'info'] : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Connection state
let isConnected = false;
let connectionPromise: Promise<void> | null = null;

// Simple connection function
const connect = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      console.log('🔄 Connecting to database...');
      await prisma.$connect();
      isConnected = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      isConnected = false;
      throw error;
    }
  })();

  return connectionPromise;
};

// Force connection on startup (server-side only)
if (typeof window === 'undefined') {
  connect().catch(error => {
    console.error('❌ Background connection failed:', error);
  });
}

// Wrapper for database operations
export const withConnection = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    // Ensure connection
    await connect();
    
    // Execute operation
    return await operation();
  } catch (error) {
    console.error('❌ Database operation failed:', error);
    
    // If it's a connection error, try to reconnect once
    if (error instanceof Error && (
      error.message.includes('not yet connected') ||
      error.message.includes('Response from the Engine was empty') ||
      error.message.includes('Engine is not yet connected')
    )) {
      console.log('🔄 Attempting to reconnect...');
      isConnected = false;
      connectionPromise = null;
      
      try {
        await connect();
        return await operation();
      } catch (retryError) {
        console.error('❌ Reconnection failed:', retryError);
        throw retryError;
      }
    }
    
    throw error;
  }
};

// Ensure connection helper
export const ensureConnection = async (): Promise<void> => {
  await connect();
};

export default prisma;