# MatMax Telegram Bot

A standalone Telegram bot service for MatMax that handles order notifications and wellness service interactions.

## 🚀 Features

- **Order Notifications**: Automatically sends order confirmations via Telegram
- **User Registration**: Links Telegram accounts with SoulPath user accounts
- **Package Information**: Provides package details and pricing
- **Webhook Integration**: Handles incoming Telegram messages
- **Database Integration**: Stores user connections and preferences

## 📦 Installation

```bash
# Clone or navigate to the service directory
cd telegram-bot-service

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your configuration
```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Database Configuration
DATABASE_URL=your_database_url_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 🚀 Local Development

```bash
# Start the service
npm run dev

# Test the bot
npm run test

# Setup the bot
npm run setup
```

## 🔗 API Endpoints

### Webhook Endpoint
```
POST /api/telegram/webhook
```
Handles incoming Telegram messages and callback queries.

### User Registration
```
POST /api/telegram/register-user
```
Links a Telegram user with a SoulPath account.

### Order Notifications
```
POST /api/orders/send-notification
```
Sends order confirmations to linked Telegram users.

## 📡 Telegram Bot Commands

- `/start` - Welcome message and introduction
- `/register` - Account linking instructions
- `/link` - Alternative to /register

### Package Queries
The bot responds to package-related queries:
- "paquetes", "packages"
- "precios", "prices"
- "yoga classes", "clases"

## 🚀 Deployment to Vercel

### Automated Deployment
```bash
# Setup Vercel project
npm run vercel:setup

# Deploy to production
npm run deploy
```

### Manual Deployment
```bash
# Link to Vercel
npm run vercel:link

# Deploy
npm run deploy
```

### Webhook Configuration
After deployment, set up the webhook:
```bash
# Set the TELEGRAM_WEBHOOK_URL environment variable
export TELEGRAM_WEBHOOK_URL=https://your-vercel-url.vercel.app

# Run webhook setup
./setup-webhook.sh
```

## 🧪 Testing

### Test Bot Connection
```bash
curl "https://api.telegram.org/bot{YOUR_TOKEN}/getMe"
```

### Test Webhook
```bash
curl "https://api.telegram.org/bot{YOUR_TOKEN}/getWebhookInfo"
```

### Test Service Health
```bash
curl "https://your-vercel-url.vercel.app/"
```

## 🔧 Integration with Main App

To integrate order notifications from your main SoulPath app:

```javascript
// Send order notification to Telegram bot
const response = await fetch('https://your-telegram-bot-url.vercel.app/api/orders/send-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    orderDetails: orderData,
    telegramChatId: userTelegramChatId
  })
});
```

## 📊 Monitoring

### Vercel Dashboard
- Function logs and performance metrics
- Real-time error monitoring
- Deployment history

### Telegram Bot Status
- Webhook health checks
- Bot connectivity status
- Message processing statistics

## 🛠️ Troubleshooting

### Common Issues

1. **Webhook not working**
   ```bash
   # Delete and reset webhook
   curl -X POST "https://api.telegram.org/bot{TOKEN}/deleteWebhook"
   ./setup-webhook.sh
   ```

2. **Bot not responding**
   - Check Vercel function logs
   - Verify environment variables
   - Test webhook URL manually

3. **Database connection issues**
   - Verify DATABASE_URL is correct
   - Check database connectivity
   - Ensure Prisma client is generated

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `PORT` | Server port (default: 3001) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the SoulPath wellness platform.
