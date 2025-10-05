import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { CommunicationService } from '@/lib/services/communication-service';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { provider, type, apiKey, apiSecret, username, token, phoneNumberId, businessAccountId } = await request.json();

    if (!provider || !type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters',
        message: 'Provider and type are required'
      }, { status: 400 });
    }

    let result = { success: false, error: 'Unknown validation type' };

    try {
      switch (type) {
        case 'email':
          if (provider === 'brevo' && apiKey) {
            // Test Brevo API key
            result = await testBrevoAPI(apiKey);
          } else if (provider === 'resend' && apiKey) {
            // Test Resend API key
            result = await testResendAPI(apiKey);
          } else {
            result = { success: false, error: 'Invalid email provider or missing API key' };
          }
          break;

        case 'sms':
          if (provider === 'labsmobile' && username && token) {
            // Test LabsMobile credentials
            result = await testLabsMobileAPI(username, token);
          } else {
            result = { success: false, error: 'Invalid SMS provider or missing credentials' };
          }
          break;

        case 'telegram':
          if (apiKey) {
            // Test Telegram bot token
            result = await testTelegramBot(apiKey);
          } else {
            result = { success: false, error: 'Missing Telegram bot token' };
          }
          break;

        case 'whatsapp':
          if (apiKey && phoneNumberId) {
            // Test WhatsApp API
            result = await testWhatsAppAPI(apiKey, phoneNumberId);
          } else {
            result = { success: false, error: 'Missing WhatsApp credentials' };
          }
          break;

        case 'instagram':
          if (apiKey && businessAccountId) {
            // Test Instagram API
            result = await testInstagramAPI(apiKey, businessAccountId);
          } else {
            result = { success: false, error: 'Missing Instagram credentials' };
          }
          break;

        default:
          result = { success: false, error: 'Unsupported validation type' };
      }
    } catch (error) {
      console.error(`Error validating ${type} API:`, error);
      result = {
        success: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      };
    }

    return NextResponse.json({
      success: result.success,
      error: result.error,
      message: result.success ? 'API validated successfully' : 'API validation failed'
    });

  } catch (error) {
    console.error('Error in validation endpoint:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions for API validation
async function testBrevoAPI(apiKey: string) {
  try {
    const response = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, account: data };
    } else {
      const error = await response.text();
      return { success: false, error: `Brevo API error: ${response.status} - ${error}` };
    }
  } catch (error) {
    return { success: false, error: `Brevo API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

async function testResendAPI(apiKey: string) {
  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: `Resend API error: ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: `Resend API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

async function testLabsMobileAPI(username: string, token: string) {
  try {
    const response = await fetch(`https://api.labsmobile.com/json/balance?username=${username}&password=${token}`);

    if (response.ok) {
      const data = await response.json();
      if (data.error) {
        return { success: false, error: `LabsMobile error: ${data.error}` };
      }
      return { success: true, balance: data };
    } else {
      return { success: false, error: `LabsMobile API error: ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: `LabsMobile API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

async function testTelegramBot(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);

    if (response.ok) {
      const data = await response.json();
      if (data.ok) {
        return { success: true, bot: data.result };
      } else {
        return { success: false, error: `Telegram API error: ${data.description}` };
      }
    } else {
      return { success: false, error: `Telegram API error: ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: `Telegram API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

async function testWhatsAppAPI(accessToken: string, phoneNumberId: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, phoneNumber: data };
    } else {
      const error = await response.json();
      return { success: false, error: `WhatsApp API error: ${error.error?.message || response.status}` };
    }
  } catch (error) {
    return { success: false, error: `WhatsApp API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

async function testInstagramAPI(accessToken: string, businessAccountId: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${businessAccountId}?fields=id,username&access_token=${accessToken}`);

    if (response.ok) {
      const data = await response.json();
      return { success: true, account: data };
    } else {
      const error = await response.json();
      return { success: false, error: `Instagram API error: ${error.error?.message || response.status}` };
    }
  } catch (error) {
    return { success: false, error: `Instagram API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
