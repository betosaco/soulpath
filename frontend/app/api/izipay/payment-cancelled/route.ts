import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Payment cancelled:', body);

    // Here you would typically:
    // 1. Log the cancellation
    // 2. Update order status to cancelled
    // 3. Send notification to customer
    // 4. Update analytics

    return NextResponse.json({
      success: true,
      message: 'Payment cancellation logged'
    });

  } catch (error) {
    console.error('Error processing payment cancellation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment cancellation' },
      { status: 500 }
    );
  }
}
