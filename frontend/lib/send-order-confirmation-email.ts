import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderId: string;
  orderDate: string;
  orderStatus: string;
  orderStatusText: string;
  paymentStatus: string;
  paymentStatusText: string;
  billingDocumentType: string;
  dni?: string;
  ruc?: string;
  companyName?: string;
  orderItems: Array<{
    name: string;
    description?: string;
    type_text: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    sessions?: number;
    duration_minutes?: number;
  }>;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  shipping_address?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Schedule booking details
  scheduleDetails?: {
    selectedDate?: string;
    selectedTime?: string;
    teacher?: string;
    serviceType?: string;
    venue?: string;
    dayOfWeek?: string;
  };
  // Package booking details
  packageBookingDetails?: {
    packageName?: string;
    packageDescription?: string;
    sessionsCount?: number;
    durationMinutes?: number;
    packageType?: string;
  };
  order_url: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData): Promise<boolean> {
  try {
    // Get email configuration from database
    const config = await prisma.communicationConfig.findFirst({
      where: { id: 1 }
    });

    if (!config?.brevo_api_key || !config.email_enabled) {
      console.error('Email configuration not found or disabled');
      return false;
    }

    // Format billing document type for display
    const formatBillingDocument = (billingType: string, dni?: string, ruc?: string, companyName?: string) => {
      switch (billingType) {
        case 'boleta':
          return `Boleta (DNI: ${dni || 'Not provided'})`;
        case 'boleta_simple':
          return 'Boleta Simple';
        case 'factura':
          return `Factura (RUC: ${ruc || 'Not provided'}${companyName ? ` - ${companyName}` : ''})`;
        default:
          return billingType;
      }
    };

    // Format order items for email
    const orderItemsHtml = orderData.orderItems.map(item => `
      <tr>
        <td>
          <strong>${item.name}</strong><br>
          <small>${item.type_text}</small>
          ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
          ${item.sessions ? `<br><small>📅 ${item.sessions} sesiones</small>` : ''}
          ${item.duration_minutes ? `<br><small>⏱️ ${item.duration_minutes} minutos cada sesión</small>` : ''}
        </td>
        <td>${item.quantity}</td>
        <td>${orderData.currency} ${item.unit_price.toFixed(2)}</td>
        <td><strong>${orderData.currency} ${item.total_price.toFixed(2)}</strong></td>
      </tr>
    `).join('');

    // Create HTML email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Pedido - MatMax</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .billing-info { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .total-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: right; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: #E24A4A; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MatMax Yoga Studio</h1>
            <h2>¡Pedido Confirmado!</h2>
        </div>
        
        <div class="content">
            <p>Hola <strong>${orderData.customerName}</strong>,</p>
            
            <p>¡Gracias por tu pedido! Hemos recibido tu solicitud y la estamos procesando.</p>
            
            <div class="order-info">
                <h3>📋 Detalles del Pedido</h3>
                <p><strong>Número de Pedido:</strong> ${orderData.orderNumber}</p>
                <p><strong>ID de Pedido:</strong> ${orderData.orderId}</p>
                <p><strong>Fecha:</strong> ${orderData.orderDate}</p>
                <p><strong>Estado:</strong> <span class="status-badge status-${orderData.orderStatus}">${orderData.orderStatusText}</span></p>
                <p><strong>Estado de Pago:</strong> <span class="status-badge status-${orderData.paymentStatus}">${orderData.paymentStatusText}</span></p>
                <p><strong>Método de Pago:</strong> ${orderData.paymentStatus === 'COMPLETED' ? 'Pago Procesado' : 'Pendiente de Pago'}</p>
                ${orderData.notes ? `<p><strong>Notas:</strong> ${orderData.notes}</p>` : ''}
            </div>

            <div class="billing-info">
                <h4>📄 Información de Facturación</h4>
                <p><strong>Documento:</strong> ${formatBillingDocument(orderData.billingDocumentType, orderData.dni, orderData.ruc, orderData.companyName)}</p>
            </div>

            ${orderData.scheduleDetails ? `
            <div class="order-info">
                <h3>📅 Detalles de la Reserva</h3>
                <p><strong>Fecha:</strong> ${orderData.scheduleDetails.selectedDate || 'No especificada'}</p>
                <p><strong>Hora:</strong> ${orderData.scheduleDetails.selectedTime || 'No especificada'}</p>
                <p><strong>Día:</strong> ${orderData.scheduleDetails.dayOfWeek || 'No especificado'}</p>
                <p><strong>Instructor:</strong> ${orderData.scheduleDetails.teacher || 'No especificado'}</p>
                <p><strong>Tipo de Clase:</strong> ${orderData.scheduleDetails.serviceType || 'No especificado'}</p>
                <p><strong>Ubicación:</strong> ${orderData.scheduleDetails.venue || 'No especificada'}</p>
            </div>
            ` : ''}

            ${orderData.packageBookingDetails ? `
            <div class="order-info">
                <h3>📦 Detalles del Paquete Comprado</h3>
                <p><strong>Paquete:</strong> ${orderData.packageBookingDetails.packageName || 'No especificado'}</p>
                <p><strong>Descripción:</strong> ${orderData.packageBookingDetails.packageDescription || 'No especificada'}</p>
                <p><strong>Sesiones Incluidas:</strong> ${orderData.packageBookingDetails.sessionsCount || 'No especificado'}</p>
                <p><strong>Duración por Sesión:</strong> ${orderData.packageBookingDetails.durationMinutes || 'No especificado'} minutos</p>
                <p><strong>Tipo de Paquete:</strong> ${orderData.packageBookingDetails.packageType || 'No especificado'}</p>
                <p><strong>Estado del Paquete:</strong> <span class="status-badge status-confirmed">Activo</span></p>
                <p><strong>Válido hasta:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}</p>
                <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <h4>🎯 Próximos Pasos:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Tu paquete ya está activo en tu cuenta</li>
                        <li>Puedes reservar clases desde tu panel de usuario</li>
                        <li>Las sesiones no utilizadas expiran en 30 días</li>
                        <li>Recibirás un email de confirmación cuando reserves una clase</li>
                    </ul>
                </div>
            </div>
            ` : ''}

            <h3>🛍️ Artículos del Pedido</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Artículo</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
            </table>

            <div class="total-section">
                <p><strong>Subtotal: ${orderData.currency} ${orderData.subtotal.toFixed(2)}</strong></p>
                ${orderData.tax_amount > 0 ? `<p>Impuestos: ${orderData.currency} ${orderData.tax_amount.toFixed(2)}</p>` : ''}
                ${orderData.shipping_amount > 0 ? `<p>Envío: ${orderData.currency} ${orderData.shipping_amount.toFixed(2)}</p>` : ''}
                <hr>
                <h3>Total: ${orderData.currency} ${orderData.total_amount.toFixed(2)}</h3>
            </div>

            ${orderData.shipping_address ? `
            <div class="order-info">
                <h3>📍 Dirección de Envío</h3>
                <p>${orderData.shipping_address.address}<br>
                ${orderData.shipping_address.city}, ${orderData.shipping_address.state} ${orderData.shipping_address.zipCode}<br>
                ${orderData.shipping_address.country}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
                <a href="${orderData.order_url}" class="button">Ver Detalles del Pedido</a>
            </div>

            <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
        </div>
        
        <div class="footer">
            <p><strong>MatMax Yoga Studio</strong></p>
            <p>📧 info@matmax.store | 📞 +51 999 999 999</p>
        </div>
    </div>
</body>
</html>`;

    // Create text version
    const textContent = `
Confirmación de Pedido - MatMax Yoga Studio

Hola ${orderData.customerName},

¡Gracias por tu pedido! Hemos recibido tu solicitud y la estamos procesando.

DETALLES DEL PEDIDO:
- Número de Pedido: ${orderData.orderNumber}
- ID de Pedido: ${orderData.orderId}
- Fecha: ${orderData.orderDate}
- Estado: ${orderData.orderStatusText}
- Estado de Pago: ${orderData.paymentStatusText}
- Método de Pago: ${orderData.paymentStatus === 'COMPLETED' ? 'Pago Procesado' : 'Pendiente de Pago'}
${orderData.notes ? `- Notas: ${orderData.notes}` : ''}

INFORMACIÓN DE FACTURACIÓN:
- Documento: ${formatBillingDocument(orderData.billingDocumentType, orderData.dni, orderData.ruc, orderData.companyName)}

${orderData.scheduleDetails ? `
DETALLES DE LA RESERVA:
- Fecha: ${orderData.scheduleDetails.selectedDate || 'No especificada'}
- Hora: ${orderData.scheduleDetails.selectedTime || 'No especificada'}
- Día: ${orderData.scheduleDetails.dayOfWeek || 'No especificado'}
- Instructor: ${orderData.scheduleDetails.teacher || 'No especificado'}
- Tipo de Clase: ${orderData.scheduleDetails.serviceType || 'No especificado'}
- Ubicación: ${orderData.scheduleDetails.venue || 'No especificada'}

` : ''}${orderData.packageBookingDetails ? `
DETALLES DEL PAQUETE COMPRADO:
- Paquete: ${orderData.packageBookingDetails.packageName || 'No especificado'}
- Descripción: ${orderData.packageBookingDetails.packageDescription || 'No especificada'}
- Sesiones Incluidas: ${orderData.packageBookingDetails.sessionsCount || 'No especificado'}
- Duración por Sesión: ${orderData.packageBookingDetails.durationMinutes || 'No especificado'} minutos
- Tipo de Paquete: ${orderData.packageBookingDetails.packageType || 'No especificado'}
- Estado del Paquete: Activo
- Válido hasta: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}

PRÓXIMOS PASOS:
- Tu paquete ya está activo en tu cuenta
- Puedes reservar clases desde tu panel de usuario
- Las sesiones no utilizadas expiran en 30 días
- Recibirás un email de confirmación cuando reserves una clase

` : ''}ARTÍCULOS DEL PEDIDO:
${orderData.orderItems.map(item => {
  let itemText = `- ${item.name} (${item.type_text})`;
  if (item.description) itemText += `\n  Descripción: ${item.description}`;
  if (item.sessions) itemText += `\n  Sesiones: ${item.sessions}`;
  if (item.duration_minutes) itemText += `\n  Duración: ${item.duration_minutes} minutos cada sesión`;
  itemText += `\n  Cantidad: ${item.quantity} - ${orderData.currency} ${item.unit_price.toFixed(2)} cada uno - Total: ${orderData.currency} ${item.total_price.toFixed(2)}`;
  return itemText;
}).join('\n\n')}

RESUMEN:
- Subtotal: ${orderData.currency} ${orderData.subtotal.toFixed(2)}
${orderData.tax_amount > 0 ? `- Impuestos: ${orderData.currency} ${orderData.tax_amount.toFixed(2)}` : ''}
${orderData.shipping_amount > 0 ? `- Envío: ${orderData.currency} ${orderData.shipping_amount.toFixed(2)}` : ''}
- TOTAL: ${orderData.currency} ${orderData.total_amount.toFixed(2)}

${orderData.shipping_address ? `
DIRECCIÓN DE ENVÍO:
${orderData.shipping_address.address}
${orderData.shipping_address.city}, ${orderData.shipping_address.state} ${orderData.shipping_address.zipCode}
${orderData.shipping_address.country}
` : ''}

Ver detalles del pedido: ${orderData.order_url}

Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.

MatMax Yoga Studio
📧 info@matmax.store | 📞 +51 999 999 999
    `;

    // Send email via Brevo API
    const emailPayload = {
      sender: {
        name: config.sender_name || 'MatMax Yoga Studio',
        email: config.sender_email || 'noreply@matmax.store'
      },
      to: [
        {
          email: orderData.customerEmail,
          name: orderData.customerName
        }
      ],
      subject: '¡Gracias por tu pedido! - MatMax Yoga Studio',
      htmlContent: htmlContent,
      textContent: textContent
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': config.brevo_api_key
      },
      body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('Order confirmation email sent successfully:', result.messageId);
    return true;

  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
