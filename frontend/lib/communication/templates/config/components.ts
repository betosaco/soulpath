/**
 * 🧩 Email Components Configuration
 * 
 * Defines all reusable email components with their templates and conditions
 */

import { ComponentConfig } from '../types';

export const EMAIL_COMPONENTS: ComponentConfig[] = [
  // HEADER COMPONENTS
  {
    id: 'welcome_header',
    name: 'Welcome Header',
    type: 'header',
    template: `
      <div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
        <h2>¡Bienvenido a tu Viaje de Bienestar!</h2>
        <p>Tu MatPass está listo y activo</p>
      </div>
    `,
    conditions: [
      { field: 'isNewCustomer', operator: 'equals', value: true }
    ],
    order: 1,
    dataMapping: {
      userName: 'customerName'
    },
    required: true
  },
  {
    id: 'renewal_header',
    name: 'Renewal Header',
    type: 'header',
    template: `
      <div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
        <h2>MatPass Renovado Exitosamente</h2>
        <p>¡Gracias por continuar tu viaje con MATMAX!</p>
      </div>
    `,
    conditions: [
      { field: 'isNewCustomer', operator: 'equals', value: false }
    ],
    order: 1,
    dataMapping: {
      userName: 'customerName'
    },
    required: true
  },
  {
    id: 'generic_header',
    name: 'Generic Header',
    type: 'header',
    template: `
      <div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
        <h2>Confirmación de Pedido</h2>
      </div>
    `,
    conditions: [],
    order: 1,
    dataMapping: {},
    required: true
  },

  // CONTENT COMPONENTS
  {
    id: 'matpass_info',
    name: 'MatPass Information',
    type: 'content',
    template: `
      <div class="matpass-info" style="background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
        <h4>📱 Tu MatPass:</h4>
        <p><strong>Tipo:</strong> {{matpassType}}</p>
        <p><strong>Descripción:</strong> {{matpassDescription}}</p>
        <p><strong>Válido desde:</strong> {{matpassStartDate}}</p>
        <p><strong>Válido hasta:</strong> {{matpassEndDate}}</p>
        <p><strong>Total de sesiones:</strong> {{matpassSessions}} sesiones</p>
      </div>
    `,
    conditions: [
      { field: 'matpassItems', operator: 'exists', value: true }
    ],
    order: 2,
    dataMapping: {
      matpassType: 'matpassItems.0.name',
      matpassDescription: 'matpassItems.0.description',
      matpassStartDate: (data) => new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      matpassEndDate: 'matpassItems.0.expiryDate',
      matpassSessions: 'matpassItems.0.sessions'
    },
    required: false
  },
  {
    id: 'booking_info',
    name: 'Booking Information',
    type: 'content',
    template: `
      <div class="booking-info" style="background: #e8f4fd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
        <h4>📅 Tu Reserva:</h4>
        <p><strong>Fecha:</strong> {{bookingDate}}</p>
        <p><strong>Hora:</strong> {{bookingTime}}</p>
        <p><strong>Tipo de Clase:</strong> {{sessionType}}</p>
        <p><strong>Instructor:</strong> {{teacherName}}</p>
        <p><strong>Ubicación:</strong> {{venue}}</p>
      </div>
    `,
    conditions: [
      { field: 'bookings', operator: 'exists', value: true }
    ],
    order: 3,
    dataMapping: {
      bookingDate: 'bookings.0.bookingDate',
      bookingTime: 'bookings.0.bookingTime',
      sessionType: 'bookings.0.sessionType',
      teacherName: 'bookings.0.teacherName',
      venue: 'bookings.0.venue'
    },
    required: false
  },
  {
    id: 'product_info',
    name: 'Product Information',
    type: 'content',
    template: `
      <div class="product-info" style="background: #f0f8e8; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
        <h4>📦 Tus Productos:</h4>
        {{#each products}}
        <div style="margin-bottom: 10px;">
          <p><strong>{{name}}</strong></p>
          <p>{{description}}</p>
          <p>Cantidad: {{quantity}} | Precio: {{unitPrice}}</p>
        </div>
        {{/each}}
      </div>
    `,
    conditions: [
      { field: 'products', operator: 'exists', value: true }
    ],
    order: 4,
    dataMapping: {
      products: 'products'
    },
    required: false
  },
  {
    id: 'order_summary',
    name: 'Order Summary',
    type: 'content',
    template: `
      <div class="order-summary" style="background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #dee2e6;">
        <h4>💰 Resumen de la Orden:</h4>
        <p><strong>Número de Orden:</strong> {{orderNumber}}</p>
        <p><strong>Fecha:</strong> {{orderDate}}</p>
        <p><strong>Total Pagado:</strong> <span style="color: #4a7c2e; font-weight: bold;">{{orderTotal}}</span></p>
      </div>
    `,
    conditions: [],
    order: 5,
    dataMapping: {
      orderNumber: 'orderNumber',
      orderDate: (data) => new Date(data.orderDate).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      orderTotal: (data) => `S/. ${data.totalAmount.toFixed(2)}`
    },
    required: true
  },
  {
    id: 'shipping_info',
    name: 'Shipping Information',
    type: 'content',
    template: `
      <div class="shipping-info" style="background: #fff3cd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
        <h4>🚚 Información de Envío:</h4>
        <p><strong>Dirección:</strong> {{shippingAddress}}</p>
        <p><strong>Tiempo de Entrega:</strong> 3-5 días hábiles</p>
      </div>
    `,
    conditions: [
      { field: 'products', operator: 'exists', value: true }
    ],
    order: 6,
    dataMapping: {
      shippingAddress: (data) => {
        if (!data.shippingAddress) return 'No especificada';
        const addr = data.shippingAddress;
        return `${addr.address}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
      }
    },
    required: false
  },

  // SECTION COMPONENTS
  {
    id: 'reminders',
    name: 'Important Reminders',
    type: 'section',
    template: `
      <div class="reminders" style="background: #fff3cd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
        <h4>⚠️ Recordatorios Importantes:</h4>
        <ul>
          <li>📅 Llega 10 minutos antes de tu clase</li>
          <li>🧘‍♀️ Trae ropa cómoda para yoga</li>
          <li>📱 Mantén el teléfono en silencio durante la clase</li>
          <li>💧 Mantente hidratado antes y después</li>
          <li>🔄 Si necesitas cancelar o reprogramar, contáctanos con anticipación</li>
        </ul>
      </div>
    `,
    conditions: [],
    order: 7,
    dataMapping: {},
    required: false
  },
  {
    id: 'next_steps',
    name: 'Next Steps',
    type: 'section',
    template: `
      <div class="next-steps" style="background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
        <h4>🎯 Próximos Pasos:</h4>
        <ul>
          <li>📅 Reserva tu próxima clase</li>
          <li>🏃‍♀️ Prueba nuevos tipos de clases</li>
          <li>👥 Conecta con nuestra comunidad</li>
        </ul>
      </div>
    `,
    conditions: [],
    order: 8,
    dataMapping: {},
    required: false
  },

  // FOOTER COMPONENTS
  {
    id: 'standard_footer',
    name: 'Standard Footer',
    type: 'footer',
    template: `
      <div class="footer" style="text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px;">
        <p><strong>MATMAX Wellness Studio</strong></p>
        <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        <p>© 2025 MATMAX. Todos los derechos reservados.</p>
      </div>
    `,
    conditions: [],
    order: 9,
    dataMapping: {},
    required: true
  },

  // CONTACT FORM COMPONENTS
  {
    id: 'contact_admin_header',
    name: 'Contact Form Admin Header',
    type: 'header',
    template: `
      <div class="header" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1>📧 NUEVO MENSAJE DE CONTACTO</h1>
        <h2>MatMax Yoga Studio</h2>
        <p>Has recibido un nuevo mensaje desde el formulario de contacto</p>
      </div>
    `,
    conditions: [],
    order: 1,
    dataMapping: {},
    required: true
  },
  {
    id: 'contact_details',
    name: 'Contact Details',
    type: 'content',
    template: `
      <div class="contact-details" style="background: #f8f9fa; padding: 30px; margin: 20px 0; border-radius: 8px;">
        <h3 style="color: #2d5016; margin-bottom: 20px;">📋 Información del Contacto</h3>
        <div style="display: table; width: 100%;">
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold; width: 120px;">Nombre:</div>
            <div style="display: table-cell; padding: 8px 0;">{{customerName}}</div>
          </div>
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Email:</div>
            <div style="display: table-cell; padding: 8px 0;">{{customerEmail}}</div>
          </div>
          {{#if customerPhone}}
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Teléfono:</div>
            <div style="display: table-cell; padding: 8px 0;">{{customerPhone}}</div>
          </div>
          {{/if}}
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Idioma:</div>
            <div style="display: table-cell; padding: 8px 0;">{{language}}</div>
          </div>
        </div>
      </div>
    `,
    conditions: [],
    order: 2,
    dataMapping: {
      customerName: 'customerName',
      customerEmail: 'customerEmail',
      customerPhone: 'customerPhone',
      language: 'language'
    },
    required: true
  },
  {
    id: 'contact_message',
    name: 'Contact Message',
    type: 'content',
    template: `
      <div class="contact-message" style="background: white; padding: 30px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2d5016;">
        <h3 style="color: #2d5016; margin-bottom: 20px;">💬 Mensaje del Usuario</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6;">
          {{message}}
        </div>
      </div>
    `,
    conditions: [],
    order: 3,
    dataMapping: {
      message: 'message'
    },
    required: true
  },
  {
    id: 'contact_user_header',
    name: 'Contact Form User Header',
    type: 'header',
    template: `
      <div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1>🧘‍♀️ MATMAX YOGA STUDIO</h1>
        <h2>¡Gracias por contactarnos!</h2>
        <p>Hemos recibido tu mensaje exitosamente</p>
      </div>
    `,
    conditions: [],
    order: 1,
    dataMapping: {},
    required: true
  },
  {
    id: 'contact_confirmation_message',
    name: 'Contact Confirmation Message',
    type: 'content',
    template: `
      <div class="confirmation-message" style="background: #f8f9fa; padding: 30px; margin: 20px 0; border-radius: 8px;">
        <h3 style="color: #2d5016; margin-bottom: 20px;">Hola {{customerName}},</h3>
        <p style="line-height: 1.6; margin-bottom: 20px;">
          Hemos recibido tu mensaje y te responderemos en las próximas 24 horas. Mientras tanto, aquí tienes un resumen de lo que nos escribiste:
        </p>

        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #2d5016; margin: 20px 0;">
          <strong>Tu mensaje:</strong><br>
          <div style="margin-top: 10px; white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6;">
            {{message}}
          </div>
        </div>

        <p style="line-height: 1.6; margin-bottom: 20px;">
          Si tienes alguna pregunta urgente, no dudes en llamarnos directamente al <strong>+51 916 172 368</strong>.
        </p>

        <p style="line-height: 1.6;">
          <strong>Saludos cordiales,<br>
          El equipo de MatMax Yoga Studio</strong>
        </p>
      </div>
    `,
    conditions: [],
    order: 2,
    dataMapping: {
      customerName: 'customerName',
      message: 'message'
    },
    required: true
  },
  {
    id: 'contact_user_footer',
    name: 'Contact Form User Footer',
    type: 'footer',
    template: `
      <div class="footer" style="text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px;">
        <p><strong>MatMax Yoga Studio</strong></p>
        <p>📍 Calle Alcanfores 425, Miraflores, Lima</p>
        <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        <p>© 2025 MatMax Yoga Studio. Todos los derechos reservados.</p>
      </div>
    `,
    conditions: [],
    order: 3,
    dataMapping: {},
    required: true
  },

  // ORDER CONFIRMATION COMPONENTS
  {
    id: 'order_header',
    name: 'Order Confirmation Header',
    type: 'header',
    template: `
      <div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
        <h2>¡Pedido Confirmado!</h2>
        <p>Tu orden #{{orderNumber}} ha sido procesada exitosamente</p>
      </div>
    `,
    conditions: [],
    order: 1,
    dataMapping: {
      orderNumber: 'orderNumber'
    },
    required: true
  },
  {
    id: 'admin_order_header',
    name: 'Admin Order Notification Header',
    type: 'header',
    template: `
      <div class="header" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1>🆕 NUEVO PEDIDO RECIBIDO</h1>
        <h2>MatMax Wellness Studio</h2>
        <p>Se ha realizado un nuevo pedido en la plataforma</p>
      </div>
    `,
    conditions: [],
    order: 1,
    dataMapping: {},
    required: true
  },
  {
    id: 'order_details',
    name: 'Order Details',
    type: 'content',
    template: `
      <div class="order-details" style="background: #f8f9fa; padding: 30px; margin: 20px 0; border-radius: 8px;">
        <h3 style="color: #2d5016; margin-bottom: 20px;">📋 Detalles del Pedido</h3>
        <div style="display: table; width: 100%;">
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold; width: 140px;">Número de Orden:</div>
            <div style="display: table-cell; padding: 8px 0;">{{orderNumber}}</div>
          </div>
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Fecha del Pedido:</div>
            <div style="display: table-cell; padding: 8px 0;">{{orderDate}}</div>
          </div>
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Cliente:</div>
            <div style="display: table-cell; padding: 8px 0;">{{customerName}}</div>
          </div>
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Email:</div>
            <div style="display: table-cell; padding: 8px 0;">{{customerEmail}}</div>
          </div>
          {{#if customerPhone}}
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; font-weight: bold;">Teléfono:</div>
            <div style="display: table-cell; padding: 8px 0;">{{customerPhone}}</div>
          </div>
          {{/if}}
        </div>
      </div>
    `,
    conditions: [],
    order: 2,
    dataMapping: {
      orderNumber: 'orderNumber',
      orderDate: 'orderDate',
      customerName: 'customerName',
      customerEmail: 'customerEmail',
      customerPhone: 'customerPhone'
    },
    required: true
  },
  {
    id: 'order_items',
    name: 'Order Items',
    type: 'content',
    template: `
      <div class="order-items" style="background: white; padding: 30px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2d5016;">
        <h3 style="color: #2d5016; margin-bottom: 20px;">📦 Items del Pedido</h3>
        {{#each orderItems}}
        <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>{{name}}</strong>
              {{#if description}}<br><small style="color: #666;">{{description}}</small>{{/if}}
              <br><small style="color: #666;">Cantidad: {{quantity}} × {{currency}} {{unitPrice}}</small>
            </div>
            <div style="text-align: right;">
              <strong>{{currency}} {{totalPrice}}</strong>
            </div>
          </div>
        </div>
        {{/each}}

        <div style="border-top: 2px solid #2d5016; padding: 15px 0; margin-top: 15px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Subtotal:</span>
            <span>{{currency}} {{subtotal}}</span>
          </div>
          {{#if taxAmount}}
          <div style="display: flex; justify-content: space-between;">
            <span>Impuestos:</span>
            <span>{{currency}} {{taxAmount}}</span>
          </div>
          {{/if}}
          {{#if shippingAmount}}
          <div style="display: flex; justify-content: space-between;">
            <span>Envío:</span>
            <span>{{currency}} {{shippingAmount}}</span>
          </div>
          {{/if}}
          <div style="display: flex; justify-content: space-between; font-size: 18px; color: #2d5016; margin-top: 10px;">
            <span>TOTAL:</span>
            <span>{{currency}} {{totalAmount}}</span>
          </div>
        </div>
      </div>
    `,
    conditions: [],
    order: 3,
    dataMapping: {
      orderItems: 'orderItems',
      currency: 'currency',
      subtotal: 'subtotal',
      taxAmount: 'taxAmount',
      shippingAmount: 'shippingAmount',
      totalAmount: 'totalAmount'
    },
    required: true
  },
  {
    id: 'order_next_steps',
    name: 'Order Next Steps',
    type: 'content',
    template: `
      <div class="next-steps" style="background: #e8f5e8; padding: 30px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2d5016;">
        <h3 style="color: #2d5016; margin-bottom: 20px;">🎯 Próximos Pasos</h3>
        <ol style="line-height: 1.8; color: #333;">
          {{#if hasMatpass}}
          <li><strong>Activación de MatPass:</strong> Tu MatPass se activará automáticamente y recibirás instrucciones por email.</li>
          {{/if}}
          {{#if hasBookings}}
          <li><strong>Confirmación de Reserva:</strong> Recibirás confirmación de tu sesión programada por email y/o mensaje de texto.</li>
          {{/if}}
          {{#if hasProducts}}
          <li><strong>Envío de Productos:</strong> Procesaremos tu pedido y te enviaremos información de envío en las próximas 24-48 horas.</li>
          {{/if}}
          <li><strong>Acceso a Mi Cuenta:</strong> Puedes ver el estado de tu pedido en <a href="{{orderUrl}}" style="color: #2d5016;">tu cuenta</a>.</li>
          {{#if isPayLater}}
          <li><strong>Pago Pendiente:</strong> El enlace de pago ha sido enviado a tu email. Completa el pago para activar tus servicios.</li>
          {{/if}}
        </ol>

        <p style="margin-top: 20px; color: #666;">
          <strong>¿Necesitas ayuda?</strong> Contáctanos al +51 916 172 368 o responde a este email.
        </p>
      </div>
    `,
    conditions: [],
    order: 4,
    dataMapping: {
      hasMatpass: 'hasMatpass',
      hasBookings: 'hasBookings',
      hasProducts: 'hasProducts',
      hasShipping: 'hasShipping',
      isPayLater: 'isPayLater',
      orderUrl: 'orderUrl'
    },
    required: true
  },
  {
    id: 'admin_order_actions',
    name: 'Admin Order Actions',
    type: 'content',
    template: `
      <div class="admin-actions" style="background: #fff3cd; padding: 30px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-bottom: 20px;">⚡ Acciones Requeridas</h3>
        <ul style="line-height: 1.8; color: #333;">
          {{#if hasBookings}}
          <li><strong>Confirmar Reserva:</strong> Verificar disponibilidad y confirmar sesión con el instructor.</li>
          {{/if}}
          {{#if hasProducts}}
          <li><strong>Procesar Envío:</strong> Preparar productos para envío y actualizar tracking.</li>
          {{/if}}
          {{#if isPayLater}}
          <li><strong>Monitorear Pago:</strong> Asegurar que el cliente complete el pago pendiente.</li>
          {{/if}}
          <li><strong>Ver Pedido Completo:</strong> <a href="{{orderUrl}}" style="color: #856404; text-decoration: underline;">Ver detalles completos del pedido</a></li>
        </ul>
      </div>
    `,
    conditions: [],
    order: 4,
    dataMapping: {
      hasBookings: 'hasBookings',
      hasProducts: 'hasProducts',
      isPayLater: 'isPayLater',
      orderUrl: 'orderUrl'
    },
    required: true
  }
];
