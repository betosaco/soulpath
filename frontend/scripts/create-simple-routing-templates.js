import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createSimpleRoutingTemplates() {
  try {
    console.log('📧 Creating simple routing templates...\n');
    
    const templates = [
      {
        templateKey: 'welcome_matpass',
        name: 'Welcome MatPass - New Customer',
        description: 'Welcome email for new customers purchasing their first MatPass',
        category: 'welcome',
        type: 'email',
        isActive: true,
        translations: [
          {
            language: 'en',
            subject: 'Welcome to MATMAX! Your MatPass is Ready - {{userName}}',
            content: '<h1>Welcome to MATMAX!</h1><p>Your MatPass is ready: {{matpassType}}</p>'
          },
          {
            language: 'es',
            subject: '¡Bienvenido a MATMAX! Tu MatPass está Listo - {{userName}}',
            content: '<h1>¡Bienvenido a MATMAX!</h1><p>Tu MatPass está listo: {{matpassType}}</p>'
          }
        ]
      },
      {
        templateKey: 'renewal_matpass',
        name: 'Renewal MatPass - Existing Customer',
        description: 'Renewal email for existing customers purchasing a new MatPass',
        category: 'transaction',
        type: 'email',
        isActive: true,
        translations: [
          {
            language: 'en',
            subject: 'Your MatPass has been Renewed - {{userName}}',
            content: '<h1>MatPass Renewed!</h1><p>Your MatPass has been renewed: {{matpassType}}</p>'
          },
          {
            language: 'es',
            subject: 'Tu MatPass ha sido Renovado - {{userName}}',
            content: '<h1>¡MatPass Renovado!</h1><p>Tu MatPass ha sido renovado: {{matpassType}}</p>'
          }
        ]
      },
      {
        templateKey: 'products_only',
        name: 'Products Only Purchase',
        description: 'Email for customers purchasing only products (no MatPass)',
        category: 'transaction',
        type: 'email',
        isActive: true,
        translations: [
          {
            language: 'en',
            subject: 'Your Product Order Confirmation - {{userName}}',
            content: '<h1>Product Order Confirmed!</h1><p>Your products: {{productName}}</p>'
          },
          {
            language: 'es',
            subject: 'Confirmación de Pedido de Productos - {{userName}}',
            content: '<h1>¡Pedido de Productos Confirmado!</h1><p>Tus productos: {{productName}}</p>'
          }
        ]
      },
      {
        templateKey: 'booking_only',
        name: 'Booking Only - Existing Customer',
        description: 'Email for existing customers making a booking (no purchase)',
        category: 'booking',
        type: 'email',
        isActive: true,
        translations: [
          {
            language: 'en',
            subject: 'Your Booking Confirmation - {{userName}}',
            content: '<h1>Booking Confirmed!</h1><p>Your class: {{sessionType}} on {{bookingDate}}</p>'
          },
          {
            language: 'es',
            subject: 'Confirmación de Reserva - {{userName}}',
            content: '<h1>¡Reserva Confirmada!</h1><p>Tu clase: {{sessionType}} el {{bookingDate}}</p>'
          }
        ]
      }
    ];

    console.log('📝 Creating routing templates...');
    
    for (const template of templates) {
      const createdTemplate = await prisma.communicationTemplate.upsert({
        where: { 
          templateKey: template.templateKey 
        },
        update: {
          name: template.name,
          description: template.description,
          type: template.type,
          category: template.category,
          isActive: template.isActive
        },
        create: {
          templateKey: template.templateKey,
          name: template.name,
          description: template.description,
          type: template.type,
          category: template.category,
          isActive: template.isActive
        }
      });

      console.log(`✅ Template created: ${createdTemplate.name}`);

      // Create translations
      for (const translation of template.translations) {
        await prisma.communicationTemplateTranslation.upsert({
          where: {
            template_id_language: {
              template_id: createdTemplate.id,
              language: translation.language
            }
          },
          update: {
            subject: translation.subject,
            content: translation.content
          },
          create: {
            template_id: createdTemplate.id,
            language: translation.language,
            subject: translation.subject,
            content: translation.content
          }
        });

        console.log(`  ✅ Translation created: ${translation.language}`);
      }
    }

    console.log('\n🎉 Routing templates created successfully!');
    console.log('\n📋 New Templates Available:');
    console.log('1. welcome_matpass - New customer with MatPass');
    console.log('2. renewal_matpass - Existing customer renewal');
    console.log('3. products_only - Products without MatPass');
    console.log('4. booking_only - Booking from existing account');
    
  } catch (error) {
    console.error('❌ Error creating routing templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleRoutingTemplates();
