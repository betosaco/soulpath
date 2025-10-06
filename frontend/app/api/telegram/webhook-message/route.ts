import { NextRequest, NextResponse } from 'next/server';
import { WebhookTelegramService } from '@/lib/services/webhook-telegram-service';

const telegramService = new WebhookTelegramService();

export async function POST(request: NextRequest) {
  try {
    console.log('📱 Webhook Telegram Message received');
    
    const body = await request.json();
    console.log('📨 Webhook message body:', JSON.stringify(body, null, 2));

    // Extract message data
    const { chatId, userId, messageText, messageType, metadata } = body;

    if (!chatId) {
      console.log('⚠️ Invalid message - missing chatId');
      return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
    }

    // Store message in database
    const messageId = await telegramService.storeMessage({
      chatId,
      userId,
      messageText,
      messageType,
      metadata
    });

    console.log(`✅ Message stored with ID: ${messageId}`);

    return NextResponse.json({ 
      success: true, 
      messageId,
      status: 'stored'
    });

  } catch (error) {
    console.error('❌ Webhook message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('🔍 GET /api/telegram/webhook-message - Health check');
    
    // Get statistics
    const stats = await telegramService.getStatistics();
    
    return NextResponse.json({ 
      status: 'ok', 
      service: 'webhook-telegram-message',
      timestamp: new Date().toISOString(),
      statistics: stats
    });
  } catch (error) {
    console.error('❌ Webhook message GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
