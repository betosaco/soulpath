import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Lyra IPN (Instant Payment Notification) Webhook Handler
 * 
 * This endpoint receives payment notifications from Lyra/Izipay
 * Documentation: https://docs.lyra.com/en/rest/V4.0/api/kb/ipn_usage.html
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data from Lyra IPN
    const formData = await request.formData();
    
    // Extract IPN parameters
    const krHash = formData.get('kr-hash') as string;
    const krHashAlgorithm = formData.get('kr-hash-algorithm') as string;
    const krAnswer = formData.get('kr-answer') as string;
    const krHashKey = formData.get('kr-hash-key') as string;

    console.log('📥 Received Lyra IPN notification');

    // Validate required parameters
    if (!krHash || !krAnswer || !krHashKey) {
      console.error('❌ Missing required IPN parameters');
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get Lyra password/HMAC key for verification
    const LYRA_PASSWORD = process.env.LYRA_PASSWORD;
    const LYRA_HMAC_KEY = process.env.LYRA_HMAC_PROD_KEY || process.env.LYRA_HMAC_TEST_KEY;

    if (!LYRA_PASSWORD && !LYRA_HMAC_KEY) {
      console.error('❌ Lyra verification keys not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify the signature based on kr-hash-key type
    let isValid = false;
    
    if (krHashKey === 'password') {
      // Use password for signature verification (IPN)
      const expectedHash = crypto
        .createHmac('sha256', LYRA_PASSWORD!)
        .update(krAnswer)
        .digest('hex');
      isValid = expectedHash === krHash;
    } else if (krHashKey === 'sha256_hmac') {
      // Use HMAC key for signature verification (return to shop)
      const expectedHash = crypto
        .createHmac('sha256', LYRA_HMAC_KEY!)
        .update(krAnswer)
        .digest('hex');
      isValid = expectedHash === krHash;
    }

    if (!isValid) {
      console.error('❌ Invalid IPN signature');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the answer JSON
    const answer = JSON.parse(krAnswer);
    
    console.log('✅ Valid IPN signature');
    console.log('📊 Payment data:', {
      orderId: answer.orderDetails?.orderId,
      transactionUuid: answer.transactions?.[0]?.uuid,
      status: answer.orderStatus,
      amount: answer.orderDetails?.orderTotalAmount,
      currency: answer.orderDetails?.orderCurrency,
    });

    // Extract payment details
    const transaction = answer.transactions?.[0];
    const orderDetails = answer.orderDetails;
    const customerInfo = answer.customer;

    const paymentData = {
      orderId: orderDetails?.orderId,
      transactionUuid: transaction?.uuid,
      transactionStatus: transaction?.status,
      orderStatus: answer.orderStatus,
      amount: orderDetails?.orderTotalAmount,
      currency: orderDetails?.orderCurrency,
      paymentMethod: transaction?.paymentMethodType,
      cardBrand: transaction?.transactionDetails?.cardDetails?.brand,
      cardNumber: transaction?.transactionDetails?.cardDetails?.pan,
      customerEmail: customerInfo?.email,
      createdAt: transaction?.creationDate,
    };

    // Check payment status
    const isSuccessful = answer.orderStatus === 'PAID';
    
    if (isSuccessful) {
      console.log('✅ Payment successful:', paymentData.orderId);
      
      // TODO: Update order status in your database
      // Example:
      // await prisma.order.update({
      //   where: { id: paymentData.orderId },
      //   data: {
      //     status: 'PAID',
      //     lyraTransactionId: paymentData.transactionUuid,
      //     paymentMethod: paymentData.paymentMethod,
      //   }
      // });

      // TODO: Send confirmation email
      // TODO: Trigger any post-payment actions

    } else {
      console.warn('⚠️ Payment not successful:', {
        orderId: paymentData.orderId,
        status: answer.orderStatus,
      });
    }

    // Return success response to Lyra
    return NextResponse.json({
      success: true,
      message: 'IPN processed successfully',
    });

  } catch (error) {
    console.error('❌ Error processing Lyra IPN:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Lyra IPN webhook endpoint is active',
    endpoint: '/api/lyra/webhook',
  });
}
