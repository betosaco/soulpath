import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const englishHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0; color: #333;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f0;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 3px;">MATMAX</h1>
                            <p style="margin: 8px 0 0 0; color: #e8f5e9; font-size: 14px; letter-spacing: 1px;">WELLNESS STUDIO</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 24px; font-weight: 600;">Hello {{userName}},</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">Thank you for your purchase at MATMAX Wellness Studio. Here's your order summary.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fafafa; border: 2px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                                <h3 style="margin: 0 0 20px 0; color: #2d5016; font-size: 18px; font-weight: 600;">💰 Order Summary</h3>
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; color: #2d5016; font-size: 18px; font-weight: 700;">TOTAL</td>
                                        <td style="padding: 0; text-align: right; color: #2d5016; font-size: 22px; font-weight: 700;">S/ {{orderTotal}}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <a href="mailto:{{adminEmail}}" style="display: inline-block; background-color: #4a7c2e; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Contact Support</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f5f5f0; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 10px 0; color: #2d5016; font-size: 16px; font-weight: 600; letter-spacing: 2px;">MATMAX WELLNESS STUDIO</p>
                            <p style="margin: 0; color: #666; font-size: 13px;">📧 {{adminEmail}} | 🌐 matmax.world</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

async function updateTemplate() {
  try {
    console.log('🔄 Updating template with full HTML content...');
    
    const template = await prisma.communicationTemplate.findUnique({
      where: { templateKey: 'order_confirmation_matpass' }
    });
    
    if (!template) {
      console.error('❌ Template not found');
      return;
    }
    
    await prisma.communicationTemplateTranslation.upsert({
      where: {
        templateId_language: {
          templateId: template.id,
          language: 'en'
        }
      },
      update: {
        subject: 'Your MATMAX Order Confirmation',
        content: englishHTML,
        updatedAt: new Date()
      },
      create: {
        templateId: template.id,
        language: 'en',
        subject: 'Your MATMAX Order Confirmation',
        content: englishHTML
      }
    });
    
    console.log('✅ English template updated!');
    console.log('🎉 Done! You can now edit and preview it in the admin dashboard.');
    console.log('📧 Navigate to: http://localhost:3000/admin/email');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTemplate();
