import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateRenewalCombinations() {
  try {
    console.log('🎨 Updating Renewal MatPass template to handle combinations with green theme...\n');
    
    const renewalMatpassContent = `<!DOCTYPE html>
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
        .booking-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e; }
        .product-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e; }
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
                    <p><strong>Price:</strong> ${{productPrice}}</p>
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

    console.log('✅ Renewal MatPass template updated with combination support!');
    console.log('📧 Template now supports:');
    console.log('  - MatPass only (existing customer renewal)');
    console.log('  - MatPass + Booking (existing customer with booking)');
    console.log('  - MatPass + Products (existing customer with products)');
    console.log('  - MatPass + Booking + Products (existing customer with all)');
    console.log('  - Green theme applied consistently');
    
  } catch (error) {
    console.error('❌ Error updating template:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRenewalCombinations();
