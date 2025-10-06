import { NextRequest, NextResponse } from 'next/server';
import { WebhookTelegramService } from '@/lib/services/webhook-telegram-service';

const telegramService = new WebhookTelegramService();

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Webhook Telegram Response received');
    
    const body = await request.json();
    console.log('📨 Webhook response body:', JSON.stringify(body, null, 2));

    // Extract response data
    const { chatId, responseText, responseType, metadata } = body;

    if (!chatId || !responseText) {
      console.log('⚠️ Invalid response - missing chatId or responseText');
      return NextResponse.json({ error: 'Missing chatId or responseText' }, { status: 400 });
    }

    // Store response in database
    const responseId = await telegramService.storeResponse({
      chatId,
      responseText,
      responseType,
      metadata
    });

    console.log(`✅ Response stored with ID: ${responseId}`);

    return NextResponse.json({ 
      success: true, 
      responseId,
      status: 'stored'
    });

  } catch (error) {
    console.error('❌ Webhook response error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('🔍 GET /api/telegram/webhook-response - Health check');
    
    // Get pending responses
    const pendingResponses = await telegramService.getPendingResponses(10);
    
    return NextResponse.json({ 
      status: 'ok', 
      service: 'webhook-telegram-response',
      timestamp: new Date().toISOString(),
      pendingResponses: pendingResponses.length
    });
  } catch (error) {
    console.error('❌ Webhook response GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
