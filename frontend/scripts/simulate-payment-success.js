import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function simulatePaymentSuccess() {
  console.log('🎭 Simulating Payment Success Page Email Trigger\n');

  try {
    // Create a test user first
    const testUser = await prisma.user.upsert({
      where: { email: 'test-payment@matmax.world' },
      update: {},
      create: {
        email: 'test-payment@matmax.world',
        fullName: 'Test Payment User',
        phone: '+51987654321',
        status: 'ACTIVE'
      }
    });

    console.log('👤 Test user created/found:', testUser.email);

    // Simulate the payment success data that would be in sessionStorage
    const paymentSuccessData = {
      orderStatus: 'PAID',
      orderId: `SUCCESS-${Date.now()}`,
      amount: 20000, // 200.00 in cents
      currency: { symbol: 'S/.', code: 'PEN' },
      packageData: {
        id: 2,
        name: 'Paquete Premium de 8 Sesiones',
        description: '8 sesiones de yoga de 60 minutos cada una',
        sessionsCount: 8,
        price: 200.00,
        packageType: 'premium',
        maxGroupSize: 1,
        sessionDuration: {
          id: 1,
          name: '60 Minutes',
          duration_minutes: 60,
          description: 'Standard 60-minute session'
        }
      },
      bookingData: {
        clientName: testUser.fullName,
        clientEmail: testUser.email,
        clientPhone: testUser.phone
      },
      paymentData: {
        transactionId: `TXN-SUCCESS-${Date.now()}`,
        paymentMethod: 'Online Payment'
      }
    };

    console.log('📋 Payment Success Data:');
    console.log('- Order ID:', paymentSuccessData.orderId);
    console.log('- Amount:', paymentSuccessData.amount / 100, paymentSuccessData.currency.symbol);
    console.log('- Package:', paymentSuccessData.packageData.name);
    console.log('- Customer:', paymentSuccessData.bookingData.clientName);

    // Test sending email directly (simulating what the success page would do)
    console.log('\n📧 Testing direct email sending...');
    
    const { createEmailService } = await import('../lib/brevo-email-service.ts');
    const emailService = await createEmailService();

    if (emailService) {
      // Get template from database
      const { CommunicationTemplateService } = await import('../lib/communication/template-service.ts');
      const template = await CommunicationTemplateService.getTemplate(
        'package_purchase_confirmation',
        'es', // Spanish template
        {
          customer_name: paymentSuccessData.bookingData.clientName,
          package_name: paymentSuccessData.packageData.name,
          package_price: (paymentSuccessData.amount / 100).toFixed(2),
          quantity: '1',
          total_amount: `${paymentSuccessData.currency.symbol}${(paymentSuccessData.amount / 100).toFixed(2)}`,
          payment_method: paymentSuccessData.paymentData.paymentMethod,
          purchase_date: new Date().toLocaleDateString(),
          sessions_count: paymentSuccessData.packageData.sessionsCount.toString(),
          session_duration: paymentSuccessData.packageData.sessionDuration.duration_minutes.toString(),
          expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          booking_url: `${process.env.NEXT_PUBLIC_APP_URL}/schedule`,
          website_url: process.env.NEXT_PUBLIC_APP_URL || 'https://matmax.world'
        }
      );

      if (template) {
        await emailService.sendTemplateEmail(
          testUser.email,
          template.content,
          template.subject || 'Purchase Confirmation - MatMax Yoga Studio',
          {}
        );
        console.log('✅ Payment success email sent successfully!');
        console.log('📧 Check', testUser.email, 'for the confirmation email');
      } else {
        console.warn('⚠️ Template not found, using fallback');
        
        await emailService.sendEmail({
          to: testUser.email,
          subject: '¡Gracias por tu compra! - MatMax Yoga Studio',
          html: `
            <h1>¡Gracias por tu compra!</h1>
            <p>Hola ${paymentSuccessData.bookingData.clientName},</p>
            <p>Tu paquete ${paymentSuccessData.packageData.name} ha sido confirmado.</p>
            <p>Precio: ${paymentSuccessData.currency.symbol}${(paymentSuccessData.amount / 100).toFixed(2)}</p>
            <p>Fecha: ${new Date().toLocaleDateString()}</p>
          `
        });
        console.log('✅ Fallback email sent successfully!');
      }
    } else {
      console.error('❌ Email service not available');
    }

  } catch (error) {
    console.error('❌ Simulation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulatePaymentSuccess();
