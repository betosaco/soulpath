import { NextRequest, NextResponse } from 'next/server';
import { createEmailService } from '@/lib/brevo-email-service';
import { z } from 'zod';

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  language: z.enum(['en', 'es']).default('en')
});


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { name, email, phone, message, language } = validation.data;

    // Create email service
    const emailService = await createEmailService();
    if (!emailService) {
      return NextResponse.json({
        success: false,
        error: 'Email service not configured'
      }, { status: 500 });
    }

    // Create admin notification email
    const adminSubject = language === 'es' 
      ? `Nuevo mensaje de contacto de ${name} - MatMax Yoga`
      : `New contact message from ${name} - MatMax Yoga`;

    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${adminSubject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #6ea058, #558b2f); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #6ea058; margin-bottom: 5px; }
          .value { background: #f8f9fa; padding: 10px; border-radius: 5px; border-left: 4px solid #6ea058; }
          .message-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #6ea058; margin-top: 20px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${language === 'es' ? 'Nuevo Mensaje de Contacto' : 'New Contact Message'}</h1>
            <p>${language === 'es' ? 'MatMax Yoga Studio' : 'MatMax Yoga Studio'}</p>
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
            <div class="message-box">
              <div class="label">${language === 'es' ? 'Mensaje:' : 'Message:'}</div>
              <div style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
            </div>
            <div style="margin-top: 30px; padding: 20px; background: #e8f5e8; border-radius: 8px; text-align: center;">
              <p><strong>${language === 'es' ? 'Responder a:' : 'Reply to:'}</strong> ${email}</p>
            </div>
          </div>
          <div class="footer">
            <p>${language === 'es' ? 'Este mensaje fue enviado desde el formulario de contacto de MatMax Yoga Studio.' : 'This message was sent from the MatMax Yoga Studio contact form.'}</p>
            <p>${language === 'es' ? 'Fecha:' : 'Date:'} ${new Date().toLocaleString(language === 'es' ? 'es-PE' : 'en-US', { timeZone: 'America/Lima' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create user confirmation email
    const userSubject = language === 'es' 
      ? `Gracias por contactarnos - MatMax Yoga Studio`
      : `Thank you for contacting us - MatMax Yoga Studio`;

    const userHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${userSubject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #6ea058, #558b2f); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .welcome { font-size: 24px; font-weight: bold; color: #6ea058; margin-bottom: 20px; }
          .message { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #6ea058; margin: 20px 0; }
          .contact-info { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .cta-button { display: inline-block; background: #6ea058; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${language === 'es' ? 'MatMax Yoga Studio' : 'MatMax Yoga Studio'}</h1>
            <p>${language === 'es' ? 'Tu santuario para el bienestar' : 'Your sanctuary for wellness'}</p>
          </div>
          <div class="content">
            <div class="welcome">
              ${language === 'es' ? `¡Hola ${name}!` : `Hello ${name}!`}
            </div>
            <div class="message">
              <p>${language === 'es' 
                ? 'Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.' 
                : 'Thank you for contacting us. We have received your message and will get back to you soon.'}
              </p>
              <p>${language === 'es' 
                ? 'Mientras tanto, te invitamos a explorar nuestros paquetes de yoga y reservar tu primera sesión.' 
                : 'In the meantime, we invite you to explore our yoga packages and book your first session.'}
              </p>
            </div>
            <div class="contact-info">
              <h3>${language === 'es' ? 'Información de Contacto:' : 'Contact Information:'}</h3>
              <p><strong>${language === 'es' ? 'Ubicación:' : 'Location:'}</strong> Calle Alcanfores 425, Miraflores, Lima - Peru</p>
              <p><strong>${language === 'es' ? 'Teléfono:' : 'Phone:'}</strong> +51 916 172 368</p>
              <p><strong>${language === 'es' ? 'Email:' : 'Email:'}</strong> info@matmax.world</p>
            </div>
            <div style="text-align: center;">
              <a href="https://matmax.world" class="cta-button">
                ${language === 'es' ? 'Visitar Nuestro Sitio' : 'Visit Our Website'}
              </a>
            </div>
          </div>
          <div class="footer">
            <p>${language === 'es' ? 'Este es un mensaje automático. Por favor no respondas a este email.' : 'This is an automated message. Please do not reply to this email.'}</p>
            <p>© 2024 MatMax Yoga Studio. ${language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails
    const adminEmailSent = await emailService.sendEmail({
      to: 'info@matmax.store',
      subject: adminSubject,
      html: adminHtml
    });

    const userEmailSent = await emailService.sendEmail({
      to: email,
      subject: userSubject,
      html: userHtml
    });

    if (!adminEmailSent || !userEmailSent) {
      return NextResponse.json({
        success: false,
        error: 'Failed to send emails'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: language === 'es' 
        ? 'Mensaje enviado exitosamente. Te contactaremos pronto.' 
        : 'Message sent successfully. We will contact you soon.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
