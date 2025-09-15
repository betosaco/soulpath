/**
 * API Route: Create Izipay Payment Intent
 * Creates a payment intent for Izipay payment processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { IzipayPaymentService } from '@/lib/izipay/payment-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/izipay/create-payment-intent - Starting request...');

    const body = await request.json();
    console.log('📝 Request body:', body);

    const {
      amount,
      currency = 'PEN',
      customerEmail,
      customerName,
      description,
      packagePriceId,
      quantity = 1,
      metadata = {}
    } = body;

    // Validate required fields
    if (!amount || !customerEmail) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Amount and customer email are required'
      }, { status: 400 });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      }, { status: 400 });
    }

    // Generate unique order ID
    const orderId = `WLN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get customer information
    let customer;
    try {
      customer = await prisma.user.findUnique({
        where: { email: customerEmail },
        select: { id: true, fullName: true, email: true }
      });
    } catch (error) {
      console.log('Customer not found in database, proceeding with provided info');
    }

    // Prepare payment intent parameters
    const paymentParams = {
      amount: amount,
      currency: currency.toUpperCase(),
      customerEmail: customerEmail,
      customerName: customerName || customer?.fullName || 'Customer',
      orderId: orderId,
      description: description || 'Wellness Services Payment',
      metadata: {
        ...metadata,
        packagePriceId: packagePriceId,
        quantity: quantity,
        customerEmail: customerEmail,
      }
    };

    console.log('💳 Creating Izipay payment intent with params:', paymentParams);

    // Load Izipay provider config from admin-configured payment methods
    let overrideConfig: any = null;
    try {
      const izipayMethod = await prisma.paymentMethodConfig.findFirst({
        where: { type: 'izipay', isActive: true },
        select: { providerConfig: true }
      });
      overrideConfig = izipayMethod?.providerConfig || null;
    } catch (e) {
      console.warn('Could not load Izipay providerConfig from DB. Falling back to env.');
    }

    // Create payment intent with Izipay
    const paymentResult = await IzipayPaymentService.createPaymentIntent(paymentParams, overrideConfig || undefined);

    if (!paymentResult.success) {
      console.error('❌ Izipay payment intent creation failed:', paymentResult.error);
      return NextResponse.json({
        success: false,
        error: 'Payment processing failed',
        message: paymentResult.error || 'Unable to create payment intent',
        details: paymentResult.details
      }, { status: 500 });
    }

    console.log('✅ Izipay payment intent created successfully');

    // Store payment intent in database for tracking
    try {
      await prisma.purchase.create({
        data: {
          userId: customer?.id || customerEmail,
          totalAmount: amount,
          currencyCode: currency.toUpperCase(),
          paymentMethod: 'izipay',
          paymentStatus: 'pending',
          transactionId: paymentResult.transactionId,
          notes: `Izipay payment - Order: ${orderId}`,
        }
      });
      console.log('✅ Purchase record created in database');
    } catch (dbError) {
      console.error('⚠️ Failed to create purchase record:', dbError);
      // Continue anyway as payment intent was created successfully
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: paymentResult.transactionId,
      orderId: orderId,
      amount: amount,
      currency: currency.toUpperCase(),
      message: 'Payment intent created successfully'
    });

  } catch (error) {
    console.error('❌ Error in POST /api/izipay/create-payment-intent:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
