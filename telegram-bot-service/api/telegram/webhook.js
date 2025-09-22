import { TelegramBotService } from '../../services/telegram-bot-service.js';

const botService = new TelegramBotService();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📱 Telegram webhook received');
    console.log('📨 Body:', JSON.stringify(req.body, null, 2));

    // Verify this is a valid Telegram update
    if (!req.body.update_id) {
      console.log('⚠️ Invalid Telegram update - missing update_id');
      return res.status(200).json({ status: 'ok' });
    }

    const message = req.body.message;
    const callbackQuery = req.body.callback_query;

    if (message) {
      await botService.handleMessage(message);
    } else if (callbackQuery) {
      await botService.handleCallbackQuery(callbackQuery);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
