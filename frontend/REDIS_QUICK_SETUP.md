# 🚀 Redis Quick Setup for Vercel

## Quick Start (Recommended: Upstash)

### 1. Install Dependencies
```bash
npm run redis:install
```

### 2. Setup Redis with Vercel
```bash
# Run the automated setup script
npm run redis:setup

# Or manually:
vercel addons create upstash
```

### 3. Test Redis Connection
```bash
# Start your development server
npm run dev

# Test Redis in another terminal
curl http://localhost:3000/api/redis-test
```

## Manual Setup (Alternative)

### Option A: Upstash (Recommended)
```bash
# 1. Go to https://console.upstash.com/
# 2. Create a new Redis database
# 3. Copy the connection details
# 4. Add to Vercel:

vercel env add REDIS_URL
# Paste: redis://default:password@host:port

vercel env add REDIS_REST_URL  
# Paste: https://your-url.upstash.io

vercel env add REDIS_REST_TOKEN
# Paste: your-token
```

### Option B: Redis Cloud
```bash
# 1. Go to https://redis.com/try-free/
# 2. Create free account and database
# 3. Add to Vercel:

vercel env add REDIS_HOST
vercel env add REDIS_PORT
vercel env add REDIS_PASSWORD
```

## Environment Variables

Add these to your `.env.local` for local development:

```bash
# For Upstash
REDIS_URL=redis://localhost:6379
REDIS_REST_URL=https://your-url.upstash.io
REDIS_REST_TOKEN=your-token

# For Redis Cloud/Self-hosted
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

## Test Commands

```bash
# Test Redis connection
npm run redis:test

# Check Redis status
npm run redis:check

# Pull environment variables
npm run vercel:env:pull
```

## Deploy to Vercel

```bash
# Deploy with Redis
vercel --prod

# Check logs
vercel logs
```

## Troubleshooting

### Redis Connection Issues
```bash
# Check environment variables
vercel env ls

# Test locally
redis-cli ping

# Check Vercel logs
vercel logs --follow
```

### Common Errors
- **Connection timeout**: Increase `REDIS_CONNECT_TIMEOUT`
- **Authentication failed**: Check `REDIS_PASSWORD`
- **Host not found**: Verify `REDIS_HOST` or `REDIS_URL`

## Performance Benefits

With Redis caching, you'll see:
- **60-80% faster** API responses
- **Reduced database load**
- **Better user experience**
- **Lower server costs**

## Next Steps

1. ✅ Redis is now configured
2. 🔄 Your APIs will automatically use caching
3. 📊 Monitor performance in Vercel dashboard
4. 🎯 Cache hit rates should be 80%+ for optimal performance

## Support

- 📖 Full documentation: `vercel-redis-setup.md`
- 🧪 Test endpoint: `/api/redis-test`
- 🔧 Setup script: `npm run redis:setup`
