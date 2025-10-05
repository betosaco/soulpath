import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export interface DashboardMetrics {
  messagesSent24h: {
    total: number;
    email: number;
    sms: number;
    telegram: number;
    whatsapp: number;
    instagram: number;
  };
  deliveryRate: {
    overall: number;
    email: number;
    sms: number;
    telegram: number;
  };
  mostActiveWorkflow: {
    id: string;
    name: string;
    executions: number;
  } | null;
  recentErrors: Array<{
    id: string;
    workflowName: string;
    errorMessage: string;
    timestamp: string;
  }>;
  messageVolume7d: Array<{
    date: string;
    email: number;
    sms: number;
    telegram: number;
    whatsapp: number;
    instagram: number;
  }>;
  activeWorkflows: number;
  configuredTemplates: number;
  systemHealth: {
    status: 'healthy' | 'warning' | 'error';
    score: number;
    issues: string[];
  };
}

export function useDashboardMetrics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/admin/communication/dashboard/metrics', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard metrics: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!user?.access_token,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}
