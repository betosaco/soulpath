import { WebhookTelegramService } from './webhook-telegram-service';

export class TelegramProcessor {
  private telegramService: WebhookTelegramService;
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.telegramService = new WebhookTelegramService();
  }

  /**
   * Start processing messages and responses
   */
  startProcessing(intervalMs: number = 5000): void {
    if (this.isProcessing) {
      console.log('⚠️ Telegram processor is already running');
      return;
    }

    console.log('🚀 Starting Telegram processor...');
    this.isProcessing = true;

    this.processingInterval = setInterval(async () => {
      await this.processMessages();
      await this.processResponses();
    }, intervalMs);

    console.log(`✅ Telegram processor started (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop processing messages and responses
   */
  stopProcessing(): void {
    if (!this.isProcessing) {
      console.log('⚠️ Telegram processor is not running');
      return;
    }

    console.log('🛑 Stopping Telegram processor...');
    this.isProcessing = false;

    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    console.log('✅ Telegram processor stopped');
  }

  /**
   * Process pending messages
   */
  private async processMessages(): Promise<void> {
    try {
      const pendingMessages = await this.telegramService.getPendingMessages(10);
      
      if (pendingMessages.length === 0) {
        return;
      }

      console.log(`📨 Processing ${pendingMessages.length} pending messages`);

      for (const message of pendingMessages) {
        try {
          await this.processMessage(message);
          await this.telegramService.markMessageProcessed(message.id);
        } catch (error) {
          console.error(`❌ Error processing message ${message.id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error processing messages:', error);
    }
  }

  /**
   * Process a single message
   */
  private async processMessage(message: any): Promise<void> {
    console.log(`💬 Processing message: ${message.id}`);
    console.log(`📱 Chat ID: ${message.chatId}`);
    console.log(`📝 Text: ${message.messageText}`);

    // Here you can implement your message processing logic
    // For example:
    // 1. Analyze the message content
    // 2. Generate a response
    // 3. Store the response for sending

    // Example: Simple echo response
    if (message.messageText) {
      const responseText = `Echo: ${message.messageText}`;
      
      await this.telegramService.storeResponse({
        chatId: message.chatId,
        responseText: responseText,
        responseType: 'text',
        metadata: {
          originalMessageId: message.id,
          processedAt: new Date()
        }
      });

      console.log(`✅ Response generated for message ${message.id}`);
    }
  }

  /**
   * Process pending responses
   */
  private async processResponses(): Promise<void> {
    try {
      const pendingResponses = await this.telegramService.getPendingResponses(10);
      
      if (pendingResponses.length === 0) {
        return;
      }

      console.log(`📤 Processing ${pendingResponses.length} pending responses`);

      for (const response of pendingResponses) {
        try {
          await this.processResponse(response);
          await this.telegramService.markResponseSent(response.id);
        } catch (error) {
          console.error(`❌ Error processing response ${response.id}:`, error);
          await this.telegramService.markResponseFailed(response.id, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Error processing responses:', error);
    }
  }

  /**
   * Process a single response
   */
  private async processResponse(response: any): Promise<void> {
    console.log(`📤 Processing response: ${response.id}`);
    console.log(`📱 Chat ID: ${response.chatId}`);
    console.log(`📝 Text: ${response.responseText}`);

    // Here you can implement your response sending logic
    // For example:
    // 1. Send via external webhook service
    // 2. Send via third-party service (Zapier, IFTTT, etc.)
    // 3. Send via custom webhook endpoint

    // Example: Send via external webhook
    try {
      await this.sendResponseViaWebhook(response);
      console.log(`✅ Response sent via webhook: ${response.id}`);
    } catch (error) {
      console.error(`❌ Error sending response ${response.id}:`, error);
      throw error;
    }
  }

  /**
   * Send response via external webhook
   */
  private async sendResponseViaWebhook(response: any): Promise<void> {
    // This is where you would integrate with external services
    // For example:
    // 1. Send to Zapier webhook
    // 2. Send to IFTTT webhook
    // 3. Send to custom webhook endpoint
    // 4. Send to third-party service

    // Example: Send to a custom webhook endpoint
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_SEND_URL || 'https://your-webhook-service.com/send';
    
    const webhookData = {
      chatId: response.chatId,
      text: response.responseText,
      type: response.responseType,
      metadata: response.metadata
    };

    console.log(`🔗 Sending to webhook: ${webhookUrl}`);
    console.log(`📨 Webhook data:`, JSON.stringify(webhookData, null, 2));

    // In a real implementation, you would make the webhook call here
    // For now, we'll just simulate success
    console.log(`✅ Webhook call simulated for response ${response.id}`);
  }

  /**
   * Get processor status
   */
  getStatus(): any {
    return {
      isProcessing: this.isProcessing,
      hasInterval: this.processingInterval !== null
    };
  }

  /**
   * Clean up old data
   */
  async cleanup(): Promise<void> {
    try {
      console.log('🧹 Cleaning up old Telegram data...');
      const cleanedCount = await this.telegramService.cleanupOldMessages();
      console.log(`✅ Cleaned up ${cleanedCount} old messages`);
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}
