/**
 * API Route: Izipay Webhook Handler
 * Handles payment status notifications from Izipay
 */

import { NextRequest, NextResponse } from 'next/server';
import { IzipayPaymentService, type IzipayWebhookPayload } from '@/lib/izipay/payment-service';
import { prisma } from '@/lib/prisma';
import { generateIzipaySignature } from '@/lib/izipay/config';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 POST /api/izipay/webhook - Received webhook notification');

    const body = await request.json();
    console.log('📝 Webhook payload:', body);

    // Validate webhook payload structure
    const requiredFields = ['transactionId', 'orderId', 'status', 'amount', 'currency'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required webhook fields:', missingFields);
      return NextResponse.json({
        success: false,
        error: 'Invalid webhook payload',
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    const webhookPayload: IzipayWebhookPayload = {
      transactionId: body.transactionId,
      orderId: body.orderId,
      status: body.status,
      amount: body.amount,
      currency: body.currency,
      paymentMethod: body.paymentMethod || 'credit_card',
      timestamp: body.timestamp || new Date().toISOString(),
      signature: body.signature || '',
    };

    // Load Izipay provider config for signature verification
    let overrideConfig: any = null;
    try {
      const izipayMethod = await prisma.paymentMethodConfig.findFirst({
        where: { type: 'izipay', isActive: true },
        select: { providerConfig: true }
      });
      overrideConfig = izipayMethod?.providerConfig || null;
    } catch (e) {
      console.warn('Could not load Izipay providerConfig from DB for webhook verification.');
    }

    // Process the webhook
    console.log('🔄 Processing Izipay webhook...');
    if (overrideConfig) {
      // Temporarily set config for verification by calling a method that accepts override
      // processWebhook internally calls verify with current config, so we monkey patch via getter by binding override
      // Instead, simply verify signature here and then call processWebhook without verification
      const verified = (() => {
        try {
          const { signature, ...signatureData } = webhookPayload as any;
          const expected = generateIzipaySignature(signatureData as any, overrideConfig.publicKey);
          return signature === expected;
        } catch {
          return false;
        }
      })();
      if (!verified) {
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
      }
    }
    const webhookResult = await IzipayPaymentService.processWebhook(webhookPayload);

    if (!webhookResult.success) {
      console.error('❌ Webhook processing failed');
      return NextResponse.json({
        success: false,
        error: 'Webhook processing failed'
      }, { status: 400 });
    }

    console.log('✅ Webhook processed successfully:', webhookResult);

    // Update purchase record in database
    try {
      const purchase = await prisma.purchase.findFirst({
        where: {
          OR: [
            { transactionId: webhookResult.transactionId },
            { notes: { contains: webhookResult.orderId } }
          ]
        }
      });

      if (purchase) {
        // Update purchase status
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: {
            paymentStatus: webhookResult.status,
            transactionId: webhookResult.transactionId,
            updatedAt: new Date(),
          }
        });

        console.log('✅ Purchase record updated:', purchase.id);

        // Create payment record
        await prisma.paymentRecord.create({
          data: {
            userId: purchase.userId,
            purchaseId: purchase.id,
            amount: webhookPayload.amount / 100, // Convert from cents
            currencyCode: webhookPayload.currency,
            paymentMethod: 'izipay',
            paymentStatus: webhookResult.status,
            transactionId: webhookResult.transactionId,
            paymentDate: new Date(),
            confirmedAt: webhookResult.status === 'completed' ? new Date() : null,
          }
        });

        console.log('✅ Payment record created');

        // If payment is completed, activate user packages
        if (webhookResult.status === 'completed') {
          await prisma.userPackage.updateMany({
            where: { purchaseId: purchase.id },
            data: { isActive: true }
          });
          console.log('✅ User packages activated');
        }

      } else {
        console.warn('⚠️ Purchase record not found for transaction:', webhookResult.transactionId);
      }

    } catch (dbError) {
      console.error('❌ Database update failed:', dbError);
      // Don't fail the webhook response as the payment was processed
    }

    // Send success response to Izipay
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      orderId: webhookResult.orderId,
      status: webhookResult.status
    });

  } catch (error) {
    console.error('❌ Error in POST /api/izipay/webhook:', error);
    
    // Return 200 to prevent Izipay from retrying failed webhooks
    // Log the error but don't expose internal details
    return NextResponse.json({
      success: false,
      error: 'Webhook processing error',
      message: 'Internal server error'
    }, { status: 200 });
  }
}

// Handle GET requests for webhook verification (if needed)
export async function GET(_request: NextRequest) {
  console.log('🔍 GET /api/izipay/webhook - Webhook endpoint verification');
  
  return NextResponse.json({
    success: true,
    message: 'Izipay webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
