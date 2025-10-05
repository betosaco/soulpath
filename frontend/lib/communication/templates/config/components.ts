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
  }
];
