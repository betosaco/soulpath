import { NextRequest, NextResponse } from 'next/server';
import { lyraPaymentService } from '@/lib/lyra/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Validation request body:', body);
    
    // Check if this is the new format (krAnswer + krHash) or the old format (kr-hash + kr-status)
    let validationResult;
    
    if (body.krAnswer && body.krHash) {
      // New format from payment form
      console.log('📝 Using new validation format (krAnswer + krHash)');
      validationResult = await lyraPaymentService.validatePayment(body.krAnswer, body.krHash);
    } else if (body['kr-hash'] && body['kr-status']) {
      // Old format from return URL
      console.log('📝 Using old validation format (kr-hash + kr-status)');
      validationResult = lyraPaymentService.validatePaymentResponse(body);
    } else {
      console.error('❌ Invalid validation request format:', body);
      return NextResponse.json({
        success: false,
        error: 'Invalid request format. Expected krAnswer+krHash or kr-hash+kr-status',
        data: body
      }, { status: 400 });
    }
    
    if (!validationResult.success) {
      console.error('❌ Validation failed:', validationResult.error);
      return NextResponse.json({
        success: false,
        error: validationResult.error,
        data: validationResult.data
      }, { status: 400 });
    }

    // Payment is valid and successful
    console.log('✅ Payment validation successful');
    return NextResponse.json({
      success: true,
      isValid: (validationResult as any).isValid || false,
      message: 'Payment validated successfully',
      data: validationResult.data
    });

  } catch (error) {
    console.error('Error validating Lyra payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Convert URL search params to object
    const responseData: any = {};
    searchParams.forEach((value, key) => {
      responseData[key] = value;
    });

    // Validate payment response using HMAC signature
    const validationResult = lyraPaymentService.validatePaymentResponse(responseData);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: validationResult.error,
        data: validationResult.data
      }, { status: 400 });
    }

    // Payment is valid and successful
    return NextResponse.json({
      success: true,
      message: 'Payment validated successfully',
      data: validationResult.data
    });

  } catch (error) {
    console.error('Error validating Lyra payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}