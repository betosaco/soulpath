import { NextRequest, NextResponse } from 'next/server';
import { getIzipayConfig, PaymentResult } from '@/lib/izipay';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify the kr-hash for security
    const config = getIzipayConfig();
    const receivedHash = body.krHash;
    
    if (receivedHash) {
      // Create the hash to verify
      const dataToHash = JSON.stringify({
        shopId: body.shopId,
        orderStatus: body.orderStatus,
        orderDetails: body.orderDetails,
        customer: body.customer,
        transactions: body.transactions
      });
      
      const expectedHash = crypto
        .createHmac('sha256', config.HMAC_KEY)
        .update(dataToHash)
        .digest('hex');
      
      if (receivedHash !== expectedHash) {
        console.error('Invalid payment hash verification');
        return NextResponse.json({ success: false, error: 'Invalid payment verification' }, { status: 400 });
      }
    }

    // Process successful payment
    const paymentResult: PaymentResult = {
      shopId: body.shopId,
      orderStatus: body.orderStatus,
      orderDetails: body.orderDetails,
      customer: body.customer,
      transactions: body.transactions,
      krHash: receivedHash
    };

    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Send confirmation emails
    // 3. Update order status
    // 4. Trigger any post-payment workflows

    console.log('Payment successful:', paymentResult);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      orderId: paymentResult.orderDetails.orderId,
      status: paymentResult.orderStatus
    });

  } catch (error) {
    console.error('Error processing payment success:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
