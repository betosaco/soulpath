import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Additional templates following the same comprehensive pattern
const additionalTemplates = {
  welcome_email: {
    name: 'Welcome Email - Complete',
    description: 'Comprehensive welcome email for new users with studio information and next steps',
    subject: 'Welcome to MATMAX Wellness Studio - {{userName}}',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Welcome</title>
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
                            <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 24px; font-weight: 600;">Welcome to MATMAX, {{userName}}!</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">We're thrilled to have you join our wellness community. Here's everything you need to know to get started.</p>
                        </td>
                    </tr>

                    <!-- Welcome Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #e8f5e9; border-left: 4px solid #4a7c2e; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #2d5016; font-size: 14px; font-weight: 600;">WELCOME TO MATMAX</p>
                                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Email: {{userEmail}}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #666; font-size: 12px;">Member Since</p>
                                            <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: 600;">{{submissionDate}}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- STUDIO INFORMATION SECTION -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Studio Header -->
                                <div style="background-color: #2d5016; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">🏢 About MATMAX Wellness Studio</h3>
                                </div>
                                
                                <!-- Studio Details -->
                                <div style="padding: 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">📍 Studio Information</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Location:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">Miraflores, Lima</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Classes:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">Hatha, Vinyasa, Yin Yoga</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Schedule:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">Monday - Sunday</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Contact:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{adminEmail}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Getting Started -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px; font-weight: 600;">🚀 Getting Started</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Browse our class schedule and book your first session</li>
                                    <li>Download our mobile app for easy booking</li>
                                    <li>Follow us on social media for wellness tips</li>
                                    <li>Join our community events and workshops</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Ready to start your wellness journey?</p>
                            <a href="mailto:{{adminEmail}}" style="display: inline-block; background-color: #4a7c2e; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Contact Us</a>
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
</html>`
  },
  
  appointment_cancelled: {
    name: 'Appointment Cancelled - Complete',
    description: 'Comprehensive cancellation email with refund information and rebooking options',
    subject: 'Your MATMAX Session Has Been Cancelled - {{bookingId}}',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Session Cancelled</title>
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
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">We're sorry to inform you that your session has been cancelled. Here are the details and next steps.</p>
                        </td>
                    </tr>

                    <!-- Cancellation Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #ffebee; border-left: 4px solid #f44336; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #d32f2f; font-size: 14px; font-weight: 600;">SESSION CANCELLED</p>
                                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Email: {{userEmail}}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #666; font-size: 12px;">Cancellation Date</p>
                                            <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: 600;">{{submissionDate}}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- CANCELLED SESSION SECTION -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #f44336; border-radius: 8px; overflow: hidden;">
                                <!-- Cancellation Header -->
                                <div style="background-color: #f44336; padding: 15px 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td>
                                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">❌ Cancelled Session</h3>
                                            </td>
                                            <td style="text-align: right;">
                                                <span style="background-color: rgba(255,255,255,0.2); color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;">ID: {{bookingId}}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Session Details -->
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
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Reason:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{cancellationReason}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Refund Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #e8f5e9; border-left: 4px solid #4a7c2e; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #2d5016; font-size: 16px; font-weight: 600;">💰 Refund Information</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Your payment will be refunded within 3-5 business days</li>
                                    <li>You can also choose to reschedule instead of refund</li>
                                    <li>Contact us if you have any questions about your refund</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Need to reschedule or have questions?</p>
                            <a href="mailto:{{adminEmail}}" style="display: inline-block; background-color: #4a7c2e; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Contact Support</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f5f0; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 10px 0; color: #2d5016; font-size: 16px; font-weight: 600; letter-spacing: 2px;">MATMAX WELLNESS STUDIO</p>
                            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Premium Yoga Classes in Miraflores, Lima</p>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 13px;">📧 {{adminEmail}} | �� matmax.world</p>
                            
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
</html>`
  }
};

async function createAdditionalTemplates() {
  try {
    console.log('🔄 Creating additional templates following the same pattern...');
    
    for (const [templateKey, templateData] of Object.entries(additionalTemplates)) {
      console.log(`📧 Creating ${templateKey}...`);
      
      // Create template
      const template = await prisma.communicationTemplate.upsert({
        where: { templateKey: templateKey },
        update: {
          name: templateData.name,
          description: templateData.description
        },
        create: {
          templateKey: templateKey,
          name: templateData.name,
          description: templateData.description,
          type: 'email',
          category: templateKey.includes('welcome') ? 'welcome' : 
                   templateKey.includes('cancelled') ? 'booking' : 'booking',
          isActive: true,
          isDefault: false
        }
      });
      
      // Create English translation
      await prisma.communicationTemplateTranslation.upsert({
        where: {
          templateId_language: {
            templateId: template.id,
            language: 'en'
          }
        },
        update: {
          subject: templateData.subject,
          content: templateData.content
        },
        create: {
          templateId: template.id,
          language: 'en',
          subject: templateData.subject,
          content: templateData.content
        }
      });
      
      console.log(`✅ ${templateKey} created successfully`);
    }
    
    console.log('🎉 All additional templates created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdditionalTemplates();
