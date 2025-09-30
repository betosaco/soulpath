import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

interface TeacherApplicationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Information
  yogaStyle: string;
  experienceYears: string;
  certifications: string;
  teachingLanguages: string[];
  availability: string;
  motivation: string;
  
  // Terms and Conditions
  agreeToTerms: boolean;
  agreeToDataProcessing: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const applicationData: TeacherApplicationData = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'yogaStyle', 'experienceYears', 'motivation'
    ];

    for (const field of requiredFields) {
      if (!applicationData[field as keyof TeacherApplicationData]) {
        return addCorsHeaders(NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        ));
      }
    }

    if (!applicationData.agreeToTerms || !applicationData.agreeToDataProcessing) {
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Terms and conditions must be accepted' },
        { status: 400 }
      ));
    }

    // Get Brevo configuration
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
    const emailContent = createEmailContent(applicationData);
    const confirmationContent = createConfirmationContent(applicationData);

    // Send notification email to admin
    const adminEmailResult = await sendBrevoEmail({
      apiKey: BREVO_API_KEY,
      to: [{ email: ADMIN_EMAIL, name: 'MatMax Admin' }],
      from: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
      subject: `New Teacher Application - ${applicationData.firstName} ${applicationData.lastName}`,
      htmlContent: emailContent,
      textContent: createTextContent(applicationData)
    });

    // Send confirmation email to applicant
    const confirmationResult = await sendBrevoEmail({
      apiKey: BREVO_API_KEY,
      to: [{ email: applicationData.email, name: `${applicationData.firstName} ${applicationData.lastName}` }],
      from: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
      subject: 'Thank you for your teacher application - MatMax Wellness',
      htmlContent: confirmationContent,
      textContent: createConfirmationTextContent(applicationData)
    });

    if (!adminEmailResult.success || !confirmationResult.success) {
      console.error('❌ Failed to send emails:', { adminEmailResult, confirmationResult });
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Failed to send application emails' },
        { status: 500 }
      ));
    }

    console.log('✅ Teacher application submitted successfully:', {
      applicant: `${applicationData.firstName} ${applicationData.lastName}`,
      email: applicationData.email,
      yogaStyle: applicationData.yogaStyle,
      experience: applicationData.experienceYears,
      emailsSent: {
        admin: ADMIN_EMAIL,
        applicant: applicationData.email
      }
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: 'Application submitted successfully'
    }));

  } catch (error) {
    console.error('❌ Error processing teacher application:', error);
    return addCorsHeaders(NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ));
  }
}

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

