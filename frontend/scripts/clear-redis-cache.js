import { createClient } from 'redis';

async function clearRedisCache() {
  let client;
  
  try {
    console.log('🔗 Connecting to Redis...');
    
    // Create Redis client
    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    await client.connect();
    console.log('✅ Connected to Redis');

    console.log('🧹 Clearing all cache...');
    await client.flushAll();
    console.log('✅ Redis cache cleared successfully!');

  } catch (error) {
    console.error('❌ Error clearing Redis cache:', error);
  } finally {
    if (client) {
      await client.quit();
      console.log('🔌 Disconnected from Redis');
    }
  }
}

clearRedisCache();
