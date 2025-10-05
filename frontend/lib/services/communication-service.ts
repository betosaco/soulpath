import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

// Types for communication results
export interface CommunicationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
}

// Email sending interfaces
export interface EmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

// SMS sending interfaces
export interface SmsParams {
  to: string;
  message: string;
  from?: string;
}

// Telegram sending interfaces
export interface TelegramParams {
  chatId: string;
  message: string;
  parseMode?: 'Markdown' | 'HTML';
}

// WhatsApp sending interfaces
export interface WhatsAppParams {
  to: string;
  message: string;
  type?: 'text';
}

// Main Communication Service Class
export class CommunicationService {
  private config: any = null;

  constructor() {
    this.loadConfig();
  }

  /**
   * Load configuration from database
   */
  private async loadConfig() {
    try {
      // Get the first (and only) communication config record
      this.config = await prisma.communicationConfig.findFirst();

      // If no config exists, create a default one
      if (!this.config) {
        this.config = await prisma.communicationConfig.create({
          data: {
            email_enabled: true,
            email_provider: 'brevo',
            sms_enabled: false,
            sms_provider: 'labsmobile',
            telegram_enabled: false,
            whatsapp_enabled: false,
            instagram_enabled: false,
          }
        });
      }
    } catch (error) {
      console.error('Failed to load communication config:', error);
      // Use default config if database fails
      this.config = {
        email_enabled: false,
        sms_enabled: false,
        telegram_enabled: false,
        whatsapp_enabled: false,
        instagram_enabled: false,
      };
    }
  }

  /**
   * Ensure config is loaded
   */
  private async ensureConfig() {
    if (!this.config) {
      await this.loadConfig();
    }
  }

  /**
   * Send email using configured provider
   */
  async sendEmail(params: EmailParams): Promise<CommunicationResult> {
    await this.ensureConfig();

    if (!this.config.email_enabled) {
      return {
        success: false,
        error: 'Email is not enabled in configuration'
      };
    }

    try {
      switch (this.config.email_provider) {
        case 'brevo':
          return await this.sendBrevoEmail(params);
        case 'resend':
          return await this.sendResendEmail(params);
        default:
          return await this.sendBrevoEmail(params); // Default fallback
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error'
      };
    }
  }

  /**
   * Send SMS using configured provider
   */
  async sendSms(params: SmsParams): Promise<CommunicationResult> {
    await this.ensureConfig();

    if (!this.config.sms_enabled) {
      return {
        success: false,
        error: 'SMS is not enabled in configuration'
      };
    }

    try {
      switch (this.config.sms_provider) {
        case 'labsmobile':
          return await this.sendLabsMobileSms(params);
        default:
          return await this.sendLabsMobileSms(params); // Default fallback
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SMS error'
      };
    }
  }

  /**
   * Send Telegram message
   */
  async sendTelegramMessage(params: TelegramParams): Promise<CommunicationResult> {
    await this.ensureConfig();

    if (!this.config.telegram_enabled) {
      return {
        success: false,
        error: 'Telegram is not enabled in configuration'
      };
    }

    try {
      return await this.sendTelegramBotMessage(params);
    } catch (error) {
      console.error('Telegram sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Telegram error'
      };
    }
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsAppMessage(params: WhatsAppParams): Promise<CommunicationResult> {
    await this.ensureConfig();

    if (!this.config.whatsapp_enabled) {
      return {
        success: false,
        error: 'WhatsApp is not enabled in configuration'
      };
    }

    try {
      return await this.sendWhatsAppBusinessMessage(params);
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown WhatsApp error'
      };
    }
  }

