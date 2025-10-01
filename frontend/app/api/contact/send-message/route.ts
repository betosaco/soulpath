import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  language: z.enum(['en', 'es']).default('en')
});

// CORS headers helper
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 }));
    }

    const { name, email, phone, message, language } = validation.data;

    // Get Brevo configuration (same as teacher application)
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@matmax.world';
    const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'MatMax Wellness';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'alberto@matmax.world';

    if (!BREVO_API_KEY) {
      console.error('❌ Brevo API key not configured');
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      ));
    }

    // Create email content
    const adminEmailContent = createAdminEmailContent(name, email, phone, message, language);
    const userEmailContent = createUserEmailContent(name, message, language);

    // Send notification email to admin (same as teacher application)
    const adminEmailResult = await sendBrevoEmail({
      apiKey: BREVO_API_KEY,
      to: [{ email: ADMIN_EMAIL, name: 'MatMax Admin' }],
      from: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
      subject: language === 'es' 
        ? `Nuevo mensaje de contacto de ${name} - MatMax Yoga`
        : `New contact message from ${name} - MatMax Yoga`,
      htmlContent: adminEmailContent,
      textContent: createAdminTextContent(name, email, phone, message, language)
    });

    // Send confirmation email to user
    const userEmailResult = await sendBrevoEmail({
      apiKey: BREVO_API_KEY,
      to: [{ email: email, name: name }],
      from: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
      subject: language === 'es' 
        ? 'Gracias por contactarnos - MatMax Yoga'
        : 'Thank you for contacting us - MatMax Yoga',
      htmlContent: userEmailContent,
      textContent: createUserTextContent(name, message, language)
    });

    if (!adminEmailResult.success || !userEmailResult.success) {
      console.error('❌ Failed to send contact emails:', { adminEmailResult, userEmailResult });
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Failed to send contact emails' },
        { status: 500 }
      ));
    }

    console.log('✅ Contact form submitted successfully:', {
      name: name,
      email: email,
      phone: phone || 'Not provided',
      emailsSent: {
        admin: ADMIN_EMAIL,
        user: email
      }
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: language === 'es' 
        ? 'Mensaje enviado exitosamente. Te contactaremos pronto.' 
        : 'Message sent successfully. We will contact you soon.'
    }));

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    return addCorsHeaders(NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ));
  }
}

// Brevo email sending function (same as teacher application)
async function sendBrevoEmail({
  apiKey,
  to,
  from,
  subject,
  htmlContent,
  textContent
}: {
  apiKey: string;
  to: Array<{ email: string; name: string }>;
  from: { email: string; name: string };
  subject: string;
  htmlContent: string;
  textContent: string;
}) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: from,
        to: to,
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Brevo API error:', result);
      return { success: false, error: result };
    }

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending Brevo email:', error);
    return { success: false, error: error };
  }
}

// Email content creation functions
function createAdminEmailContent(name: string, email: string, phone: string | undefined, message: string, language: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${language === 'es' ? 'Nuevo Mensaje de Contacto' : 'New Contact Message'}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6ea058, #8bc34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6ea058; }
        .value { margin-top: 5px; }
        .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #6ea058; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${language === 'es' ? 'Nuevo Mensaje de Contacto' : 'New Contact Message'}</h1>
        <p>MatMax Yoga Studio</p>
      </div>
      <div class="content">
        <div class="field">
          <div class="label">${language === 'es' ? 'Nombre:' : 'Name:'}</div>
          <div class="value">${name}</div>
        </div>
        <div class="field">
          <div class="label">${language === 'es' ? 'Email:' : 'Email:'}</div>
          <div class="value">${email}</div>
        </div>
        ${phone ? `
        <div class="field">
          <div class="label">${language === 'es' ? 'Teléfono:' : 'Phone:'}</div>
          <div class="value">${phone}</div>
        </div>
        ` : ''}
        <div class="field">
          <div class="label">${language === 'es' ? 'Mensaje:' : 'Message:'}</div>
          <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          ${language === 'es' 
            ? 'Este mensaje fue enviado desde el formulario de contacto de MatMax Yoga Studio.' 
            : 'This message was sent from the MatMax Yoga Studio contact form.'}
        </div>
      </div>
    </body>
    </html>
  `;
}

function createUserEmailContent(name: string, message: string, language: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${language === 'es' ? 'Gracias por contactarnos' : 'Thank you for contacting us'}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6ea058, #8bc34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .highlight { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #6ea058; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${language === 'es' ? '¡Gracias por contactarnos!' : 'Thank you for contacting us!'}</h1>
        <p>MatMax Yoga Studio</p>
      </div>
      <div class="content">
        <p>Hola ${name},</p>
        <p>${language === 'es' 
          ? 'Hemos recibido tu mensaje y te responderemos pronto. Mientras tanto, aquí tienes un resumen de lo que nos escribiste:' 
          : 'We have received your message and will respond soon. In the meantime, here is a summary of what you wrote to us:'}</p>
        
        <div class="highlight">
          <strong>${language === 'es' ? 'Tu mensaje:' : 'Your message:'}</strong><br>
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        <p>${language === 'es' 
          ? 'Te contactaremos en las próximas 24 horas. Si tienes alguna pregunta urgente, no dudes en llamarnos al +51 916 172 368.' 
          : 'We will contact you within the next 24 hours. If you have any urgent questions, feel free to call us at +51 916 172 368.'}</p>
        
        <p>${language === 'es' ? 'Saludos cordiales,' : 'Best regards,'}<br>
        <strong>El equipo de MatMax Yoga Studio</strong></p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p><strong>MatMax Yoga Studio</strong><br>
          Calle Alcanfores 425, Miraflores, Lima<br>
          +51 916 172 368 | info@matmax.world</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createAdminTextContent(name: string, email: string, phone: string | undefined, message: string, language: string): string {
  return `
${language === 'es' ? 'Nuevo Mensaje de Contacto' : 'New Contact Message'}
MatMax Yoga Studio

${language === 'es' ? 'Nombre:' : 'Name:'} ${name}
${language === 'es' ? 'Email:' : 'Email:'} ${email}
${phone ? `${language === 'es' ? 'Teléfono:' : 'Phone:'} ${phone}` : ''}

${language === 'es' ? 'Mensaje:' : 'Message:'}
${message}

---
${language === 'es' 
  ? 'Este mensaje fue enviado desde el formulario de contacto de MatMax Yoga Studio.' 
  : 'This message was sent from the MatMax Yoga Studio contact form.'}
  `;
}

function createUserTextContent(name: string, message: string, language: string): string {
  return `
${language === 'es' ? '¡Gracias por contactarnos!' : 'Thank you for contacting us!'}
MatMax Yoga Studio

Hola ${name},

${language === 'es' 
  ? 'Hemos recibido tu mensaje y te responderemos pronto. Mientras tanto, aquí tienes un resumen de lo que nos escribiste:' 
  : 'We have received your message and will respond soon. In the meantime, here is a summary of what you wrote to us:'}

${language === 'es' ? 'Tu mensaje:' : 'Your message:'}
${message}

${language === 'es' 
  ? 'Te contactaremos en las próximas 24 horas. Si tienes alguna pregunta urgente, no dudes en llamarnos al +51 916 172 368.' 
  : 'We will contact you within the next 24 hours. If you have any urgent questions, feel free to call us at +51 916 172 368.'}

${language === 'es' ? 'Saludos cordiales,' : 'Best regards,'}
El equipo de MatMax Yoga Studio

---
MatMax Yoga Studio
Calle Alcanfores 425, Miraflores, Lima
+51 916 172 368 | info@matmax.world
  `;
}