import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateTemplatesDirect() {
  try {
    console.log('🎨 Updating templates directly...\n');
    
    // Update Products Only template
    console.log('🔧 Updating Products Only template...');
    await prisma.$executeRaw`
      UPDATE "CommunicationTemplateTranslation" 
      SET content = $1
      WHERE "templateId" = (
        SELECT id FROM "CommunicationTemplate" 
        WHERE "templateKey" = 'products_only'
      ) AND language = 'en'
    `, `<!DOCTYPE html>
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
</html>`;
    
    console.log('✅ Products Only template updated');
    
    // Update Booking Only template
    console.log('🔧 Updating Booking Only template...');
    await prisma.$executeRaw`
      UPDATE "CommunicationTemplateTranslation" 
      SET content = $1
      WHERE "templateId" = (
        SELECT id FROM "CommunicationTemplate" 
        WHERE "templateKey" = 'booking_only'
      ) AND language = 'en'
    `, `<!DOCTYPE html>
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
</html>`;
    
    console.log('✅ Booking Only template updated');
    
    console.log('\n🎉 All templates have been updated!');
    
  } catch (error) {
    console.error('❌ Error updating templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTemplatesDirect();
