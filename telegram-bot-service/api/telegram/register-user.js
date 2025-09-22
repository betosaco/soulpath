import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
        return res.status(200).json({
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
        return res.status(201).json({
          success: true,
          message: 'Telegram user registered successfully',
          telegramUserId: newTelegramUser.id
        });
      }
    } catch (error) {
      console.error('❌ Error registering Telegram user:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to register Telegram user',
        details: error.message
      });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
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
        return res.status(200).json({
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
        return res.status(200).json({
          success: true,
          telegramUser: null
        });
      }
    } catch (error) {
      console.error('❌ Error fetching Telegram user:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch Telegram user',
        details: error.message
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
