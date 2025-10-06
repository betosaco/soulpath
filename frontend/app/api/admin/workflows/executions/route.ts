/**
 * ⚡ Workflow Executions API
 *
 * CRUD operations for managing stateful workflow executions.
 * Provides endpoints for monitoring, debugging, and controlling workflow executions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ExecutionStatus } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { statefulWorkflowEngine } from '@/lib/workflows/stateful-execution';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');
    const status = searchParams.get('status') as ExecutionStatus;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const executions = await prisma.workflowExecution.findMany({
      where: {
        ...(workflowId && { workflowId }),
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100), // Max 100 per request
      skip: offset,
      select: {
        id: true,
        workflowId: true,
        status: true,
        currentNodeId: true,
        executionPath: true,
        startedAt: true,
        completedAt: true,
        resumeAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.workflowExecution.count({
      where: {
        ...(workflowId && { workflowId }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      success: true,
      data: executions,
      pagination: {
        total,
        limit: Math.min(limit, 100),
        offset,
        hasMore: offset + executions.length < total,
      },
    });

  } catch (error) {
    console.error('Error fetching workflow executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      workflowId,
      orderData,
      eventContext,
      action,
      executionId,
    } = body;

    if (action === 'start' && workflowId && orderData) {
      // Start a new workflow execution
      const mockWorkflow = {
        id: workflowId,
        name: 'Test Workflow',
        nodes: [],
        edges: [],
      };

      const executionId = await statefulWorkflowEngine.startWorkflowExecution(
        mockWorkflow,
        orderData,
        eventContext || {}
      );

      return NextResponse.json({
        success: true,
        data: { executionId },
        message: 'Workflow execution started',
      });

    } else if (action === 'resume' && executionId) {
      // Resume a paused execution
      await statefulWorkflowEngine.resumeWorkflowExecution(executionId);

      return NextResponse.json({
        success: true,
        message: 'Workflow execution resumed',
      });

    } else if (action === 'cancel' && executionId) {
      // Cancel an execution
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
        message: 'Workflow execution cancelled',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing required parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error managing workflow execution:', error);
    return NextResponse.json(
      { error: 'Failed to manage execution' },
      { status: 500 }
    );
  }
}
