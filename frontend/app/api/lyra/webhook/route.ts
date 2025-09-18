import { NextRequest, NextResponse } from 'next/server';
import { lyraPaymentService } from '@/lib/lyra/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔔 Lyra webhook received:', JSON.stringify(body, null, 2));
    
    // Validate webhook signature
    const validationResult = lyraPaymentService.validatePaymentResponse(body);
    
    if (!validationResult.success) {
      console.error('❌ Webhook validation failed:', validationResult.error);
      return NextResponse.json({
        success: false,
        error: validationResult.error
      }, { status: 400 });
    }

    const paymentData = validationResult.data;
    
    // Process the webhook based on payment status
    switch (paymentData['kr-status']) {
      case 'PAID':
        console.log('✅ Payment successful:', paymentData);
        // TODO: Update your database with successful payment
        // TODO: Send confirmation email
        // TODO: Update order status
        break;
        
      case 'CANCELLED':
        console.log('❌ Payment cancelled:', paymentData);
        // TODO: Update order status to cancelled
        break;
        
      case 'REFUSED':
        console.log('❌ Payment refused:', paymentData);
        // TODO: Update order status to failed
        break;
        
      default:
        console.log('ℹ️ Unknown payment status:', paymentData['kr-status']);
    }

    // Return success response to Lyra
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('❌ Error processing Lyra webhook:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests (for webhook verification)
  return NextResponse.json({
    success: true,
    message: 'Lyra webhook endpoint is active'
  });
}
