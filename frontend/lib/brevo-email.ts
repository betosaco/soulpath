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

export async function sendTemplateEmail(
  templateKey: string,
  recipientEmail: string,
  data: Record<string, any>,
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

  return sendBrevoEmail({
    to: recipientEmail,
    subject,
    htmlContent,
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
