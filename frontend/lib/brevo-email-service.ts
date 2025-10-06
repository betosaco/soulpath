/**
 * Brevo Email Service Wrapper
 *
 * Provides a unified interface for email services used throughout the application.
 */

import { sendBrevoEmail } from './brevo-email';

export interface EmailServiceOptions {
  to: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: {
    email: string;
    name: string;
  };
  replyTo?: {
    email: string;
    name: string;
  };
}

export interface EmailService {
  sendEmail: (options: EmailServiceOptions) => Promise<{ messageId: string }>;
  sendTemplateEmail: (templateKey: string, to: string | string[], data: Record<string, any>) => Promise<{ messageId: string }>;
}

export function createEmailService(apiKey?: string): EmailService {
  const defaultApiKey = apiKey || process.env.BREVO_API_KEY;
  const defaultSender = {
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@matmax.com',
    name: process.env.BREVO_SENDER_NAME || 'MatMax',
  };

  if (!defaultApiKey) {
    throw new Error('Brevo API key is required');
  }

  return {
    sendEmail: async (options: EmailServiceOptions) => {
      const sender = options.sender || defaultSender;

      return await sendBrevoEmail({
        ...options,
        apiKey: defaultApiKey,
        sender,
      });
    },

    sendTemplateEmail: async (templateKey: string, to: string | string[], data: Record<string, any>) => {
      // This would use the template functionality from brevo-email.ts
      // For now, return a placeholder
      console.warn('sendTemplateEmail not fully implemented, using placeholder');
      return { messageId: `template-${Date.now()}` };
    },
  };
}

// Default instance
export const emailService = createEmailService();
