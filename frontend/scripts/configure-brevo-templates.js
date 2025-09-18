#!/usr/bin/env node

/**
 * Configure Brevo Email Templates Script
 * 
 * This script configures Brevo email templates for MatMax booking system
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function configureBrevoTemplates() {
  console.log('📧 Configuring Brevo Email Templates\n');
  console.log('===================================\n');

  try {
    // Update communication configuration with Brevo settings
    console.log('🔧 Updating communication configuration...');
    const commConfig = await prisma.communicationConfig.upsert({
      where: { id: 1 },
      update: {
        email_enabled: true,
        brevo_api_key: process.env.BREVO_API_KEY || 'your-brevo-api-key',
        sender_email: 'noreply@matmax.store',
        sender_name: 'MatMax Yoga Studio',
        admin_email: 'admin@matmax.store'
      },
      create: {
        email_enabled: true,
        brevo_api_key: process.env.BREVO_API_KEY || 'your-brevo-api-key',
        sender_email: 'noreply@matmax.store',
        sender_name: 'MatMax Yoga Studio',
        admin_email: 'admin@matmax.store'
      }
    });

    console.log('✅ Communication configuration updated');

    // Create email templates for different scenarios
    const templates = [
      {
        templateKey: 'package_purchase_confirmation',
        name: 'Confirmación de Compra de Paquete',
        description: 'Email enviado cuando un cliente compra un paquete de yoga',
        type: 'email',
        category: 'purchase',
        translations: [
          {
            language: 'es',
            subject: '¡Gracias por tu compra! - MatMax Yoga Studio',
            content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Compra - MatMax</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4A90E2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .package-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .button { background: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MatMax Yoga Studio</h1>
            <h2>¡Compra Confirmada!</h2>
        </div>
        
        <div class="content">
            <p>Hola <strong>{{customer_name}}</strong>,</p>
            
            <p>¡Gracias por tu compra en MatMax Yoga Studio! Tu paquete ha sido confirmado exitosamente.</p>
            
            <div class="package-info">
                <h3>📦 Detalles de tu Paquete</h3>
                <p><strong>Paquete:</strong> {{package_name}}</p>
                <p><strong>Sesiones:</strong> {{sessions_count}} sesiones de {{session_duration}} minutos</p>
                <p><strong>Precio:</strong> S/. {{package_price}}</p>
                <p><strong>Fecha de compra:</strong> {{purchase_date}}</p>
                <p><strong>Válido hasta:</strong> {{expiry_date}}</p>
            </div>
            
            <p>Ahora puedes reservar tus clases en nuestro horario disponible:</p>
            <ul>
                <li>Lunes: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha</li>
                <li>Martes: 17:30 Hatha, 18:45 Vinyasa</li>
                <li>Miércoles: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha</li>
                <li>Jueves: 17:30 Hatha, 18:45 Vinyasa</li>
                <li>Viernes: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha</li>
                <li>Sábado: 08:15 Hatha, 09:30 Vinyasa</li>
            </ul>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{booking_url}}" class="button">Reservar mi Primera Clase</a>
            </p>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
            <ul>
                <li>📧 Email: info@matmax.store</li>
                <li>📱 WhatsApp: +51 999 999 999</li>
                <li>🌐 Web: {{website_url}}</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>¡Namaste! 🙏</p>
            <p><strong>MatMax Yoga Studio</strong><br>
            Tu espacio de bienestar y transformación</p>
        </div>
    </div>
</body>
</html>`,
        textContent: `
¡Gracias por tu compra! - MatMax Yoga Studio

Hola {{customer_name}},

¡Gracias por tu compra en MatMax Yoga Studio! Tu paquete ha sido confirmado exitosamente.

DETALLES DE TU PAQUETE:
- Paquete: {{package_name}}
- Sesiones: {{sessions_count}} sesiones de {{session_duration}} minutos
- Precio: S/. {{package_price}}
- Fecha de compra: {{purchase_date}}
- Válido hasta: {{expiry_date}}

HORARIOS DISPONIBLES:
- Lunes: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
- Martes: 17:30 Hatha, 18:45 Vinyasa
- Miércoles: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
- Jueves: 17:30 Hatha, 18:45 Vinyasa
- Viernes: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
- Sábado: 08:15 Hatha, 09:30 Vinyasa

Reserva tu primera clase: {{booking_url}}

Contacto:
- Email: info@matmax.store
- WhatsApp: +51 999 999 999
- Web: {{website_url}}

¡Namaste!
MatMax Yoga Studio
        `,
        placeholders: [
          'customer_name',
          'package_name', 
          'sessions_count',
          'session_duration',
          'package_price',
          'purchase_date',
          'expiry_date',
          'booking_url',
          'website_url'
        ],
        isActive: true
      },
      {
        name: 'booking_confirmation',
        subject: '¡Reserva Confirmada! - MatMax Yoga Studio',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Reserva - MatMax</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4A90E2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .button { background: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MatMax Yoga Studio</h1>
            <h2>¡Reserva Confirmada!</h2>
        </div>
        
        <div class="content">
            <p>Hola <strong>{{customer_name}}</strong>,</p>
            
            <p>¡Tu reserva ha sido confirmada exitosamente! Te esperamos en MatMax Yoga Studio.</p>
            
            <div class="booking-info">
                <h3>📅 Detalles de tu Clase</h3>
                <p><strong>Fecha:</strong> {{class_date}}</p>
                <p><strong>Hora:</strong> {{class_time}}</p>
                <p><strong>Tipo de Clase:</strong> {{class_type}}</p>
                <p><strong>Instructora:</strong> {{instructor_name}}</p>
                <p><strong>Duración:</strong> {{class_duration}} minutos</p>
                <p><strong>Ubicación:</strong> {{venue_address}}</p>
                <p><strong>Número de Reserva:</strong> {{booking_reference}}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h4>📋 Instrucciones Importantes:</h4>
                <ul>
                    <li>Llega 10 minutos antes de tu clase</li>
                    <li>Trae tu propia colchoneta de yoga</li>
                    <li>Usa ropa cómoda y flexible</li>
                    <li>Evita comer 2 horas antes de la clase</li>
                    <li>Mantén tu teléfono en silencio</li>
                </ul>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{booking_url}}" class="button">Ver Mis Reservas</a>
            </p>
            
            <p><strong>¿Necesitas cancelar o reprogramar?</strong><br>
            Puedes hacerlo hasta 2 horas antes de tu clase desde tu cuenta o contactándonos.</p>
            
            <p>Contacto:</p>
            <ul>
                <li>📧 Email: info@matmax.store</li>
                <li>📱 WhatsApp: +51 999 999 999</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>¡Te esperamos pronto! 🙏</p>
            <p><strong>MatMax Yoga Studio</strong></p>
        </div>
    </div>
</body>
</html>`,
        textContent: `
¡Reserva Confirmada! - MatMax Yoga Studio

Hola {{customer_name}},

¡Tu reserva ha sido confirmada exitosamente! Te esperamos en MatMax Yoga Studio.

DETALLES DE TU CLASE:
- Fecha: {{class_date}}
- Hora: {{class_time}}
- Tipo de Clase: {{class_type}}
- Instructora: {{instructor_name}}
- Duración: {{class_duration}} minutos
- Ubicación: {{venue_address}}
- Número de Reserva: {{booking_reference}}

INSTRUCCIONES IMPORTANTES:
- Llega 10 minutos antes de tu clase
- Trae tu propia colchoneta de yoga
- Usa ropa cómoda y flexible
- Evita comer 2 horas antes de la clase
- Mantén tu teléfono en silencio

Ver mis reservas: {{booking_url}}

¿Necesitas cancelar o reprogramar?
Puedes hacerlo hasta 2 horas antes de tu clase.

Contacto:
- Email: info@matmax.store
- WhatsApp: +51 999 999 999

¡Te esperamos pronto!
MatMax Yoga Studio
        `,
        placeholders: [
          'customer_name',
          'class_date',
          'class_time', 
          'class_type',
          'instructor_name',
          'class_duration',
          'venue_address',
          'booking_reference',
          'booking_url'
        ],
        isActive: true
      },
      {
        name: 'booking_reminder',
        subject: 'Recordatorio: Tu clase de yoga es mañana - MatMax',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recordatorio de Clase - MatMax</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .reminder-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MatMax Yoga Studio</h1>
            <h2>Recordatorio de Clase</h2>
        </div>
        
        <div class="content">
            <p>Hola <strong>{{customer_name}}</strong>,</p>
            
            <p>¡No olvides tu clase de yoga mañana! Te recordamos los detalles:</p>
            
            <div class="reminder-info">
                <h3>📅 Tu Clase de Mañana</h3>
                <p><strong>Fecha:</strong> {{class_date}}</p>
                <p><strong>Hora:</strong> {{class_time}}</p>
                <p><strong>Tipo de Clase:</strong> {{class_type}}</p>
                <p><strong>Instructora:</strong> {{instructor_name}}</p>
                <p><strong>Ubicación:</strong> {{venue_address}}</p>
            </div>
            
            <p>¡Te esperamos con mucha energía positiva! 🙏</p>
        </div>
        
        <div class="footer">
            <p><strong>MatMax Yoga Studio</strong></p>
        </div>
    </div>
</body>
</html>`,
        textContent: `
Recordatorio: Tu clase de yoga es mañana - MatMax

Hola {{customer_name}},

¡No olvides tu clase de yoga mañana! Te recordamos los detalles:

TU CLASE DE MAÑANA:
- Fecha: {{class_date}}
- Hora: {{class_time}}
- Tipo de Clase: {{class_type}}
- Instructora: {{instructor_name}}
- Ubicación: {{venue_address}}

¡Te esperamos con mucha energía positiva!

MatMax Yoga Studio
        `,
        placeholders: [
          'customer_name',
          'class_date',
          'class_time',
          'class_type', 
          'instructor_name',
          'venue_address'
        ],
        isActive: true
      }
    ];

    console.log('📝 Creating email templates...');
    
    for (const template of templates) {
      const createdTemplate = await prisma.communicationTemplate.upsert({
        where: { 
          name: template.name 
        },
        update: {
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
          placeholders: template.placeholders,
          isActive: template.isActive
        },
        create: {
          name: template.name,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
          placeholders: template.placeholders,
          isActive: template.isActive
        }
      });

      console.log(`✅ Template created: ${createdTemplate.name}`);
    }

    console.log('\n🎉 Brevo email templates configured successfully!');
    console.log('\n📋 Available Templates:');
    console.log('1. package_purchase_confirmation - Enviado al comprar un paquete');
    console.log('2. booking_confirmation - Enviado al hacer una reserva');
    console.log('3. booking_reminder - Recordatorio 24h antes de la clase');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Configure BREVO_SMTP_USER and BREVO_SMTP_PASSWORD environment variables');
    console.log('2. Test email sending from admin dashboard');
    console.log('3. Customize templates as needed');

  } catch (error) {
    console.error('❌ Error configuring Brevo templates:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the configuration
configureBrevoTemplates();
