import { createEmailService } from './brevo-email-service';

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
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
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  shipping_address?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  scheduleDetails?: Array<{
    selectedDate: string;
    selectedTime: string;
    dayOfWeek: string;
    teacher: string;
    serviceType: string;
    venue: string;
  }>;
  packageBookingDetails?: {
    packageName: string;
    packageDescription: string;
    sessionsCount: number;
    durationMinutes: number;
    packageType: string;
  };
  // Group booking fields
  is_group_booking?: boolean;
  group_members_count?: number;
  group_members?: Array<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country_code: string;
    package_name: string;
    birth_date?: string;
    birth_time?: string;
    birth_place?: string;
    question?: string;
  }>;
  order_url: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData): Promise<boolean> {
  try {
    // Get email configuration using the same method as createEmailService
    const emailService = await createEmailService();

    if (!emailService) {
      console.error('Email service not available - Brevo configuration not found');
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

    // Generate HTML content for the email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Pedido - MatMax Yoga Studio</title>
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
                <p><strong>Fecha:</strong> ${orderData.orderDate}</p>
                <p><strong>Estado:</strong> <span class="status-badge status-${orderData.orderStatus}">${orderData.orderStatusText}</span></p>
                <p><strong>Estado de Pago:</strong> <span class="status-badge status-${orderData.paymentStatus}">${orderData.paymentStatusText}</span></p>
            </div>

            <div class="billing-info">
                <h4>📄 Información de Facturación</h4>
                <p><strong>Documento:</strong> ${formatBillingDocument(orderData.billingDocumentType, orderData.dni, orderData.ruc, orderData.companyName)}</p>
            </div>

            ${orderData.scheduleDetails && orderData.scheduleDetails.length > 0 ? `
            <div class="order-info">
                <h3>📅 Detalles de las Reservas</h3>
                ${orderData.scheduleDetails.map((schedule, index) => `
                <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #E24A4A;">
                    <h4>📅 Sesión ${index + 1}</h4>
                    <p><strong>Fecha:</strong> ${schedule.selectedDate || 'No especificada'}</p>
                    <p><strong>Hora:</strong> ${schedule.selectedTime || 'No especificada'}</p>
                    <p><strong>Día:</strong> ${schedule.dayOfWeek || 'No especificado'}</p>
                    <p><strong>Instructor:</strong> ${schedule.teacher || 'No especificado'}</p>
                    <p><strong>Tipo de Clase:</strong> ${schedule.serviceType || 'No especificado'}</p>
                    <p><strong>Ubicación:</strong> ${schedule.venue || 'No especificada'}</p>
                    ${orderData.is_group_booking && orderData.group_members && orderData.group_members.length > 0 ? `
                    <p><strong>📦 Paquetes para esta sesión:</strong></p>
                    <ul>
                        ${orderData.group_members.map((member, memberIndex) => `
                        <li>${memberIndex + 1}. <strong>${member.first_name} ${member.last_name}</strong> - ${member.package_name}</li>
                        `).join('')}
                    </ul>
                    ` : ''}
                </div>
                `).join('')}
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
                <p><strong>Estado del Paquete:</strong> Activo</p>
                <p><strong>Válido hasta:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}</p>
                
                <h4>Próximos Pasos:</h4>
                <ul>
                    <li>Tu paquete ya está activo en tu cuenta</li>
                    <li>Puedes reservar clases desde tu panel de usuario</li>
                    <li>Las sesiones no utilizadas expiran en 30 días</li>
                    <li>Recibirás un email de confirmación cuando reserves una clase</li>
                </ul>
            </div>
            ` : ''}

            ${orderData.is_group_booking && orderData.group_members && orderData.group_members.length > 0 ? `
            <div class="order-info">
                <h3>👥 Información del Grupo</h3>
                <p>Este es un pedido grupal con ${orderData.group_members_count} miembros:</p>
                <div class="group-members">
                    ${orderData.group_members.map(member => `
                    <div class="group-member" style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #E24A4A;">
                        <h4>👤 ${member.first_name} ${member.last_name}</h4>
                        <p><strong>📧 Email:</strong> ${member.email}</p>
                        <p><strong>📱 Teléfono:</strong> ${member.country_code} ${member.phone}</p>
                        <p><strong>📦 Paquete:</strong> ${member.package_name}</p>
                        ${member.birth_date ? `<p><strong>🎂 Fecha de Nacimiento:</strong> ${member.birth_date}</p>` : ''}
                        ${member.birth_time ? `<p><strong>🕐 Hora de Nacimiento:</strong> ${member.birth_time}</p>` : ''}
                        ${member.birth_place ? `<p><strong>📍 Lugar de Nacimiento:</strong> ${member.birth_place}</p>` : ''}
                        ${member.question ? `<p><strong>❓ Pregunta Específica:</strong> ${member.question}</p>` : ''}
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <div class="order-info">
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
            </div>

            <div class="total-section">
                <p><strong>Subtotal: ${orderData.currency} ${orderData.subtotal.toFixed(2)}</strong></p>
                ${orderData.taxAmount > 0 ? `<p>Impuestos: ${orderData.currency} ${orderData.taxAmount.toFixed(2)}</p>` : ''}
                ${orderData.shippingAmount > 0 ? `<p>Envío: ${orderData.currency} ${orderData.shippingAmount.toFixed(2)}</p>` : ''}
                <hr>
                <h3>Total: ${orderData.currency} ${orderData.totalAmount.toFixed(2)}</h3>
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

    // Generate text content for the email
    const textContent = `
Confirmación de Pedido - MatMax Yoga Studio

Hola ${orderData.customerName},

¡Gracias por tu pedido! Hemos recibido tu solicitud y la estamos procesando.

DETALLES DEL PEDIDO:
- Número de Pedido: ${orderData.orderNumber}
- Fecha: ${orderData.orderDate}
- Estado: ${orderData.orderStatusText}
- Estado de Pago: ${orderData.paymentStatusText}

INFORMACIÓN DE FACTURACIÓN:
- Documento: ${formatBillingDocument(orderData.billingDocumentType, orderData.dni, orderData.ruc, orderData.companyName)}

${orderData.scheduleDetails && orderData.scheduleDetails.length > 0 ? `
DETALLES DE LAS RESERVAS:
${orderData.scheduleDetails.map((schedule, index) => `
Sesión ${index + 1}:
- Fecha: ${schedule.selectedDate || 'No especificada'}
- Hora: ${schedule.selectedTime || 'No especificada'}
- Día: ${schedule.dayOfWeek || 'No especificado'}
- Instructor: ${schedule.teacher || 'No especificado'}
- Tipo de Clase: ${schedule.serviceType || 'No especificado'}
- Ubicación: ${schedule.venue || 'No especificada'}
${orderData.is_group_booking && orderData.group_members && orderData.group_members.length > 0 ? `
- Paquetes para esta sesión:
${orderData.group_members.map((member, memberIndex) => `  ${memberIndex + 1}. ${member.first_name} ${member.last_name} - ${member.package_name}`).join('\n')}` : ''}
`).join('\n')}

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

` : ''}${orderData.is_group_booking && orderData.group_members && orderData.group_members.length > 0 ? `
INFORMACIÓN DEL GRUPO:
Este es un pedido grupal con ${orderData.group_members_count} miembros:

${orderData.group_members.map(member => `
👤 ${member.first_name} ${member.last_name}
📧 Email: ${member.email}
📱 Teléfono: ${member.country_code} ${member.phone}
📦 Paquete: ${member.package_name}
${member.birth_date ? `🎂 Fecha de Nacimiento: ${member.birth_date}` : ''}
${member.birth_time ? `🕐 Hora de Nacimiento: ${member.birth_time}` : ''}
${member.birth_place ? `📍 Lugar de Nacimiento: ${member.birth_place}` : ''}
${member.question ? `❓ Pregunta Específica: ${member.question}` : ''}
`).join('\n')}

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
${orderData.taxAmount > 0 ? `- Impuestos: ${orderData.currency} ${orderData.taxAmount.toFixed(2)}` : ''}
${orderData.shippingAmount > 0 ? `- Envío: ${orderData.currency} ${orderData.shippingAmount.toFixed(2)}` : ''}
- TOTAL: ${orderData.currency} ${orderData.totalAmount.toFixed(2)}

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

    // Send email using Brevo service with BCC to alberto@matmax.world
    const emailResult = await emailService.sendEmailWithBCC({
      to: orderData.customerEmail,
      bcc: 'alberto@matmax.world',
      subject: '¡Gracias por tu pedido! - MatMax Yoga Studio',
      html: htmlContent,
      text: textContent
    });

    if (!emailResult) {
      console.error('❌ Failed to send order confirmation email');
      return false;
    }

    console.log('✅ Order confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
}
