import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { TelegramBotService } from './services/telegram-bot-service.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Telegram Bot Service
const telegramService = new TelegramBotService();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'telegram-bot-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Telegram webhook endpoint
app.post('/api/telegram/webhook', async (req, res) => {
  try {
    console.log('📱 Telegram webhook received');
    console.log('📨 Body:', JSON.stringify(req.body, null, 2));

    // Verify this is a valid Telegram update
    if (!req.body.update_id) {
      console.log('⚠️ Invalid Telegram update - missing update_id');
      return res.json({ status: 'ok' });
    }

    const message = req.body.message;
    const callbackQuery = req.body.callback_query;

    if (message) {
      await telegramService.handleMessage(message);
    } else if (callbackQuery) {
      await telegramService.handleCallbackQuery(callbackQuery);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User registration endpoint
app.post('/api/telegram/register-user', async (req, res) => {
  try {
    const { userId, telegramChatId, telegramUserId, telegramUsername, telegramFirstName, telegramLastName } = req.body;

    console.log('📝 Telegram user registration:', { userId, telegramChatId });

    // Validate required fields
    if (!userId || !telegramChatId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and telegramChatId'
      });
    }

    // Check if user exists in our system
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found in system'
      });
    }

    // Check if Telegram user already exists
    const existingTelegramUser = await prisma.telegramUser.findFirst({
      where: {
        OR: [
          { userId: userId },
          { telegramChatId: telegramChatId }
        ]
      }
    });

    if (existingTelegramUser) {
      // Update existing record
      const updatedTelegramUser = await prisma.telegramUser.update({
        where: { id: existingTelegramUser.id },
        data: {
          telegramUserId,
          telegramUsername,
          telegramFirstName,
          telegramLastName,
          isActive: true,
          lastInteraction: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('✅ Telegram user updated:', updatedTelegramUser.id);
      return res.json({
        success: true,
        message: 'Telegram user updated successfully',
        telegramUserId: updatedTelegramUser.id
      });
    } else {
      // Create new Telegram user record
      const newTelegramUser = await prisma.telegramUser.create({
        data: {
          userId,
          telegramChatId,
          telegramUserId,
          telegramUsername,
          telegramFirstName,
          telegramLastName,
          isActive: true,
          lastInteraction: new Date()
        }
      });

      console.log('✅ Telegram user created:', newTelegramUser.id);
      return res.json({
        success: true,
        message: 'Telegram user registered successfully',
        telegramUserId: newTelegramUser.id
      });
    }
  } catch (error) {
    console.error('❌ Error registering Telegram user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register Telegram user',
      details: error.message
    });
  }
});

// Get Telegram user endpoint
app.get('/api/telegram/register-user', async (req, res) => {
  try {
    const { userId, telegramChatId } = req.query;

    if (!userId && !telegramChatId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or telegramChatId parameter'
      });
    }

    let telegramUser;

    if (userId) {
      telegramUser = await prisma.telegramUser.findFirst({
        where: { userId: userId, isActive: true }
      });
    } else if (telegramChatId) {
      telegramUser = await prisma.telegramUser.findFirst({
        where: { telegramChatId: telegramChatId, isActive: true }
      });
    }

    if (telegramUser) {
      return res.json({
        success: true,
        telegramUser: {
          id: telegramUser.id,
          userId: telegramUser.userId,
          telegramChatId: telegramUser.telegramChatId,
          telegramUsername: telegramUser.telegramUsername,
          telegramFirstName: telegramUser.telegramFirstName,
          telegramLastName: telegramUser.telegramLastName,
          isActive: telegramUser.isActive,
          lastInteraction: telegramUser.lastInteraction,
          notificationPreferences: telegramUser.notificationPreferences
        }
      });
    } else {
      return res.json({
        success: true,
        telegramUser: null
      });
    }
  } catch (error) {
    console.error('❌ Error fetching Telegram user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Telegram user',
      details: error.message
    });
  }
});

// Order notification endpoint (for external calls from main app)
app.post('/api/orders/send-notification', async (req, res) => {
  try {
    const { orderDetails, telegramChatId } = req.body;

    if (!orderDetails || !telegramChatId) {
      return res.status(400).json({
        success: false,
        error: 'Missing orderDetails or telegramChatId'
      });
    }

    await telegramService.sendOrderConfirmation(telegramChatId, orderDetails);

    res.json({
      success: true,
      message: 'Order notification sent successfully'
    });
  } catch (error) {
    console.error('❌ Error sending order notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send order notification',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`🤖 Telegram Bot Service running on port ${port}`);
  console.log(`📱 Webhook URL: http://localhost:${port}/api/telegram/webhook`);
  console.log(`🔗 Health check: http://localhost:${port}/`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down Telegram Bot Service...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down Telegram Bot Service...');
  await prisma.$disconnect();
  process.exit(0);
});
