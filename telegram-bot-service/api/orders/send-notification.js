import { TelegramBotService } from '../../services/telegram-bot-service.js';

const botService = new TelegramBotService();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderDetails, telegramChatId } = req.body;

    if (!orderDetails || !telegramChatId) {
      return res.status(400).json({
        success: false,
        error: 'Missing orderDetails or telegramChatId'
      });
    }

    await botService.sendOrderConfirmation(telegramChatId, orderDetails);

    res.status(200).json({
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
}
