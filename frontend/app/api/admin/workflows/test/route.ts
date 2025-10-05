import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { WorkflowEngine } from '@/components/admin/workflows/WorkflowEngine';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflow, testData } = await request.json();
    console.log('🧪 Testing workflow:', workflow);
    console.log('🧪 Test data:', testData);

    // Create mock order data and event context for testing
    const mockOrderData = testData?.orderData || {
      userName: 'Test User',
      userEmail: 'test@example.com',
      orderId: 'TEST-123',
      orderTotal: 100,
      products: [],
      matpassData: null,
      bookingData: null
    };

    const mockEventContext = testData?.eventContext || {
      eventType: 'purchase' as const,
      user: {
        id: 'test-user-1',
        email: 'test@example.com',
        fullName: 'Test User'
      },
      customer: {
        id: 'test-customer-1',
        email: 'test@example.com',
        name: 'Test User',
        telegramChatId: '123456789'
      }
    };

    try {
      // Execute the workflow using the WorkflowEngine with event context
      const engine = new WorkflowEngine();
      const results = await engine.executeWorkflow(workflow, mockOrderData, mockEventContext);

      console.log('✅ Workflow test completed successfully');
      console.log('📊 Test results:', results);

      return NextResponse.json({
        success: true,
        message: 'Workflow test completed successfully',
        results,
        executionContext
      });

    } catch (executionError) {
      console.error('❌ Workflow execution error:', executionError);
      return NextResponse.json({
        success: false,
        error: 'Workflow execution failed',
        details: executionError instanceof Error ? executionError.message : 'Unknown execution error',
        partialResults: executionContext.results
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error testing workflow:', error);
    return NextResponse.json({
      error: 'Failed to test workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
