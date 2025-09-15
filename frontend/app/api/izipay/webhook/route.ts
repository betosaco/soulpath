import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * Izipay Webhook Handler
 * Handles asynchronous payment status notifications from Izipay
 * Implements HMAC signature validation for security
 */

export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed',
    message: 'This endpoint only accepts POST requests'
  }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Izipay webhook received');

    // Read raw request body for HMAC validation
    const rawBody = await request.text();
    console.log('🔍 Raw webhook body length:', rawBody.length);

    // Get HMAC signature from headers
    const krHash = request.headers.get('kr-hash');
    if (!krHash) {
      console.error('❌ Missing kr-hash header');
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Missing signature header'
      }, { status: 401 });
    }

    console.log('🔍 Received kr-hash:', krHash);

    // Get Izipay HMAC secret from database
    const izipayPaymentMethod = await prisma.paymentMethodConfig.findFirst({
      where: {
        type: 'izipay',
        isActive: true
      },
      select: {
        id: true,
        type: true,
        name: true,
        description: true,
        icon: true,
        isActive: true,
        requiresConfirmation: true,
        autoAssignPackage: true,
        providerConfig: true
      }
    });

    if (!izipayPaymentMethod || !((izipayPaymentMethod.providerConfig as Record<string, unknown>)?.izipayConfig as Record<string, unknown>)?.hmacKey) {
      console.error('❌ Izipay configuration not found or HMAC key missing');
      return NextResponse.json({ 
        error: 'Configuration error',
        message: 'Izipay configuration not found'
      }, { status: 500 });
    }

    const hmacSecret = ((izipayPaymentMethod.providerConfig as Record<string, unknown>)?.izipayConfig as Record<string, unknown>)?.hmacKey as string;
    console.log('🔍 HMAC secret found, length:', hmacSecret.length);

    // Calculate HMAC signature
    const calculatedHash = crypto
      .createHmac('sha256', hmacSecret)
      .update(rawBody, 'utf8')
      .digest('base64');

    console.log('🔍 Calculated hash:', calculatedHash);

    // Verify HMAC signature
    if (calculatedHash !== krHash) {
      console.error('❌ HMAC signature verification failed');
      console.error('Expected:', calculatedHash);
      console.error('Received:', krHash);
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Invalid signature'
      }, { status: 401 });
    }

    console.log('✅ HMAC signature verified successfully');

    // Parse webhook data
    const webhookData = new URLSearchParams(rawBody);
    const krAnswer = webhookData.get('kr-answer');

    if (!krAnswer) {
      console.error('❌ Missing kr-answer in webhook data');
      return NextResponse.json({ 
        error: 'Bad request',
        message: 'Missing kr-answer data'
      }, { status: 400 });
    }

    let paymentData;
    try {
      paymentData = JSON.parse(krAnswer);
      console.log('🔍 Parsed webhook data:', JSON.stringify(paymentData, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse kr-answer JSON:', parseError);
      return NextResponse.json({ 
        error: 'Bad request',
        message: 'Invalid JSON in kr-answer'
      }, { status: 400 });
    }

    // Extract payment information
    const orderId = paymentData.orderId;
    const transactionStatus = paymentData.transactionDetails?.status;
    const transactionId = paymentData.transactionDetails?.transactionId || paymentData.transactionId;

    if (!orderId) {
      console.error('❌ Missing orderId in webhook data');
      return NextResponse.json({ 
        error: 'Bad request',
        message: 'Missing orderId'
      }, { status: 400 });
    }

    console.log('🔍 Processing webhook for orderId:', orderId, 'status:', transactionStatus);

    // Find the purchase record
    const purchase = await prisma.purchase.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!purchase) {
      console.error('❌ Purchase not found for orderId:', orderId);
      return NextResponse.json({ 
        error: 'Not found',
        message: 'Purchase not found'
      }, { status: 404 });
    }

    console.log('✅ Purchase found:', purchase.id, 'current status:', purchase.paymentStatus);

    // Map Izipay status to our payment status
    let newPaymentStatus = purchase.paymentStatus;
    let notes = purchase.notes || '';

    switch (transactionStatus) {
      case 'PAID':
      case 'AUTHORISED':
        newPaymentStatus = 'completed';
        notes = `Payment confirmed via webhook. Transaction ID: ${transactionId}`;
        break;
      case 'UNPAID':
      case 'REFUSED':
      case 'CANCELLED':
        newPaymentStatus = 'failed';
        notes = `Payment failed via webhook. Status: ${transactionStatus}. Transaction ID: ${transactionId}`;
        break;
      case 'PENDING':
        newPaymentStatus = 'pending';
        notes = `Payment pending via webhook. Transaction ID: ${transactionId}`;
        break;
      default:
        console.warn('⚠️ Unknown transaction status:', transactionStatus);
        notes = `Webhook received with status: ${transactionStatus}. Transaction ID: ${transactionId}`;
    }

    // Update purchase record
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        paymentStatus: newPaymentStatus,
        transactionId: transactionId || purchase.transactionId,
        notes: notes,
        ...(newPaymentStatus === 'completed' && !purchase.purchasedAt && {
          purchasedAt: new Date()
        })
      }
    });

    console.log('✅ Purchase updated:', {
      id: updatedPurchase.id,
      oldStatus: purchase.paymentStatus,
      newStatus: newPaymentStatus,
      transactionId: transactionId
    });

    // If payment is completed, ensure user package is created
    if (newPaymentStatus === 'completed') {
      console.log('✅ Payment completed, user package creation would happen here');
      // TODO: Implement user package creation logic
    }

    // Log webhook processing
    console.log('✅ Webhook processed successfully:', {
      orderId,
      transactionStatus,
      newPaymentStatus,
      transactionId
    });

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully',
      orderId,
      status: newPaymentStatus
    });

  } catch (error) {
    console.error('❌ Error processing Izipay webhook:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to process webhook'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}