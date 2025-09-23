import { NextRequest, NextResponse } from 'next/server';
import { ConversationalOrchestrator } from '@/lib/services/conversational-orchestrator';
import { OrchestratorConfig, IntentActionMapping } from '@/lib/types/conversational-orchestrator';

// Configuración del orquestador
const orchestratorConfig: OrchestratorConfig = {
  rasa: {
    url: process.env.RASA_URL || 'http://localhost:5005',
    model: process.env.RASA_MODEL || 'rasa',
    confidence_threshold: parseFloat(process.env.RASA_CONFIDENCE_THRESHOLD || '0.7')
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-8b-instruct:free',
    temperature: parseFloat(process.env.OPENROUTER_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENROUTER_MAX_TOKENS || '1000')
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    webhookUrl: process.env.TWILIO_WEBHOOK_URL || ''
  },
  logging: {
    enabled: process.env.LOGGING_ENABLED !== 'false', // Enable by default unless explicitly disabled
    level: (process.env.LOGGING_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
    storage: (process.env.LOGGING_STORAGE as 'database' | 'file' | 'console') || 'database'
  },
  apis: {
    baseUrl: process.env.API_BASE_URL || `${process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`}/api`,
    timeout: parseInt(process.env.API_TIMEOUT || '10000'),
    retries: parseInt(process.env.API_RETRIES || '3')
  }
};

// Mapeo de intenciones a acciones
const intentActionMapping: IntentActionMapping = {
  'greet': {
    action: 'greet_user',
    apiEndpoint: undefined,
    description: undefined
  },
  'book_session': {
    action: 'book_session',
    apiEndpoint: '/bookings',
    description: 'Te ayudo a reservar una sesión. ¿Qué tipo de sesión te interesa?'
  },
  'ask_packages': {
    action: 'view_packages',
    apiEndpoint: '/packages',
    description: 'Aquí tienes nuestros paquetes disponibles:'
  },
  'show_packages': {
    action: 'view_packages',
    apiEndpoint: '/packages',
    description: 'Aquí tienes nuestros paquetes disponibles:'
  },
  'view_packages': {
    action: 'view_packages',
    apiEndpoint: '/packages',
    description: 'Aquí tienes nuestros paquetes disponibles:'
  },
  'check_balance': {
    action: 'check_balance',
    apiEndpoint: '/user/balance',
    description: 'Tu saldo actual es:'
  },
  'contact_support': {
    action: 'contact_support',
    apiEndpoint: undefined,
    description: 'Para contactar soporte, puedes escribirnos a support@soulpath.lat o usar nuestro chat en vivo.'
  },
  'goodbye': {
    action: 'goodbye',
    apiEndpoint: undefined,
    description: '¡Hasta luego! Que tengas un excelente día. 🙏'
  }
};

// Instancia del orquestador
let orchestrator: ConversationalOrchestrator | null = null;

function getTelegramOrchestrator(): ConversationalOrchestrator {
  if (!orchestrator) {
    orchestrator = new ConversationalOrchestrator(orchestratorConfig, intentActionMapping);
  }
  return orchestrator;
}

function getBaseUrl(): string {
  // In production, use the public base URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // In development, try to detect the actual port being used
  // Check if we're running on a different port
  let port = process.env.PORT || 3000;
  
  // If PORT is not set, try to detect from the request or use common ports
  if (!process.env.PORT) {
    // Use 3001 since we know that's what Next.js is using
    port = 3001;
  }
  
  // For server-side requests, we need to use localhost with the correct port
  const baseUrl = `http://localhost:${port}`;
  console.log(`🔧 Constructed base URL: ${baseUrl} (PORT: ${port}, process.env.PORT: ${process.env.PORT})`);
  return baseUrl;
}

export async function GET() {
  try {
    console.log('🔍 GET /api/telegram/webhook - Health check');
    return NextResponse.json({ 
      status: 'ok', 
      channel: 'telegram',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Telegram webhook GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📱 Telegram webhook received');
    
    const body = await request.json();
    console.log('📨 Telegram webhook body:', JSON.stringify(body, null, 2));

    // Verificar que es una actualización válida de Telegram
    if (!body.update_id) {
      console.log('⚠️ Invalid Telegram update - missing update_id');
      return NextResponse.json({ status: 'ok' });
    }

    const message = body.message;
    const callbackQuery = body.callback_query;

    if (message) {
      // Procesar mensaje de texto
      const chatId = message.chat?.id;
      const text = message.text;
      const userInfo = message.from;

      if (!chatId || !text) {
        console.log('⚠️ Invalid message - missing chat_id or text');
        return NextResponse.json({ status: 'ok' });
      }

      console.log(`💬 Processing message from ${userInfo?.first_name || 'Unknown'}: ${text}`);

      // Register or update Telegram user
      try {
        await registerTelegramUser({
          telegramChatId: chatId.toString(),
          telegramUserId: userInfo?.id?.toString(),
          telegramUsername: userInfo?.username,
          telegramFirstName: userInfo?.first_name,
          telegramLastName: userInfo?.last_name
        });
      } catch (registrationError) {
        console.error('Error registering Telegram user:', registrationError);
        // Continue with message processing even if registration fails
      }

      // Crear contexto de conversación
      const conversationContext = {
        userId: chatId.toString(),
        sessionId: `telegram_${chatId}_${message.chat?.id}`,
        conversationHistory: []
      };

      // Check for special commands first
      const lowerText = text.toLowerCase().trim();

      // Handle registration command
      if (lowerText === '/register' || lowerText === '/start register' || lowerText.startsWith('/link')) {
        await handleRegistrationCommand(chatId.toString(), userInfo);
        return NextResponse.json({ status: 'ok' });
      }

      // Check if this is a package request first (before trying orchestrator)
      const isPackageRequest = lowerText.includes('paquetes') || lowerText.includes('packages') ||
                              lowerText.includes('lista') || lowerText.includes('list') ||
                              lowerText.includes('mostrar') || lowerText.includes('show') ||
                              lowerText.includes('ver') || lowerText.includes('see') ||
                              lowerText.includes('dame') || lowerText.includes('give me') ||
                              lowerText.includes('precios') || lowerText.includes('prices') ||
                              lowerText.includes('precio') || lowerText.includes('price') ||
                              lowerText.includes('costo') || lowerText.includes('cost') ||
                              lowerText.includes('tarifa') || lowerText.includes('rates') ||
                              lowerText.includes('cuánto') || lowerText.includes('how much');

      console.log(`🔍 Text: "${text}" -> Lower: "${lowerText}" -> IsPackageRequest: ${isPackageRequest}`);

      let response;

      if (isPackageRequest) {
        console.log('🔄 Package request detected, using hybrid chat directly...');
        const baseUrl = getBaseUrl();
        console.log(`🔗 Using base URL: ${baseUrl}`);
        try {
          const hybridResponse = await fetch(`${baseUrl}/api/chat/hybrid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: text,
              userId: chatId.toString(),
              conversationHistory: []
            }),
          });

          if (hybridResponse.ok) {
            const hybridData = await hybridResponse.json();
            if (hybridData.success && hybridData.response) {
              response = {
                success: true,
                data: {
                  text: hybridData.response,
                  intent: 'package_request',
                  confidence: 0.9,
                  entities: []
                }
              };
            }
          }
        } catch (error) {
          console.error('❌ Hybrid chat failed:', error);
        }
      }

      // If not a package request or hybrid chat failed, try orchestrator
      if (!response) {
        const orchestrator = getTelegramOrchestrator();
        response = await orchestrator.processMessage(text, conversationContext);
      }

      // If orchestrator also failed, use hybrid chat as final fallback
      if (!response || !('success' in response) || !response.success || !response.data || !(response.data as Record<string, unknown>).text) {
        console.log('🔄 Orchestrator failed, trying hybrid chat fallback...');
        const baseUrl = getBaseUrl();
        console.log(`🔗 Using base URL for fallback: ${baseUrl}`);
        try {
          const hybridResponse = await fetch(`${baseUrl}/api/chat/hybrid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: text,
              userId: chatId.toString(),
              conversationHistory: []
            }),
          });

          if (hybridResponse.ok) {
            const hybridData = await hybridResponse.json();
            if (hybridData.success && hybridData.response) {
              response = {
                success: true,
                data: {
                  text: hybridData.response,
                  intent: 'hybrid_fallback',
                  confidence: 0.8,
                  entities: []
                }
              };
            }
          }
        } catch (error) {
          console.error('❌ Hybrid chat fallback failed:', error);
        }
      }

      // Enviar respuesta a Telegram
      if (response && 'success' in response && response.success && response.data && (response.data as Record<string, unknown>).text) {
        const responseText = (response.data as Record<string, unknown>).text as string;
        await sendTelegramMessage(chatId.toString(), responseText);
        console.log(`✅ Response sent to Telegram: ${responseText}`);
      } else {
        console.log('⚠️ No response text found:', response);
      }

    } else if (callbackQuery) {
      // Procesar callback query (botones)
      const chatId = callbackQuery.message?.chat?.id;
      const data = callbackQuery.data;
      const userInfo = callbackQuery.from;

      if (!chatId || !data) {
        console.log('⚠️ Invalid callback query - missing chat_id or data');
        return NextResponse.json({ status: 'ok' });
      }

      console.log(`🔘 Processing callback from ${userInfo?.first_name || 'Unknown'}: ${data}`);

      // Crear contexto de conversación para callback
      const conversationContext = {
        userId: chatId.toString(),
        sessionId: `telegram_${chatId}_${callbackQuery.message?.chat?.id}`,
        conversationHistory: []
      };

      // Procesar con el orquestador
      const orchestrator = getTelegramOrchestrator();
      const response = await orchestrator.processMessage(data, conversationContext);

      // Enviar respuesta a Telegram
      if (response && 'success' in response && response.success && response.data && (response.data as Record<string, unknown>).text) {
        const responseText = (response.data as Record<string, unknown>).text as string;
        await sendTelegramMessage(chatId.toString(), responseText);
        console.log(`✅ Callback response sent to Telegram: ${responseText}`);
      } else {
        console.log('⚠️ No callback response text found:', response);
      }

      // Responder al callback query para quitar el "loading" del botón
      await answerCallbackQuery(callbackQuery.id);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to send Telegram message: ${response.status} - ${errorText}`);
    } else {
      console.log(`✅ Telegram message sent successfully to ${chatId}`);
    }
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
  }
}

async function answerCallbackQuery(callbackQueryId: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
  const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to answer callback query: ${response.status} - ${errorText}`);
    } else {
      console.log(`✅ Callback query answered successfully`);
    }
  } catch (error) {
    console.error('❌ Error answering callback query:', error);
  }
}

