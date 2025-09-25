import { Redis } from 'ioredis';

// Redis client configuration for Vercel
const redisConfig = {
  // Use REDIS_REDIS_URL first (your actual env var), then fallback to REDIS_URL, then individual components
  ...(process.env.REDIS_REDIS_URL || process.env.REDIS_URL ? {
    url: process.env.REDIS_REDIS_URL || process.env.REDIS_URL,
  } : {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
  }),
  
  // Connection settings
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
  lazyConnect: true,
  
  // Connection pool settings
  family: 4,
  keepAlive: 30000,
  
  // Timeout settings
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000'),
  commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000'),
  
  // TLS settings for secure connections
  ...(process.env.REDIS_TLS === 'true' && {
    tls: {
      rejectUnauthorized: false
    }
  }),
  
  // Vercel-specific optimizations
  enableReadyCheck: false,
  maxLoadingTimeout: 5000,
};

const redis = new Redis(redisConfig);

// Handle Redis connection errors gracefully
redis.on('error', (error) => {
  console.warn('⚠️ Redis connection error (non-critical):', error.message);
  // Don't throw the error, just log it as Redis is optional
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('ready', () => {
  console.log('✅ Redis ready for operations');
});

redis.on('close', () => {
  console.log('🔄 Redis connection closed');
});

// Cache key generators
export const cacheKeys = {
  schedule: (startDate?: string, endDate?: string, available?: boolean) => 
    `schedule:${startDate || 'default'}:${endDate || 'default'}:${available || 'all'}`,
  packages: (currency: string, active?: boolean) => 
    `packages:${currency}:${active || 'all'}`,
  packageDetail: (packageId: number, currency: string) => 
    `package:${packageId}:${currency}`,
  popularPackages: (currency: string) => 
    `packages:popular:${currency}`,
  featuredPackages: (currency: string) => 
    `packages:featured:${currency}`,
  products: (page: number, limit: number, search?: string, category?: string, sortBy?: string, sortOrder?: string) => 
    `products:${page}:${limit}:${search || 'all'}:${category || 'all'}:${sortBy || 'createdAt'}:${sortOrder || 'desc'}`,
  productDetail: (productId: string) => 
    `product:${productId}`,
};

// Cache TTL (Time To Live) in seconds
export const cacheTTL = {
  schedule: 300, // 5 minutes - schedule changes frequently
  packages: 1800, // 30 minutes - packages change less frequently
  packageDetail: 3600, // 1 hour - individual package details
  popularPackages: 1800, // 30 minutes
  featuredPackages: 1800, // 30 minutes
  products: 900, // 15 minutes - products change moderately
  productDetail: 1800, // 30 minutes - individual product details
};

// Generic cache functions
export class CacheService {
  private static instance: CacheService;
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        console.log(`✅ Cache hit for key: ${key}`);
        return JSON.parse(cached);
      }
      console.log(`❌ Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      console.warn(`⚠️ Redis get error for key ${key} (falling back to no cache):`, error.message);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
      console.log(`✅ Cached data for key: ${key}${ttl ? ` (TTL: ${ttl}s)` : ''}`);
    } catch (error) {
      console.warn(`⚠️ Redis set error for key ${key} (cache disabled):`, error.message);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      console.log(`🗑️ Deleted cache key: ${key}`);
    } catch (error) {
      console.error(`❌ Redis delete error for key ${key}:`, error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`🗑️ Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.error(`❌ Redis pattern invalidation error for pattern ${pattern}:`, error);
    }
  }

  async invalidateScheduleCache(): Promise<void> {
    await this.invalidatePattern('schedule:*');
  }

  async invalidatePackagesCache(): Promise<void> {
    await this.invalidatePattern('packages:*');
  }

  async invalidatePackageCache(packageId?: number): Promise<void> {
    if (packageId) {
      await this.invalidatePattern(`package:${packageId}:*`);
    } else {
      await this.invalidatePattern('package:*');
    }
  }

  async invalidateProductsCache(): Promise<void> {
    await this.invalidatePattern('products:*');
  }

  async invalidateProductCache(productId?: string): Promise<void> {
    if (productId) {
      await this.invalidatePattern(`product:${productId}`);
    } else {
      await this.invalidatePattern('product:*');
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('❌ Redis ping failed:', error);
      return false;
    }
  }

  // Get cache statistics
  async getStats(): Promise<{ memory: string; keys: number; connected: boolean }> {
    try {
      const info = await this.redis.info('memory');
      const keys = await this.redis.dbsize();
      const connected = await this.ping();
      
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const memory = memoryMatch ? memoryMatch[1] : 'unknown';
      
      return { memory, keys, connected };
    } catch (error) {
      console.error('❌ Redis stats error:', error);
      return { memory: 'unknown', keys: 0, connected: false };
    }
  }
}

// Export singleton instance
export const cache = CacheService.getInstance();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Closing Redis connection...');
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Closing Redis connection...');
  await redis.quit();
  process.exit(0);
});

export default redis;