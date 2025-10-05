import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateTemplatesSimple() {
  try {
    console.log('🎨 Updating templates to use green theme...\n');
    
    // Update Renewal MatPass template
    console.log('🔧 Updating Renewal MatPass template...');
    await prisma.communicationTemplate.updateMany({
      where: { templateKey: 'renewal_matpass' },
      data: {}
    });
    
    await prisma.communicationTemplateTranslation.updateMany({
      where: { 
        template: { templateKey: 'renewal_matpass' },
        language: 'en'
      },
      data: {
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MatPass Renewed - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .renewal-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4a7c2e; }
        .matpass-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
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
      }
    });
    
    console.log('✅ Renewal MatPass template updated');
    
    // Update Welcome MatPass template
    console.log('🔧 Updating Welcome MatPass template...');
    await prisma.communicationTemplateTranslation.updateMany({
      where: { 
        template: { templateKey: 'welcome_matpass' },
        language: 'en'
      },
      data: {
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to MATMAX - Your MatPass is Ready</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .welcome-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4a7c2e; }
        .matpass-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px; }
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
      }
    });
    
    console.log('✅ Welcome MatPass template updated');
    
    // Update Products Only template
    console.log('🔧 Updating Products Only template...');
    await prisma.communicationTemplateTranslation.updateMany({
      where: { 
        template: { templateKey: 'products_only' },
        language: 'en'
      },
      data: {
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Product Order Confirmation - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .order-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4a7c2e; }
        .product-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
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
      }
    });
    
    console.log('✅ Products Only template updated');
    
    // Update Booking Only template
    console.log('🔧 Updating Booking Only template...');
    await prisma.communicationTemplateTranslation.updateMany({
      where: { 
        template: { templateKey: 'booking_only' },
        language: 'en'
      },
      data: {
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .booking-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4a7c2e; }
        .booking-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
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
      }
    });
    
    console.log('✅ Booking Only template updated');
    
    // Update Appointment Cancelled template (Spanish)
    console.log('🔧 Updating Appointment Cancelled template...');
    await prisma.communicationTemplateTranslation.updateMany({
      where: { 
        template: { templateKey: 'appointment_cancelled' },
        language: 'es'
      },
      data: {
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Clase Cancelada - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .cancellation-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4a7c2e; }
        .booking-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .refund-info { background: #fff3e0; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ff9800; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
            <h2>Clase Cancelada</h2>
        </div>
        
        <div class="content">
            <div class="cancellation-section">
                <h3>❌ Clase Cancelada {{userName}}!</h3>
                <p>Lamentamos informarte que tu sesión ha sido cancelada. Aquí están los detalles y próximos pasos.</p>
                
                <div class="booking-info">
                    <h4>📋 Detalles de la Clase Cancelada:</h4>
                    <p><strong>Fecha:</strong> {{bookingDate}}</p>
                    <p><strong>Hora:</strong> {{bookingTime}}</p>
                    <p><strong>Instructor:</strong> {{teacherName}}</p>
                    <p><strong>Tipo de Clase:</strong> {{className}}</p>
                    <p><strong>Razón:</strong> {{cancellationReason}}</p>
                </div>
                
                <div class="refund-info">
                    <h4>💰 Información de Reembolso</h4>
                    <ul>
                        <li>Tu pago será reembolsado en 3-5 días hábiles</li>
                        <li>También puedes elegir reprogramar en lugar de reembolso</li>
                        <li>Contáctanos si tienes preguntas sobre tu reembolso</li>
                    </ul>
                </div>
                
                <p><strong>¿Necesitas reprogramar o tienes preguntas?</strong></p>
                <p>Contáctanos: {{adminEmail}}</p>
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
    });
    
    console.log('✅ Appointment Cancelled template updated');
    
    console.log('\n🎉 All templates have been updated with green theme!');
    
  } catch (error) {
    console.error('❌ Error updating templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTemplatesSimple();
