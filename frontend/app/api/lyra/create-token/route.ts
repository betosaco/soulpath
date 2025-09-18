import { NextRequest, NextResponse } from 'next/server';
import { lyraPaymentService } from '@/lib/lyra/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Create token request body:', JSON.stringify(body, null, 2));
    
    const { amount, currency, orderId, customer, metadata } = body;

    // Validate required fields
    if (!amount || !currency || !orderId || !customer?.email) {
      console.error('❌ Missing required fields:', { amount, currency, orderId, customer });
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: amount, currency, orderId, customer.email'
      }, { status: 400 });
    }

    console.log('✅ Required fields validated');
    console.log('🔧 Creating form token with params:', {
      amount: parseInt(amount),
      currency,
      orderId,
      customer,
      metadata
    });

    // Create form token
    const result = await lyraPaymentService.createFormToken({
      amount: parseInt(amount), // Ensure it's a number
      currency,
      orderId,
      customer,
      metadata
    });

    console.log('📋 Form token result:', result);

    if (!result.success) {
      console.error('❌ Form token creation failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

    console.log('✅ Form token created successfully');
    return NextResponse.json({
      success: true,
      formToken: result.formToken,
      publicKey: process.env.LYRA_PUBLIC_KEY
    });

  } catch (error) {
    console.error('❌ Error creating Lyra form token:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
