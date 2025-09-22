# Brevo Email Templates Setup

This document explains how to set up and use Brevo email templates with the updated email system.

## Overview

The email system has been updated to use Brevo's template system instead of hardcoded HTML content. This provides better maintainability, design consistency, and easier customization.

## Template Variables

### Order Confirmation Email (Template ID: 1)

**Email Recipients:**
- **To:** Customer email address
- **BCC:** info@matmax.store (internal copy)

**Available Variables:**
- `customerName` - Customer's full name
- `customerEmail` - Customer's email address
- `orderNumber` - Order number (e.g., "ORD-123456789-abc123def")
- `orderId` - Internal order ID
- `orderDate` - Order creation date
- `orderStatus` - Order status (lowercase)
- `orderStatusText` - Order status in Spanish
- `paymentStatus` - Payment status (lowercase)
- `paymentStatusText` - Payment status in Spanish
- `paymentMethod` - Payment method text
- `notes` - Order notes (if any)
- `billingDocumentType` - Billing document type
- `billingDocumentText` - Formatted billing document text
- `dni` - DNI number
- `ruc` - RUC number
- `companyName` - Company name
- `hasScheduleDetails` - Boolean indicating if schedule details exist
- `scheduleDate` - Schedule date
- `scheduleTime` - Schedule time
- `scheduleDayOfWeek` - Day of week
- `scheduleTeacher` - Teacher name
- `scheduleServiceType` - Service type
- `scheduleVenue` - Venue name
- `hasPackageBooking` - Boolean indicating if package booking details exist
- `packageName` - Package name
- `packageDescription` - Package description
- `packageSessionsCount` - Number of sessions
- `packageDurationMinutes` - Duration per session in minutes
- `packageType` - Package type
- `packageExpiryDate` - Package expiry date
- `orderItems` - Array of order items (for complex formatting)
- `orderItemsHtml` - Pre-formatted HTML table of order items
- `currency` - Currency code
- `subtotal` - Order subtotal
- `taxAmount` - Tax amount
- `shippingAmount` - Shipping amount
- `totalAmount` - Total amount
- `hasTax` - Boolean indicating if tax > 0
- `hasShipping` - Boolean indicating if shipping > 0
- `hasShippingAddress` - Boolean indicating if shipping address exists
- `shippingAddress` - Shipping address
- `shippingCity` - Shipping city
- `shippingState` - Shipping state
- `shippingZipCode` - Shipping zip code
- `shippingCountry` - Shipping country
- `orderUrl` - Link to order details
- `contactEmail` - Contact email
- `contactPhone` - Contact phone

### Booking Confirmation Email (Template ID: 2)

**Available Variables:**
- `customerName` - Customer's full name
- `customerEmail` - Customer's email address
- `bookingId` - Booking ID
- `bookingDate` - Booking date
- `bookingTime` - Booking time
- `sessionType` - Session type
- `instructor` - Instructor name
- `venue` - Venue name
- `duration` - Session duration in minutes
- `bookingStatus` - Booking status
- `packageName` - Package name
- `packageDescription` - Package description
- `packageType` - Package type
- `sessionsUsed` - Number of sessions used
- `sessionsRemaining` - Number of sessions remaining
- `bookingUrl` - Link to booking details
- `contactEmail` - Contact email
- `contactPhone` - Contact phone
- `language` - Language code

## Setup Instructions

### 1. Create Templates in Brevo

1. Log into your Brevo account
2. Go to Templates > Email Templates
3. Create two new templates:

#### Order Confirmation Template (ID: 1)
- **Name:** Order Confirmation - MatMax
- **Subject:** ¡Gracias por tu pedido! - MatMax Yoga Studio
- Use the variables above to create a professional email layout

#### Booking Confirmation Template (ID: 2)
- **Name:** Booking Confirmation - MatMax
- **Subject:** ¡Reserva Confirmada! - MatMax Yoga Studio
- Use the variables above to create a professional email layout

### 2. Update Template IDs in Database

The system will use template IDs 1 and 2 by default, but you can customize them:

