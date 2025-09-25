#!/usr/bin/env node

/**
 * Script to clear ALL cache
 * This will force fresh data to be fetched for all cached endpoints
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

async function clearAllCache() {
  try {
    console.log('🔄 Connecting to Redis...');
    
    // Wait for connection
    await redis.ping();
    console.log('✅ Connected to Redis');
    
    // Clear all cache keys for all endpoints
    const patterns = [
      'packages:*',           // All packages cache
      'package:*',           // Individual package cache
      'products:*',          // All products list cache
      'product:*',           // Individual product cache
      'schedules:*',         // All schedules cache
      'schedule:*',          // Individual schedule cache
      'admin:products:*',    // Admin products cache
      'admin:dashboard:*',   // Admin dashboard cache
      'teacher-schedule:*',  // Teacher schedule cache
    ];
    
    let totalCleared = 0;
    const results = {};
    
    for (const pattern of patterns) {
      console.log(`🔍 Looking for keys matching: ${pattern}`);
      
      // Get all keys matching the pattern
      const keys = await redis.keys(pattern);
      console.log(`📋 Found ${keys.length} keys matching ${pattern}`);
      
      if (keys.length > 0) {
        // Delete all matching keys
        const deleted = await redis.del(...keys);
        totalCleared += deleted;
        results[pattern] = deleted;
        console.log(`🗑️  Deleted ${deleted} keys for pattern: ${pattern}`);
      } else {
        results[pattern] = 0;
      }
    }
    
    console.log(`\n✅ Complete cache clearing finished!`);
    console.log(`📊 Total keys cleared: ${totalCleared}`);
    console.log(`\n📋 Summary by endpoint:`);
    
    // Display summary
    Object.entries(results).forEach(([pattern, count]) => {
      const endpoint = pattern.replace(':*', '').replace(':', ' → ');
      console.log(`   ${endpoint}: ${count} keys cleared`);
    });
    
    console.log(`\n🎯 All caches have been refreshed!`);
    console.log(`💡 Next API calls will fetch fresh data from the database`);
    console.log(`\n🚀 Affected endpoints:`);
    console.log(`   • /api/packages - MATPASS packages`);
    console.log(`   • /api/products - Product listings`);
    console.log(`   • /api/schedules - Class schedules`);
    console.log(`   • /api/admin/* - Admin dashboard data`);
    console.log(`   • /api/teacher-schedule-slots - Teacher schedules`);
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  } finally {
    await redis.quit();
    console.log('🔌 Redis connection closed');
  }
}

// Run the cache clearing
clearAllCache();
