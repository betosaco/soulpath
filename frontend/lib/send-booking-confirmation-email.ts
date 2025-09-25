import { createEmailService } from '@/lib/brevo-email-service';

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
  dayOfWeek?: string;
  sessionType: string;
  teacher?: string;
  venue?: string;
  duration: number;
  packageName: string;
  packageDescription?: string;
  sessionsUsed: number;
  sessionsRemaining: number;
  packageType: string;
  bookingUrl: string;
  language?: string;
}

export async function sendBookingConfirmationEmail(bookingData: BookingEmailData): Promise<boolean> {
  try {
    // Get email configuration using the same method as createEmailService
    const emailService = await createEmailService();

    if (!emailService) {
      console.error('Email service not available - Brevo configuration not found');
      return false;
    }

    // Generate HTML content for the booking confirmation email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Reserva - MatMax Wellness Studio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4A90E2, #357ABD); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .customer-info { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4A90E2; }
        .booking-info { background-color: #e8f4fd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4A90E2; }
        .package-info { background-color: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .instructions { background-color: #d1ecf1; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #dee2e6; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .highlight { font-weight: bold; color: #4A90E2; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MatMax Wellness Studio</h1>
            <h2>¡Reserva Confirmada!</h2>
        </div>

        <div class="content">
            <p>Hola <strong>${bookingData.customerName}</strong>,</p>

            <p>¡Tu reserva ha sido confirmada exitosamente! Te esperamos en MatMax Wellness Studio.</p>

            <div class="customer-info">
                <h3>👤 Información del Cliente</h3>
                <p><strong>Nombre:</strong> ${bookingData.customerName}</p>
                <p><strong>Email:</strong> ${bookingData.customerEmail}</p>
                ${bookingData.customerPhone ? `<p><strong>Teléfono:</strong> ${bookingData.customerPhone}</p>` : ''}
            </div>

            <div class="booking-info">
                <h3>📅 Sesión 1</h3>
                <p><strong>Fecha:</strong> ${bookingData.bookingDate}</p>
                <p><strong>Hora:</strong> ${bookingData.bookingTime}</p>
                ${bookingData.dayOfWeek ? `<p><strong>Día:</strong> ${bookingData.dayOfWeek}</p>` : ''}
                ${bookingData.teacher ? `<p><strong>Instructor:</strong> ${bookingData.teacher}</p>` : ''}
                <p><strong>Tipo de Clase:</strong> ${bookingData.sessionType}</p>
                ${bookingData.venue ? `<p><strong>Ubicación:</strong> ${bookingData.venue}</p>` : ''}
            </div>

            <div class="package-info">
                <h3>🎫 Información del Paquete Utilizado</h3>
                <p><strong>Paquete:</strong> ${bookingData.packageName}</p>
                ${bookingData.packageDescription ? `<p><strong>Descripción:</strong> ${bookingData.packageDescription}</p>` : ''}
                <p><strong>Tipo de Paquete:</strong> ${bookingData.packageType}</p>
                <p><strong>Sesiones Utilizadas:</strong> ${bookingData.sessionsUsed}</p>
                <p><strong>Sesiones Restantes:</strong> ${bookingData.sessionsRemaining}</p>
            </div>

            <div class="instructions">
                <h4>📋 Instrucciones Importantes:</h4>
                <ul>
                    <li>Llega 10 minutos antes de tu clase</li>
                    <li>Te prestamos un mat MatMax</li>
                    <li>Usa ropa cómoda y flexible</li>
                    <li>Evita comer 2 horas antes de la clase</li>
                    <li>Mantén tu teléfono en silencio</li>
                </ul>
            </div>


            <p><strong>¿Necesitas cancelar o reprogramar?</strong><br>
            Puedes hacerlo hasta 2 horas antes de tu clase desde tu cuenta o contactándonos.</p>

            <p><strong>Contacto:</strong></p>
            <ul>
                <li>📧 info@matmax.store</li>
                <li>📱 +51 916 172 368</li>
                <li>📍 Calle Alcanfores 425, Miraflores - Lima, PE</li>
            </ul>
        </div>

        <div class="footer">
            <p>¡Te esperamos pronto! 🙏</p>
            <p><strong>MatMax Wellness Studio</strong></p>
        </div>
    </div>
</body>
</html>`;

    // Create text version
    const textContent = `
Confirmación de Reserva - MatMax Wellness Studio

Hola ${bookingData.customerName},

¡Tu reserva ha sido confirmada exitosamente! Te esperamos en MatMax Wellness Studio.

INFORMACIÓN DEL CLIENTE:
Nombre: ${bookingData.customerName}
Email: ${bookingData.customerEmail}
${bookingData.customerPhone ? `Teléfono: ${bookingData.customerPhone}` : ''}

📅 Sesión 1:
Fecha: ${bookingData.bookingDate}
Hora: ${bookingData.bookingTime}
${bookingData.dayOfWeek ? `Día: ${bookingData.dayOfWeek}` : ''}
${bookingData.teacher ? `Instructor: ${bookingData.teacher}` : ''}
Tipo de Clase: ${bookingData.sessionType}
${bookingData.venue ? `Ubicación: ${bookingData.venue}` : ''}

INFORMACIÓN DEL PAQUETE UTILIZADO:
Paquete: ${bookingData.packageName}
${bookingData.packageDescription ? `Descripción: ${bookingData.packageDescription}` : ''}
Tipo de Paquete: ${bookingData.packageType}
Sesiones Utilizadas: ${bookingData.sessionsUsed}
Sesiones Restantes: ${bookingData.sessionsRemaining}

INSTRUCCIONES IMPORTANTES:
- Llega 10 minutos antes de tu clase
- Te prestamos un mat MatMax
- Usa ropa cómoda y flexible
- Evita comer 2 horas antes de la clase
- Mantén tu teléfono en silencio

¿Necesitas cancelar o reprogramar?
Puedes hacerlo hasta 2 horas antes de tu clase desde tu cuenta o contactándonos.

CONTACTO:
📧 info@matmax.store
📱 +51 916 172 368
📍 Calle Alcanfores 425, Miraflores - Lima, PE

¡Te esperamos pronto!

MatMax Wellness Studio
`;

    // Send email using Brevo service with BCC
    const emailResult = await emailService.sendEmailWithBCC({
      to: bookingData.customerEmail,
      bcc: 'alberto@matmax.world',
      subject: '¡Reserva Confirmada! - MatMax Wellness Studio',
      html: htmlContent,
      text: textContent
    });

    if (!emailResult) {
      console.error('Failed to send booking confirmation email');
      return false;
    }

    console.log('Booking confirmation email sent successfully');
    return true;

  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return false;
  }
}
