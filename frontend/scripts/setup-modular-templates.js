import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setupModularTemplates() {
  try {
    console.log('🏗️ Setting up Modular Template System...\n');

    // Create email scenarios
    console.log('📋 Creating email scenarios...');
    const scenarios = [
      {
        id: 'new_customer_matpass_only',
        name: 'New Customer - MatPass Only',
        description: 'Welcome email for new customers purchasing only MatPass',
        customerType: 'new',
        orderTypes: ['matpass'],
        components: ['welcome_header', 'matpass_info', 'order_summary', 'next_steps', 'standard_footer'],
        subjectTemplate: 'new_customer_matpass',
        priority: 100,
        isActive: true
      },
      {
        id: 'existing_customer_matpass_only',
        name: 'Existing Customer - MatPass Only',
        description: 'Renewal email for existing customers purchasing only MatPass',
        customerType: 'existing',
        orderTypes: ['matpass'],
        components: ['renewal_header', 'matpass_info', 'order_summary', 'reminders', 'next_steps', 'standard_footer'],
        subjectTemplate: 'existing_customer_matpass',
        priority: 95,
        isActive: true
      },
      {
        id: 'new_customer_matpass_booking',
        name: 'New Customer - MatPass + Booking',
        description: 'Welcome email for new customers with MatPass and booking',
        customerType: 'new',
        orderTypes: ['matpass', 'booking'],
        components: ['welcome_header', 'matpass_info', 'booking_info', 'order_summary', 'next_steps', 'standard_footer'],
        subjectTemplate: 'new_customer_matpass_booking',
        priority: 90,
        isActive: true
      },
      {
        id: 'existing_customer_matpass_booking',
        name: 'Existing Customer - MatPass + Booking',
        description: 'Renewal email for existing customers with MatPass and booking',
        customerType: 'existing',
        orderTypes: ['matpass', 'booking'],
        components: ['renewal_header', 'matpass_info', 'booking_info', 'order_summary', 'reminders', 'next_steps', 'standard_footer'],
        subjectTemplate: 'existing_customer_matpass_booking',
        priority: 85,
        isActive: true
      },
      {
        id: 'new_customer_matpass_products',
        name: 'New Customer - MatPass + Products',
        description: 'Welcome email for new customers with MatPass and products',
        customerType: 'new',
        orderTypes: ['matpass', 'product'],
        components: ['welcome_header', 'matpass_info', 'product_info', 'order_summary', 'shipping_info', 'next_steps', 'standard_footer'],
        subjectTemplate: 'new_customer_matpass_products',
        priority: 85,
        isActive: true
      },
      {
        id: 'existing_customer_matpass_products',
        name: 'Existing Customer - MatPass + Products',
        description: 'Renewal email for existing customers with MatPass and products',
        customerType: 'existing',
        orderTypes: ['matpass', 'product'],
        components: ['renewal_header', 'matpass_info', 'product_info', 'order_summary', 'shipping_info', 'reminders', 'next_steps', 'standard_footer'],
        subjectTemplate: 'existing_customer_matpass_products',
        priority: 80,
        isActive: true
      },
      {
        id: 'new_customer_complete',
        name: 'New Customer - Complete Order',
        description: 'Welcome email for new customers with MatPass, booking, and products',
        customerType: 'new',
        orderTypes: ['matpass', 'booking', 'product'],
        components: ['welcome_header', 'matpass_info', 'booking_info', 'product_info', 'order_summary', 'shipping_info', 'next_steps', 'standard_footer'],
        subjectTemplate: 'new_customer_complete',
        priority: 80,
        isActive: true
      },
      {
        id: 'existing_customer_complete',
        name: 'Existing Customer - Complete Order',
        description: 'Renewal email for existing customers with MatPass, booking, and products',
        customerType: 'existing',
        orderTypes: ['matpass', 'booking', 'product'],
        components: ['renewal_header', 'matpass_info', 'booking_info', 'product_info', 'order_summary', 'shipping_info', 'reminders', 'next_steps', 'standard_footer'],
        subjectTemplate: 'existing_customer_complete',
        priority: 75,
        isActive: true
      },
      {
        id: 'fallback_generic',
        name: 'Generic Fallback',
        description: 'Generic email for unmatched scenarios',
        customerType: 'both',
        orderTypes: ['matpass', 'booking', 'product'],
        components: ['generic_header', 'order_summary', 'standard_footer'],
        subjectTemplate: 'generic',
        priority: 1,
        isActive: true
      }
    ];

    for (const scenario of scenarios) {
      await prisma.emailScenario.upsert({
        where: { id: scenario.id },
        update: scenario,
        create: scenario
      });
      console.log(`✅ Created scenario: ${scenario.name}`);
    }

    // Create email components
    console.log('\n🧩 Creating email components...');
    const components = [
      {
        id: 'welcome_header',
        name: 'Welcome Header',
        type: 'header',
        template: `<div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
          <h2>¡Bienvenido a tu Viaje de Bienestar!</h2>
          <p>Tu MatPass está listo y activo</p>
        </div>`,
        conditions: [
          { field: 'isNewCustomer', operator: 'equals', value: true }
        ],
        orderIndex: 1,
        dataMapping: {
          userName: 'customerName'
        },
        isRequired: true,
        isActive: true
      },
      {
        id: 'renewal_header',
        name: 'Renewal Header',
        type: 'header',
        template: `<div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
          <h2>MatPass Renovado Exitosamente</h2>
          <p>¡Gracias por continuar tu viaje con MATMAX!</p>
        </div>`,
        conditions: [
          { field: 'isNewCustomer', operator: 'equals', value: false }
        ],
        orderIndex: 1,
        dataMapping: {
          userName: 'customerName'
        },
        isRequired: true,
        isActive: true
      },
      {
        id: 'generic_header',
        name: 'Generic Header',
        type: 'header',
        template: `<div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
          <h2>Confirmación de Pedido</h2>
        </div>`,
        conditions: [],
        orderIndex: 1,
        dataMapping: {},
        isRequired: true,
        isActive: true
      },
      {
        id: 'matpass_info',
        name: 'MatPass Information',
        type: 'content',
        template: `<div class="matpass-info" style="background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
          <h4>📱 Tu MatPass:</h4>
          <p><strong>Tipo:</strong> {{matpassType}}</p>
          <p><strong>Descripción:</strong> {{matpassDescription}}</p>
          <p><strong>Válido desde:</strong> {{matpassStartDate}}</p>
          <p><strong>Válido hasta:</strong> {{matpassEndDate}}</p>
          <p><strong>Total de sesiones:</strong> {{matpassSessions}} sesiones</p>
        </div>`,
        conditions: [
          { field: 'matpassItems', operator: 'exists', value: true }
        ],
        orderIndex: 2,
        dataMapping: {
          matpassType: 'matpassItems.0.name',
          matpassDescription: 'matpassItems.0.description',
          matpassStartDate: 'matpassStartDate',
          matpassEndDate: 'matpassItems.0.expiryDate',
          matpassSessions: 'matpassItems.0.sessions'
        },
        isRequired: false,
        isActive: true
      },
      {
        id: 'booking_info',
        name: 'Booking Information',
        type: 'content',
        template: `<div class="booking-info" style="background: #e8f4fd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
          <h4>📅 Tu Reserva:</h4>
          <p><strong>Fecha:</strong> {{bookingDate}}</p>
          <p><strong>Hora:</strong> {{bookingTime}}</p>
          <p><strong>Tipo de Clase:</strong> {{sessionType}}</p>
          <p><strong>Instructor:</strong> {{teacherName}}</p>
          <p><strong>Ubicación:</strong> {{venue}}</p>
        </div>`,
        conditions: [
          { field: 'bookings', operator: 'exists', value: true }
        ],
        orderIndex: 3,
        dataMapping: {
          bookingDate: 'bookings.0.bookingDate',
          bookingTime: 'bookings.0.bookingTime',
          sessionType: 'bookings.0.sessionType',
          teacherName: 'bookings.0.teacherName',
          venue: 'bookings.0.venue'
        },
        isRequired: false,
        isActive: true
      },
      {
        id: 'product_info',
        name: 'Product Information',
        type: 'content',
        template: `<div class="product-info" style="background: #f0f8e8; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
          <h4>📦 Tus Productos:</h4>
          {{#each products}}
          <div style="margin-bottom: 10px;">
            <p><strong>{{name}}</strong></p>
            <p>{{description}}</p>
            <p>Cantidad: {{quantity}} | Precio: {{unitPrice}}</p>
          </div>
          {{/each}}
        </div>`,
        conditions: [
          { field: 'products', operator: 'exists', value: true }
        ],
        orderIndex: 4,
        dataMapping: {
          products: 'products'
        },
        isRequired: false,
        isActive: true
      },
      {
        id: 'order_summary',
        name: 'Order Summary',
        type: 'content',
        template: `<div class="order-summary" style="background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #dee2e6;">
          <h4>💰 Resumen de la Orden:</h4>
          <p><strong>Número de Orden:</strong> {{orderNumber}}</p>
          <p><strong>Fecha:</strong> {{orderDate}}</p>
          <p><strong>Total Pagado:</strong> <span style="color: #4a7c2e; font-weight: bold;">{{orderTotal}}</span></p>
        </div>`,
        conditions: [],
        orderIndex: 5,
        dataMapping: {
          orderNumber: 'orderNumber',
          orderDate: 'orderDate',
          orderTotal: 'orderTotal'
        },
        isRequired: true,
        isActive: true
      },
      {
        id: 'shipping_info',
        name: 'Shipping Information',
        type: 'content',
        template: `<div class="shipping-info" style="background: #fff3cd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
          <h4>🚚 Información de Envío:</h4>
          <p><strong>Dirección:</strong> {{shippingAddress}}</p>
          <p><strong>Tiempo de Entrega:</strong> 3-5 días hábiles</p>
        </div>`,
        conditions: [
          { field: 'products', operator: 'exists', value: true }
        ],
        orderIndex: 6,
        dataMapping: {
          shippingAddress: 'shippingAddress'
        },
        isRequired: false,
        isActive: true
      },
      {
        id: 'reminders',
        name: 'Important Reminders',
        type: 'section',
        template: `<div class="reminders" style="background: #fff3cd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
          <h4>⚠️ Recordatorios Importantes:</h4>
          <ul>
            <li>📅 Llega 10 minutos antes de tu clase</li>
            <li>🧘‍♀️ Trae ropa cómoda para yoga</li>
            <li>📱 Mantén el teléfono en silencio durante la clase</li>
            <li>💧 Mantente hidratado antes y después</li>
            <li>🔄 Si necesitas cancelar o reprogramar, contáctanos con anticipación</li>
          </ul>
        </div>`,
        conditions: [],
        orderIndex: 7,
        dataMapping: {},
        isRequired: false,
        isActive: true
      },
      {
        id: 'next_steps',
        name: 'Next Steps',
        type: 'section',
        template: `<div class="next-steps" style="background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
          <h4>🎯 Próximos Pasos:</h4>
          <ul>
            <li>📅 Reserva tu próxima clase</li>
            <li>🏃‍♀️ Prueba nuevos tipos de clases</li>
            <li>👥 Conecta con nuestra comunidad</li>
          </ul>
        </div>`,
        conditions: [],
        orderIndex: 8,
        dataMapping: {},
        isRequired: false,
        isActive: true
      },
      {
        id: 'standard_footer',
        name: 'Standard Footer',
        type: 'footer',
        template: `<div class="footer" style="text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px;">
          <p><strong>MATMAX Wellness Studio</strong></p>
          <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
          <p>© 2025 MATMAX. Todos los derechos reservados.</p>
        </div>`,
        conditions: [],
        orderIndex: 9,
        dataMapping: {},
        isRequired: true,
        isActive: true
      }
    ];

    for (const component of components) {
      await prisma.emailComponent.upsert({
        where: { id: component.id },
        update: component,
        create: component
      });
      console.log(`✅ Created component: ${component.name}`);
    }

    // Create subject templates
    console.log('\n📝 Creating subject templates...');
    const subjectTemplates = [
      {
        id: 'new_customer_matpass',
        template: '¡Bienvenido a MATMAX, {{userName}}! Tu MatPass está listo',
        placeholders: ['userName'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'existing_customer_matpass',
        template: 'MatPass Renovado - {{userName}} ({{matpassSessions}} sesiones)',
        placeholders: ['userName', 'matpassSessions'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'new_customer_matpass_booking',
        template: '¡Bienvenido {{userName}}! Tu MatPass y reserva están listos',
        placeholders: ['userName'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'existing_customer_matpass_booking',
        template: 'MatPass Renovado + Reserva - {{userName}}',
        placeholders: ['userName'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'new_customer_matpass_products',
        template: '¡Bienvenido {{userName}}! Tu MatPass y productos están listos',
        placeholders: ['userName'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'existing_customer_matpass_products',
        template: 'MatPass Renovado + Productos - {{userName}}',
        placeholders: ['userName'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'new_customer_complete',
        template: '¡Bienvenido {{userName}}! Tu pedido completo está listo',
        placeholders: ['userName'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'existing_customer_complete',
        template: 'Pedido Completo Renovado - {{userName}}',
        placeholders: ['userName'],
        maxLength: 60,
        isActive: true
      },
      {
        id: 'generic',
        template: 'Confirmación de Pedido - {{orderNumber}}',
        placeholders: ['orderNumber'],
        maxLength: 60,
        isActive: true
      }
    ];

    for (const subject of subjectTemplates) {
      await prisma.emailSubjectTemplate.upsert({
        where: { id: subject.id },
        update: subject,
        create: subject
      });
      console.log(`✅ Created subject template: ${subject.id}`);
    }

    console.log('\n🎉 Modular Template System setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - ${scenarios.length} email scenarios created`);
    console.log(`  - ${components.length} email components created`);
    console.log(`  - ${subjectTemplates.length} subject templates created`);
    console.log('\n🚀 The modular template system is now ready to use!');

  } catch (error) {
    console.error('❌ Error setting up modular templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupModularTemplates();
