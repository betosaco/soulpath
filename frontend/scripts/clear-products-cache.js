#!/usr/bin/env node

/**
 * Script to clear products cache
 * This will force fresh data to be fetched for all product-related endpoints
 */

import { Redis } from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Redis client configuration
const redisConfig = {
  ...(process.env.REDIS_URL || process.env.REDIS_REDIS_URL ? {
    url: process.env.REDIS_URL || process.env.REDIS_REDIS_URL,
  } : {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
  }),
  
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  family: 4,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
  
  ...(process.env.REDIS_TLS === 'true' && {
    tls: {
      rejectUnauthorized: false
    }
  }),
  
  enableReadyCheck: false,
  maxLoadingTimeout: 5000,
};

const redis = new Redis(redisConfig);

async function clearProductsCache() {
  try {
    console.log('🔄 Connecting to Redis...');
    
    // Wait for connection
    await redis.ping();
    console.log('✅ Connected to Redis');
    
    // Clear all product-related cache keys
    const patterns = [
      'products:*',      // All products list cache
      'product:*',       // All individual product cache
    ];
    
    let totalCleared = 0;
    
    for (const pattern of patterns) {
      console.log(`🔍 Looking for keys matching: ${pattern}`);
      
      // Get all keys matching the pattern
      const keys = await redis.keys(pattern);
      console.log(`📋 Found ${keys.length} keys matching ${pattern}`);
      
      if (keys.length > 0) {
        // Delete all matching keys
        const deleted = await redis.del(...keys);
        totalCleared += deleted;
        console.log(`🗑️  Deleted ${deleted} keys for pattern: ${pattern}`);
      }
    }
    
    console.log(`\n✅ Cache clearing complete!`);
    console.log(`📊 Total keys cleared: ${totalCleared}`);
    console.log(`🎯 Products cache has been refreshed`);
    console.log(`\n💡 Next API calls will fetch fresh data from the database`);
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  } finally {
    await redis.quit();
    console.log('🔌 Redis connection closed');
  }
}

// Run the cache clearing
clearProductsCache();
