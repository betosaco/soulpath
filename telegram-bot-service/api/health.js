export default async function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'matmax-telegram-bot',
    name: 'MatMax Telegram Bot',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: [
      'POST /api/telegram/webhook',
      'POST /api/telegram/register-user',
      'GET /api/telegram/register-user',
      'POST /api/orders/send-notification',
      'GET /api/health'
    ]
  });
}
