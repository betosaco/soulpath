import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/redis';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔍 Testing Redis connection...');

    // Test Redis connection
    const isConnected = await cache.ping();
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'Redis connection failed',
        message: 'Unable to connect to Redis server'
      }, { status: 500 });
    }

    // Test cache operations
    const testKey = 'redis-test-' + Date.now();
    const testValue = { 
      message: 'Hello from Redis!', 
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substring(7)
    };

    // Set test data
    await cache.set(testKey, testValue, 60); // Cache for 1 minute

    // Get test data
    const retrievedValue = await cache.get(testKey);

    // Get cache statistics
    const stats = await cache.getStats();

    // Clean up test data
    await cache.del(testKey);

    return NextResponse.json({
      success: true,
      message: 'Redis connection successful',
      test: {
        set: testValue,
        retrieved: retrievedValue,
        match: JSON.stringify(testValue) === JSON.stringify(retrievedValue)
      },
      stats: {
        connected: isConnected,
        memory: stats.memory,
        keys: stats.keys
      },
      environment: {
        hasRedisUrl: !!(process.env.REDIS_REDIS_URL || process.env.REDIS_URL),
        hasRedisHost: !!process.env.REDIS_HOST,
        hasRedisPassword: !!process.env.REDIS_PASSWORD,
        nodeEnv: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('❌ Redis test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Redis test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        hasRedisUrl: !!(process.env.REDIS_REDIS_URL || process.env.REDIS_URL),
        hasRedisHost: !!process.env.REDIS_HOST,
        hasRedisPassword: !!process.env.REDIS_PASSWORD,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, key, value, ttl } = await request.json();

    switch (action) {
      case 'set':
        await cache.set(key, value, ttl);
        return NextResponse.json({
          success: true,
          message: `Set ${key} successfully`
        });

      case 'get':
        const data = await cache.get(key);
        return NextResponse.json({
          success: true,
          data,
          found: data !== null
        });

      case 'delete':
        await cache.del(key);
        return NextResponse.json({
          success: true,
          message: `Deleted ${key} successfully`
        });

      case 'clear':
        await cache.invalidatePattern('*');
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: 'Supported actions: set, get, delete, clear'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Redis POST test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Redis operation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}