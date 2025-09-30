import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with enhanced configuration
// Build a resilient database URL for Supabase PgBouncer
function buildDatabaseUrl(): string {
  // Prefer a direct (non-pooled) URL when explicitly provided for local/dev failover
  const directUrl = process.env.DIRECT_DATABASE_URL || process.env.SUPABASE_DIRECT_URL;
  if (directUrl) {
    return directUrl;
  }

  const rawUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/wellness_db';
  try {
    const url = new URL(rawUrl);

    // Ensure SSL is required for Supabase
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }

    // If using Supabase PgBouncer (port 6543 or pooler host), add PgBouncer params
    const isPgBouncer = url.hostname.includes('pooler.supabase.com') || url.port === '6543';
    if (isPgBouncer) {
      // Prisma recommendations when using PgBouncer (transaction mode):
      // - pgbouncer=true
      // - connection_limit=1
      if (!url.searchParams.has('pgbouncer')) {
        url.searchParams.set('pgbouncer', 'true');
      }
      if (!url.searchParams.has('connection_limit')) {
        url.searchParams.set('connection_limit', '1');
      }
      // Optional: shorter timeouts to fail fast rather than hang
      if (!url.searchParams.has('connect_timeout')) {
        url.searchParams.set('connect_timeout', '15');
      }
      if (!url.searchParams.has('pool_timeout')) {
        url.searchParams.set('pool_timeout', '30');
      }
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

let prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  datasources: {
    db: {
      url: buildDatabaseUrl()
    }
  },
  // Performance optimizations
  __internal: {
    engine: {
      connectionTimeout: 10000, // 10 seconds
      maxWait: 5000, // 5 seconds max wait for connection
      pool: {
        timeout: 30000, // 30 seconds
        idleTimeout: 300000, // 5 minutes
      }
    }
  }
});

export let prisma: PrismaClient = prismaInstance;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Connection state
let isConnected = false;
let connectionPromise: Promise<void> | null = null;
let triedFailover = false;

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
      // Conditional failover: if pooled connection fails and a direct URL is provided, retry once
      const msg = error instanceof Error ? error.message : String(error);
      const canFailover = !triedFailover && Boolean(process.env.DIRECT_DATABASE_URL || process.env.SUPABASE_DIRECT_URL);
      if (canFailover && (msg.includes('P1001') || msg.includes('pooler.supabase.com') || msg.includes('6543'))) {
        try {
          console.warn('⚠️ Attempting Prisma failover to direct database URL...');
          triedFailover = true;
          prismaInstance = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
            datasources: {
              db: {
                url: process.env.DIRECT_DATABASE_URL || process.env.SUPABASE_DIRECT_URL as string,
              }
            },
            // Performance optimizations
            __internal: {
              engine: {
                connectionTimeout: 10000,
                maxWait: 5000,
                pool: {
                  timeout: 30000,
                  idleTimeout: 300000,
                }
              }
            }
          });
          prisma = prismaInstance;
          if (process.env.NODE_ENV !== 'production') {
            globalForPrisma.prisma = prismaInstance;
          }
          await prisma.$connect();
          isConnected = true;
          console.log('✅ Failover connection (direct URL) established successfully');
          return;
        } catch (failoverError) {
          console.error('❌ Failover connection attempt failed:', failoverError);
        }
      }
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