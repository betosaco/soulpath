/**
 * Brevo Email Service
 * 
 * This service handles email sending through Brevo API
 */

interface BrevoEmailOptions {
  to: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  apiKey: string;
  sender: {
    email: string;
    name: string;
  };
  replyTo?: {
    email: string;
    name: string;
  };
}

interface BrevoResponse {
  messageId: string;
}

export async function sendBrevoEmail(options: BrevoEmailOptions): Promise<BrevoResponse> {
  const { to, subject, htmlContent, textContent, apiKey, sender, replyTo } = options;

  const emailData = {
    sender: {
      email: sender.email,
      name: sender.name
    },
    to: Array.isArray(to) 
      ? to.map(email => ({ email, name: email }))
      : [{ email: to, name: to }],
    subject,
    htmlContent,
    textContent: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    replyTo: replyTo ? {
      email: replyTo.email,
      name: replyTo.name
    } : undefined
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return {
      messageId: result.messageId
    };

  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// Email theme tokens (inline-safe for email clients)
// ----------------------------------------------------------------------------

export type EmailTheme = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
};

export type EmailThemeKey = 'frontpage' | 'admin' | 'teacher' | 'client';

export function getFrontpageEmailTheme(): EmailTheme {
  return {
    background: '#f4eeed',
    surface: '#ffffff',
    textPrimary: '#383838',
    textSecondary: '#4a4a4a',
    border: '#e3d9d6',
    primary: '#6ea058',
    accent: '#f4a556',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };
}

export function getAdminEmailTheme(): EmailTheme {
  return {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    textPrimary: '#eaeaea',
    textSecondary: '#c0c0c0',
    border: '#3a3a3a',
    primary: '#ffd700',
    accent: '#1e90ff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };
}

export function getTeacherEmailTheme(): EmailTheme {
  return {
    background: '#f0f4f8',
    surface: '#ffffff',
    textPrimary: '#2c3e50',
    textSecondary: '#34495e',
    border: '#dbe4eb',
    primary: '#3498db',
    accent: '#2ecc71',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#e74c3c',
  };
}

export function getClientEmailTheme(): EmailTheme {
  return {
    background: '#f8fcf8',
    surface: '#ffffff',
    textPrimary: '#333333',
    textSecondary: '#555555',
    border: '#e0e0e0',
    primary: '#4CAF50',
    accent: '#FFC107',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#f44336',
  };
}

export function getEmailTheme(theme: EmailThemeKey = 'client'): EmailTheme {
  switch (theme) {
    case 'admin':
      return getAdminEmailTheme();
    case 'teacher':
      return getTeacherEmailTheme();
    case 'frontpage':
      return getFrontpageEmailTheme();
    case 'client':
    default:
      return getClientEmailTheme();
  }
}

export function renderEmailLayout(htmlContent: string, subject: string, theme: EmailTheme): string {
  const preheader = '';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>${subject}</title>
    <style>
      /* Ensure basic typography in clients */
      .btn-primary { background: ${theme.primary}; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block; font-weight: 600; }
      .badge { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
      .badge-accent { background: ${theme.accent}1F; color: ${theme.accent}; }
      .divider { border-top: 1px solid ${theme.border}; height: 1px; margin: 16px 0; }
      @media (prefers-color-scheme: dark) {
        /* Lighten surface in dark-capable clients */
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:${theme.background}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <span style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden">${preheader}</span>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="background:${theme.background};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px; width:100%; background:${theme.surface}; border:1px solid ${theme.border}; border-radius:12px; overflow:hidden;">
            <tr>
              <td style="background:${theme.primary}; padding:16px 20px; color:#ffffff; font-family:Arial, Helvetica, sans-serif;">
                <h1 style="margin:0; font-size:20px; line-height:1.4; font-weight:700;">${subject}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:20px; color:${theme.textPrimary}; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:1.6;">
                ${htmlContent}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px; color:${theme.textSecondary}; font-family:Arial, Helvetica, sans-serif; font-size:12px; border-top:1px solid ${theme.border};">
                <p style="margin:0;">MatMax Yoga Studio • Lima, Peru</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendTemplateEmail(
  templateKey: string,
  recipientEmail: string,
  data: Record<string, string | number | boolean>,
  config: {
    brevo_api_key: string;
    sender_email: string;
    sender_name: string;
    admin_email: string;
  }
): Promise<BrevoResponse> {
  // This would typically fetch the template from the database
  // For now, we'll use a simplified approach
  
  const templates: Record<string, { subject: string; htmlContent: string }> = {
    package_purchase_confirmation: {
      subject: '¡Gracias por tu compra! - MatMax Yoga Studio',
      htmlContent: `
        <h1>¡Gracias por tu compra!</h1>
        <p>Hola ${data.customer_name || 'Cliente'},</p>
        <p>Tu paquete ${data.package_name || 'N/A'} ha sido confirmado.</p>
        <p>Precio: S/. ${data.package_price || '0'}</p>
        <p>Fecha: ${data.purchase_date || new Date().toLocaleDateString()}</p>
      `
    },
    booking_confirmation: {
      subject: '¡Reserva Confirmada! - MatMax Yoga Studio',
      htmlContent: `
        <h1>¡Reserva Confirmada!</h1>
        <p>Hola ${data.customer_name || 'Cliente'},</p>
        <p>Tu clase de ${data.class_type || 'Yoga'} está confirmada.</p>
        <p>Fecha: ${data.class_date || 'N/A'}</p>
        <p>Hora: ${data.class_time || 'N/A'}</p>
        <p>Instructora: ${data.instructor_name || 'N/A'}</p>
      `
    },
    booking_reminder: {
      subject: 'Recordatorio: Tu clase de yoga es mañana - MatMax',
      htmlContent: `
        <h1>Recordatorio de Clase</h1>
        <p>Hola ${data.customer_name || 'Cliente'},</p>
        <p>No olvides tu clase de ${data.class_type || 'Yoga'} mañana.</p>
        <p>Fecha: ${data.class_date || 'N/A'}</p>
        <p>Hora: ${data.class_time || 'N/A'}</p>
      `
    }
  };

  const template = templates[templateKey];
  if (!template) {
    throw new Error(`Template ${templateKey} not found`);
  }

  // Replace placeholders in template
  let subject = template.subject;
  let htmlContent = template.htmlContent;

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
  });

  const theme = getFrontpageEmailTheme();
  const wrappedHtml = renderEmailLayout(htmlContent, subject, theme);

  return sendBrevoEmail({
    to: recipientEmail,
    subject,
    htmlContent: wrappedHtml,
    apiKey: config.brevo_api_key,
    sender: {
      email: config.sender_email,
      name: config.sender_name
    },
    replyTo: {
      email: config.admin_email,
      name: 'MatMax Support'
    }
  });
}
