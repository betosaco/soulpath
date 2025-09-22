# Telegram Bot - Separate Deployment Guide

This guide explains how to deploy the Telegram bot as a **separate Vercel service** from your main SoulPath application.

## 🎯 Why Separate Deployment?

- **Independent Scaling**: Bot can scale separately from main app
- **Isolated Failures**: Bot issues won't affect main application
- **Different Tech Stack**: Express.js vs Next.js
- **Focused Monitoring**: Separate logs and metrics
- **Independent Deployments**: Deploy bot without touching main app

## 📁 Project Structure

```
telegram-bot-service/
├── server.js                 # Express server
├── services/
│   └── telegram-bot-service.js # Bot logic
├── package.json             # Dependencies
├── vercel.json             # Vercel config
├── deploy.sh               # Complete deployment
├── setup-vercel.sh         # Vercel setup
├── setup-webhook.sh        # Webhook config
├── test-bot.js            # Testing script
├── setup-bot.js           # Setup validation
├── README.md              # Documentation
└── env-example.txt        # Environment template
```

## 🚀 Quick Deployment

### Option 1: Automated (Recommended)
```bash
cd telegram-bot-service
./deploy.sh
```

### Option 2: Manual Step-by-Step
```bash
cd telegram-bot-service

# 1. Install dependencies
npm install

# 2. Configure environment
cp env-example.txt .env
# Edit .env with your values

# 3. Setup Vercel
npm run vercel:setup

# 4. Deploy
npm run deploy

# 5. Configure webhook
./setup-webhook.sh
```

## ⚙️ Environment Configuration

Create a `.env` file with:

```env
# Required
TELEGRAM_BOT_TOKEN=8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU
DATABASE_URL=postgresql://user:pass@host:5432/db

# Optional
PORT=3001
NODE_ENV=production
```

### Environment Variables on Vercel

After deployment, set these in Vercel dashboard:

```bash
# Required for bot operation
TELEGRAM_BOT_TOKEN
DATABASE_URL

# Optional for performance
NODE_ENV=production
```

## 🔗 Integration with Main App

### Order Notifications

When an order is created in your main app, notify the bot service:

```javascript
// In your main app (frontend/app/api/orders/create-unified/route.ts)

const telegramResponse = await fetch('https://your-telegram-bot.vercel.app/api/orders/send-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderDetails: orderData,
    telegramChatId: user.telegramChatId
  })
});
```

### User Linking

When users link their Telegram account:

```javascript
// In your main app

const linkResponse = await fetch('https://your-telegram-bot.vercel.app/api/telegram/register-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    telegramChatId: telegramChatId,
    telegramUserId: telegramUserId,
    telegramUsername: telegramUsername,
    telegramFirstName: telegramFirstName,
    telegramLastName: telegramLastName
  })
});
```

## 📡 API Endpoints

### Webhook (Internal)
```
POST /api/telegram/webhook
```
- Receives Telegram messages
- Handles user interactions
- Processes callback queries

### User Registration (External)
```
POST /api/telegram/register-user
```
- Links Telegram users with system accounts
- Called from main app when users connect

### Order Notifications (External)
```
POST /api/orders/send-notification
```
- Sends order confirmations to linked users
- Called from main app after order creation

## 🧪 Testing

### Local Testing
```bash
cd telegram-bot-service

# Test bot connection
npm run test

# Setup validation
npm run setup

# Start local server
npm run dev
```

### Production Testing
```bash
# Test webhook
curl "https://api.telegram.org/bot{YOUR_TOKEN}/getWebhookInfo"

# Test health check
curl "https://your-bot-url.vercel.app/"

# Test bot interaction
# Send messages to @Matmaxcommerce_bot on Telegram
```

## 🔍 Monitoring

### Vercel Dashboard
- **Functions**: Monitor webhook processing time
- **Logs**: View message processing and errors
- **Analytics**: Track bot usage patterns

### Telegram Bot Metrics
```bash
# Bot info
curl "https://api.telegram.org/bot{TOKEN}/getMe"

# Webhook status
curl "https://api.telegram.org/bot{TOKEN}/getWebhookInfo"

# Recent updates (if needed)
curl "https://api.telegram.org/bot{TOKEN}/getUpdates"
```

### Database Monitoring
```sql
-- Check linked users
SELECT COUNT(*) FROM telegram_users WHERE is_active = true;

-- Check recent interactions
SELECT * FROM telegram_users
WHERE last_interaction > NOW() - INTERVAL '24 hours'
ORDER BY last_interaction DESC;
```

## 🛠️ Troubleshooting

### Webhook Issues
```bash
# Reset webhook
curl -X POST "https://api.telegram.org/bot{TOKEN}/deleteWebhook"
./setup-webhook.sh
```

### Deployment Issues
```bash
# Check Vercel logs
vercel logs

# Redeploy
npm run deploy

# Check environment variables
vercel env ls
```

### Bot Not Responding
1. Verify webhook is set: `getWebhookInfo`
2. Check Vercel function logs
3. Test direct API calls
4. Verify bot token validity

### Database Issues
1. Check DATABASE_URL format
2. Verify database connectivity
3. Ensure Prisma schema is up to date
4. Check connection limits

## 🔒 Security

### Bot Token Protection
- ✅ Environment variables only
- ✅ Never in client-side code
- ✅ Separate from main app

### API Security
- ✅ CORS configured for main app domain
- ✅ Input validation on all endpoints
- ✅ Rate limiting (handled by Vercel)

### Data Protection
- ✅ Telegram chat IDs encrypted
- ✅ User consent required for linking
- ✅ Minimal data collection

## 📊 Performance Optimization

### Vercel Configuration
- **60-second timeout** for webhook processing
- **Global CDN** for fast responses
- **Automatic scaling** for traffic spikes

### Database Optimization
- **Connection pooling** enabled
- **Indexed queries** for user lookups
- **Efficient data structures**

### Bot Optimization
- **Async processing** for all operations
- **Error handling** prevents crashes
- **Message queuing** for high volume

## 🚀 Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database URL verified and accessible
- [ ] Bot token valid and active
- [ ] Webhook URL configured in Telegram
- [ ] Main app integration tested
- [ ] Order notification flow tested
- [ ] User linking flow tested
- [ ] Monitoring and alerts set up
- [ ] Backup strategy documented

## 🎉 Success Metrics

### Bot Health
- ✅ Webhook response time < 5 seconds
- ✅ Message processing success rate > 99%
- ✅ Zero crashes in production

### User Engagement
- 📈 User linking completion rate
- 📱 Order notification delivery rate
- 💬 Interactive response accuracy

### Integration Success
- 🔗 Main app API calls successful
- 📊 Order notifications delivered
- 👥 User accounts properly linked

## 📞 Support

For deployment issues:
1. Check Vercel function logs
2. Verify environment configuration
3. Test API endpoints manually
4. Review database connectivity
5. Check Telegram bot status

## 🔄 Updates and Maintenance

### Regular Tasks
- **Weekly**: Review bot analytics
- **Monthly**: Update dependencies
- **Quarterly**: Security audit

### Emergency Procedures
1. Check Vercel status page
2. Verify database connectivity
3. Reset webhook if needed
4. Scale resources if required

---

**Ready to deploy?** Run `./deploy.sh` in the `telegram-bot-service` directory! 🚀🤖
