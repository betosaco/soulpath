import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';

interface MessageVolumeChartProps {
  className?: string;
}

const CHANNEL_COLORS = {
  email: '#3b82f6',      // blue-500
  sms: '#10b981',       // emerald-500
  telegram: '#8b5cf6',  // violet-500
  whatsapp: '#f59e0b',  // amber-500
  instagram: '#ec4899'   // pink-500
};

const CHANNEL_NAMES = {
  email: 'Email',
  sms: 'SMS',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram'
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">
          {new Date(label).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Total: {total.toLocaleString()}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700">{CHANNEL_NAMES[entry.dataKey as keyof typeof CHANNEL_NAMES]}</span>
              </div>
              <span className="font-medium text-gray-900">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function ChartTypeSelector({
  chartType,
  onChartTypeChange
}: {
  chartType: 'line' | 'bar' | 'area';
  onChartTypeChange: (type: 'line' | 'bar' | 'area') => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-700">Chart Type:</span>
      <div className="flex gap-1">
        {[
          { type: 'line' as const, icon: TrendingUp, label: 'Line' },
          { type: 'bar' as const, icon: BarChart3, label: 'Bar' },
          { type: 'area' as const, icon: Activity, label: 'Area' }
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors ${
              chartType === type
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MessageVolumeChart({ className }: MessageVolumeChartProps) {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const [chartType, setChartType] = React.useState<'line' | 'bar' | 'area'>('area');

  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    if (!metrics?.messageVolume7d) return [];

    return metrics.messageVolume7d.map(day => ({
      ...day,
      date: new Date(day.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      fullDate: day.date
    }));
  }, [metrics?.messageVolume7d]);

  // Calculate totals for legend
  const totals = React.useMemo(() => {
    if (!chartData.length) return {};

    const result: Record<string, number> = {};
    chartData.forEach(day => {
      Object.keys(CHANNEL_COLORS).forEach(channel => {
        result[channel] = (result[channel] || 0) + (day[channel as keyof typeof day] as number || 0);
      });
    });
    return result;
  }, [chartData]);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {CHANNEL_NAMES[value as keyof typeof CHANNEL_NAMES]} ({totals[value]?.toLocaleString() || 0})
                </span>
              )}
            />
            {Object.keys(CHANNEL_COLORS).map(channel => (
              <Bar
                key={channel}
                dataKey={channel}
                stackId="messages"
                fill={CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS]}
                radius={channel === 'instagram' ? [0, 0, 4, 4] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {Object.keys(CHANNEL_COLORS).map(channel => (
                <linearGradient key={channel} id={`gradient-${channel}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS]} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {CHANNEL_NAMES[value as keyof typeof CHANNEL_NAMES]} ({totals[value]?.toLocaleString() || 0})
                </span>
              )}
            />
            {Object.keys(CHANNEL_COLORS).map(channel => (
              <Area
                key={channel}
                type="monotone"
                dataKey={channel}
                stackId="messages"
                stroke={CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS]}
                fill={`url(#gradient-${channel})`}
              />
            ))}
          </AreaChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {CHANNEL_NAMES[value as keyof typeof CHANNEL_NAMES]} ({totals[value]?.toLocaleString() || 0})
                </span>
              )}
            />
            {Object.keys(CHANNEL_COLORS).map(channel => (
              <Line
                key={channel}
                type="monotone"
                dataKey={channel}
                stroke={CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={24} />
              Message Volume (7 Days)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Daily message distribution across all channels
            </p>
          </div>
          <div className="flex gap-2">
            {Object.keys(CHANNEL_COLORS).map(channel => (
              <Badge
                key={channel}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS],
                  color: CHANNEL_COLORS[channel as keyof typeof CHANNEL_COLORS]
                }}
              >
                {totals[channel]?.toLocaleString() || 0} {CHANNEL_NAMES[channel as keyof typeof CHANNEL_NAMES]}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartTypeSelector
          chartType={chartType}
          onChartTypeChange={setChartType}
        />

        {isLoading ? (
          <div className="h-80 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-gray-500">No data available</p>
              <p className="text-xs text-gray-400 mt-1">Check back later for message volume statistics</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>7-day rolling average</span>
          <span>
            Total: {Object.values(totals).reduce((sum, val) => sum + val, 0).toLocaleString()} messages
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
