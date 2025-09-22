# Telegram Bot Deployment to Vercel

This guide explains how to deploy your Telegram bot that sends order details after confirmations to Vercel.

## 🎯 Overview

Your Telegram bot will:
- ✅ Receive messages from users
- ✅ Allow users to link their accounts
- ✅ Send automatic order confirmations
- ✅ Provide status updates and notifications

## 🚀 Quick Deployment

### Option 1: Full Deployment Script (Recommended)

```bash
cd frontend
npm run deploy:telegram
```

This script will:
1. Install Vercel CLI if needed
2. Link your project to Vercel
3. Set up the Telegram bot token
4. Deploy to production
5. Configure the webhook automatically

### Option 2: Manual Deployment

1. **Deploy to Vercel:**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Set Environment Variables:**
   ```bash
   vercel env add TELEGRAM_BOT_TOKEN
   # Enter your bot token: 8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU
   ```

3. **Configure Webhook:**
   ```bash
   npm run setup:telegram-webhook
   ```

## 🔧 Configuration

### Environment Variables

Add these to your Vercel project:

```bash
TELEGRAM_BOT_TOKEN=8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_key
# ... other required environment variables
```

### Database Setup

Run the database migration to create the telegram_users table:

```sql
-- Execute this in your database
\i frontend/scripts/create-telegram-users-table.sql
```

## 📱 Bot Features

### User Commands

- `/start` - Welcome message and bot info
- `/register` - Account linking instructions
- `/link` - Alternative to /register

### Automatic Notifications

The bot automatically sends:
- 📦 Order confirmations with full details
- 🔔 Status updates
- 🎉 Welcome messages for new users

### Message Format

Order confirmations include:
- 👤 Customer information
- 📦 Order details with items
- 💳 Payment information
- 📅 Schedule details (if applicable)
- 🚚 Shipping address (if applicable)

## 🧪 Testing

### 1. Test Bot Connection
```bash
curl "https://api.telegram.org/bot8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU/getMe"
```

### 2. Test Webhook
```bash
curl "https://api.telegram.org/bot8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU/getWebhookInfo"
```

### 3. Test Your Bot
1. Open Telegram
2. Search for `@Matmaxcommerce_bot`
3. Send `/start` to test the bot
4. Send `/register` to see linking instructions

### 4. Test Order Notifications
1. Create a test order through your website
2. Link a Telegram account (if not already linked)
3. The bot should automatically send order details

## 🔍 Monitoring

### Vercel Dashboard
- Check function logs for webhook activity
- Monitor function execution times
- View error rates and performance

### Telegram Bot Status
```bash
# Check webhook health
curl "https://api.telegram.org/bot{YOUR_TOKEN}/getWebhookInfo"

# View recent updates
curl "https://api.telegram.org/bot{YOUR_TOKEN}/getUpdates"
```

### Database Monitoring
Check the `telegram_users` table for:
- Active user links
- Last interaction times
- Notification preferences

## 🛠️ Troubleshooting

### Webhook Not Working
```bash
# Delete and reset webhook
curl -X POST "https://api.telegram.org/bot{YOUR_TOKEN}/deleteWebhook"
npm run setup:telegram-webhook
```

### Bot Not Responding
1. Check Vercel function logs
2. Verify environment variables
3. Test webhook URL manually
4. Check database connectivity

### Users Not Receiving Notifications
1. Verify users are linked (`telegram_users` table)
2. Check notification preferences
3. Test with a manual order creation

## 📊 Performance Optimization

### Vercel Configuration
- Webhook timeout: 60 seconds (configured in vercel.json)
- Automatic scaling for traffic spikes
- Edge network for global performance

### Database Optimization
- Indexed telegram_users table
- Connection pooling enabled
- Query optimization for order lookups

## 🔒 Security

### Bot Token Security
- ✅ Stored as environment variable
- ✅ Never exposed in client-side code
- ✅ Rotated periodically if needed

### Webhook Security
- ✅ HTTPS only
- ✅ Telegram signature validation
- ✅ Rate limiting enabled

### User Data Protection
- ✅ Telegram chat IDs encrypted
- ✅ User consent required for linking
- ✅ GDPR compliant data handling

## 🚀 Production Checklist

- [ ] Bot token configured in Vercel
- [ ] Database tables created
- [ ] Webhook URL set and accessible
- [ ] SSL certificate valid
- [ ] Environment variables set
- [ ] Test order notifications working
- [ ] Monitoring configured
- [ ] Backup strategy in place

## 📞 Support

For issues:
1. Check Vercel function logs
2. Verify Telegram bot status
3. Test webhook connectivity
4. Review database connections
5. Check the troubleshooting section

## 🎉 Success!

Once deployed, your Telegram bot will automatically send order details to linked users after every order confirmation. Users can interact with the bot for support and receive real-time updates about their orders.

Happy deploying! 🚀🤖
