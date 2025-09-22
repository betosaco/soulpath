import { createEmailService } from '@/lib/brevo-email-service';

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
  sessionType: string;
  instructor?: string;
  venue?: string;
  duration: number;
  packageName: string;
  packageDescription?: string;
  sessionsUsed: number;
  sessionsRemaining: number;
  packageType: string;
  bookingUrl: string;
  language?: string;
}

export async function sendBookingConfirmationEmail(bookingData: BookingEmailData): Promise<boolean> {
  try {
    // Get email configuration using the same method as createEmailService
    const emailService = await createEmailService();

    if (!emailService) {
      console.error('Email service not available - Brevo configuration not found');
      return false;
    }

    // Prepare template variables for Brevo
    const templateVars = {
      // Customer information
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,

      // Booking details
      bookingId: bookingData.bookingId,
      bookingDate: bookingData.bookingDate,
      bookingTime: bookingData.bookingTime,
      sessionType: bookingData.sessionType,
      instructor: bookingData.instructor || '',
      venue: bookingData.venue || '',
      duration: bookingData.duration,
      bookingStatus: 'Confirmada',

      // Package information
      packageName: bookingData.packageName,
      packageDescription: bookingData.packageDescription || '',
      packageType: bookingData.packageType,
      sessionsUsed: bookingData.sessionsUsed,
      sessionsRemaining: bookingData.sessionsRemaining,

      // URLs and contact
      bookingUrl: bookingData.bookingUrl,
      contactEmail: 'info@matmax.store',
      contactPhone: '+51 916 172 368',
      contactAddress: 'Calle Alcanfores 425, Miraflores - Lima, PE',
      language: bookingData.language || 'es'
    };

    // Send email using Brevo service
    const emailResult = await emailService.sendEmail({
      to: bookingData.customerEmail,
      subject: '¡Reserva Confirmada! - MatMax Yoga Studio',
      html: htmlContent,
      text: textContent
    });

    if (!emailResult) {
      console.error('Failed to send booking confirmation email');
      return false;
    }

    console.log('Booking confirmation email sent successfully');
    return true;

  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return false;
  }
}
