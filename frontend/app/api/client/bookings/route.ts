import { NextRequest, NextResponse } from 'next/server';

/**
 * DEPRECATED BOOKING ENDPOINT - DEBUGGING VERSION
 * ===============================================
 * 
 * This endpoint has been deprecated in favor of the unified order system.
 * All booking operations should now use /api/orders/create-unified.
 * 
 * This version includes debugging to help identify where the deprecated system is being used.
 */

export async function GET(request: NextRequest) {
  console.log('🚨 DEPRECATED ENDPOINT ACCESSED: GET /api/client/bookings');
  console.log('🚨 Request URL:', request.url);
  console.log('🚨 Request headers:', Object.fromEntries(request.headers.entries()));
  console.log('🚨 User should use: /packages/enhanced');
  
  return NextResponse.json({
    success: false,
    error: 'Deprecated endpoint',
    message: 'This booking endpoint has been deprecated. Please use the current booking system at /packages/enhanced',
    redirect: '/packages/enhanced',
    debug: {
      endpoint: '/api/client/bookings',
      method: 'GET',
      timestamp: new Date().toISOString(),
      message: 'You are using the deprecated booking system. Please use /packages/enhanced instead.'
    }
  }, { status: 410 }); // 410 Gone
}

export async function POST(request: NextRequest) {
  console.log('🚨 DEPRECATED ENDPOINT ACCESSED: POST /api/client/bookings');
  console.log('🚨 Request URL:', request.url);
  console.log('🚨 Request headers:', Object.fromEntries(request.headers.entries()));
  
  // Log the request body to see what data is being sent
  try {
    const body = await request.text();
    console.log('🚨 Request body:', body);
  } catch (error) {
    console.log('🚨 Could not read request body:', error);
  }
  
  console.log('🚨 User should use: /api/orders/create-unified');
  
  return NextResponse.json({
    success: false,
    error: 'Deprecated endpoint',
    message: 'This booking endpoint has been deprecated. Please use the current booking system at /packages/enhanced',
    redirect: '/packages/enhanced',
    debug: {
      endpoint: '/api/client/bookings',
      method: 'POST',
      timestamp: new Date().toISOString(),
      message: 'You are using the deprecated booking system. Please use /api/orders/create-unified instead.'
    }
  }, { status: 410 }); // 410 Gone
}