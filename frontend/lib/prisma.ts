import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with enhanced configuration
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn', 'info'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/wellness_db'
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Connection state
let isConnected = false;
let connectionPromise: Promise<void> | null = null;

// Simple connection function
const connect = async (): Promise<void> => {
  // Skip database connection during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🚫 Skipping database connection during build phase');
    return;
  }

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

// Force connection on startup (server-side only, but not during build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production' && !process.env.NEXT_PHASE) {
  // Only attempt connection if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    connect().catch(error => {
      console.error('❌ Background connection failed:', error);
    });
  } else {
    console.log('⚠️  DATABASE_URL not found, skipping database connection');
  }
}

// Wrapper for database operations
export const withConnection = async <T>(operation: () => Promise<T>): Promise<T> => {
  // Skip database operations during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🚫 Skipping database operation during build phase');
    throw new Error('Database operations not available during build phase');
  }

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
  // Skip database connection during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🚫 Skipping database connection during build phase');
    return;
  }
  await connect();
};

export default prisma;