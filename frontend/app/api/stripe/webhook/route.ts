import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe client inside the function to avoid build-time issues
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.warn('STRIPE_SECRET_KEY is not configured - Stripe webhook disabled');
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });
};

const getEndpointSecret = () => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('STRIPE_WEBHOOK_SECRET is not configured - Stripe webhook disabled');
    return null;
  }
  return secret;
};

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const endpointSecret = getEndpointSecret();

    // If Stripe is not configured, return success to avoid build errors
    if (!stripe || !endpointSecret) {
      console.log('Stripe webhook disabled - returning success');
      return NextResponse.json({ received: true, message: 'Stripe webhook disabled' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Processing webhook event:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, prisma);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, prisma);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, prisma);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, prisma: PrismaClient) {
  try {
    console.log('Processing checkout session completed:', session.id);

    const metadata = session.metadata;
    if (!metadata) {
      console.error('No metadata found in session');
      return;
    }

    const customerId = metadata.userId;
    const packageId = parseInt(metadata.packageId);
    const quantity = parseInt(metadata.quantity || '1');

    if (!customerId || !packageId) {
      console.error('Missing required metadata:', { customerId, packageId });
      return;
    }

    // Get package details
    const packageDefinition = await prisma.packageDefinition.findUnique({
      where: { id: packageId },
      include: {
        packagePrices: {
          where: { isActive: true },
          take: 1
        }
      }
    });

    if (!packageDefinition) {
      console.error('Package not found:', packageId);
      return;
    }

    const packagePrice = packageDefinition.packagePrices[0];
    if (!packagePrice) {
      console.error('No active price found for package:', packageId);
      return;
    }

    const totalAmount = Number(packagePrice.price) * quantity;

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: customerId,
        totalAmount: totalAmount,
        currency: packagePrice.currency.code,
        paymentMethod: 'stripe',
        paymentStatus: 'COMPLETED',
        transactionId: session.payment_intent as string,
        purchasedAt: new Date()
      }
    });

    // Create user packages for each quantity
    for (let i = 0; i < quantity; i++) {
      await prisma.userPackage.create({
        data: {
          userId: customerId,
          orderItemId: `stripe-${purchase.id}-${packagePrice.id}-${i}`,
          purchaseId: purchase.id,
          packagePriceId: packagePrice.id,
          quantity: 1,
          sessionsUsed: 0,
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      });
    }

    // Send confirmation email
    try {
      const { createEmailService } = await import('@/lib/brevo-email-service');
      const emailService = await createEmailService();
      
      if (emailService) {
        // Get user details
        const user = await prisma.user.findUnique({
          where: { id: customerId },
          select: { email: true, fullName: true }
        });

        if (user?.email) {
          // Send welcome email for new MatPass
          const { OrderEmailService } = await import('@/lib/communication/order-email-service');
          
          const templateEmailData = {
            customerName: user.fullName || user.email,
            customerEmail: user.email,
            customerPhone: '',
            orderNumber: `PURCHASE-${purchase.id}`,
            orderDate: new Date().toISOString(),
            totalAmount: totalAmount,
            currency: packagePrice.currency.code,
            subtotal: totalAmount,
            taxAmount: totalAmount * 0.18,
            shippingAmount: 0,
            paymentMethod: 'Credit Card',
            paymentStatus: 'COMPLETED',
            orderItems: [],
            matpassItems: [{
              name: packageDefinition.name,
              type: 'MatPass',
              quantity: 1,
              unitPrice: Number(packagePrice.price),
              totalPrice: Number(packagePrice.price),
              sessions: packageDefinition.sessionsCount,
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }],
            bookings: [],
            products: [],
            orderUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://matmax.world'}/packages`,
            websiteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://matmax.world'
          };

          await OrderEmailService.sendOrderConfirmationEmail(templateEmailData, 'en');
        }
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    console.log('Checkout session completed successfully');

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, prisma: PrismaClient) {
  try {
    console.log('Processing payment intent succeeded:', paymentIntent.id);

    // Update any pending purchases with this payment intent
    await prisma.purchase.updateMany({
      where: {
        transactionId: paymentIntent.id,
        paymentStatus: 'PENDING'
      },
      data: {
        paymentStatus: 'COMPLETED'
      }
    });

    console.log('Payment intent succeeded processed');

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent, prisma: PrismaClient) {
  try {
    console.log('Processing payment intent failed:', paymentIntent.id);

    // Update purchase record to failed
    await prisma.purchase.updateMany({
      where: {
        transactionId: paymentIntent.id,
        paymentStatus: 'PENDING'
      },
      data: {
        paymentStatus: 'FAILED'
      }
    });

    console.log('Payment intent failed processed');

  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Processing invoice payment succeeded:', invoice.id);
    // Handle invoice payment logic here if needed
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}