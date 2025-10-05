import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateCombinationTemplates() {
  try {
    console.log('📧 Updating templates to handle combinations...\n');
    
    // Update welcome_matpass template to handle combinations
    const welcomeMatpassContent = `<!DOCTYPE html>
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
        .booking-info { background: #e8f4fd; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .product-info { background: #f0f8e8; padding: 20px; margin: 15px 0; border-radius: 5px; }
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
                
                {{#if hasBooking}}
                <div class="booking-info">
                    <h4>📅 Your First Booking:</h4>
                    <p><strong>Date:</strong> {{bookingDate}}</p>
                    <p><strong>Time:</strong> {{bookingTime}}</p>
                    <p><strong>Class Type:</strong> {{sessionType}}</p>
                    <p><strong>Instructor:</strong> {{teacherName}}</p>
                    <p><strong>Location:</strong> {{venue}}</p>
                </div>
                {{/if}}
                
                {{#if hasProducts}}
                <div class="product-info">
                    <h4>📦 Your Products:</h4>
                    <p><strong>Product:</strong> {{productName}}</p>
                    <p><strong>Description:</strong> {{productDescription}}</p>
                    <p><strong>Quantity:</strong> {{productQuantity}}</p>
                    <p><strong>Price:</strong> {{productPrice}}</p>
                </div>
                {{/if}}
                
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
</html>`;

    // Update renewal_matpass template to handle combinations
    const renewalMatpassContent = `<!DOCTYPE html>
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
        .booking-info { background: #e8f4fd; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .product-info { background: #f0f8e8; padding: 20px; margin: 15px 0; border-radius: 5px; }
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
                
                {{#if hasBooking}}
                <div class="booking-info">
                    <h4>📅 Your New Booking:</h4>
                    <p><strong>Date:</strong> {{bookingDate}}</p>
                    <p><strong>Time:</strong> {{bookingTime}}</p>
                    <p><strong>Class Type:</strong> {{sessionType}}</p>
                    <p><strong>Instructor:</strong> {{teacherName}}</p>
                    <p><strong>Location:</strong> {{venue}}</p>
                </div>
                {{/if}}
                
                {{#if hasProducts}}
                <div class="product-info">
                    <h4>📦 Your Products:</h4>
                    <p><strong>Product:</strong> {{productName}}</p>
                    <p><strong>Description:</strong> {{productDescription}}</p>
                    <p><strong>Quantity:</strong> {{productQuantity}}</p>
                    <p><strong>Price:</strong> {{productPrice}}</p>
                </div>
                {{/if}}
                
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
</html>`;

    // Update welcome_matpass template
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        template: {
          templateKey: 'welcome_matpass'
        },
        language: 'en'
      },
      data: {
        content: welcomeMatpassContent
      }
    });

    // Update renewal_matpass template
    await prisma.communicationTemplateTranslation.updateMany({
      where: {
        template: {
          templateKey: 'renewal_matpass'
        },
        language: 'en'
      },
      data: {
        content: renewalMatpassContent
      }
    });

    console.log('✅ Templates updated to handle combinations!');
    console.log('📧 Templates now support:');
    console.log('  - MatPass + Booking');
    console.log('  - MatPass + Products');
    console.log('  - MatPass + Booking + Products');
    
  } catch (error) {
    console.error('❌ Error updating templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCombinationTemplates();
