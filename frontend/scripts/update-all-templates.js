import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Template patterns based on the Order Confirmation - Complete template
const templatePatterns = {
  booking_confirmation: {
    name: 'Booking Confirmation - Complete',
    description: 'Comprehensive booking confirmation email with session details and reminders',
    subject: 'Your MATMAX Booking Confirmation - {{bookingId}}',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Booking Confirmation</title>
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
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">Your booking has been confirmed at MATMAX Wellness Studio. Here are your session details:</p>
                        </td>
                    </tr>

                    <!-- Booking Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #f1f8e9; border-left: 4px solid #4a7c2e; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #2d5016; font-size: 14px; font-weight: 600;">BOOKING CONFIRMATION</p>
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

                    <!-- BOOKING SECTION -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Booking Header -->
                                <div style="background-color: #4a7c2e; padding: 15px 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td>
                                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">📅 Session Details</h3>
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

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px; font-weight: 600;">⚠️ Important Session Reminders</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Arrive 10 minutes early for your session</li>
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
</html>`
  },
  
  session_reminder: {
    name: 'Session Reminder - Complete',
    description: 'Comprehensive session reminder email with all details and preparation tips',
    subject: 'Your MATMAX Session Reminder - {{bookingDate}}',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Session Reminder</title>
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
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">This is a friendly reminder about your upcoming session at MATMAX Wellness Studio.</p>
                        </td>
                    </tr>

                    <!-- Reminder Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #e65100; font-size: 14px; font-weight: 600;">SESSION REMINDER</p>
                                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Email: {{userEmail}}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #666; font-size: 12px;">Reminder Date</p>
                                            <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: 600;">{{reminderDate}}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- SESSION SECTION -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #ff9800; border-radius: 8px; overflow: hidden;">
                                <!-- Session Header -->
                                <div style="background-color: #ff9800; padding: 15px 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td>
                                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">⏰ Upcoming Session</h3>
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

                    <!-- Preparation Tips -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #e8f5e9; border-left: 4px solid #4a7c2e; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #2d5016; font-size: 16px; font-weight: 600;">💡 Preparation Tips</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Arrive 10 minutes early to settle in</li>
                                    <li>Bring a water bottle and your yoga mat</li>
                                    <li>Wear comfortable, breathable clothing</li>
                                    <li>Avoid eating 2 hours before your session</li>
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
  }
};

async function updateAllTemplates() {
  try {
    console.log('🔄 Updating all email templates to follow the same pattern...');
    
    for (const [templateKey, templateData] of Object.entries(templatePatterns)) {
      console.log(`📧 Updating ${templateKey}...`);
      
      // Find existing template
      let template = await prisma.communicationTemplate.findUnique({
        where: { templateKey: templateKey }
      });
      
      if (template) {
        // Update existing template
        await prisma.communicationTemplate.update({
          where: { id: template.id },
          data: {
            name: templateData.name,
            description: templateData.description
          }
        });
        
        // Update English translation
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
        
        console.log(`✅ ${templateKey} updated successfully`);
      } else {
        console.log(`⚠️ Template ${templateKey} not found, skipping...`);
      }
    }
    
    console.log('🎉 All templates updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllTemplates();
