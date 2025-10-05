import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { communicationService } from '@/lib/services/communication-service';
import { generateModularEmail } from '@/lib/communication/templates/index';

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  language: z.enum(['en', 'es']).default('en')
});

// CORS headers helper
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 }));
    }

    const { name, email, phone, message, language } = validation.data;

    // Use the modular email system to generate emails
    const contactData = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message: message,
      language: language,
      isNewCustomer: true,
      hasMatpass: false,
      hasBookings: false,
      hasProducts: false,
      matpassCount: 0,
      bookingCount: 0,
      productCount: 0
    };

    // Generate admin notification email using modular system
    const adminEmail = await generateModularEmail('contact_form_admin', contactData, language as 'en' | 'es');
    const userEmail = await generateModularEmail('contact_form_confirmation', contactData, language as 'en' | 'es');

    // Send notification email to admin using CommunicationService
    const adminEmailResult = await communicationService.sendEmail({
      to: process.env.ADMIN_EMAIL || 'alberto@matmax.world',
      subject: adminEmail.subject,
      html: adminEmail.html,
      text: adminEmail.text
    });

    // Send confirmation email to user using CommunicationService
    const userEmailResult = await communicationService.sendEmail({
      to: email,
      subject: userEmail.subject,
      html: userEmail.html,
      text: userEmail.text
    });

    if (!adminEmailResult.success || !userEmailResult.success) {
      console.error('❌ Failed to send contact emails:', { adminEmailResult, userEmailResult });
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Failed to send contact emails' },
        { status: 500 }
      ));
    }

    console.log('✅ Contact form submitted successfully:', {
      name: name,
      email: email,
      phone: phone || 'Not provided',
      emailsSent: {
        admin: ADMIN_EMAIL,
        user: email
      }
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: language === 'es' 
        ? 'Mensaje enviado exitosamente. Te contactaremos pronto.' 
        : 'Message sent successfully. We will contact you soon.'
    }));

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    return addCorsHeaders(NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ));
  }
}