  /**
   * Send email via Brevo (Sendinblue)
   */
  private async sendBrevoEmail(params: EmailParams): Promise<CommunicationResult> {
    const apiKey = this.config.brevo_api_key;
    if (!apiKey) {
      return { success: false, error: 'Brevo API key not configured' };
    }

    const recipients = Array.isArray(params.to) ? params.to : [params.to];

    const emailData = {
      sender: {
        name: this.config.sender_name || 'SOULPATH',
        email: this.config.sender_email || 'noreply@soulpath.lat'
      },
      to: recipients.map(email => ({ email })),
      subject: params.subject,
      htmlContent: params.html,
      textContent: params.text,
      replyTo: params.replyTo ? { email: params.replyTo } : undefined
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        messageId: result.messageId,
        provider: 'brevo'
      };
    } else {
      return {
        success: false,
        error: result.message || 'Brevo API error',
        provider: 'brevo'
      };
    }
  }

  /**
   * Send email via Resend
   */
  private async sendResendEmail(params: EmailParams): Promise<CommunicationResult> {
    const apiKey = this.config.resend_api_key;
    if (!apiKey) {
      return { success: false, error: 'Resend API key not configured' };
    }

    const resend = new Resend(apiKey);
    const recipients = Array.isArray(params.to) ? params.to : [params.to];

    const result = await resend.emails.send({
      from: params.from || `${this.config.sender_name || 'SOULPATH'} <${this.config.sender_email || 'noreply@soulpath.lat'}>`,
      to: recipients,
      subject: params.subject,
      html: params.html,
      text: params.text,
      reply_to: params.replyTo
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
        provider: 'resend'
      };
    } else {
      return {
        success: true,
        messageId: result.data?.id,
        provider: 'resend'
      };
    }
  }

  /**
   * Send SMS via LabsMobile
   */
  private async sendLabsMobileSms(params: SmsParams): Promise<CommunicationResult> {
    const username = this.config.labsmobile_username;
    const token = this.config.labsmobile_token;

    if (!username || !token) {
      return { success: false, error: 'LabsMobile credentials not configured' };
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', token);
    formData.append('msisdn', params.to);
    formData.append('message', params.message);
    formData.append('sender', params.from || this.config.sms_sender_name || 'SoulPath');

    const response = await fetch('https://api.labsmobile.com/get/send.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const result = await response.text();

    // LabsMobile returns a numeric code
    if (response.ok && result.startsWith('0')) {
      return {
        success: true,
        messageId: result,
        provider: 'labsmobile'
      };
    } else {
      return {
        success: false,
        error: `LabsMobile error: ${result}`,
        provider: 'labsmobile'
      };
    }
  }

  /**
   * Send Telegram message via Bot API
   */
  private async sendTelegramBotMessage(params: TelegramParams): Promise<CommunicationResult> {
    const botToken = this.config.telegram_bot_token;
    if (!botToken) {
      return { success: false, error: 'Telegram bot token not configured' };
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: params.chatId,
        text: params.message,
        parse_mode: params.parseMode
      })
    });

    const result = await response.json();

    if (response.ok && result.ok) {
      return {
        success: true,
        messageId: result.result.message_id.toString(),
        provider: 'telegram'
      };
    } else {
      return {
        success: false,
        error: result.description || 'Telegram API error',
        provider: 'telegram'
      };
    }
  }

  /**
   * Send WhatsApp message via Business API
   */
  private async sendWhatsAppBusinessMessage(params: WhatsAppParams): Promise<CommunicationResult> {
    const accessToken = this.config.whatsapp_access_token;
    const phoneNumberId = this.config.whatsapp_phone_number_id;

    if (!accessToken || !phoneNumberId) {
      return { success: false, error: 'WhatsApp credentials not configured' };
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: params.to,
        type: params.type || 'text',
        text: {
          body: params.message
        }
      })
    });

    const result = await response.json();

    if (response.ok && result.messages) {
      return {
        success: true,
        messageId: result.messages[0].id,
        provider: 'whatsapp'
      };
    } else {
      return {
        success: false,
        error: result.error?.message || 'WhatsApp API error',
        provider: 'whatsapp'
      };
    }
  }

  /**
   * Get current configuration
   */
  async getConfig() {
    await this.ensureConfig();
    return this.config;
  }

  /**
   * Test connection for a specific provider
   */
  async testConnection(provider: string): Promise<{ success: boolean; message: string }> {
    await this.ensureConfig();

    switch (provider) {
      case 'email':
        if (!this.config.email_enabled) {
          return { success: false, message: 'Email is not enabled' };
        }
        return await this.testEmailConnection();

      case 'sms':
        if (!this.config.sms_enabled) {
          return { success: false, message: 'SMS is not enabled' };
        }
        return await this.testSmsConnection();

      case 'telegram':
        if (!this.config.telegram_enabled) {
          return { success: false, message: 'Telegram is not enabled' };
        }
        return await this.testTelegramConnection();

      case 'whatsapp':
        if (!this.config.whatsapp_enabled) {
          return { success: false, message: 'WhatsApp is not enabled' };
        }
        return await this.testWhatsAppConnection();

      default:
        return { success: false, message: 'Unknown provider' };
    }
  }

  private async testEmailConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Send a simple test email
      const result = await this.sendEmail({
        to: this.config.admin_email || 'test@example.com',
        subject: 'Communication Service Test',
        html: '<p>This is a test email from the Communication Service.</p>',
        text: 'This is a test email from the Communication Service.'
      });

      if (result.success) {
        return { success: true, message: `Test email sent successfully via ${result.provider}` };
      } else {
        return { success: false, message: `Failed to send test email: ${result.error}` };
      }
    } catch (error) {
      return { success: false, message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async testSmsConnection(): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'SMS testing not implemented yet' };
  }

  private async testTelegramConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const botToken = this.config.telegram_bot_token;
      if (!botToken) {
        return { success: false, message: 'Bot token not configured' };
      }

      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const result = await response.json();

      if (response.ok && result.ok) {
        return { success: true, message: `Connected to bot: @${result.result.username}` };
      } else {
        return { success: false, message: `Telegram API error: ${result.description}` };
      }
    } catch (error) {
      return { success: false, message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async testWhatsAppConnection(): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'WhatsApp testing not implemented yet' };
  }
}

// Export singleton instance
export const communicationService = new CommunicationService();

// Export types
export type { EmailParams, SmsParams, TelegramParams, WhatsAppParams, CommunicationResult };