```sql
UPDATE communication_config
SET
  order_confirmation_template_id = YOUR_ORDER_TEMPLATE_ID,
  booking_confirmation_template_id = YOUR_BOOKING_TEMPLATE_ID
WHERE id = 1;
```

### 3. Template Examples

#### Order Confirmation HTML Structure:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .total-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: right; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: #E24A4A; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MatMax Yoga Studio</h1>
            <h2>¡Pedido Confirmado!</h2>
        </div>

        <div class="content">
            <p>Hola <strong>{{params.customerName}}</strong>,</p>

            <p>¡Gracias por tu pedido! Hemos recibido tu solicitud y la estamos procesando.</p>

            <div class="order-info">
                <h3>📋 Detalles del Pedido</h3>
                <p><strong>Número de Pedido:</strong> {{params.orderNumber}}</p>
                <p><strong>ID de Pedido:</strong> {{params.orderId}}</p>
                <p><strong>Fecha:</strong> {{params.orderDate}}</p>
                <p><strong>Estado:</strong> <span class="status-badge">{{params.orderStatusText}}</span></p>
                <p><strong>Estado de Pago:</strong> <span class="status-badge">{{params.paymentStatusText}}</span></p>
                {{#if params.notes}}
                <p><strong>Notas:</strong> {{params.notes}}</p>
                {{/if}}
            </div>

            <div class="order-info">
                <h4>📄 Información de Facturación</h4>
                <p><strong>Documento:</strong> {{params.billingDocumentText}}</p>
            </div>

            {{#if params.hasScheduleDetails}}
            <div class="order-info">
                <h3>📅 Detalles de la Reserva</h3>
                <p><strong>Fecha:</strong> {{params.scheduleDate}}</p>
                <p><strong>Hora:</strong> {{params.scheduleTime}}</p>
                <p><strong>Día:</strong> {{params.scheduleDayOfWeek}}</p>
                <p><strong>Instructor:</strong> {{params.scheduleTeacher}}</p>
                <p><strong>Tipo de Clase:</strong> {{params.scheduleServiceType}}</p>
                <p><strong>Ubicación:</strong> {{params.scheduleVenue}}</p>
            </div>
            {{/if}}

            {{#if params.hasPackageBooking}}
            <div class="order-info">
                <h3>📦 Detalles del Paquete Comprado</h3>
                <p><strong>Paquete:</strong> {{params.packageName}}</p>
                {{#if params.packageDescription}}
                <p><strong>Descripción:</strong> {{params.packageDescription}}</p>
                {{/if}}
                <p><strong>Sesiones Incluidas:</strong> {{params.packageSessionsCount}}</p>
                <p><strong>Duración por Sesión:</strong> {{params.packageDurationMinutes}} minutos</p>
                <p><strong>Tipo de Paquete:</strong> {{params.packageType}}</p>
                <p><strong>Válido hasta:</strong> {{params.packageExpiryDate}}</p>
            </div>
            {{/if}}

            <h3>🛍️ Artículos del Pedido</h3>
            {{{params.orderItemsHtml}}}

            <div class="total-section">
                <p><strong>Subtotal: {{params.currency}} {{params.subtotal}}</strong></p>
                {{#if params.hasTax}}
                <p>Impuestos: {{params.currency}} {{params.taxAmount}}</p>
                {{/if}}
                {{#if params.hasShipping}}
                <p>Envío: {{params.currency}} {{params.shippingAmount}}</p>
                {{/if}}
                <hr>
                <h3>Total: {{params.currency}} {{params.totalAmount}}</h3>
            </div>

            {{#if params.hasShippingAddress}}
            <div class="order-info">
                <h3>📍 Dirección de Envío</h3>
                <p>{{params.shippingAddress}}<br>
                {{params.shippingCity}}, {{params.shippingState}} {{params.shippingZipCode}}<br>
                {{params.shippingCountry}}</p>
            </div>
            {{/if}}

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{params.orderUrl}}" class="button">Ver Detalles del Pedido</a>
            </div>

            <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
        </div>

        <div class="footer">
            <p><strong>MatMax Yoga Studio</strong></p>
            <p>📧 {{params.contactEmail}} | 📞 {{params.contactPhone}}</p>
        </div>
    </div>
</body>
</html>
```

#### Booking Confirmation HTML Structure:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4A90E2; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .booking-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4A90E2; }
        .package-info { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: #4A90E2; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .highlight-box { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MatMax Yoga Studio</h1>
            <h2>¡Reserva Confirmada!</h2>
        </div>

        <div class="content">
            <p>Hola <strong>{{params.customerName}}</strong>,</p>

            <p>¡Tu reserva ha sido confirmada exitosamente! Te esperamos en MatMax Yoga Studio.</p>

            <div class="booking-info">
                <h3>📅 Detalles de tu Clase</h3>
                <p><strong>Fecha:</strong> {{params.bookingDate}}</p>
                <p><strong>Hora:</strong> {{params.bookingTime}}</p>
                <p><strong>Tipo de Clase:</strong> {{params.sessionType}}</p>
                {{#if params.instructor}}
                <p><strong>Instructor:</strong> {{params.instructor}}</p>
                {{/if}}
                {{#if params.venue}}
                <p><strong>Ubicación:</strong> {{params.venue}}</p>
                {{/if}}
                <p><strong>Duración:</strong> {{params.duration}} minutos</p>
                <p><strong>Número de Reserva:</strong> {{params.bookingId}}</p>
                <p><strong>Estado:</strong> <span class="status-badge">{{params.bookingStatus}}</span></p>
            </div>

            <div class="package-info">
                <h3>🎫 Información del Paquete Utilizado</h3>
                <p><strong>Paquete:</strong> {{params.packageName}}</p>
                {{#if params.packageDescription}}
                <p><strong>Descripción:</strong> {{params.packageDescription}}</p>
                {{/if}}
                <p><strong>Tipo de Paquete:</strong> {{params.packageType}}</p>
                <p><strong>Sesiones Utilizadas:</strong> {{params.sessionsUsed}}</p>
                <p><strong>Sesiones Restantes:</strong> {{params.sessionsRemaining}}</p>
            </div>

            <div class="highlight-box">
                <h4>📋 Instrucciones Importantes:</h4>
                <ul>
                    <li>Llega 10 minutos antes de tu clase</li>
                    <li>Trae tu propia colchoneta de yoga</li>
                    <li>Usa ropa cómoda y flexible</li>
                    <li>Evita comer 2 horas antes de la clase</li>
                    <li>Mantén tu teléfono en silencio</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{params.bookingUrl}}" class="button">Ver Mis Reservas</a>
            </div>

            <p><strong>¿Necesitas cancelar o reprogramar?</strong><br>
            Puedes hacerlo hasta 2 horas antes de tu clase desde tu cuenta o contactándonos.</p>

            <p>Contacto:</p>
            <ul>
                <li>📧 {{params.contactEmail}}</li>
                <li>📱 {{params.contactPhone}}</li>
            </ul>
        </div>

        <div class="footer">
            <p>¡Te esperamos pronto! 🙏</p>
            <p><strong>MatMax Yoga Studio</strong></p>
        </div>
    </div>
</body>
</html>
```

## Contact Information Included

All email templates include the following contact information:

- **Address**: Calle Alcanfores 425, Miraflores - Lima, PE
- **Email**: info@matmax.store
- **WhatsApp**: +51 916 172 368

## Benefits of Using Templates

1. **Consistency**: All emails use the same design and branding
2. **Maintainability**: Changes to email design only need to be made in Brevo
3. **Performance**: Templates are pre-processed by Brevo
4. **Analytics**: Better tracking and analytics in Brevo dashboard
5. **Testing**: Easy A/B testing of email designs
6. **Compliance**: Better deliverability and compliance features
7. **Complete Contact Info**: All emails include full business contact details

## Troubleshooting

- **Template not found**: Check that the template IDs in the database match the IDs in Brevo
- **Missing variables**: Ensure all required variables are provided in the `params` object
- **Email not sending**: Check Brevo API key and email configuration in the database
- **Variable formatting**: Use proper conditional logic (`{{#if}}`) for optional content
