'use client';

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  Zap,
  Mail,
  Smartphone,
  Workflow,
  FileText,
  Activity,
  User,
  Building
} from 'lucide-react';

// Import specialized dashboards
import { CommunicationDashboard } from './CommunicationDashboard';

interface AdminDashboardProps {
  className?: string;
}

export function AdminDashboard({ className }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'System overview and key metrics'
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      description: 'Manage emails, SMS, and messaging'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'User management and permissions'
    },
    {
      id: 'business',
      label: 'Business',
      icon: Building,
      description: 'Business settings and configuration'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Reports and data insights'
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      description: 'System configuration and maintenance'
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Top Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <LayoutDashboard className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MATMAX Admin</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, Admin
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent size={20} />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <OverviewDashboard />}
            {activeTab === 'communication' && <CommunicationDashboard />}
            {activeTab === 'users' && <UsersDashboard />}
            {activeTab === 'business' && <BusinessDashboard />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'system' && <SystemDashboard />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Dashboard
function OverviewDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to MATMAX administration panel</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="1,234"
          change="+12%"
          icon={<Users className="text-blue-600" size={24} />}
        />
        <MetricCard
          title="Active Workflows"
          value="8"
          change="+2"
          icon={<Workflow className="text-green-600" size={24} />}
        />
        <MetricCard
          title="Messages Sent"
          value="45.2K"
          change="+18%"
          icon={<Mail className="text-purple-600" size={24} />}
        />
        <MetricCard
          title="System Health"
          value="98.5%"
          change="+0.3%"
          icon={<Activity className="text-emerald-600" size={24} />}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            icon={<MessageSquare />}
            title="Configure Communication"
            description="Set up email, SMS, and messaging"
            href="#communication"
            onClick={() => {}}
          />
          <QuickActionButton
            icon={<Users />}
            title="Manage Users"
            description="Add and manage system users"
            href="#users"
            onClick={() => {}}
          />
          <QuickActionButton
            icon={<BarChart3 />}
            title="View Analytics"
            description="Check system performance"
            href="#analytics"
            onClick={() => {}}
          />
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            message="New workflow created: Customer Onboarding"
            time="2 minutes ago"
            type="success"
          />
          <ActivityItem
            message="Email template updated: Welcome Message"
            time="15 minutes ago"
            type="info"
          />
          <ActivityItem
            message="User registered: maria@example.com"
            time="1 hour ago"
            type="info"
          />
          <ActivityItem
            message="System backup completed"
            time="3 hours ago"
            type="success"
          />
        </div>
      </Card>
    </div>
  );
}

// Users Dashboard
function UsersDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <BaseButton className="bg-blue-600 hover:bg-blue-700 text-white">
          <Users size={16} className="mr-2" />
          Add User
        </BaseButton>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-600">User management interface coming soon</p>
        </div>
      </Card>
    </div>
  );
}

// Business Dashboard
function BusinessDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Business Configuration</h3>
          <p className="text-gray-600">Business settings interface coming soon</p>
        </div>
      </Card>
    </div>
  );
}

// Analytics Dashboard
function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-600">Analytics and reporting interface coming soon</p>
        </div>
      </Card>
    </div>
  );
}

// System Dashboard
function SystemDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Database size={20} />
            Database
          </h3>
          <div className="space-y-3">
            <SystemMetric label="Database Size" value="2.4 GB" />
            <SystemMetric label="Active Connections" value="12" />
            <SystemMetric label="Query Performance" value="98.5%" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} />
            Security
          </h3>
          <div className="space-y-3">
            <SystemMetric label="SSL Certificate" value="Valid" status="success" />
            <SystemMetric label="Firewall Status" value="Active" status="success" />
            <SystemMetric label="Last Security Scan" value="2 hours ago" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap size={20} />
            Performance
          </h3>
          <div className="space-y-3">
            <SystemMetric label="Average Response Time" value="245ms" />
            <SystemMetric label="Uptime" value="99.9%" status="success" />
            <SystemMetric label="Memory Usage" value="68%" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} />
            Logs
          </h3>
          <div className="space-y-3">
            <SystemMetric label="Error Rate" value="0.01%" status="success" />
            <SystemMetric label="Warning Rate" value="0.05%" />
            <SystemMetric label="Log Retention" value="30 days" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, change, icon }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-green-600">{change} from last week</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function QuickActionButton({ icon, title, description, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="p-4 border rounded-lg hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

function ActivityItem({ message, time, type }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-2 h-2 rounded-full ${
        type === 'success' ? 'bg-green-500' :
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
      }`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

function SystemMetric({ label, value, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${
        status === 'success' ? 'text-green-600' : 'text-gray-900'
      }`}>
        {value}
      </span>
    </div>
  );
}
