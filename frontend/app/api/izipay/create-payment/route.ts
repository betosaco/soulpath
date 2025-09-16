import { NextRequest, NextResponse } from 'next/server';
import { getIzipayConfig, IZIPAY_ENDPOINTS, PaymentFormConfig, FormTokenResponse } from '@/lib/izipay';

export async function POST(request: NextRequest) {
  try {
    const body: PaymentFormConfig = await request.json();
    console.log('🔍 API Request body:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.amount || !body.orderId || !body.customer?.email) {
      console.log('❌ Missing required fields:', {
        amount: body.amount,
        orderId: body.orderId,
        customerEmail: body.customer?.email
      });
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
    
    // Prepare the request payload according to Izipay documentation
    const payload = {
      amount: Math.round(body.amount * 100), // Convert to cents (required: integer)
      currency: body.currency || 'PEN', // Required: currency code
      orderId: body.orderId, // Required: unique order identifier
      customer: {
        email: body.customer.email, // Required: customer email
        ...(body.customer.firstName && { firstName: body.customer.firstName }),
        ...(body.customer.lastName && { lastName: body.customer.lastName }),
        ...(body.customer.phone && { phone: body.customer.phone }),
        // Add reference field as recommended by Izipay
        reference: body.orderId // Use orderId as customer reference
      },
      // Add required fields for Izipay
      ...(body.returnUrl && { returnUrl: body.returnUrl }),
      ...(body.successUrl && { successUrl: body.successUrl }),
      ...(body.errorUrl && { errorUrl: body.errorUrl })
    };

    // Create Basic Auth header
    const credentials = Buffer.from(`${config.USERNAME}:${config.PASSWORD}`).toString('base64');
    const apiUrl = `${config.API_BASE_URL}${IZIPAY_ENDPOINTS.CREATE_PAYMENT}`;
    
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

    const responseText = await response.text();
    
    let data: FormTokenResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Izipay response as JSON:', parseError);
      throw new Error(`Invalid JSON response from Izipay: ${responseText}`);
    }

    if (!response.ok) {
      console.error('❌ Izipay API HTTP Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      return NextResponse.json(
        { 
          success: false, 
          error: data.errorMessage || `Izipay API error: ${response.status} ${response.statusText}`,
          details: data
        },
        { status: response.status }
      );
    }

    if (data.status !== 'SUCCESS') {
      console.error('❌ Izipay API returned non-success status:', {
        status: data.status,
        errorCode: data.errorCode,
        errorMessage: data.errorMessage,
        fullResponse: data
      });
      return NextResponse.json(
        { 
          success: false, 
          error: data.errorMessage || `Payment creation failed: ${data.status}`,
          errorCode: data.errorCode,
          details: data
        },
        { status: 400 }
      );
    }

    if (!data.answer?.formToken) {
      console.error('❌ Izipay API response missing formToken:', {
        hasAnswer: !!data.answer,
        answerKeys: data.answer ? Object.keys(data.answer) : 'N/A',
        fullResponse: data
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'No form token received from payment provider',
          details: data
        },
        { status: 400 }
      );
    }

    console.log('✅ Izipay payment token created successfully:', {
      formToken: data.answer.formToken.substring(0, 20) + '...',
      publicKey: config.PUBLIC_KEY.substring(0, 20) + '...'
    });

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
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
