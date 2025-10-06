/**
 * 🔴 Live Workflow Debug System
 *
 * Real-time workflow execution monitoring with WebSocket/SSE event streaming.
 * Provides live visualization of node execution, data flow, and debugging capabilities.
 */

import { EventEmitter } from 'events';
import { WorkflowData, WorkflowNode, WorkflowConnection } from '../../components/admin/workflows/VisualWorkflowBuilder';
import { OrderData } from '../communication/templates/types';

export interface DebugEvent {
  id: string;
  executionId: string;
  workflowId: string;
  type: 'node:start' | 'node:success' | 'node:error' | 'node:delay:start' | 'node:delay:complete' | 'workflow:paused' | 'workflow:resumed' | 'connection:data';
  nodeId?: string;
  timestamp: number;
  data: any;
  duration?: number;
}

export interface NodeExecutionState {
  nodeId: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  startTime?: number;
  endTime?: number;
  duration?: number;
  inputData?: any;
  outputData?: any;
  error?: string;
  retryCount?: number;
}

export interface ConnectionExecutionState {
  connectionId: string;
  fromNodeId: string;
  toNodeId: string;
  data: any;
  timestamp: number;
  dataSize?: number;
  dataType?: string;
}

export interface WorkflowExecutionState {
  executionId: string;
  workflowId: string;
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  startTime: number;
  endTime?: number;
  duration?: number;
  currentNodeId?: string;
  nodeStates: Map<string, NodeExecutionState>;
  connectionStates: Map<string, ConnectionExecutionState>;
  executionPath: string[];
  error?: string;
}

export class LiveWorkflowDebugger extends EventEmitter {
  private executionStates: Map<string, WorkflowExecutionState> = new Map();
  private eventHistory: Map<string, DebugEvent[]> = new Map();
  private activeConnections: Map<string, WebSocket | EventSource> = new Map();

  /**
   * Start debugging a workflow execution
   */
  startExecutionDebug(
    executionId: string,
    workflow: WorkflowData,
    orderData: OrderData
  ): WorkflowExecutionState {
    const executionState: WorkflowExecutionState = {
      executionId,
      workflowId: workflow.id || 'unknown',
      status: 'running',
      startTime: Date.now(),
      nodeStates: new Map(),
      connectionStates: new Map(),
      executionPath: [],
    };

    // Initialize node states
    workflow.nodes.forEach(node => {
      executionState.nodeStates.set(node.id, {
        nodeId: node.id,
        status: 'pending',
      });
    });

    this.executionStates.set(executionId, executionState);
    this.eventHistory.set(executionId, []);

    this.emit('execution:started', { executionId, executionState });

    return executionState;
  }

  /**
   * Handle workflow execution event
   */
  handleExecutionEvent(event: DebugEvent): void {
    const { executionId, type, nodeId, data, timestamp } = event;

    // Store event in history
    const history = this.eventHistory.get(executionId) || [];
    history.push(event);
    this.eventHistory.set(executionId, history);

    // Update execution state
    const executionState = this.executionStates.get(executionId);
    if (!executionState) return;

    switch (type) {
      case 'node:start':
        if (nodeId) {
          const nodeState = executionState.nodeStates.get(nodeId);
          if (nodeState) {
            nodeState.status = 'running';
            nodeState.startTime = timestamp;
            nodeState.inputData = data.inputData;
            executionState.currentNodeId = nodeId;
          }
        }
        break;

      case 'node:success':
        if (nodeId) {
          const nodeState = executionState.nodeStates.get(nodeId);
          if (nodeState) {
            nodeState.status = 'success';
            nodeState.endTime = timestamp;
            nodeState.duration = nodeState.endTime - (nodeState.startTime || nodeState.endTime);
            nodeState.outputData = data.outputData || data.result;
          }
          executionState.executionPath.push(nodeId);
        }
        break;

      case 'node:error':
        if (nodeId) {
          const nodeState = executionState.nodeStates.get(nodeId);
          if (nodeState) {
            nodeState.status = 'error';
            nodeState.endTime = timestamp;
            nodeState.duration = nodeState.endTime - (nodeState.startTime || nodeState.endTime);
            nodeState.error = data.error || 'Unknown error';
          }
          executionState.error = data.error;
          executionState.status = 'failed';
          executionState.endTime = timestamp;
          executionState.duration = executionState.endTime - executionState.startTime;
        }
        break;

      case 'connection:data':
        const connectionId = `${data.fromNodeId}-${data.toNodeId}`;
        executionState.connectionStates.set(connectionId, {
          connectionId,
          fromNodeId: data.fromNodeId,
          toNodeId: data.toNodeId,
          data: data.data,
          timestamp,
          dataSize: this.calculateDataSize(data.data),
          dataType: this.inferDataType(data.data),
        });
        break;

      case 'workflow:paused':
        executionState.status = 'paused';
        break;

      case 'workflow:resumed':
        executionState.status = 'running';
        break;
    }

    // Emit updated state
    this.emit('execution:updated', { executionId, executionState, event });
  }

