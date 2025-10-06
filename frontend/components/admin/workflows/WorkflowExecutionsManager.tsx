/**
 * 🔄 Workflow Executions Manager
 *
 * Admin interface for monitoring and managing stateful workflow executions.
 * Provides real-time status, debugging, and control capabilities.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseButton } from '@/components/ui/BaseButton';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  currentNodeId: string | null;
  executionPath: string[];
  startedAt: Date;
  completedAt: Date | null;
  resumeAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  duration?: number;
  statusInfo?: {
    label: string;
    color: string;
    isActive: boolean;
    canResume: boolean;
    canCancel: boolean;
  };
}

interface ExecutionStats {
  total: number;
  running: number;
  paused: number;
  completed: number;
  failed: number;
  cancelled: number;
}

export function WorkflowExecutionsManager() {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [stats, setStats] = useState<ExecutionStats>({
    total: 0,
    running: 0,
    paused: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    workflowId: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  });

  // Fetch executions
  const fetchExecutions = async (resetPage = true) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: resetPage ? '0' : ((pagination.page - 1) * pagination.limit).toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.workflowId && { workflowId: filters.workflowId }),
      });

      const response = await fetch(`/api/admin/workflows/executions?${params}`);
      const data = await response.json();

      if (data.success) {
        setExecutions(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          hasMore: data.pagination.hasMore,
          page: resetPage ? 1 : prev.page,
        }));

        // Calculate stats
        const newStats = data.data.reduce(
          (acc: ExecutionStats, exec: WorkflowExecution) => {
            acc.total++;
            switch (exec.status) {
              case 'RUNNING':
                acc.running++;
                break;
              case 'PAUSED':
                acc.paused++;
                break;
              case 'COMPLETED':
                acc.completed++;
                break;
              case 'FAILED':
                acc.failed++;
                break;
              case 'CANCELLED':
                acc.cancelled++;
                break;
            }
            return acc;
          },
          { total: 0, running: 0, paused: 0, completed: 0, failed: 0, cancelled: 0 }
        );
        setStats(newStats);
      }
    } catch (error) {
      console.error('Failed to fetch executions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch execution details
  const fetchExecutionDetails = async (executionId: string) => {
    try {
      const response = await fetch(`/api/admin/workflows/executions/${executionId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedExecution(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch execution details:', error);
    }
  };

  // Control execution
  const controlExecution = async (executionId: string, action: 'resume' | 'cancel' | 'pause') => {
    try {
      const response = await fetch(`/api/admin/workflows/executions/${executionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the list
        fetchExecutions(false);
        // Refresh details if viewing this execution
        if (selectedExecution?.id === executionId) {
          fetchExecutionDetails(executionId);
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} execution:`, error);
    }
  };

  // Delete execution
  const deleteExecution = async (executionId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ejecución?')) return;

    try {
      const response = await fetch(`/api/admin/workflows/executions/${executionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchExecutions(false);
        if (selectedExecution?.id === executionId) {
          setSelectedExecution(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete execution:', error);
    }
  };

  // Auto-refresh for active executions
  useEffect(() => {
    fetchExecutions();

    const interval = setInterval(() => {
      if (stats.running > 0 || stats.paused > 0) {
        fetchExecutions(false);
      }
    }, 10000); // Refresh every 10 seconds if there are active executions

    return () => clearInterval(interval);
  }, [stats.running, stats.paused]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchExecutions(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'PAUSED':
        return <Pause className="w-4 h-4 text-amber-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'CANCELLED':
        return <Square className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (duration: number | undefined) => {
    if (!duration) return 'N/A';
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${Math.round(duration / 1000)}s`;
    if (duration < 3600000) return `${Math.round(duration / 60000)}m`;
    return `${Math.round(duration / 3600000)}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Executions</h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage stateful workflow executions
          </p>
        </div>
        <BaseButton onClick={() => fetchExecutions()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </BaseButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Running</p>
                <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paused</p>
                <p className="text-2xl font-bold text-amber-600">{stats.paused}</p>
              </div>
              <Pause className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
              </div>
              <Square className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Executions List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Executions</CardTitle>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search executions..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="RUNNING">Running</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : executions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No executions found
                </div>
              ) : (
                <div className="space-y-3">
                  {executions.map((execution) => (
                    <div
                      key={execution.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedExecution?.id === execution.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => fetchExecutionDetails(execution.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(execution.status)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {execution.workflowId}
                            </p>
                            <p className="text-sm text-gray-500">
                              {execution.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: execution.statusInfo?.color,
                              color: execution.statusInfo?.color,
                            }}
                          >
                            {execution.statusInfo?.label || execution.status}
                          </Badge>

                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {formatDistanceToNow(new Date(execution.startedAt), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </p>
                            {execution.duration && (
                              <p className="text-xs text-gray-500">
                                Duration: {formatDuration(execution.duration)}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-1">
                            {execution.statusInfo?.canResume && (
                              <BaseButton
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  controlExecution(execution.id, 'resume');
                                }}
                              >
                                <Play className="w-3 h-3" />
                              </BaseButton>
                            )}

                            {execution.statusInfo?.canCancel && (
                              <BaseButton
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  controlExecution(execution.id, 'cancel');
                                }}
                              >
                                <Square className="w-3 h-3" />
                              </BaseButton>
                            )}

                            <BaseButton
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteExecution(execution.id);
                              }}
                              disabled={execution.statusInfo?.isActive}
                            >
                              <Trash2 className="w-3 h-3" />
                            </BaseButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} executions
                  </p>

                  <div className="flex gap-2">
                    <BaseButton
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </BaseButton>

                    <span className="px-3 py-1 text-sm text-gray-600">
                      Page {pagination.page}
                    </span>

                    <BaseButton
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasMore}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </BaseButton>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Execution Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Execution Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExecution ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedExecution.status)}
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: selectedExecution.statusInfo?.color,
                        color: selectedExecution.statusInfo?.color,
                      }}
                    >
                      {selectedExecution.statusInfo?.label || selectedExecution.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Execution ID</label>
                      <p className="font-mono text-sm text-gray-900 break-all">
                        {selectedExecution.id}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Workflow ID</label>
                      <p className="font-mono text-sm text-gray-900">
                        {selectedExecution.workflowId}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Started At</label>
                      <p className="text-sm text-gray-900">
                        {format(new Date(selectedExecution.startedAt), 'PPpp', { locale: es })}
                      </p>
                    </div>

                    {selectedExecution.completedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Completed At</label>
                        <p className="text-sm text-gray-900">
                          {format(new Date(selectedExecution.completedAt), 'PPpp', { locale: es })}
                        </p>
                      </div>
                    )}

                    {selectedExecution.resumeAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Resume At</label>
                        <p className="text-sm text-gray-900">
                          {format(new Date(selectedExecution.resumeAt), 'PPpp', { locale: es })}
                        </p>
                      </div>
                    )}

                    {selectedExecution.duration && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duration</label>
                        <p className="text-sm text-gray-900">
                          {formatDuration(selectedExecution.duration)}
                        </p>
                      </div>
                    )}

                    {selectedExecution.currentNodeId && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Current Node</label>
                        <p className="font-mono text-sm text-gray-900">
                          {selectedExecution.currentNodeId}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-600">Execution Path</label>
                      <div className="mt-1 max-h-32 overflow-y-auto">
                        <div className="flex flex-wrap gap-1">
                          {selectedExecution.executionPath.map((nodeId, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {nodeId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    {selectedExecution.statusInfo?.canResume && (
                      <BaseButton
                        onClick={() => controlExecution(selectedExecution.id, 'resume')}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </BaseButton>
                    )}

                    {selectedExecution.statusInfo?.canCancel && (
                      <BaseButton
                        variant="outline"
                        onClick={() => controlExecution(selectedExecution.id, 'cancel')}
                        className="flex-1"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Cancel
                      </BaseButton>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Select an execution to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
