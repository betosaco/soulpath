import { cache } from '../lib/redis.ts';

async function clearCache() {
  try {
    console.log('🧹 Clearing cache...');
    
    // Clear packages cache
    await cache.del('packages:*');
    console.log('✅ Packages cache cleared');
    
    // Clear products cache
    await cache.del('products:*');
    console.log('✅ Products cache cleared');
    
    // Clear schedules cache
    await cache.del('schedules:*');
    console.log('✅ Schedules cache cleared');
    
    console.log('🎉 Cache cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  } finally {
    process.exit(0);
  }
}

clearCache();
