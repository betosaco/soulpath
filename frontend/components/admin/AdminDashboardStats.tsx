'use client';

import { useState, useEffect } from 'react';
import { adminUI } from '@/lib/styles/admin-ui';
import {
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalClients: number;
  totalBookings: number;
  totalRevenue: number;
  activeTeachers: number;
  clientGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  teacherGrowth: number;
}

export function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual data fetching
        const mockStats: DashboardStats = {
          totalClients: 1247,
          totalBookings: 3421,
          totalRevenue: 45680,
          activeTeachers: 23,
          clientGrowth: 12.5,
          bookingGrowth: 8.3,
          revenueGrowth: 15.2,
          teacherGrowth: 4.1,
        };
        
        setStats(mockStats);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--unified-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--unified-text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-[var(--unified-text-secondary)]">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toLocaleString(),
      icon: UsersIcon,
      growth: stats.clientGrowth,
      color: 'blue',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      icon: CalendarIcon,
      growth: stats.bookingGrowth,
      color: 'green',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      growth: stats.revenueGrowth,
      color: 'purple',
    },
    {
      title: 'Active Teachers',
      value: stats.activeTeachers.toString(),
      icon: ChartBarIcon,
      growth: stats.teacherGrowth,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--unified-text-primary)] mb-2">
          Dashboard Overview
        </h1>
        <p className="text-[var(--unified-text-secondary)]">
          Welcome back! Here's what's happening with your wellness studio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className={adminUI.stats.container}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.growth >= 0;
          const TrendIcon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
          
          return (
            <div key={index} className={adminUI.stats.card}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={adminUI.stats.label}>{stat.title}</p>
                  <p className={adminUI.stats.value}>{stat.value}</p>
                  <div className={`${adminUI.stats.change} ${isPositive ? adminUI.stats.positive : adminUI.stats.negative}`}>
                    <TrendIcon className="w-4 h-4 inline mr-1" />
                    {Math.abs(stat.growth)}% from last month
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className={adminUI.card.container}>
          <div className={adminUI.card.header}>
            <h3 className="text-lg font-semibold text-[var(--unified-text-primary)]">
              Recent Bookings
            </h3>
          </div>
          <div className={adminUI.card.body}>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[var(--unified-primary)] rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-[var(--unified-text-primary)]">
                        Yoga Class - {item}:00 PM
                      </p>
                      <p className="text-xs text-[var(--unified-text-secondary)]">
                        John Doe • Studio A
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--unified-text-tertiary)]">
                    Today
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={adminUI.card.container}>
          <div className={adminUI.card.header}>
            <h3 className="text-lg font-semibold text-[var(--unified-text-primary)]">
              Quick Actions
            </h3>
          </div>
          <div className={adminUI.card.body}>
            <div className="grid grid-cols-2 gap-3">
              <button className={adminUI.button.primary}>
                Add Client
              </button>
              <button className={adminUI.button.secondary}>
                New Booking
              </button>
              <button className={adminUI.button.accent}>
                View Reports
              </button>
              <button className={adminUI.button.ghost}>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
