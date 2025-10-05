import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Send,
  Activity,
  Workflow,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  isLoading?: boolean;
  error?: boolean;
}

function KPICard({ title, value, subtitle, icon, trend, change, isLoading, error }: KPICardProps) {
  const getTrendColor = () => {
    if (error) return 'text-red-600';
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    if (error) return <AlertTriangle className="w-3 h-3" />;
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingDown className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${error ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${error ? 'bg-red-100' : 'bg-gray-100'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {error ? 'N/A' : value}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
            {change && (
              <div className={`flex items-center text-xs mt-2 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="ml-1">{change}</span>
                <span className="ml-1 text-muted-foreground">from last hour</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface RecentErrorsCardProps {
  errors: Array<{
    id: string;
    workflowName: string;
    errorMessage: string;
    timestamp: string;
  }>;
  isLoading?: boolean;
}

function RecentErrorsCard({ errors, isLoading }: RecentErrorsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Recent Errors
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            ))}
          </div>
        ) : errors.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium">All systems operational</p>
              <p className="text-sm">No recent errors detected</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {errors.slice(0, 3).map((error) => (
              <div key={error.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900">
                    {error.workflowName}
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    {error.errorMessage}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardKPICards() {
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  // Calculate changes (mock data - in real app, compare with previous period)
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: change.toFixed(1) + '%',
      trend: change >= 0 ? 'up' : 'down' as const
    };
  };

  const messagesChange = calculateChange(
    metrics?.messagesSent24h.total || 0,
    (metrics?.messagesSent24h.total || 0) * 0.9
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Messages Sent (24h) */}
      <KPICard
        title="Messages Sent (24h)"
        value={metrics?.messagesSent24h.total.toLocaleString() || '0'}
        subtitle={`${metrics?.messagesSent24h.email || 0} email, ${metrics?.messagesSent24h.sms || 0} SMS`}
        icon={<Send className="text-blue-600" size={20} />}
        trend={messagesChange.trend}
        change={messagesChange.value}
        isLoading={isLoading}
        error={!!error}
      />

      {/* Delivery Rate */}
      <KPICard
        title="Delivery Rate"
        value={`${metrics?.deliveryRate.overall || 0}%`}
        subtitle={`Email: ${metrics?.deliveryRate.email || 0}%, SMS: ${metrics?.deliveryRate.sms || 0}%`}
        icon={<CheckCircle className="text-green-600" size={20} />}
        trend="up"
        change="+0.3%"
        isLoading={isLoading}
        error={!!error}
      />

      {/* Most Active Workflow */}
      <KPICard
        title="Most Active Workflow"
        value={metrics?.mostActiveWorkflow?.name || 'N/A'}
        subtitle={`${metrics?.mostActiveWorkflow?.executions || 0} executions today`}
        icon={<Workflow className="text-purple-600" size={20} />}
        isLoading={isLoading}
        error={!!error}
      />

      {/* System Health */}
      <KPICard
        title="System Health"
        value={`${metrics?.systemHealth.score || 0}%`}
        subtitle={
          metrics?.systemHealth.status === 'healthy' ? 'All systems operational' :
          metrics?.systemHealth.status === 'warning' ? 'Minor issues detected' :
          'Critical issues detected'
        }
        icon={
          <Activity
            className={
              metrics?.systemHealth.status === 'healthy' ? 'text-green-600' :
              metrics?.systemHealth.status === 'warning' ? 'text-yellow-600' :
              'text-red-600'
            }
            size={20}
          />
        }
        trend={metrics?.systemHealth.status === 'healthy' ? 'up' : 'neutral'}
        change={metrics?.systemHealth.status === 'healthy' ? '+0.2%' : '0%'}
        isLoading={isLoading}
        error={!!error}
      />

      {/* Recent Errors - Full width card */}
      <div className="md:col-span-2 lg:col-span-4">
        <RecentErrorsCard
          errors={metrics?.recentErrors || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
