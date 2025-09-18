import { NextRequest, NextResponse } from 'next/server';
import { lyraPaymentService } from '@/lib/lyra/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Create token request body:', JSON.stringify(body, null, 2));
    
    const { amount, currency, orderId, customer, metadata } = body;

    // Validate required fields
    if (!amount || !currency || !orderId || !customer?.email || !customer?.name || !customer?.phone) {
      console.error('❌ Missing required fields:', { amount, currency, orderId, customer });
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: amount, currency, orderId, customer.email, customer.name, customer.phone'
      }, { status: 400 });
    }

    // Validate that customer name is not empty
    if (!customer.name || customer.name.trim() === '') {
      console.error('❌ Customer name is empty:', { customer });
      return NextResponse.json({
        success: false,
        error: 'Customer name is required and cannot be empty'
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
    
    // Format public key with shop ID for Lyra library
    const shopId = process.env.LYRA_USERNAME?.trim() || '88569105';
    const publicKey = process.env.LYRA_PUBLIC_KEY?.trim() || 'publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv';
    const formattedPublicKey = `${shopId}:${publicKey}`;
    
    console.log('🔧 Formatted public key:', formattedPublicKey);
    
    return NextResponse.json({
      success: true,
      formToken: result.formToken,
      publicKey: formattedPublicKey
    });

  } catch (error) {
    console.error('❌ Error creating Lyra form token:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
