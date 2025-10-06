import { WorkflowNode, ExecutionContext } from '../types';
import { statefulWorkflowEngine } from '../stateful-execution';

export interface DelayNodeData {
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days';
}

export async function executeDelayNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  const nodeData = node.data as DelayNodeData;

  try {
    // Calculate delay in milliseconds and resume time
    const delayMs = calculateDelayMs(nodeData.duration, nodeData.unit);
    const resumeAt = new Date(Date.now() + delayMs);

    // Emit delay start event for debugging
    context.emit('node:delay:start', {
      nodeId: node.id,
      duration: nodeData.duration,
      unit: nodeData.unit,
      delayMs,
      resumeAt: resumeAt.toISOString(),
      timestamp: new Date().toISOString()
    });

    // For short delays (< 30 seconds), execute immediately
    if (delayMs <= 30000) {
      await new Promise(resolve => setTimeout(resolve, delayMs));

      // Emit delay complete event for debugging
      context.emit('node:delay:complete', {
        nodeId: node.id,
        duration: nodeData.duration,
        unit: nodeData.unit,
        delayMs,
        actualDelay: delayMs,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        delayed: true,
        duration: nodeData.duration,
        unit: nodeData.unit,
        delayMs,
        immediate: true,
      };
    }

    // For longer delays, pause the workflow execution
    // This requires the StatefulWorkflowEngine to be available
    if (typeof context.executionId === 'string') {
      await statefulWorkflowEngine.pauseWorkflowExecution(
        context.executionId,
        node.id,
        context.variables,
        resumeAt
      );

      // Emit pause event
      context.emit('workflow:paused', {
        executionId: context.executionId,
        nodeId: node.id,
        resumeAt: resumeAt.toISOString(),
        reason: 'delay',
        timestamp: new Date().toISOString()
      });

      // Return a special result indicating workflow should pause
      return {
        success: true,
        paused: true,
        resumeAt: resumeAt.toISOString(),
        duration: nodeData.duration,
        unit: nodeData.unit,
        delayMs,
      };
    } else {
      // Fallback: if no executionId, force a shorter delay
      console.warn(`Long delay requested but no executionId available. Reducing delay to 30 seconds.`);
      await new Promise(resolve => setTimeout(resolve, 30000));

      context.emit('node:delay:complete', {
        nodeId: node.id,
        duration: nodeData.duration,
        unit: nodeData.unit,
        delayMs: 30000,
        actualDelay: 30000,
        fallback: true,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        delayed: true,
        duration: nodeData.duration,
        unit: nodeData.unit,
        delayMs: 30000,
        fallback: true,
      };
    }

  } catch (error) {
    // Emit error event for debugging
    context.emit('node:error', {
      nodeId: node.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}

function calculateDelayMs(duration: number, unit: string): number {
  const multipliers = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24
  };

  return duration * (multipliers[unit as keyof typeof multipliers] || 1000);
}
