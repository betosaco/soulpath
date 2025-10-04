import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createRoutingTemplates() {
  try {
    console.log('📧 Creating routing system templates...\n');
    
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
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to MATMAX - Your MatPass is Ready</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .welcome-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .matpass-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ Welcome to MATMAX Wellness Studio!</h1>
            <h2>Your MatPass is Ready</h2>
        </div>
        
        <div class="content">
            <div class="welcome-section">
                <h3>🎉 Welcome {{userName}}!</h3>
                <p>We're thrilled to have you join the MATMAX community! Your MatPass is now active and ready to use.</p>
                
                <div class="matpass-info">
                    <h4>📱 Your MatPass Details:</h4>
                    <p><strong>Type:</strong> {{matpassType}}</p>
                    <p><strong>Description:</strong> {{matpassDescription}}</p>
                    <p><strong>Valid From:</strong> {{matpassStartDate}}</p>
                    <p><strong>Valid Until:</strong> {{matpassEndDate}}</p>
                    <p><strong>Total Sessions:</strong> {{matpassSessions}} sessions</p>
                </div>
                
                <p><strong>What's next?</strong></p>
                <ul>
                    <li>📅 Book your first class using your MatPass</li>
                    <li>🏃‍♀️ Explore our class schedule</li>
                    <li>👥 Join our community</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
          },
          {
            language: 'es',
            subject: '¡Bienvenido a MATMAX! Tu MatPass está Listo - {{userName}}',
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenido a MATMAX - Tu MatPass está Listo</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .welcome-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .matpass-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ ¡Bienvenido a MATMAX Wellness Studio!</h1>
            <h2>Tu MatPass está Listo</h2>
        </div>
        
        <div class="content">
            <div class="welcome-section">
                <h3>🎉 ¡Bienvenido {{userName}}!</h3>
                <p>¡Estamos emocionados de tenerte en la comunidad MATMAX! Tu MatPass está activo y listo para usar.</p>
                
                <div class="matpass-info">
                    <h4>📱 Detalles de tu MatPass:</h4>
                    <p><strong>Tipo:</strong> {{matpassType}}</p>
                    <p><strong>Descripción:</strong> {{matpassDescription}}</p>
                    <p><strong>Válido desde:</strong> {{matpassStartDate}}</p>
                    <p><strong>Válido hasta:</strong> {{matpassEndDate}}</p>
                    <p><strong>Total de sesiones:</strong> {{matpassSessions}} sesiones</p>
                </div>
                
                <p><strong>¿Qué sigue?</strong></p>
                <ul>
                    <li>📅 Reserva tu primera clase usando tu MatPass</li>
                    <li>🏃‍♀️ Explora nuestro horario de clases</li>
                    <li>👥 Únete a nuestra comunidad</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
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
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MatPass Renewed - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .renewal-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .matpass-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX Wellness Studio</h1>
            <h2>MatPass Renewed Successfully</h2>
        </div>
        
        <div class="content">
            <div class="renewal-section">
                <h3>🔄 MatPass Renewed {{userName}}!</h3>
                <p>Thank you for continuing your journey with MATMAX! Your MatPass has been successfully renewed.</p>
                
                <div class="matpass-info">
                    <h4>📱 Your Renewed MatPass:</h4>
                    <p><strong>Type:</strong> {{matpassType}}</p>
                    <p><strong>Description:</strong> {{matpassDescription}}</p>
                    <p><strong>Valid From:</strong> {{matpassStartDate}}</p>
                    <p><strong>Valid Until:</strong> {{matpassEndDate}}</p>
                    <p><strong>Total Sessions:</strong> {{matpassSessions}} sessions</p>
                </div>
                
                <p><strong>Keep enjoying your wellness journey!</strong></p>
                <ul>
                    <li>📅 Book your next class</li>
                    <li>🏃‍♀️ Try new class types</li>
                    <li>👥 Connect with our community</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
          },
          {
            language: 'es',
            subject: 'Tu MatPass ha sido Renovado - {{userName}}',
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MatPass Renovado - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .renewal-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .matpass-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX Wellness Studio</h1>
            <h2>MatPass Renovado Exitosamente</h2>
        </div>
        
        <div class="content">
            <div class="renewal-section">
                <h3>🔄 ¡MatPass Renovado {{userName}}!</h3>
                <p>¡Gracias por continuar tu viaje con MATMAX! Tu MatPass ha sido renovado exitosamente.</p>
                
                <div class="matpass-info">
                    <h4>📱 Tu MatPass Renovado:</h4>
                    <p><strong>Tipo:</strong> {{matpassType}}</p>
                    <p><strong>Descripción:</strong> {{matpassDescription}}</p>
                    <p><strong>Válido desde:</strong> {{matpassStartDate}}</p>
                    <p><strong>Válido hasta:</strong> {{matpassEndDate}}</p>
                    <p><strong>Total de sesiones:</strong> {{matpassSessions}} sesiones</p>
                </div>
                
                <p><strong>¡Sigue disfrutando tu viaje de bienestar!</strong></p>
                <ul>
                    <li>📅 Reserva tu próxima clase</li>
                    <li>🏃‍♀️ Prueba nuevos tipos de clase</li>
                    <li>👥 Conecta con nuestra comunidad</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
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
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Product Order Confirmation - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .order-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .product-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX Wellness Studio</h1>
            <h2>Product Order Confirmation</h2>
        </div>
        
        <div class="content">
            <div class="order-section">
                <h3>🛍️ Order Confirmed {{userName}}!</h3>
                <p>Thank you for your product purchase! Your order has been confirmed and will be processed soon.</p>
                
                <div class="product-info">
                    <h4>📦 Your Products:</h4>
                    <p><strong>Product:</strong> {{productName}}</p>
                    <p><strong>Description:</strong> {{productDescription}}</p>
                    <p><strong>Quantity:</strong> {{productQuantity}}</p>
                    <p><strong>Price:</strong> ${{productPrice}}</p>
                </div>
                
                <p><strong>What's next?</strong></p>
                <ul>
                    <li>📦 Your products will be prepared</li>
                    <li>📧 You'll receive shipping updates</li>
                    <li>🏃‍♀️ Consider joining our classes with a MatPass</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
          },
          {
            language: 'es',
            subject: 'Confirmación de Pedido de Productos - {{userName}}',
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Pedido de Productos - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .order-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .product-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX Wellness Studio</h1>
            <h2>Confirmación de Pedido de Productos</h2>
        </div>
        
        <div class="content">
            <div class="order-section">
                <h3>🛍️ ¡Pedido Confirmado {{userName}}!</h3>
                <p>¡Gracias por tu compra de productos! Tu pedido ha sido confirmado y será procesado pronto.</p>
                
                <div class="product-info">
                    <h4>📦 Tus Productos:</h4>
                    <p><strong>Producto:</strong> {{productName}}</p>
                    <p><strong>Descripción:</strong> {{productDescription}}</p>
                    <p><strong>Cantidad:</strong> {{productQuantity}}</p>
                    <p><strong>Precio:</strong> ${{productPrice}}</p>
                </div>
                
                <p><strong>¿Qué sigue?</strong></p>
                <ul>
                    <li>📦 Tus productos serán preparados</li>
                    <li>📧 Recibirás actualizaciones de envío</li>
                    <li>🏃‍♀️ Considera unirte a nuestras clases con un MatPass</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
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
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .booking-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .booking-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX Wellness Studio</h1>
            <h2>Booking Confirmation</h2>
        </div>
        
        <div class="content">
            <div class="booking-section">
                <h3>📅 Booking Confirmed {{userName}}!</h3>
                <p>Your class has been successfully booked using your existing MatPass.</p>
                
                <div class="booking-info">
                    <h4>📋 Your Booking Details:</h4>
                    <p><strong>Date:</strong> {{bookingDate}}</p>
                    <p><strong>Time:</strong> {{bookingTime}}</p>
                    <p><strong>Class Type:</strong> {{sessionType}}</p>
                    <p><strong>Instructor:</strong> {{teacherName}}</p>
                    <p><strong>Location:</strong> {{venue}}</p>
                </div>
                
                <p><strong>Important reminders:</strong></p>
                <ul>
                    <li>📅 Arrive 10 minutes early</li>
                    <li>🧘‍♀️ Bring comfortable clothes</li>
                    <li>📱 Keep phone on silent</li>
                    <li>💧 Stay hydrated</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
          },
          {
            language: 'es',
            subject: 'Confirmación de Reserva - {{userName}}',
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Reserva - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .booking-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .booking-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX Wellness Studio</h1>
            <h2>Confirmación de Reserva</h2>
        </div>
        
        <div class="content">
            <div class="booking-section">
                <h3>📅 ¡Reserva Confirmada {{userName}}!</h3>
                <p>Tu clase ha sido reservada exitosamente usando tu MatPass existente.</p>
                
                <div class="booking-info">
                    <h4>📋 Detalles de tu Reserva:</h4>
                    <p><strong>Fecha:</strong> {{bookingDate}}</p>
                    <p><strong>Hora:</strong> {{bookingTime}}</p>
                    <p><strong>Tipo de Clase:</strong> {{sessionType}}</p>
                    <p><strong>Instructor:</strong> {{teacherName}}</p>
                    <p><strong>Ubicación:</strong> {{venue}}</p>
                </div>
                
                <p><strong>Recordatorios importantes:</strong></p>
                <ul>
                    <li>📅 Llega 10 minutos antes</li>
                    <li>🧘‍♀️ Usa ropa cómoda</li>
                    <li>📱 Mantén el teléfono en silencio</li>
                    <li>💧 Mantente hidratado</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
        </div>
    </div>
</body>
</html>`
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

createRoutingTemplates();
