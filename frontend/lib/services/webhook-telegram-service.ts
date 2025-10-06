import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TelegramMessageData {
  chatId: string;
  userId?: string;
  messageText?: string;
  messageType?: string;
  metadata?: any;
}

export interface TelegramResponseData {
  chatId: string;
  responseText: string;
  responseType?: string;
  metadata?: any;
}

export class WebhookTelegramService {
  /**
   * Store incoming Telegram message in database
   */
  async storeMessage(data: TelegramMessageData): Promise<string> {
    try {
      const message = await prisma.telegramMessage.create({
        data: {
          chatId: data.chatId,
          userId: data.userId,
          messageText: data.messageText,
          messageType: data.messageType || 'text',
          metadata: data.metadata,
          status: 'pending'
        }
      });

      console.log(`✅ Telegram message stored: ${message.id}`);
      return message.id;
    } catch (error) {
      console.error('❌ Error storing Telegram message:', error);
      throw error;
    }
  }

  /**
   * Store outgoing Telegram response in database
   */
  async storeResponse(data: TelegramResponseData): Promise<string> {
    try {
      const response = await prisma.telegramResponse.create({
        data: {
          chatId: data.chatId,
          responseText: data.responseText,
          responseType: data.responseType || 'text',
          metadata: data.metadata,
          status: 'pending'
        }
      });

      console.log(`✅ Telegram response stored: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error('❌ Error storing Telegram response:', error);
      throw error;
    }
  }

  /**
   * Get pending messages for processing
   */
  async getPendingMessages(limit: number = 10): Promise<any[]> {
    try {
      const messages = await prisma.telegramMessage.findMany({
        where: {
          status: 'pending'
        },
        orderBy: {
          receivedAt: 'asc'
        },
        take: limit
      });

      return messages;
    } catch (error) {
      console.error('❌ Error getting pending messages:', error);
      throw error;
    }
  }

  /**
   * Get pending responses for sending
   */
  async getPendingResponses(limit: number = 10): Promise<any[]> {
    try {
      const responses = await prisma.telegramResponse.findMany({
        where: {
          status: 'pending'
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: limit
      });

      return responses;
    } catch (error) {
      console.error('❌ Error getting pending responses:', error);
      throw error;
    }
  }

  /**
   * Mark message as processed
   */
  async markMessageProcessed(messageId: string): Promise<void> {
    try {
      await prisma.telegramMessage.update({
        where: { id: messageId },
        data: {
          status: 'processed',
          processedAt: new Date()
        }
      });

      console.log(`✅ Message marked as processed: ${messageId}`);
    } catch (error) {
      console.error('❌ Error marking message as processed:', error);
      throw error;
    }
  }

  /**
   * Mark response as sent
   */
  async markResponseSent(responseId: string): Promise<void> {
    try {
      await prisma.telegramResponse.update({
        where: { id: responseId },
        data: {
          status: 'sent',
          sentAt: new Date()
        }
      });

      console.log(`✅ Response marked as sent: ${responseId}`);
    } catch (error) {
      console.error('❌ Error marking response as sent:', error);
      throw error;
    }
  }

  /**
   * Mark response as failed
   */
  async markResponseFailed(responseId: string, error: string): Promise<void> {
    try {
      await prisma.telegramResponse.update({
        where: { id: responseId },
        data: {
          status: 'failed',
          metadata: {
            error: error,
            failedAt: new Date()
          }
        }
      });

      console.log(`❌ Response marked as failed: ${responseId}`);
    } catch (err) {
      console.error('❌ Error marking response as failed:', err);
      throw err;
    }
  }

  /**
   * Get message history for a chat
   */
  async getChatHistory(chatId: string, limit: number = 50): Promise<any[]> {
    try {
      const messages = await prisma.telegramMessage.findMany({
        where: {
          chatId: chatId
        },
        orderBy: {
          receivedAt: 'desc'
        },
        take: limit
      });

      return messages;
    } catch (error) {
      console.error('❌ Error getting chat history:', error);
      throw error;
    }
  }

  /**
   * Get response history for a chat
   */
  async getResponseHistory(chatId: string, limit: number = 50): Promise<any[]> {
    try {
      const responses = await prisma.telegramResponse.findMany({
        where: {
          chatId: chatId
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });

      return responses;
    } catch (error) {
      console.error('❌ Error getting response history:', error);
      throw error;
    }
  }

  /**
   * Clean up old messages (older than 30 days)
   */
  async cleanupOldMessages(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await prisma.telegramMessage.deleteMany({
        where: {
          receivedAt: {
            lt: thirtyDaysAgo
          },
          status: 'processed'
        }
      });

      console.log(`🧹 Cleaned up ${result.count} old messages`);
      return result.count;
    } catch (error) {
      console.error('❌ Error cleaning up old messages:', error);
      throw error;
    }
  }

  /**
   * Get statistics for monitoring
   */
  async getStatistics(): Promise<any> {
    try {
      const [
        totalMessages,
        pendingMessages,
        processedMessages,
        totalResponses,
        pendingResponses,
        sentResponses,
        failedResponses
      ] = await Promise.all([
        prisma.telegramMessage.count(),
        prisma.telegramMessage.count({ where: { status: 'pending' } }),
        prisma.telegramMessage.count({ where: { status: 'processed' } }),
        prisma.telegramResponse.count(),
        prisma.telegramResponse.count({ where: { status: 'pending' } }),
        prisma.telegramResponse.count({ where: { status: 'sent' } }),
        prisma.telegramResponse.count({ where: { status: 'failed' } })
      ]);

      return {
        messages: {
          total: totalMessages,
          pending: pendingMessages,
          processed: processedMessages
        },
        responses: {
          total: totalResponses,
          pending: pendingResponses,
          sent: sentResponses,
          failed: failedResponses
        }
      };
    } catch (error) {
      console.error('❌ Error getting statistics:', error);
      throw error;
    }
  }
}
