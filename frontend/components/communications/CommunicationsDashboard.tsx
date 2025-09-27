'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// Tabs removed; navigation handled by sidebar
import { Badge } from '../ui/badge';
import { BaseButton } from '../ui/BaseButton';
import {
  MessageSquare,
  Ticket,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Filter,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useDashboardStats } from '../../hooks/useCommunications';
import { UnifiedInbox } from './UnifiedInbox';
import { TicketingSystem } from './TicketingSystem';
import { ConversationView } from './ConversationView';
import { TicketView } from './TicketView';
import { CommunicationsSettings } from './CommunicationsSettings';

interface CommunicationsDashboardProps {
  defaultView?: string;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function CommunicationsDashboard({ defaultView = 'overview', activeView, onViewChange }: CommunicationsDashboardProps) {
  const [internalView, setInternalView] = useState(defaultView);
  const currentView = activeView ?? internalView;
  const setView = onViewChange ?? setInternalView;
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDashboardStats(selectedPeriod);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setView('conversation');
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setView('ticket');
  };

  const handleBackToOverview = () => {
    setSelectedConversationId(null);
    setSelectedTicketId(null);
    setView('overview');
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Active Conversations',
      value: stats?.conversations.active || 0,
      change: '+12%',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Open Tickets',
      value: stats?.tickets.open || 0,
      change: '-5%',
      trend: 'down' as const,
      icon: Ticket,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Avg Response Time',
      value: stats?.messages.avgResponseTimeMinutes 
        ? `${Math.floor(stats.messages.avgResponseTimeMinutes / 60)}h ${stats.messages.avgResponseTimeMinutes % 60}m`
        : '0m',
      change: '-15%',
      trend: 'down' as const,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Customer Satisfaction',
      value: stats?.satisfaction.averageRating 
        ? `${stats.satisfaction.averageRating}/5`
        : 'N/A',
      change: '+8%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  // Render main content based on active view
  const renderMainContent = () => {
    switch (currentView) {
      case 'inbox':
        return (
          <UnifiedInbox
            onConversationSelect={handleConversationSelect}
            onBackClick={handleBackToOverview}
          />
        );
      
      case 'tickets':
        return (
          <TicketingSystem
            onTicketSelect={handleTicketSelect}
            onBackClick={handleBackToOverview}
          />
        );
      
      case 'conversation':
        return selectedConversationId ? (
          <div className="h-full">
            <ConversationView
              conversationId={selectedConversationId}
              onBackClick={() => setView('inbox')}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No conversation selected</p>
            <p>Please select a conversation from the inbox to view it here.</p>
          </div>
        );
      
      case 'ticket':
        return selectedTicketId ? (
          <TicketView
            ticketId={selectedTicketId}
            onBackClick={() => setView('tickets')}
          />
        ) : null;
      
      case 'settings':
        return (
          <CommunicationsSettings
            onBackClick={handleBackToOverview}
          />
        );
      
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        stat.trend === 'up' 
                          ? 'text-green-600 bg-green-50 border-green-200' 
                          : 'text-red-600 bg-red-50 border-red-200'
                      }`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <div className="flex gap-2">
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => refetchStats()}
                disabled={statsLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </BaseButton>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1d">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseButton
              onClick={() => setView('inbox')}
              className="flex items-center justify-center gap-2 h-12"
            >
              <MessageSquare className="h-4 w-4" />
              Open Unified Inbox
            </BaseButton>
            <BaseButton
              onClick={() => setView('tickets')}
              className="flex items-center justify-center gap-2 h-12"
              variant="outline"
            >
              <Ticket className="h-4 w-4" />
              View All Tickets
            </BaseButton>
            <BaseButton
              onClick={() => setView('settings')}
              className="flex items-center justify-center gap-2 h-12"
              variant="outline"
            >
              <Users className="h-4 w-4" />
              Settings
            </BaseButton>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Recent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stats?.tickets.recent?.slice(0, 5).map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleTicketSelect(ticket.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        #{ticket.ticketNumber} • {ticket.customer?.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        ticket.priority === 'HIGH' || ticket.priority === 'URGENT'
                          ? 'text-red-600 bg-red-50 border-red-200'
                          : 'text-gray-600 bg-gray-50 border-gray-200'
                      }`}
                    >
                      {ticket.priority}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500 text-center py-8">
                  No recent tickets
                </p>
              )}
            </div>
            
            {stats?.tickets.recent && stats.tickets.recent.length > 5 && (
              <div className="mt-4 text-center">
                <BaseButton
                  variant="outline"
                  size="sm"
                  onClick={() => setView('tickets')}
                >
                  View All Tickets
                </BaseButton>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Channel Activity */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Channel Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stats?.conversations.byChannel?.map((channel) => (
                <div key={channel.channelId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {channel.channelName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {channel.count} conversations
                      </p>
                    </div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((channel.count / (stats?.conversations.total || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500 text-center py-8">
                  No channel activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* No page-level title/description; header shows active menu name */}
      {/* No back button; navigation handled via sidebar */}

      {/* Main Content (navigation via sidebar) */}
      <div className="mt-0">
        {renderMainContent()}
      </div>
    </div>
  );
}
