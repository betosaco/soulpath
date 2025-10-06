/**
 * 📋 Individual Workflow Execution API
 *
 * GET, PUT, DELETE operations for specific workflow executions.
 * Provides detailed execution information, control, and debugging capabilities.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { statefulWorkflowEngine } from '@/lib/workflows/stateful-execution';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const executionId = params.id;
    if (!executionId) {
      return NextResponse.json({ error: 'Execution ID is required' }, { status: 400 });
    }

    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
    });

    if (!execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }

    // Calculate execution duration
    const duration = execution.completedAt
      ? execution.completedAt.getTime() - execution.startedAt.getTime()
      : execution.startedAt
        ? Date.now() - execution.startedAt.getTime()
        : null;

    return NextResponse.json({
      success: true,
      data: {
        ...execution,
        duration, // Duration in milliseconds
        // Add human-readable status information
        statusInfo: {
          label: getStatusLabel(execution.status),
          color: getStatusColor(execution.status),
          isActive: ['RUNNING', 'PAUSED'].includes(execution.status),
          canResume: execution.status === 'PAUSED',
          canCancel: ['RUNNING', 'PAUSED'].includes(execution.status),
        },
      },
    });

  } catch (error) {
    console.error('Error fetching workflow execution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch execution' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const executionId = params.id;
    if (!executionId) {
      return NextResponse.json({ error: 'Execution ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'resume') {
      // Resume the execution
      await statefulWorkflowEngine.resumeWorkflowExecution(executionId);

      return NextResponse.json({
        success: true,
        message: 'Execution resumed successfully',
      });

    } else if (action === 'cancel') {
      // Cancel the execution
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: 'CANCELLED',
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Execution cancelled successfully',
      });

    } else if (action === 'pause') {
      // Force pause (for debugging)
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: 'PAUSED',
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Execution paused successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating workflow execution:', error);
    return NextResponse.json(
      { error: 'Failed to update execution' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const executionId = params.id;
    if (!executionId) {
      return NextResponse.json({ error: 'Execution ID is required' }, { status: 400 });
    }

    // Check if execution exists
    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
    });

    if (!execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }

    // Only allow deletion of completed or failed executions
    if (!['COMPLETED', 'FAILED', 'CANCELLED'].includes(execution.status)) {
      return NextResponse.json(
        { error: 'Cannot delete active execution' },
        { status: 400 }
      );
    }

    // Delete the execution
    await prisma.workflowExecution.delete({
      where: { id: executionId },
    });

    return NextResponse.json({
      success: true,
      message: 'Execution deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting workflow execution:', error);
    return NextResponse.json(
      { error: 'Failed to delete execution' },
      { status: 500 }
    );
  }
}

// Helper functions
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    RUNNING: 'Running',
    PAUSED: 'Paused',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled',
  };
  return labels[status] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    RUNNING: '#3b82f6',    // blue
    PAUSED: '#f59e0b',     // amber
    COMPLETED: '#10b981',  // emerald
    FAILED: '#ef4444',     // red
    CANCELLED: '#6b7280',  // gray
  };
  return colors[status] || '#6b7280';
}
