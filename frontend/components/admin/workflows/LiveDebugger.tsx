/**
 * 🔴 Live Workflow Debugger
 *
 * Real-time visualization overlay for workflow execution debugging.
 * Shows node states, connection data flow, execution progress, and performance metrics.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Eye,
  EyeOff,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Database,
  TrendingUp,
  Settings,
  Maximize,
  Minimize,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { liveWorkflowDebugger, WorkflowExecutionState, NodeExecutionState, ConnectionExecutionState } from '@/lib/workflows/live-debug';

interface LiveDebuggerProps {
  workflowId: string;
  executionId?: string;
  isVisible: boolean;
  onClose: () => void;
  onFullscreen?: () => void;
  className?: string;
}

export function LiveDebugger({
  workflowId,
  executionId,
  isVisible,
  onClose,
  onFullscreen,
  className = '',
}: LiveDebuggerProps) {
  const [executionState, setExecutionState] = useState<WorkflowExecutionState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectionAnimations, setConnectionAnimations] = useState<Map<string, boolean>>(new Map());
  const canvasRef = useRef<HTMLDivElement>(null);

  // Connect to live execution updates
  useEffect(() => {
    if (!executionId || !isVisible) return;

    // Connect to execution updates
    liveWorkflowDebugger.connectToExecution(executionId, false); // Use SSE for now
    setIsConnected(true);

    // Listen for execution updates
    const handleExecutionUpdate = (data: any) => {
      if (data.executionId === executionId) {
        setExecutionState(data.executionState);

        // Trigger connection animations
        if (data.event.type === 'connection:data') {
          const connectionId = `${data.event.data.fromNodeId}-${data.event.data.toNodeId}`;
          setConnectionAnimations(prev => new Map(prev.set(connectionId, true)));
          setTimeout(() => {
            setConnectionAnimations(prev => {
              const newMap = new Map(prev);
              newMap.delete(connectionId);
              return newMap;
            });
          }, 2000);
        }
      }
    };

    const handleExecutionEnd = (data: any) => {
      if (data.executionId === executionId) {
        setExecutionState(data.executionState);
        setIsConnected(false);
      }
    };

    liveWorkflowDebugger.on('execution:updated', handleExecutionUpdate);
    liveWorkflowDebugger.on('execution:ended', handleExecutionEnd);

    // Get initial state
    const initialState = liveWorkflowDebugger.getExecutionState(executionId);
    if (initialState) {
      setExecutionState(initialState);
    }

    return () => {
      liveWorkflowDebugger.off('execution:updated', handleExecutionUpdate);
      liveWorkflowDebugger.off('execution:ended', handleExecutionEnd);
      liveWorkflowDebugger.disconnectFromExecution(executionId);
      setIsConnected(false);
    };
  }, [executionId, isVisible]);

  // Control execution
  const controlExecution = async (action: 'resume' | 'cancel' | 'pause') => {
    if (!executionId) return;

    try {
      const response = await fetch(`/api/admin/workflows/executions/${executionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        console.log(`✅ Execution ${action} successful`);
      }
    } catch (error) {
      console.error(`Failed to ${action} execution:`, error);
    }
  };

  // Get node status color
  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-50 shadow-blue-200';
      case 'success':
        return 'border-green-500 bg-green-50 shadow-green-200';
      case 'error':
        return 'border-red-500 bg-red-50 shadow-red-200';
      case 'pending':
        return 'border-gray-300 bg-white';
      case 'skipped':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  // Get node status icon
  const getNodeStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get connection animation class
  const getConnectionAnimationClass = (connectionId: string) => {
    return connectionAnimations.get(connectionId) ? 'animate-pulse border-blue-500' : '';
  };

  // Format duration
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  // Get execution metrics
  const metrics = executionId ? liveWorkflowDebugger.getExecutionMetrics(executionId) : null;

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Live Debug: {executionId?.slice(0, 8)}...
                </h2>
              </div>

              {executionState && (
                <Badge
                  variant="outline"
                  className={`text-sm ${
                    executionState.status === 'running'
                      ? 'border-blue-500 text-blue-700'
                      : executionState.status === 'paused'
                      ? 'border-yellow-500 text-yellow-700'
                      : executionState.status === 'completed'
                      ? 'border-green-500 text-green-700'
                      : executionState.status === 'failed'
                      ? 'border-red-500 text-red-700'
                      : 'border-gray-500 text-gray-700'
                  }`}
                >
                  {executionState.status === 'running' && <Activity className="w-3 h-3 mr-1 animate-pulse" />}
                  {executionState.status === 'paused' && <Pause className="w-3 h-3 mr-1" />}
                  {executionState.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {executionState.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                  {executionState.status}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Control Buttons */}
              {executionState?.status === 'paused' && (
                <BaseButton onClick={() => controlExecution('resume')} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </BaseButton>
              )}

              {executionState?.status === 'running' && (
                <>
                  <BaseButton
                    variant="outline"
                    onClick={() => controlExecution('pause')}
                    size="sm"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    onClick={() => controlExecution('cancel')}
                    size="sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Cancel
                  </BaseButton>
                </>
              )}

              <BaseButton variant="outline" onClick={() => setShowDetails(!showDetails)} size="sm">
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </BaseButton>

              {onFullscreen && (
                <BaseButton variant="outline" onClick={onFullscreen} size="sm">
                  <Maximize className="w-4 h-4" />
                </BaseButton>
              )}

              <BaseButton variant="outline" onClick={onClose} size="sm">
                <X className="w-4 h-4" />
              </BaseButton>
            </div>
          </div>

          {/* Execution Info */}
          {executionState && (
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Started:</span>
                <div className="font-medium">
                  {format(new Date(executionState.startTime), 'HH:mm:ss', { locale: es })}
                </div>
              </div>

              <div>
                <span className="text-gray-600">Duration:</span>
                <div className="font-medium">
                  {executionState.duration
                    ? formatDuration(executionState.duration)
                    : formatDuration(Date.now() - executionState.startTime)
                  }
                </div>
              </div>

              <div>
                <span className="text-gray-600">Current Node:</span>
                <div className="font-medium font-mono text-xs">
                  {executionState.currentNodeId || 'None'}
                </div>
              </div>

              <div>
                <span className="text-gray-600">Progress:</span>
                <div className="font-medium">
                  {executionState.executionPath.length} / {executionState.nodeStates.size} nodes
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Workflow Canvas Overlay */}
          <div className="flex-1 relative bg-gray-100" ref={canvasRef}>
            {/* This would overlay on the actual workflow canvas */}
            <div className="absolute inset-0 p-8">
              {/* Mock workflow visualization - in real implementation, this would overlay on ReactFlow */}
              <div className="bg-white rounded-lg shadow-lg h-full relative overflow-hidden">
                {/* Node Visualization */}
                <div className="absolute inset-4 grid grid-cols-4 gap-8">
                  {executionState && Array.from(executionState.nodeStates.values()).map((nodeState, index) => (
                    <div
                      key={nodeState.nodeId}
                      className={`p-4 rounded-lg border-2 shadow-lg transition-all duration-300 cursor-pointer ${
                        getNodeStatusColor(nodeState.status)
                      } ${selectedNodeId === nodeState.nodeId ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedNodeId(nodeState.nodeId)}
                      style={{
                        gridColumn: (index % 4) + 1,
                        gridRow: Math.floor(index / 4) + 1,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getNodeStatusIcon(nodeState.status)}
                          <span className="font-medium text-sm">
                            Node {nodeState.nodeId.slice(-4)}
                          </span>
                        </div>
                        {nodeState.duration && (
                          <span className="text-xs text-gray-500">
                            {formatDuration(nodeState.duration)}
                          </span>
                        )}
                      </div>

                      {nodeState.error && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          {nodeState.error}
                        </div>
                      )}

                      {nodeState.outputData && showDetails && (
                        <div className="text-xs bg-gray-50 p-2 rounded mt-2 max-h-20 overflow-y-auto">
                          <pre>{JSON.stringify(nodeState.outputData, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Connection Animations */}
                {executionState && Array.from(executionState.connectionStates.values()).map((connection) => (
                  <div
                    key={connection.connectionId}
                    className={`absolute border-2 border-dashed transition-all duration-1000 ${
                      getConnectionAnimationClass(connection.connectionId)
                    }`}
                    style={{
                      // This would be calculated based on actual node positions
                      left: '20%',
                      top: '30%',
                      width: '30%',
                      height: '2px',
                      backgroundColor: connectionAnimations.get(connection.connectionId) ? '#3b82f6' : '#e5e7eb',
                    }}
                  >
                    {connectionAnimations.get(connection.connectionId) && (
                      <div className="absolute inset-0 bg-blue-500 animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          {showDetails && (
            <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                {/* Performance Metrics */}
                {metrics && (
                  <Card className="mb-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Nodes:</span>
                        <span className="font-medium">{metrics.totalNodes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium text-green-600">{metrics.completedNodes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed:</span>
                        <span className="font-medium text-red-600">{metrics.failedNodes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Node Time:</span>
                        <span className="font-medium">{formatDuration(metrics.averageNodeDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Transferred:</span>
                        <span className="font-medium">{(metrics.totalDataTransferred / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Duration:</span>
                        <span className="font-medium">{formatDuration(metrics.executionDuration)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Node Details */}
                {selectedNodeId && executionState && (
                  <Card className="mb-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Node Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const nodeState = executionState.nodeStates.get(selectedNodeId);
                        if (!nodeState) return null;

                        return (
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              {getNodeStatusIcon(nodeState.status)}
                              <span className="font-medium">Node {selectedNodeId.slice(-4)}</span>
                              <Badge variant="outline" className="text-xs">
                                {nodeState.status}
                              </Badge>
                            </div>

                            {nodeState.duration && (
                              <div>
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium ml-2">{formatDuration(nodeState.duration)}</span>
                              </div>
                            )}

                            {nodeState.startTime && (
                              <div>
                                <span className="text-gray-600">Started:</span>
                                <div className="font-medium">
                                  {format(new Date(nodeState.startTime), 'HH:mm:ss', { locale: es })}
                                </div>
                              </div>
                            )}

                            {nodeState.error && (
                              <div>
                                <span className="text-gray-600">Error:</span>
                                <div className="text-red-600 bg-red-50 p-2 rounded text-xs mt-1">
                                  {nodeState.error}
                                </div>
                              </div>
                            )}

                            {nodeState.inputData && (
                              <div>
                                <span className="text-gray-600">Input Data:</span>
                                <div className="bg-gray-100 p-2 rounded text-xs mt-1 max-h-32 overflow-y-auto">
                                  <pre>{JSON.stringify(nodeState.inputData, null, 2)}</pre>
                                </div>
                              </div>
                            )}

                            {nodeState.outputData && (
                              <div>
                                <span className="text-gray-600">Output Data:</span>
                                <div className="bg-gray-100 p-2 rounded text-xs mt-1 max-h-32 overflow-y-auto">
                                  <pre>{JSON.stringify(nodeState.outputData, null, 2)}</pre>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}

                {/* Execution Timeline */}
                {executionId && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Execution Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
                        {liveWorkflowDebugger.getExecutionHistory(executionId).slice(-20).map((event, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white rounded">
                            <div className={`w-2 h-2 rounded-full ${
                              event.type.includes('success') ? 'bg-green-500' :
                              event.type.includes('error') ? 'bg-red-500' :
                              event.type.includes('start') ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <div className="font-medium">{event.type}</div>
                              {event.nodeId && (
                                <div className="text-gray-600">Node: {event.nodeId.slice(-4)}</div>
                              )}
                            </div>
                            <div className="text-gray-500">
                              {format(new Date(event.timestamp), 'HH:mm:ss')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
                {isConnected ? 'Conectado en tiempo real' : 'Desconectado'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>Presiona F11 para pantalla completa</span>
              <span>Click en nodos para ver detalles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