function createEmailContent(data: TeacherApplicationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Teacher Application</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
        .field { margin-bottom: 10px; }
        .field strong { color: #2c3e50; }
        .languages { display: flex; flex-wrap: wrap; gap: 5px; }
        .language-tag { background: #3498db; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .footer { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Teacher Application</h1>
          <p><strong>Applicant:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
        </div>

        <div class="section">
          <h3>Información Personal</h3>
          <div class="field"><strong>Nombre Completo:</strong> ${data.firstName} ${data.lastName}</div>
          <div class="field"><strong>Correo Electrónico:</strong> ${data.email}</div>
          <div class="field"><strong>Teléfono:</strong> ${data.phone}</div>
        </div>

        <div class="section">
          <h3>Información Profesional</h3>
          <div class="field"><strong>Estilo Principal de Yoga:</strong> ${data.yogaStyle}</div>
          <div class="field"><strong>Experiencia Enseñando:</strong> ${data.experienceYears}</div>
          <div class="field"><strong>Certificaciones:</strong> ${data.certifications || 'No proporcionado'}</div>
          <div class="field"><strong>Idiomas de Enseñanza:</strong></div>
          <div class="languages">
            ${data.teachingLanguages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
          </div>
          <div class="field"><strong>Disponibilidad:</strong> ${data.availability || 'No especificado'}</div>
        </div>

        <div class="section">
          <h3>Información Adicional</h3>
          <div class="field"><strong>Motivación:</strong></div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            ${data.motivation}
          </div>
        </div>

        <div class="footer">
          <p><strong>Solicitud enviada el:</strong> ${new Date().toLocaleString()}</p>
          <p>Por favor revisa esta solicitud y contacta al solicitante para programar una entrevista.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createTextContent(data: TeacherApplicationData): string {
  return `
Nueva Solicitud de Profesor

Solicitante: ${data.firstName} ${data.lastName}
Correo: ${data.email}
Teléfono: ${data.phone}

INFORMACIÓN PERSONAL:
- Nombre Completo: ${data.firstName} ${data.lastName}
- Correo Electrónico: ${data.email}
- Teléfono: ${data.phone}

INFORMACIÓN PROFESIONAL:
- Estilo Principal de Yoga: ${data.yogaStyle}
- Experiencia Enseñando: ${data.experienceYears}
- Certificaciones: ${data.certifications || 'No proporcionado'}
- Idiomas de Enseñanza: ${data.teachingLanguages.join(', ')}
- Disponibilidad: ${data.availability || 'No especificado'}

INFORMACIÓN ADICIONAL:
- Motivación: ${data.motivation}

Solicitud enviada el: ${new Date().toLocaleString()}
  `;
}

function createConfirmationContent(data: TeacherApplicationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Application Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .footer { text-align: center; color: #666; font-size: 14px; }
        .highlight { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Gracias por tu Solicitud!</h1>
          <p>Solicitud de Profesor MatMax Wellness</p>
        </div>

        <div class="content">
          <p>Estimado/a ${data.firstName},</p>
          
          <p>Gracias por tu interés en unirte al equipo de MatMax Wellness como profesor de yoga. Hemos recibido exitosamente tu solicitud y estamos emocionados de conocer más sobre tu pasión por enseñar.</p>

          <div class="highlight">
            <h3>Resumen de la Solicitud</h3>
            <p><strong>Nombre:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Estilo Principal:</strong> ${data.yogaStyle}</p>
            <p><strong>Experiencia:</strong> ${data.experienceYears}</p>
            <p><strong>Idiomas:</strong> ${data.teachingLanguages.join(', ')}</p>
          </div>

          <h3>¿Qué sigue ahora?</h3>
          <ul>
            <li>Nuestro equipo revisará tu solicitud cuidadosamente</li>
            <li>Te contactaremos dentro de 5-7 días hábiles</li>
            <li>Si eres seleccionado, programaremos una entrevista y posiblemente una demostración de enseñanza</li>
            <li>Discutiremos tu disponibilidad y preferencias de enseñanza</li>
          </ul>

          <p>Apreciamos tu paciencia durante nuestro proceso de revisión. Si tienes alguna pregunta mientras tanto, no dudes en contactarnos.</p>

          <p>Gracias nuevamente por considerar MatMax Wellness como tu hogar de enseñanza.</p>

          <p>Saludos cordiales,<br>
          El Equipo de MatMax Wellness</p>
        </div>

        <div class="footer">
          <p>MatMax Wellness | Estudio de Bienestar y Yoga</p>
          <p>Este correo fue enviado en respuesta a tu solicitud de profesor.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createConfirmationTextContent(data: TeacherApplicationData): string {
  return `
¡Gracias por tu Solicitud!

Estimado/a ${data.firstName},

Gracias por tu interés en unirte al equipo de MatMax Wellness como profesor de yoga. Hemos recibido exitosamente tu solicitud y estamos emocionados de conocer más sobre tu pasión por enseñar.

Resumen de la Solicitud:
- Nombre: ${data.firstName} ${data.lastName}
- Estilo Principal: ${data.yogaStyle}
- Experiencia: ${data.experienceYears}
- Idiomas: ${data.teachingLanguages.join(', ')}

¿Qué sigue ahora?
- Nuestro equipo revisará tu solicitud cuidadosamente
- Te contactaremos dentro de 5-7 días hábiles
- Si eres seleccionado, programaremos una entrevista y posiblemente una demostración de enseñanza
- Discutiremos tu disponibilidad y preferencias de enseñanza

Apreciamos tu paciencia durante nuestro proceso de revisión. Si tienes alguna pregunta mientras tanto, no dudes en contactarnos.

Gracias nuevamente por considerar MatMax Wellness como tu hogar de enseñanza.

Saludos cordiales,
El Equipo de MatMax Wellness

MatMax Wellness | Estudio de Bienestar y Yoga
Este correo fue enviado en respuesta a tu solicitud de profesor.
  `;
}
