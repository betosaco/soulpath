import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isPublished: boolean;
  version: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  connectionCount: number;
  data?: any; // Full workflow data when fetched individually
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
}

interface WorkflowsQueryParams {
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
}

interface WorkflowsResponse {
  workflows: Workflow[];
  templates: WorkflowTemplate[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export function useWorkflowsQuery(params?: WorkflowsQueryParams) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['workflows', params],
    queryFn: async () => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const searchParams = new URLSearchParams();
      if (params?.includeInactive !== undefined) searchParams.set('includeInactive', params.includeInactive.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.offset) searchParams.set('offset', params.offset.toString());

      const url = `/api/admin/workflows${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.status}`);
      }

      return response.json() as Promise<WorkflowsResponse>;
    },
    enabled: !!user?.access_token,
  });
}

export function useWorkflowQuery(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/workflows/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflow: ${response.status}`);
      }

      return response.json() as Promise<{ success: boolean; workflow: Workflow }>;
    },
    enabled: !!user?.access_token && !!id,
  });
}

export function useCreateWorkflowMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowData: {
      name: string;
      description?: string;
      data: any; // Full workflow structure
      saveAsTemplate?: boolean;
      isPublished?: boolean;
      tags?: string[];
    }) => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create workflow: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate workflows queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });
}

export function useUpdateWorkflowMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      workflowData
    }: {
      id: string;
      workflowData: Partial<{
        name: string;
        description?: string;
        data: any;
        isActive: boolean;
        isPublished: boolean;
        tags: string[];
      }>;
    }) => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/workflows/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update workflow: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate workflows queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      // Also invalidate the specific workflow query
      queryClient.invalidateQueries({ queryKey: ['workflow'] });
    }
  });
}

export function useDeleteWorkflowMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/workflows/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete workflow: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate workflows queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      // Also invalidate the specific workflow query
      queryClient.invalidateQueries({ queryKey: ['workflow'] });
    }
  });
}

export function useTestWorkflowMutation() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      testData
    }: {
      id: string;
      testData: any;
    }) => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/workflows/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflowId: id,
          testData
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to test workflow: ${response.status}`);
      }

      return response.json();
    }
  });
}
