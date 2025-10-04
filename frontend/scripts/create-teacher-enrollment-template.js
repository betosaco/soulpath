import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createTeacherEnrollmentTemplate() {
  try {
    console.log('🔄 Creating Teacher Enrollment template...');
    
    const templateData = {
      name: 'Teacher Enrollment - Complete',
      description: 'Comprehensive teacher enrollment email with onboarding information and next steps',
      subject: 'Welcome to MATMAX as a Teacher - {{teacherName}}',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATMAX Wellness Studio - Teacher Enrollment</title>
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
                            <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 24px; font-weight: 600;">Welcome to MATMAX, {{teacherName}}!</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">We're excited to have you join our teaching team. Here's everything you need to know to get started as a MATMAX instructor.</p>
                        </td>
                    </tr>

                    <!-- Teacher Enrollment Summary Header -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #e8f5e9; border-left: 4px solid #4a7c2e; padding: 15px 20px; border-radius: 4px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #2d5016; font-size: 14px; font-weight: 600;">TEACHER ENROLLMENT</p>
                                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">Email: {{teacherEmail}}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #666; font-size: 12px;">Enrollment Date</p>
                                            <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: 600;">{{submissionDate}}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- TEACHER INFORMATION SECTION -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Teacher Header -->
                                <div style="background-color: #2d5016; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">👨‍🏫 Teacher Profile</h3>
                                </div>
                                
                                <!-- Teacher Details -->
                                <div style="padding: 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">📍 Teacher Information</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Name:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherName}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Email:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherEmail}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Phone:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherPhone}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Specialties:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherSpecialties}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Experience:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherExperience}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- TEACHER DASHBOARD ACCESS -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="border: 2px solid #4a7c2e; border-radius: 8px; overflow: hidden;">
                                <!-- Dashboard Header -->
                                <div style="background-color: #4a7c2e; padding: 15px 20px;">
                                    <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">🎛️ Teacher Dashboard Access</h3>
                                </div>
                                
                                <!-- Dashboard Details -->
                                <div style="padding: 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0 0 12px 0; color: #2d5016; font-size: 15px; font-weight: 600;">🔑 Access Information</p>
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Dashboard URL:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{dashboardUrl}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Login Email:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{teacherEmail}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" style="color: #666; font-size: 14px; padding: 6px 0;">Temporary Password:</td>
                                                        <td style="color: #333; font-size: 14px; font-weight: 600; padding: 6px 0;">{{temporaryPassword}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Next Steps -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px; font-weight: 600;">🚀 Next Steps</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Log into your teacher dashboard using the credentials above</li>
                                    <li>Complete your teacher profile with bio and photos</li>
                                    <li>Set your availability and teaching schedule</li>
                                    <li>Upload your certifications and credentials</li>
                                    <li>Attend the teacher orientation session</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Teacher Resources -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #e8f5e9; border-left: 4px solid #4a7c2e; padding: 20px; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px 0; color: #2d5016; font-size: 16px; font-weight: 600;">📚 Teacher Resources</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                    <li>Teacher Handbook and Guidelines</li>
                                    <li>Class planning templates and resources</li>
                                    <li>Student management best practices</li>
                                    <li>Marketing and promotion guidelines</li>
                                    <li>Payment and commission information</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Questions about your teacher account or need support?</p>
                            <a href="mailto:{{adminEmail}}" style="display: inline-block; background-color: #4a7c2e; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">Contact Teacher Support</a>
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
                                This email was sent to {{teacherEmail}}
                            </p>
                        </td>
                    </tr>

                </table>
                
            </td>
        </tr>
    </table>

</body>
</html>`
    };
    
    // Create or update the teacher enrollment template
    const template = await prisma.communicationTemplate.upsert({
      where: { templateKey: 'teacher_enrollment' },
      update: {
        name: templateData.name,
        description: templateData.description
      },
      create: {
        templateKey: 'teacher_enrollment',
        name: templateData.name,
        description: templateData.description,
        type: 'email',
        category: 'teacher',
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
    
    console.log('✅ English template added!');
    console.log('🎉 Teacher Enrollment template is ready!');
    console.log('📧 Navigate to: http://localhost:3000/admin/email');
    console.log('🔑 Template Key: teacher_enrollment');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTeacherEnrollmentTemplate();
