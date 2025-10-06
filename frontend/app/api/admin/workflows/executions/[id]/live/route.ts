/**
 * 📡 Live Workflow Execution Updates
 *
 * Server-Sent Events (SSE) endpoint for real-time workflow execution monitoring.
 * Streams execution events, state changes, and debugging information to clients.
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { liveWorkflowDebugger } from '@/lib/workflows/live-debug';
import { statefulWorkflowEngine } from '@/lib/workflows/stateful-execution';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const executionId = params.id;

  if (!executionId) {
    return new Response('Execution ID is required', { status: 400 });
  }

  // Check authentication (for SSE, we do this synchronously)
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return new Response('Unauthorized', { status: 401 });
    }
  } catch (error) {
    return new Response('Authentication failed', { status: 401 });
  }

  // Verify execution exists
  const executionState = liveWorkflowDebugger.getExecutionState(executionId);
  if (!executionState) {
    return new Response('Execution not found', { status: 404 });
  }

  // Set up Server-Sent Events
  const responseStream = new ReadableStream({
    start(controller) {
      // Send initial state
      const initialData = {
        type: 'execution:state',
        executionId,
        data: executionState,
        timestamp: Date.now(),
      };

      controller.enqueue(`data: ${JSON.stringify(initialData)}\n\n`);

      // Set up event listeners for real-time updates
      const handleExecutionUpdate = (data: any) => {
        if (data.executionId === executionId) {
          const eventData = {
            type: 'execution:update',
            executionId,
            data: data.executionState,
            event: data.event,
            timestamp: Date.now(),
          };

          try {
            controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
          } catch (error) {
            // Connection might be closed
            liveWorkflowDebugger.off('execution:updated', handleExecutionUpdate);
            liveWorkflowDebugger.off('execution:ended', handleExecutionEnd);
          }
        }
      };

      const handleExecutionEnd = (data: any) => {
        if (data.executionId === executionId) {
          const eventData = {
            type: 'execution:ended',
            executionId,
            data: data.executionState,
            finalStatus: data.finalStatus,
            timestamp: Date.now(),
          };

          try {
            controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
            // Close the connection after sending final status
            controller.close();
          } catch (error) {
            // Connection might already be closed
          }

          // Clean up listeners
          liveWorkflowDebugger.off('execution:updated', handleExecutionUpdate);
          liveWorkflowDebugger.off('execution:ended', handleExecutionEnd);
        }
      };

      // Attach listeners
      liveWorkflowDebugger.on('execution:updated', handleExecutionUpdate);
      liveWorkflowDebugger.on('execution:ended', handleExecutionEnd);

      // Send periodic heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeatData = {
            type: 'heartbeat',
            executionId,
            timestamp: Date.now(),
          };
          controller.enqueue(`data: ${JSON.stringify(heartbeatData)}\n\n`);
        } catch (error) {
          // Connection closed, clean up
          clearInterval(heartbeatInterval);
          liveWorkflowDebugger.off('execution:updated', handleExecutionUpdate);
          liveWorkflowDebugger.off('execution:ended', handleExecutionEnd);
        }
      }, 30000); // 30 second heartbeat

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        liveWorkflowDebugger.off('execution:updated', handleExecutionUpdate);
        liveWorkflowDebugger.off('execution:ended', handleExecutionEnd);
        controller.close();
      });
    },

    cancel() {
      // Cleanup on cancel
      console.log(`SSE connection cancelled for execution ${executionId}`);
    },
  });

  // Return SSE response
  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
