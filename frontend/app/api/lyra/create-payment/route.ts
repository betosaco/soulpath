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

    if (!LYRA_USERNAME || !LYRA_PASSWORD) {
      console.error('❌ Lyra credentials not configured');
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Payment gateway not configured' },
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

    // Extract formToken from response
    const formToken = responseData.answer?.formToken;

    if (!formToken) {
      console.error('❌ No formToken in response:', responseData);
      return addCorsHeaders(NextResponse.json(
        { success: false, error: 'Invalid payment response' },
        { status: 500 }
      ));
    }

    console.log('✅ FormToken created successfully');

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
