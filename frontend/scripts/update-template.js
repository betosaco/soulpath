import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateTemplate() {
  const updatedContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra - MatMax Yoga Studio</title>
    <style>
        /* Light mode (default) */
        body {
            font-family: 'Lato', Arial, sans-serif;
            line-height: 1.6;
            color: #383838;
            background-color: #f4eeed;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1a1a1a;
                color: #e0e0e0;
            }
            .email-container {
                background-color: #2d2d2d;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
        }
        .header {
            background: linear-gradient(135deg, #6ea058 0%, #8bc34a 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 10px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header h2 {
            font-size: 20px;
            font-weight: 400;
            margin: 0;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #383838;
        }
        .package-info {
            background: linear-gradient(135deg, #f4eeed 0%, #ede6e5 100%);
            padding: 25px;
            margin: 25px 0;
            border-radius: 12px;
            border-left: 5px solid #6ea058;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .package-info h3 {
            color: #6ea058;
            font-size: 20px;
            margin: 0 0 20px 0;
            font-weight: 600;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e0d6d4;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #383838;
            flex: 1;
        }
        .detail-value {
            color: #666666;
            flex: 1;
            text-align: right;
        }
        
        /* Dark mode content styles */
        @media (prefers-color-scheme: dark) {
            .content {
                background-color: #2d2d2d;
            }
            .greeting {
                color: #e0e0e0;
            }
            .package-info {
                background: linear-gradient(135deg, #3a3a3a 0%, #2d2d2d 100%);
                border-left-color: #6ea058;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .package-info h3 {
                color: #6ea058;
            }
            .detail-row {
                border-bottom-color: #4a4a4a;
            }
            .detail-label {
                color: #e0e0e0;
            }
            .detail-value {
                color: #b0b0b0;
            }
        }
        .schedule-section {
            margin: 30px 0;
        }
        .schedule-section h3 {
            color: #6ea058;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .schedule-list {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e0d6d4;
        }
        .schedule-list ul {
            margin: 0;
            padding-left: 20px;
        }
        .schedule-list li {
            margin: 8px 0;
            color: #666666;
        }
        
        /* Dark mode schedule styles */
        @media (prefers-color-scheme: dark) {
            .schedule-section h3 {
                color: #6ea058;
            }
            .schedule-list {
                background-color: #3a3a3a;
                border-color: #4a4a4a;
            }
            .schedule-list li {
                color: #b0b0b0;
            }
        }
        .cta-button {
            text-align: center;
            margin: 35px 0;
        }
        .cta-button a {
            display: inline-block;
            background: linear-gradient(135deg, #6ea058 0%, #8bc34a 100%);
            color: #ffffff;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(110, 160, 88, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button a:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(110, 160, 88, 0.4);
        }
        .contact-section {
            background-color: #f4eeed;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .contact-section h3 {
            color: #6ea058;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .contact-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .contact-list li {
            margin: 10px 0;
            color: #666666;
        }
        .footer {
            background-color: #383838;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .footer h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            margin: 0 0 10px 0;
            color: #6ea058;
        }
        .footer p {
            margin: 5px 0;
            opacity: 0.8;
        }
        
        /* Dark mode contact and footer styles */
        @media (prefers-color-scheme: dark) {
            .contact-section {
                background-color: #3a3a3a;
            }
            .contact-section h3 {
                color: #6ea058;
            }
            .contact-list li {
                color: #b0b0b0;
            }
            .footer {
                background-color: #1a1a1a;
            }
            .footer h3 {
                color: #6ea058;
            }
        }
        .highlight {
            color: #6ea058;
            font-weight: 600;
        }
        .success-text {
            font-size: 16px;
            margin-right: 10px;
        }
        
        /* Dark mode highlight styles */
        @media (prefers-color-scheme: dark) {
            .highlight {
                color: #6ea058;
            }
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .detail-row {
                flex-direction: column;
            }
            .detail-value {
                text-align: left;
                margin-top: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>MatMax Yoga Studio</h1>
            <h2>Compra Confirmada</h2>
        </div>
        
        <div class="content">
            <div class="greeting">
                <span class="success-text">Confirmado</span>
                Hola <strong class="highlight">{{customer_name}}</strong>,
            </div>
            
            <p>Gracias por tu compra en MatMax Yoga Studio. Tu paquete ha sido confirmado exitosamente y ya puedes comenzar a reservar tus clases.</p>
            
            <div class="package-info">
                <h3>Detalles de tu Paquete</h3>
                <div class="detail-row">
                    <span class="detail-label">Paquete:</span>
                    <span class="detail-value">{{package_name}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Sesiones:</span>
                    <span class="detail-value">{{sessions_count}} sesiones de {{session_duration}} minutos</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Precio unitario:</span>
                    <span class="detail-value">S/. {{package_price}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total pagado:</span>
                    <span class="detail-value highlight">{{total_amount}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Método de pago:</span>
                    <span class="detail-value">{{payment_method}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha de compra:</span>
                    <span class="detail-value">{{purchase_date}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Válido hasta:</span>
                    <span class="detail-value">{{expiry_date}}</span>
                </div>
            </div>
            
            <div class="schedule-section">
                <h3>Horarios Disponibles</h3>
                <div class="schedule-list">
                    <p>Ahora puedes reservar tus clases en nuestro horario disponible:</p>
                    <ul>
                        <li><strong>Lunes:</strong> 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha</li>
                        <li><strong>Martes:</strong> 17:30 Hatha, 18:45 Vinyasa</li>
                        <li><strong>Miércoles:</strong> 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha</li>
                        <li><strong>Jueves:</strong> 17:30 Hatha, 18:45 Vinyasa</li>
                        <li><strong>Viernes:</strong> 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha</li>
                        <li><strong>Sábado:</strong> 08:15 Hatha, 09:30 Vinyasa</li>
                    </ul>
                </div>
            </div>
            
            <div class="cta-button">
                <a href="{{booking_url}}">Reservar mi Primera Clase</a>
            </div>
            
            <div class="contact-section">
                <h3>Necesitas Ayuda?</h3>
                <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos:</p>
                <ul class="contact-list">
                    <li><strong>Email:</strong> info@matmax.store</li>
                    <li><strong>WhatsApp:</strong> +51 916 172 368</li>
                    <li><strong>Web:</strong> {{website_url}}</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <h3>MatMax Yoga Studio</h3>
            <p>Tu espacio de bienestar y transformación</p>
            <p>Esperamos verte pronto en clase</p>
        </div>
    </div>
</body>
</html>`;

  // First find the template
  const template = await prisma.communicationTemplate.findFirst({
    where: {
      templateKey: 'package_purchase_confirmation'
    }
  });

  if (template) {
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        templateId: template.id,
        language: 'es'
      },
      data: {
        content: updatedContent
      }
    });
  }

  console.log('✅ Email template updated - removed Namaste, kept info@matmax.store as sender');
  await prisma.$disconnect();
}

updateTemplate();
