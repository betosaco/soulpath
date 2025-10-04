import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const completeOrderHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0; color: #333;">
    
    <!-- Email Container -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f0;">
        <tr>
            <td style="padding: 40px 20px;">
                
                <!-- Main Content Card -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 3px;">MATMAX</h1>
                            <p style="margin: 8px 0 0 0; color: #e8f5e9; font-size: 14px; letter-spacing: 1px;">WELLNESS STUDIO</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 24px; font-weight: 600;">Hello {{userName}},</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">Thank you for your purchase at MATMAX Wellness Studio. Here's a summary of your order:</p>
                        </td>
                    </tr>

                    <!-- Order Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #f1f8e9; border-left: 4px solid #4a7c2e; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #2d5016; font-size: 14px; font-weight: 600;">ORDER CONFIRMATION</p>
                                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Email: {{userEmail}}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #666; font-size: 12px;">Date</p>
                                            <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: 600;">{{submissionDate}}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- MATPASS SECTION (Conditional) -->
                    {{#if hasMatpass}}
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- MATPASS Header -->
                                <div style="background-color: #2d5016; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">🎫 MATPASS Purchase</h3>
                                </div>
                                
                                <!-- MATPASS Details -->
                                <div style="padding: 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td width="80">
                                                <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #4a7c2e 0%, #2d5016 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 10px;">
                                                    <span style="font-size: 36px;">✨</span>
                                                </div>
                                            </td>
                                            <td style="padding-left: 20px; vertical-align: top;">
                                                <p style="margin: 0 0 6px 0; color: #2d5016; font-size: 18px; font-weight: 700;">{{matpassType}}</p>
                                                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; line-height: 1.5;">{{matpassDescription}}</p>
                                                <div style="background-color: #f1f8e9; display: inline-block; padding: 6px 12px; border-radius: 4px;">
                                                    <p style="margin: 0; color: #4a7c2e; font-size: 16px; font-weight: 700;">S/ {{matpassPrice}}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- MATPASS Validity -->
                                    <div style="margin-top: 15px; background-color: #fff3e0; padding: 12px 15px; border-radius: 6px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="50%">
                                                    <p style="margin: 0; color: #666; font-size: 12px;">Valid From</p>
                                                    <p style="margin: 4px 0 0 0; color: #e65100; font-size: 14px; font-weight: 600;">{{matpassStartDate}}</p>
                                                </td>
                                                <td width="50%" style="text-align: right;">
                                                    <p style="margin: 0; color: #666; font-size: 12px;">Valid Until</p>
                                                    <p style="margin: 4px 0 0 0; color: #e65100; font-size: 14px; font-weight: 600;">{{matpassEndDate}}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    {{/if}}

                    <!-- BOOKING SECTION (Conditional) -->
                    {{#if hasBooking}}
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Booking Header -->
                                <div style="background-color: #4a7c2e; padding: 15px 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td>
                                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">📅 Session Booking</h3>
                                            </td>
                                            <td style="text-align: right;">
                                                <span style="background-color: rgba(255,255,255,0.2); color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;">ID: {{bookingId}}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Booking Details -->
                                <div style="padding: 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">📍 Session Information</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Date:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{bookingDate}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Time:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{bookingTime}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Teacher:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherName}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Class:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{className}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Venue:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{venue}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>
                    {{/if}}

                    <!-- PRODUCTS SECTION (Conditional) -->
                    {{#if hasProducts}}
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Products Header -->
                                <div style="background-color: #2d5016; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">��️ Products Ordered</h3>
                                </div>
                                
                                <!-- Products List -->
                                <div style="padding: 20px;">
                                    <!-- Product Item (Repeat for each product) -->
                                    {{#each products}}
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px; border: 1px solid #e0e0e0;">
                                        <tr>
                                            <td width="80" style="vertical-align: top;">
                                                <div style="width: 70px; height: 70px; background-color: #e8f5e9; border-radius: 6px; overflow: hidden;">
                                                    <img src="{{productImage}}" alt="{{productName}}" style="width: 100%; height: 100%; object-fit: cover;" />
                                                </div>
                                            </td>
                                            <td style="padding-left: 15px; vertical-align: top;">
                                                <p style="margin: 0 0 6px 0; color: #2d5016; font-size: 15px; font-weight: 600;">{{productName}}</p>
                                                <p style="margin: 0 0 8px 0; color: #666; font-size: 13px; line-height: 1.5;">{{productDescription}}</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="color: #666; font-size: 13px;">Qty: {{productQuantity}}</td>
                                                        <td style="text-align: right;">
                                                            <span style="color: #4a7c2e; font-size: 16px; font-weight: 700;">S/ {{productPrice}}</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    {{/each}}
                                    
                                    <!-- Products Total -->
                                    <div style="background-color: #f1f8e9; padding: 15px; border-radius: 6px; margin-top: 10px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #2d5016; font-size: 15px; font-weight: 600;">Products Subtotal:</td>
                                                <td style="text-align: right; color: #2d5016; font-size: 18px; font-weight: 700;">S/ {{productsSubtotal}}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    {{/if}}

                    <!-- Order Summary Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fafafa; border: 2px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                                <h3 style="margin: 0 0 20px 0; color: #2d5016; font-size: 18px; font-weight: 600; border-bottom: 2px solid #4a7c2e; padding-bottom: 10px;">💰 Order Summary</h3>
                                
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <!-- MATPASS Subtotal -->
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">MATPASS</td>
                                        <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px; font-weight: 600;">S/ {{matpassSubtotal}}</td>
                                    </tr>
                                    
                                    <!-- Products Subtotal -->
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Products</td>
                                        <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px; font-weight: 600;">S/ {{productsSubtotal}}</td>
                                    </tr>
                                    
                                    <!-- Divider Line -->
                                    <tr>
                                        <td colspan="2" style="padding: 12px 0;">
                                            <div style="border-top: 1px solid #e0e0e0;"></div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Subtotal Before Tax -->
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 15px; font-weight: 600;">Subtotal</td>
                                        <td style="padding: 8px 0; text-align: right; color: #333; font-size: 15px; font-weight: 600;">S/ {{subtotalBeforeTax}}</td>
                                    </tr>
                                    
                                    <!-- IGV Tax (18%) -->
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px;">IGV (18%)</td>
                                        <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px; font-weight: 600;">S/ {{igvAmount}}</td>
                                    </tr>
                                    
                                    <!-- Bold Divider Line -->
                                    <tr>
                                        <td colspan="2" style="padding: 15px 0 12px 0;">
                                            <div style="border-top: 2px solid #4a7c2e;"></div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Total -->
                                    <tr>
                                        <td style="padding: 0; color: #2d5016; font-size: 18px; font-weight: 700;">TOTAL</td>
                                        <td style="padding: 0; text-align: right; color: #2d5016; font-size: 22px; font-weight: 700;">S/ {{orderTotal}}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Total Paid Banner -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); border-radius: 8px; padding: 20px; text-align: center;">
                                <p style="margin: 0 0 8px 0; color: #e8f5e9; font-size: 14px; letter-spacing: 1px;">TOTAL PAID</p>
                                <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 1px;">S/ {{orderTotal}}</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px; font-weight: 600;">⚠️ Important Session Reminders</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Arrive 10 minutes early for in-person sessions</li>
                                    <li>Bring comfortable clothing and your yoga mat</li>
                                    <li>Cancellations must be made 24 hours in advance</li>
                                    <li>Stay hydrated before and after your session</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Questions or need to make changes?</p>
                            <a href="mailto:{{adminEmail}}" style="display: inline-block; background-color: #4a7c2e; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Contact Support</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f5f0; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 10px 0; color: #2d5016; font-size: 16px; font-weight: 600; letter-spacing: 2px;">MATMAX WELLNESS STUDIO</p>
                            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Premium Yoga Classes in Miraflores, Lima</p>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">📧 {{adminEmail}} | 🌐 matmax.world</p>
                            
                            <!-- Social Links -->
                            <div style="margin: 20px 0;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">📘</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">📷</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #4a7c2e; text-decoration: none; font-size: 24px;">🐦</a>
                            </div>
                            
                            <p style="margin: 20px 0 0 0; color: #999; font-size: 11px; line-height: 1.6;">
                                © 2025 MATMAX Wellness Studio. All rights reserved.<br>
                                This email was sent to {{userEmail}}
                            </p>
                        </td>
                    </tr>

                </table>
                
            </td>
        </tr>
    </table>

</body>
</html>`;

async function addCompleteTemplate() {
  try {
    console.log('📧 Adding complete order confirmation template...');
    
    // Create the template
    const template = await prisma.communicationTemplate.upsert({
      where: { templateKey: 'order_confirmation_complete' },
      update: {
        name: 'Order Confirmation - Complete (MATPASS + Booking + Products)',
        description: 'Comprehensive order confirmation template for all purchase types with conditional sections',
        type: 'email',
        category: 'transaction',
        isActive: true,
        isDefault: false,
        updatedAt: new Date()
      },
      create: {
        templateKey: 'order_confirmation_complete',
        name: 'Order Confirmation - Complete (MATPASS + Booking + Products)',
        description: 'Comprehensive order confirmation template for all purchase types with conditional sections',
        type: 'email',
        category: 'transaction',
        isActive: true,
        isDefault: false
      }
    });
    
    console.log('✅ Template created with ID:', template.id);
    
    // Add English translation
    await prisma.communicationTemplateTranslation.upsert({
      where: {
        templateId_language: {
          templateId: template.id,
          language: 'en'
        }
      },
      update: {
        subject: 'Your MATMAX Order Confirmation - {{orderNumber}}',
        content: completeOrderHTML,
        updatedAt: new Date()
      },
      create: {
        templateId: template.id,
        language: 'en',
        subject: 'Your MATMAX Order Confirmation - {{orderNumber}}',
        content: completeOrderHTML
      }
    });
    
    console.log('✅ English template added!');
    console.log('🎉 Complete order confirmation template is ready!');
    console.log('📧 Navigate to: http://localhost:3000/admin/email');
    console.log('🔑 Template Key: order_confirmation_complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCompleteTemplate();