async function registerTelegramUser(telegramData: {
  telegramChatId: string;
  telegramUserId?: string;
  telegramUsername?: string;
  telegramFirstName?: string;
  telegramLastName?: string;
}): Promise<void> {
  try {
    // First, try to find existing Telegram user by chat ID
    const existingTelegramUserResponse = await fetch(`${getBaseUrl()}/api/telegram/register-user?telegramChatId=${telegramData.telegramChatId}`);
    const existingTelegramUserData = await existingTelegramUserResponse.json();

    if (existingTelegramUserData.success && existingTelegramUserData.telegramUser) {
      // User already exists, update their last interaction
      console.log('📱 Telegram user already registered, updating last interaction');
      return; // No need to register again
    }

    // For new users, we need their system user ID. This would typically come from a login flow
    // For now, we'll create a placeholder registration that can be linked later
    // In a production system, users would need to authenticate first

    console.log('📱 New Telegram user detected, but no system user ID available yet');
    // You could send a message asking them to login/register first

  } catch (error) {
    console.error('❌ Error checking Telegram user registration:', error);
  }
}

async function handleRegistrationCommand(chatId: string, userInfo: { id: number; first_name?: string; last_name?: string; username?: string }): Promise<void> {
  try {
    const welcomeMessage = `
🤖 <b>Welcome to SoulPath Telegram Bot!</b>

Hello ${userInfo?.first_name || 'there'}! 👋

To receive order notifications and updates via Telegram, you need to link your account:

1. Log in to your SoulPath account at ${getBaseUrl().replace('/api/telegram/webhook', '')}
2. Go to your account settings
3. Look for "Telegram Notifications" or "Link Telegram"
4. Follow the instructions to connect your Telegram account

Once linked, you'll receive:
✅ Order confirmations
📦 Shipping updates
🔔 Status notifications
🎁 Special offers

If you don't have an account yet, please register first!

Questions? Reply to this message or contact support.
    `.trim();

    await sendTelegramMessage(chatId, welcomeMessage);
    console.log(`✅ Registration welcome message sent to ${chatId}`);

  } catch (error) {
    console.error('❌ Error handling registration command:', error);
  }
}
