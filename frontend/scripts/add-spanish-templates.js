import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addSpanishTemplates() {
  try {
    console.log('🔄 Adding Spanish translations for all email templates...');
    
    // Get all existing templates
    const templates = await prisma.communicationTemplate.findMany({
      include: {
        translations: true
      }
    });
    
    for (const template of templates) {
      console.log(`📧 Adding Spanish translation for: ${template.name}`);
      
      // Check if Spanish translation already exists
      const existingSpanish = template.translations.find(t => t.language === 'es');
      if (existingSpanish) {
        console.log(`⚠️ Spanish translation already exists for ${template.name}, skipping...`);
        continue;
      }
      
      // Create Spanish translation based on template type
      let spanishSubject = '';
      let spanishContent = '';
      
      switch (template.templateKey) {
        case 'order_confirmation_complete':
          spanishSubject = 'Confirmación de Pedido - {{userName}}';
          spanishContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Confirmación de Pedido</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0; color: #333;">
    
    <!-- Email Container -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f0;">
        <tr>
            <td style="padding: 40px 20px;">
                
                <!-- Main Content Card -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 3px;">MATMAX</h1>
                            <p style="margin: 8px 0 0 0; color: #e8f5e9; font-size: 14px; letter-spacing: 1px;">ESTUDIO DE BIENESTAR</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 24px; font-weight: 600;">¡Gracias por tu pedido, {{userName}}!</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">Tu pedido ha sido confirmado exitosamente. Aquí tienes todos los detalles de tu compra.</p>
                        </td>
                    </tr>

                    <!-- Order Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #e8f5e9; border-left: 4px solid #4a7c2e; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #2d5016; font-size: 14px; font-weight: 600;">PEDIDO CONFIRMADO</p>
                                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Email: {{userEmail}}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #666; font-size: 12px;">Número de Pedido</p>
                                            <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: 600;">{{orderNumber}}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- MATPASS SECTION -->
                    {{#if hasMatpass}}
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- MATPASS Header -->
                                <div style="background-color: #2d5016; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">🎫 MATPASS Adquirido</h3>
                                </div>
                                
                                <!-- MATPASS Details -->
                                <div style="padding: 20px;">
                                    {{#each matpassItems}}
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">📍 Información del MATPASS</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Nombre:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{name}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Sesiones:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{sessions}} sesiones</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Precio:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{currency}} {{totalPrice}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Válido hasta:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{expiryDate}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    {{/each}}
                                </div>
                            </div>
                        </td>
                    </tr>
                    {{/if}}

                    <!-- BOOKING SECTION -->
                    {{#if hasBookings}}
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Booking Header -->
                                <div style="background-color: #4a7c2e; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">📅 Reservas Confirmadas</h3>
                                </div>
                                
                                <!-- Booking Details -->
                                <div style="padding: 20px;">
                                    {{#each bookings}}
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">📍 Información de la Reserva</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Fecha:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{bookingDate}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Hora:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{bookingTime}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Instructor:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherName}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Tipo de Clase:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{sessionType}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    {{/each}}
                                </div>
                            </div>
                        </td>
                    </tr>
                    {{/if}}

                    <!-- PRODUCTS SECTION -->
                    {{#if hasProducts}}
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Products Header -->
                                <div style="background-color: #4a7c2e; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">🛍️ Productos Adquiridos</h3>
                                </div>
                                
                                <!-- Products Details -->
                                <div style="padding: 20px;">
                                    {{#each products}}
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">📍 Información del Producto</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Nombre:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{name}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Cantidad:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{quantity}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Precio:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{currency}} {{totalPrice}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    {{/each}}
                                </div>
                            </div>
                        </td>
                    </tr>
                    {{/if}}

                    <!-- Price Summary -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px; font-weight: 600;">💰 Resumen de Precios</h3>
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="color: #666; font-size: 14px; padding: 6px 0;">Subtotal:</td>
                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0; text-align: right;">{{currency}} {{subtotal}}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666; font-size: 14px; padding: 6px 0;">Impuestos:</td>
                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0; text-align: right;">{{currency}} {{taxAmount}}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666; font-size: 14px; padding: 6px 0;">Envío:</td>
                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0; text-align: right;">{{currency}} {{shippingAmount}}</td>
                                    </tr>
                                    <tr style="border-top: 2px solid #ff9800; margin-top: 10px;">
                                        <td style="color: #2d5016; font-size: 16px; font-weight: 600; padding: 10px 0;">TOTAL:</td>
                                        <td style="color: #2d5016; font-size: 16px; font-weight: 600; padding: 10px 0; text-align: right;">{{currency}} {{totalAmount}}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">¿Tienes alguna pregunta sobre tu pedido?</p>
                            <a href="mailto:{{adminEmail}}" style="display: inline-block; background-color: #4a7c2e; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Contactar Soporte</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f5f0; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 10px 0; color: #2d5016; font-size: 16px; font-weight: 600; letter-spacing: 2px;">MATMAX ESTUDIO DE BIENESTAR</p>
                            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Clases Premium de Yoga en Miraflores, Lima</p>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">📧 {{adminEmail}} | 🌐 matmax.world</p>
                            
                            <!-- Social Links -->
                            <div style="margin: 20px 0;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">📘</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">📷</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">🐦</a>
                            </div>
                            
                            <p style="margin: 20px 0 0 0; color: #999; font-size: 11px; line-height: 1.6;">
                                © 2025 MATMAX Estudio de Bienestar. Todos los derechos reservados.<br>
                                Este email fue enviado a {{userEmail}}
                            </p>
                        </td>
                    </tr>

                </table>
                
            </td>
        </tr>
    </table>

</body>
</html>`;
          break;
          
        case 'booking_confirmation':
          spanishSubject = 'Reserva Confirmada - {{userName}}';
          spanishContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Reserva Confirmada</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0; color: #333;">
    
    <!-- Email Container -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f0;">
        <tr>
            <td style="padding: 40px 20px;">
                
                <!-- Main Content Card -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 3px;">MATMAX</h1>
                            <p style="margin: 8px 0 0 0; color: #e8f5e9; font-size: 14px; letter-spacing: 1px;">ESTUDIO DE BIENESTAR</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 24px; font-weight: 600;">¡Reserva Confirmada, {{userName}}!</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">Tu sesión de yoga ha sido reservada exitosamente. Te esperamos en MATMAX.</p>
                        </td>
                    </tr>

                    <!-- Booking Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #e8f5e9; border-left: 4px solid #4a7c2e; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #2d5016; font-size: 14px; font-weight: 600;">RESERVA CONFIRMADA</p>
                                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Email: {{userEmail}}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #666; font-size: 12px;">ID de Reserva</p>
                                            <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: 600;">{{bookingId}}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- BOOKING DETAILS SECTION -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Booking Header -->
                                <div style="background-color: #2d5016; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">📅 Detalles de la Reserva</h3>
                                </div>
                                
                                <!-- Booking Details -->
                                <div style="padding: 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">📍 Información de la Sesión</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Fecha:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{bookingDate}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Hora:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{bookingTime}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Instructor:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherName}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Tipo de Clase:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{sessionType}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Duración:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{duration}} minutos</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Instructions -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px; font-weight: 600;">📋 Instrucciones Importantes</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Llega 10 minutos antes de tu clase</li>
                                    <li>Te prestamos un mat MATMAX</li>
                                    <li>Usa ropa cómoda y flexible</li>
                                    <li>Evita comer 2 horas antes de la clase</li>
                                    <li>Mantén tu teléfono en silencio</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">¿Necesitas cancelar o reprogramar?</p>
                            <a href="mailto:{{adminEmail}}" style="display: inline-block; background-color: #4a7c2e; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Contactar Soporte</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f5f0; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 10px 0; color: #2d5016; font-size: 16px; font-weight: 600; letter-spacing: 2px;">MATMAX ESTUDIO DE BIENESTAR</p>
                            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Clases Premium de Yoga en Miraflores, Lima</p>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">📧 {{adminEmail}} | 🌐 matmax.world</p>
                            
                            <!-- Social Links -->
                            <div style="margin: 20px 0;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">📘</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">📷</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">🐦</a>
                            </div>
                            
                            <p style="margin: 20px 0 0 0; color: #999; font-size: 11px; line-height: 1.6;">
                                © 2025 MATMAX Estudio de Bienestar. Todos los derechos reservados.<br>
                                Este email fue enviado a {{userEmail}}
                            </p>
                        </td>
                    </tr>

                </table>
                
            </td>
        </tr>
    </table>

</body>
</html>`;
          break;
          
        default:
          // For other templates, create basic Spanish versions
          spanishSubject = `Confirmación - {{userName}}`;
          spanishContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0; color: #333;">
    
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f0;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%;">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 3px;">MATMAX</h1>
                            <p style="margin: 8px 0 0 0; color: #e8f5e9; font-size: 14px; letter-spacing: 1px;">ESTUDIO DE BIENESTAR</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 24px; font-weight: 600;">Hola {{userName}},</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">Gracias por tu interés en MATMAX Wellness Studio.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f5f5f0; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 10px 0; color: #2d5016; font-size: 16px; font-weight: 600; letter-spacing: 2px;">MATMAX ESTUDIO DE BIENESTAR</p>
                            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Clases Premium de Yoga en Miraflores, Lima</p>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">📧 {{adminEmail}} | 🌐 matmax.world</p>
                            
                            <p style="margin: 20px 0 0 0; color: #999; font-size: 11px; line-height: 1.6;">
                                © 2025 MATMAX Estudio de Bienestar. Todos los derechos reservados.<br>
                                Este email fue enviado a {{userEmail}}
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
      }
      
      // Create Spanish translation
      await prisma.communicationTemplateTranslation.create({
        data: {
          templateId: template.id,
          language: 'es',
          subject: spanishSubject,
          content: spanishContent
        }
      });
      
      console.log(`✅ Spanish translation added for ${template.name}`);
    }
    
    console.log('🎉 All Spanish templates added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding Spanish templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSpanishTemplates();
