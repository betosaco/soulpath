import { NextRequest, NextResponse } from 'next/server';
import { getIzipayConfig, IZIPAY_ENDPOINTS, PaymentFormConfig, FormTokenResponse } from '@/lib/izipay';

export async function POST(request: NextRequest) {
  try {
    const body: PaymentFormConfig = await request.json();
    
    console.log('🔍 Izipay API - Request body:', body);
    
    // Validate required fields
    if (!body.amount || !body.orderId || !body.customer?.email) {
      console.log('❌ Missing required fields:', { amount: body.amount, orderId: body.orderId, email: body.customer?.email });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: amount, orderId, and customer.email are required' 
        },
        { status: 400 }
      );
    }

    // Get Izipay configuration
    const config = getIzipayConfig();
    console.log('🔧 Izipay config:', { 
      username: config.USERNAME, 
      apiBaseUrl: config.API_BASE_URL,
      hasPassword: !!config.PASSWORD 
    });
    
    // Prepare the request payload
    const payload = {
      amount: Math.round(body.amount * 100), // Convert to cents
      currency: body.currency || 'PEN',
      orderId: body.orderId,
      customer: {
        email: body.customer.email,
        ...(body.customer.firstName && { firstName: body.customer.firstName }),
        ...(body.customer.lastName && { lastName: body.customer.lastName }),
        ...(body.customer.phone && { phone: body.customer.phone })
      },
      ...(body.returnUrl && { returnUrl: body.returnUrl }),
      ...(body.successUrl && { successUrl: body.successUrl }),
      ...(body.errorUrl && { errorUrl: body.errorUrl })
    };

    // Create Basic Auth header
    const credentials = Buffer.from(`${config.USERNAME}:${config.PASSWORD}`).toString('base64');
    const apiUrl = `${config.API_BASE_URL}${IZIPAY_ENDPOINTS.CREATE_PAYMENT}`;
    
    console.log('🌐 Making request to:', apiUrl);
    console.log('📦 Payload:', payload);
    
    // Make request to Izipay API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Response status:', response.status);
    const data: FormTokenResponse = await response.json();
    console.log('📊 Response data:', data);

    if (!response.ok) {
      console.error('Izipay API Error:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.errorMessage || 'Failed to create payment token' 
        },
        { status: response.status }
      );
    }

    if (data.status !== 'SUCCESS' || !data.answer?.formToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid response from payment provider' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      formToken: data.answer.formToken,
      publicKey: config.PUBLIC_KEY,
      javascriptUrl: config.JAVASCRIPT_URL
    });

  } catch (error) {
    console.error('Error creating payment token:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
