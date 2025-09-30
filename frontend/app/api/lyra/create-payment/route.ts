import { NextRequest, NextResponse } from 'next/server';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

/**
 * Lyra CreatePayment API Route
 * 
 * Generates a formToken for Lyra/Izipay embedded payment form
 * Documentation: https://docs.lyra.com/en/rest/V4.0/javascript/guide/formToken/presentation.html
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { amount, currency = 'PEN', orderId, customer } = body;

    // Validation
    if (!amount || amount <= 0) {
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      ));
    }

    if (!orderId) {
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      ));
    }

    if (!customer?.email) {
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Customer email is required' },
        { status: 400 }
      ));
    }

    // Get Lyra credentials from environment
    const LYRA_USERNAME = process.env.LYRA_USERNAME;
    const LYRA_PASSWORD = process.env.LYRA_PASSWORD;
    const LYRA_API_ENDPOINT = process.env.LYRA_API_ENDPOINT || 'https://api.lyra.com/api-payment/V4/Charge/CreatePayment';

    console.log('🔍 Environment check:', {
      hasUsername: !!LYRA_USERNAME,
      hasPassword: !!LYRA_PASSWORD,
      endpoint: LYRA_API_ENDPOINT,
      usernameLength: LYRA_USERNAME?.length || 0
    });

    if (!LYRA_USERNAME || !LYRA_PASSWORD) {
      console.error('❌ Lyra credentials not configured');
      console.error('Available env vars:', {
        LYRA_USERNAME: !!process.env.LYRA_USERNAME,
        LYRA_PASSWORD: !!process.env.LYRA_PASSWORD,
        allEnvKeys: Object.keys(process.env).filter(k => k.includes('LYRA'))
      });
      return addCorsHeaders(NextResponse.json(
        { 
          success: false, 
          error: 'Payment gateway not configured. Please add LYRA_USERNAME and LYRA_PASSWORD environment variables.',
          missingVars: {
            LYRA_USERNAME: !LYRA_USERNAME,
            LYRA_PASSWORD: !LYRA_PASSWORD
          }
        },
        { status: 500 }
      ));
    }

    // Prepare authentication header (Basic Auth)
    const auth = Buffer.from(`${LYRA_USERNAME}:${LYRA_PASSWORD}`).toString('base64');

    // Prepare payment request
    const paymentRequest = {
      amount: Math.round(amount), // Amount in cents
      currency: currency,
      orderId: orderId,
      customer: {
        email: customer.email,
        ...(customer.phone && { phone: customer.phone }),
        ...(customer.firstName && { firstName: customer.firstName }),
        ...(customer.lastName && { lastName: customer.lastName }),
      },
      // Optional: Select specific payment methods
      // paymentMethods: ['CARDS', 'PAYPAL'],
    };

    console.log('🔄 Creating Lyra payment:', {
      orderId,
      amount: paymentRequest.amount,
      currency,
      email: customer.email
    });

    // Make request to Lyra API
    const response = await fetch(LYRA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(paymentRequest),
    });

    const responseData = await response.json();

    // Log full response for debugging
    console.log('📊 Lyra API Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('❌ Lyra API error:', responseData);
      return addCorsHeaders(NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create payment',
          details: responseData 
        },
        { status: response.status }
      ));
    }

    // Extract formToken from response - try multiple possible paths
    const formToken = responseData.answer?.formToken || 
                     responseData.formToken || 
                     responseData.data?.formToken;

    if (!formToken) {
      console.error('❌ No formToken in response. Full response:', JSON.stringify(responseData, null, 2));
      console.error('❌ Response structure:', {
        hasAnswer: !!responseData.answer,
        hasFormToken: !!responseData.formToken,
        hasData: !!responseData.data,
        keys: Object.keys(responseData)
      });
      return addCorsHeaders(NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment response - no formToken found',
          debug: {
            status: responseData.status,
            responseKeys: Object.keys(responseData),
            hasAnswer: !!responseData.answer
          }
        },
        { status: 500 }
      ));
    }

    console.log('✅ FormToken created successfully:', formToken.substring(0, 20) + '...');

    // Return formToken to client
    return addCorsHeaders(NextResponse.json({
      success: true,
      formToken: formToken,
      orderId: orderId,
    }));

  } catch (error) {
    console.error('❌ Error creating Lyra payment:', error);
    return addCorsHeaders(NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    ));
  }
}
