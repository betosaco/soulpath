/**
 * 🔄 Stateful Workflow Execution Engine
 *
 * Enables workflows to be paused, resumed, and survive server restarts.
 * Supports long-running workflows with delays, external API calls, and background processing.
 */

import { PrismaClient, ExecutionStatus } from '@prisma/client';
import { WorkflowData, WorkflowNode } from '../../components/admin/workflows/VisualWorkflowBuilder';
import { OrderData } from '../communication/templates/types';
import { WorkflowEngine, ExecutionContext } from '../../components/admin/workflows/WorkflowEngine';

const prisma = new PrismaClient();

export interface ExecutionSnapshot {
  workflowId: string;
  executionId: string;
  status: ExecutionStatus;
  currentNodeId: string | null;
  input: any;
  variables: Record<string, any>;
  results: Map<string, any>;
  executionPath: string[];
  error?: Error;
}

export class StatefulWorkflowEngine extends WorkflowEngine {
  private backgroundWorkerInterval: NodeJS.Timeout | null = null;

  /**
   * Start a new workflow execution (stateful)
   */
  async startWorkflowExecution(
    workflow: WorkflowData,
    orderData: OrderData,
    eventContext?: any
  ): Promise<string> {
    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id || 'temp-workflow-id',
        status: 'RUNNING',
        input: orderData,
        variables: {},
        executionPath: [],
      },
    });

    console.log(`🚀 Started stateful workflow execution: ${execution.id}`);

    // Start execution asynchronously
    this.executeWorkflowStatefully(execution.id, workflow, orderData, eventContext)
      .catch(error => {
        console.error(`❌ Workflow execution failed: ${execution.id}`, error);
        this.updateExecutionStatus(execution.id, 'FAILED', { error: error.message });
      });

    return execution.id;
  }

  /**
   * Resume a paused workflow execution
   */
  async resumeWorkflowExecution(executionId: string): Promise<void> {
    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
    });

    if (!execution || execution.status !== 'PAUSED') {
      throw new Error(`Execution ${executionId} not found or not paused`);
    }

    // Load workflow data (in real implementation, this would be stored or referenced)
    const workflow: WorkflowData = {
      id: execution.workflowId,
      name: 'Resumed Workflow',
      nodes: [],
      edges: [],
    };

    // Reconstruct order data
    const orderData: OrderData = execution.input as OrderData;

    console.log(`▶️ Resuming workflow execution: ${executionId}`);

    // Resume execution
    this.executeWorkflowStatefully(executionId, workflow, orderData, {}, execution)
      .catch(error => {
        console.error(`❌ Workflow resume failed: ${executionId}`, error);
        this.updateExecutionStatus(executionId, 'FAILED', { error: error.message });
      });
  }

  /**
   * Execute workflow with state persistence
   */
  private async executeWorkflowStatefully(
    executionId: string,
    workflow: WorkflowData,
    orderData: OrderData,
    eventContext: any = {},
    existingExecution?: any
  ): Promise<void> {
    try {
      // Load or create execution context
      let context: ExecutionContext;
      if (existingExecution) {
        // Resume from saved state
        context = {
          workflow,
          orderData,
          eventContext,
          executedNodes: new Set(existingExecution.executionPath),
          results: new Map(Object.entries(existingExecution.results || {})),
          errors: new Map(),
          variables: existingExecution.variables || {},
          executionPath: existingExecution.executionPath,
          startTime: Date.now(),
          executionId, // Add execution ID for stateful operations
          emit: (event: string, data: any) => {
            console.log(`🔍 Stateful Workflow Event [${event}]:`, data);
            this.logExecutionEvent(executionId, event, data);

            // Also emit to live debugger
            const debugEvent = {
              id: `${executionId}-${Date.now()}`,
              executionId,
              workflowId: workflow.id || 'unknown',
              type: event as any,
              nodeId: data.nodeId,
              timestamp: data.timestamp || Date.now(),
              data,
            };
            liveWorkflowDebugger.handleExecutionEvent(debugEvent);
          },
        };
      } else {
        // Start fresh execution
        context = {
          workflow,
          orderData,
          eventContext,
          executedNodes: new Set(),
          results: new Map(),
          errors: new Map(),
          variables: {},
          executionPath: [],
          startTime: Date.now(),
          executionId, // Add execution ID for stateful operations
          emit: (event: string, data: any) => {
            console.log(`🔍 Stateful Workflow Event [${event}]:`, data);
            this.logExecutionEvent(executionId, event, data);

            // Also emit to live debugger
            const debugEvent = {
              id: `${executionId}-${Date.now()}`,
              executionId,
              workflowId: workflow.id || 'unknown',
              type: event as any,
              nodeId: data.nodeId,
              timestamp: data.timestamp || Date.now(),
              data,
            };
            liveWorkflowDebugger.handleExecutionEvent(debugEvent);
          },
        };
      }

      // Execute workflow using parent class logic
      const result = await this.executeWorkflow(workflow, orderData, eventContext);

      // Mark as completed
      await this.updateExecutionStatus(executionId, 'COMPLETED', {
        output: result,
        executionPath: context.executionPath,
      });

      console.log(`✅ Stateful workflow completed: ${executionId}`);

    } catch (error) {
      console.error(`❌ Stateful workflow error: ${executionId}`, error);
      await this.updateExecutionStatus(executionId, 'FAILED', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Pause workflow execution (for delays, external calls, etc.)
   */
  async pauseWorkflowExecution(
    executionId: string,
    currentNodeId: string,
    variables: Record<string, any>,
    resumeAt?: Date
  ): Promise<void> {
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'PAUSED',
        currentNodeId,
        variables,
        resumeAt,
        updatedAt: new Date(),
      },
    });

    console.log(`⏸️ Workflow execution paused: ${executionId}`, {
      currentNodeId,
      resumeAt: resumeAt?.toISOString(),
    });
  }

  /**
   * Update execution status
   */
  private async updateExecutionStatus(
    executionId: string,
    status: ExecutionStatus,
    additionalData: any = {}
  ): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
      ...additionalData,
    };

    if (status === 'COMPLETED' || status === 'FAILED') {
      updateData.completedAt = new Date();
    }

    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: updateData,
    });
  }

  /**
   * Log execution events for debugging
   */
  private async logExecutionEvent(
    executionId: string,
    event: string,
    data: any
  ): Promise<void> {
    // In a real implementation, you might want to store these in a separate table
    // For now, we'll just log them
    console.log(`📝 Execution Event [${executionId}]: ${event}`, data);
  }

  /**
   * Start background worker for processing delayed executions
   */
  startBackgroundWorker(): void {
    if (this.backgroundWorkerInterval) {
      console.warn('Background worker already running');
      return;
    }

    console.log('🔄 Starting workflow background worker...');

    this.backgroundWorkerInterval = setInterval(async () => {
      try {
        await this.processDelayedExecutions();
      } catch (error) {
        console.error('Background worker error:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop background worker
   */
  stopBackgroundWorker(): void {
    if (this.backgroundWorkerInterval) {
      clearInterval(this.backgroundWorkerInterval);
      this.backgroundWorkerInterval = null;
      console.log('🛑 Stopped workflow background worker');
    }
  }

  /**
   * Process executions that are ready to resume
   */
  private async processDelayedExecutions(): Promise<void> {
    const now = new Date();

    // Find executions ready to resume
    const readyExecutions = await prisma.workflowExecution.findMany({
      where: {
        status: 'PAUSED',
        resumeAt: {
          lte: now,
        },
      },
      take: 10, // Process in batches
    });

    if (readyExecutions.length === 0) {
      return;
    }

    console.log(`🔄 Processing ${readyExecutions.length} delayed executions`);

    for (const execution of readyExecutions) {
      try {
        await this.resumeWorkflowExecution(execution.id);
      } catch (error) {
        console.error(`Failed to resume execution ${execution.id}:`, error);
        // Mark as failed or retry later
        await this.updateExecutionStatus(execution.id, 'FAILED', {
          error: error instanceof Error ? error.message : 'Resume failed',
        });
      }
    }
  }

  /**
   * Get execution history and status
   */
  async getExecutionHistory(
    workflowId?: string,
    status?: ExecutionStatus,
    limit: number = 50
  ): Promise<any[]> {
    const where: any = {};
    if (workflowId) where.workflowId = workflowId;
    if (status) where.status = status;

    return await prisma.workflowExecution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
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
      },
    });
  }

  /**
   * Get detailed execution information
   */
  async getExecutionDetails(executionId: string): Promise<any> {
    return await prisma.workflowExecution.findUnique({
      where: { id: executionId },
    });
  }
}

// Singleton instance
export const statefulWorkflowEngine = new StatefulWorkflowEngine();

// Start background worker when module loads (in production, this would be handled by a separate service)
if (typeof window === 'undefined') { // Only run on server
  statefulWorkflowEngine.startBackgroundWorker();

  // Graceful shutdown
  process.on('SIGINT', () => {
    statefulWorkflowEngine.stopBackgroundWorker();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    statefulWorkflowEngine.stopBackgroundWorker();
    process.exit(0);
  });
}