  /**
   * End execution debug session
   */
  endExecutionDebug(executionId: string, finalStatus: 'completed' | 'failed' | 'cancelled'): void {
    const executionState = this.executionStates.get(executionId);
    if (!executionState) return;

    executionState.status = finalStatus;
    executionState.endTime = Date.now();
    executionState.duration = executionState.endTime - executionState.startTime;

    this.emit('execution:ended', { executionId, executionState, finalStatus });
  }

  /**
   * Get current execution state
   */
  getExecutionState(executionId: string): WorkflowExecutionState | null {
    return this.executionStates.get(executionId) || null;
  }

  /**
   * Get execution event history
   */
  getExecutionHistory(executionId: string): DebugEvent[] {
    return this.eventHistory.get(executionId) || [];
  }

  /**
   * Get all active executions
   */
  getActiveExecutions(): WorkflowExecutionState[] {
    return Array.from(this.executionStates.values()).filter(
      state => ['running', 'paused'].includes(state.status)
    );
  }

  /**
   * Connect to real-time execution updates (WebSocket/SSE)
   */
  connectToExecution(executionId: string, useWebSocket: boolean = false): void {
    const endpoint = useWebSocket
      ? `ws://localhost:3000/api/admin/workflows/executions/${executionId}/live`
      : `/api/admin/workflows/executions/${executionId}/live`;

    if (useWebSocket) {
      const ws = new WebSocket(endpoint);

      ws.onopen = () => {
        console.log(`🔗 Connected to execution ${executionId} via WebSocket`);
        this.activeConnections.set(executionId, ws);
      };

      ws.onmessage = (event) => {
        try {
          const debugEvent: DebugEvent = JSON.parse(event.data);
          this.handleExecutionEvent(debugEvent);
        } catch (error) {
          console.error('Failed to parse debug event:', error);
        }
      };

      ws.onclose = () => {
        console.log(`🔌 Disconnected from execution ${executionId}`);
        this.activeConnections.delete(executionId);
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for execution ${executionId}:`, error);
      };
    } else {
      // Server-Sent Events fallback
      const es = new EventSource(endpoint);

      es.onopen = () => {
        console.log(`🔗 Connected to execution ${executionId} via SSE`);
        this.activeConnections.set(executionId, es);
      };

      es.onmessage = (event) => {
        try {
          const debugEvent: DebugEvent = JSON.parse(event.data);
          this.handleExecutionEvent(debugEvent);
        } catch (error) {
          console.error('Failed to parse debug event:', error);
        }
      };

      es.onerror = (error) => {
        console.error(`SSE error for execution ${executionId}:`, error);
        es.close();
        this.activeConnections.delete(executionId);
      };

      this.activeConnections.set(executionId, es);
    }
  }

  /**
   * Disconnect from execution updates
   */
  disconnectFromExecution(executionId: string): void {
    const connection = this.activeConnections.get(executionId);
    if (connection) {
      if (connection instanceof WebSocket) {
        connection.close();
      } else {
        connection.close();
      }
      this.activeConnections.delete(executionId);
    }
  }

  /**
   * Clean up old execution states (garbage collection)
   */
  cleanupOldExecutions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [executionId, state] of this.executionStates) {
      if (state.endTime && (now - state.endTime) > maxAge) {
        toDelete.push(executionId);
      }
    }

    toDelete.forEach(executionId => {
      this.executionStates.delete(executionId);
      this.eventHistory.delete(executionId);
      this.disconnectFromExecution(executionId);
    });

    if (toDelete.length > 0) {
      console.log(`🧹 Cleaned up ${toDelete.length} old execution states`);
    }
  }

  /**
   * Utility: Calculate data size for monitoring
   */
  private calculateDataSize(data: any): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  /**
   * Utility: Infer data type for visualization
   */
  private inferDataType(data: any): string {
    if (data === null || data === undefined) return 'null';
    if (Array.isArray(data)) return 'array';
    if (typeof data === 'object') return 'object';
    return typeof data;
  }

  /**
   * Get execution performance metrics
   */
  getExecutionMetrics(executionId: string): {
    totalNodes: number;
    completedNodes: number;
    failedNodes: number;
    averageNodeDuration: number;
    totalDataTransferred: number;
    executionDuration: number;
  } | null {
    const state = this.executionStates.get(executionId);
    if (!state) return null;

    const nodeStates = Array.from(state.nodeStates.values());
    const completedNodes = nodeStates.filter(n => n.status === 'success');
    const failedNodes = nodeStates.filter(n => n.status === 'error');

    const averageNodeDuration = completedNodes.length > 0
      ? completedNodes.reduce((sum, node) => sum + (node.duration || 0), 0) / completedNodes.length
      : 0;

    const totalDataTransferred = Array.from(state.connectionStates.values())
      .reduce((sum, conn) => sum + (conn.dataSize || 0), 0);

    return {
      totalNodes: nodeStates.length,
      completedNodes: completedNodes.length,
      failedNodes: failedNodes.length,
      averageNodeDuration,
      totalDataTransferred,
      executionDuration: state.duration || (Date.now() - state.startTime),
    };
  }
}

// Singleton instance
export const liveWorkflowDebugger = new LiveWorkflowDebugger();

// Auto-cleanup old executions every hour
setInterval(() => {
  liveWorkflowDebugger.cleanupOldExecutions();
}, 60 * 60 * 1000);
