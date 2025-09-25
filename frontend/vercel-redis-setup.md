# Redis Configuration for Vercel

## Option 1: Upstash Redis (Recommended for Vercel)

### 1. Install Upstash Redis
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Install Upstash Redis integration
vercel addons create upstash
```

### 2. Alternative: Manual Upstash Setup
```bash
# Go to https://console.upstash.com/
# Create a new Redis database
# Copy the connection details
```

### 3. Set Environment Variables
```bash
# Set Redis environment variables in Vercel
vercel env add REDIS_URL
# Paste your Upstash Redis URL (starts with redis://)

vercel env add REDIS_REST_URL
# Paste your Upstash REST URL (starts with https://)

vercel env add REDIS_REST_TOKEN
# Paste your Upstash REST token

# For local development, add to .env.local
echo "REDIS_URL=redis://localhost:6379" >> .env.local
echo "REDIS_REST_URL=https://your-upstash-url.upstash.io" >> .env.local
echo "REDIS_REST_TOKEN=your-token" >> .env.local
```

## Option 2: Redis Cloud

### 1. Create Redis Cloud Account
```bash
# Go to https://redis.com/try-free/
# Create a free account and database
```

### 2. Set Environment Variables
```bash
vercel env add REDIS_HOST
# Your Redis Cloud hostname

vercel env add REDIS_PORT
# Usually 6379

vercel env add REDIS_PASSWORD
# Your Redis Cloud password

vercel env add REDIS_USERNAME
# Your Redis Cloud username (if required)
```

## Option 3: Self-Hosted Redis (Advanced)

### 1. Deploy Redis on Railway/Render/DigitalOcean
```bash
# Example for Railway
railway add redis

# Or use Docker
docker run -d --name redis -p 6379:6379 redis:alpine
```

### 2. Set Environment Variables
```bash
vercel env add REDIS_HOST
vercel env add REDIS_PORT
vercel env add REDIS_PASSWORD
```

## Environment Variables Summary

Add these to your Vercel project:

```bash
# Required for Upstash
REDIS_URL=redis://default:password@host:port
REDIS_REST_URL=https://your-upstash-url.upstash.io
REDIS_REST_TOKEN=your-token

# Required for Redis Cloud/Self-hosted
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_USERNAME=default  # Optional

# Optional configuration
REDIS_TLS=true  # For secure connections
REDIS_DB=0      # Database number
```

## Local Development Setup

### 1. Install Redis locally (macOS)
```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis

# Or run manually
redis-server
```

### 2. Install Redis locally (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3. Install Redis locally (Windows)
```bash
# Using Chocolatey
choco install redis-64

# Or download from https://github.com/microsoftarchive/redis/releases
```

## Testing Redis Connection

### 1. Test locally
```bash
# Connect to Redis CLI
redis-cli

# Test connection
ping
# Should return PONG

# Test set/get
set test "Hello Redis"
get test
# Should return "Hello Redis"
```

### 2. Test in your app
```bash
# Add this to your API route for testing
const redis = require('ioredis');
const client = new Redis(process.env.REDIS_URL);

// Test in API route
await client.set('test', 'Hello from Vercel!');
const result = await client.get('test');
console.log('Redis test result:', result);
```

## Vercel Deployment Commands

### 1. Deploy with Redis
```bash
# Deploy to Vercel
vercel --prod

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

### 2. Monitor Redis usage
```bash
# Check Vercel function logs
vercel logs

# Monitor Redis in Upstash console
# Go to https://console.upstash.com/
```

## Troubleshooting

### Common Issues:

1. **Connection timeout**
   ```bash
   # Increase timeout in redis config
   vercel env add REDIS_CONNECT_TIMEOUT 10000
   ```

2. **Memory issues**
   ```bash
   # Check Redis memory usage
   # In Redis CLI: INFO memory
   ```

3. **SSL/TLS issues**
   ```bash
   # Enable TLS for secure connections
   vercel env add REDIS_TLS true
   ```

### Debug Commands:
```bash
# Check Vercel environment
vercel env ls

# Test Redis connection
vercel dev
# Then test your API endpoints

# Check logs
vercel logs --follow
```

## Performance Optimization

### 1. Connection Pooling
```typescript
// In your Redis config
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  family: 4,
  keepAlive: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
});
```

### 2. Cache Strategy
```typescript
// Cache TTL recommendations
const cacheTTL = {
  schedule: 300,    // 5 minutes
  packages: 1800,   // 30 minutes
  user: 3600,       // 1 hour
  static: 86400,    // 24 hours
};
```

## Cost Considerations

### Upstash (Recommended)
- Free tier: 10,000 requests/day
- Pro: $0.2 per 100K requests
- No server management needed

### Redis Cloud
- Free tier: 30MB storage
- Pro: $7/month for 250MB
- More control over configuration

### Self-hosted
- Free but requires server management
- Good for high-traffic applications
- More complex setup and maintenance
