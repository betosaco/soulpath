'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Clock,
  Users,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { useConversations, useChannels } from '../../hooks/useCommunications';
import { useAuth } from '../../hooks/useAuth';
import { Conversation, ConversationFilters, Priority } from '../../lib/types/communications';

interface UnifiedInboxProps {
  onConversationSelect: (conversationId: string) => void;
  onBackClick?: () => void;
}

export function UnifiedInbox({ onConversationSelect, onBackClick }: UnifiedInboxProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: channels } = useChannels();

  // Build filters for conversations query
  const conversationFilters = useMemo((): ConversationFilters => {
    const filters: ConversationFilters = {
      page: currentPage,
      limit: 20,
    };

    if (selectedStatus !== 'all') {
      filters.status = selectedStatus as 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
    }

    if (selectedPriority !== 'all') {
      filters.priority = selectedPriority as Priority;
    }

    if (selectedChannel !== 'all') {
      filters.channelId = selectedChannel;
    }

    return filters;
  }, [currentPage, selectedStatus, selectedPriority, selectedChannel]);

  const {
    data: conversationsData,
    isLoading,
    error,
  } = useConversations(conversationFilters);

  // Filter conversations by search term client-side
  const filteredConversations = useMemo(() => {
    if (!conversationsData?.conversations) return [];
    
    if (!searchTerm) return conversationsData.conversations;

    return conversationsData.conversations.filter(conversation => 
      conversation.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversationsData?.conversations, searchTerm]);

  // Get channel icon
  const getChannelIcon = (channelName: string) => {
    switch (channelName.toLowerCase()) {
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      case 'instagram': return Instagram;
      case 'sms': return Phone;
      case 'live_chat': return MessageSquare;
      default: return MessageSquare;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'NORMAL': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'LOW': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-200';
      case 'ARCHIVED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'CLOSED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedChannel('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header moved to CommunicationsHeader */}

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <BaseInput
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Channel Filter */}
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channels?.channels?.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id.toString()}>
                    {channel.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <BaseButton
              variant="outline"
              onClick={resetFilters}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </BaseButton>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">Failed to load conversations</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No conversations found</p>
              {(searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedChannel !== 'all') && (
                <BaseButton
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-2"
                >
                  Clear filters
                </BaseButton>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => {
                const ChannelIcon = getChannelIcon(conversation.primaryChannel?.name || '');
                const hasUnreadMessages = conversation.lastCustomerMessageAt && 
                  conversation.lastAgentResponseAt &&
                  new Date(conversation.lastCustomerMessageAt) > new Date(conversation.lastAgentResponseAt);

                return (
                  <div
                    key={conversation.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onConversationSelect(conversation.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar/Channel Icon */}
                      <div className="flex-shrink-0">
                        {conversation.customer?.avatarUrl ? (
                          <img
                            src={conversation.customer.avatarUrl}
                            alt={conversation.customer.fullName || 'Customer'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm font-medium ${hasUnreadMessages ? 'text-gray-900 font-semibold' : 'text-gray-900'}`}>
                              {conversation.customer?.fullName || conversation.customer?.email || 'Unknown Customer'}
                            </h3>
                            <ChannelIcon className="h-4 w-4 text-gray-400" />
                            {hasUnreadMessages && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityColor(conversation.priority)}>
                              {conversation.priority}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(conversation.status)}>
                              {conversation.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.subject || 'No subject'}
                          </p>
                          <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {conversation.lastMessageAt && formatTimeAgo(conversation.lastMessageAt)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{conversation.totalMessages} messages</span>
                            {conversation.assignedAgent && (
                              <span>Assigned to {conversation.assignedAgent.fullName}</span>
                            )}
                            {conversation._count?.tickets && conversation._count.tickets > 0 && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {conversation._count.tickets} tickets
                              </span>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {conversationsData?.pagination && conversationsData.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {((conversationsData.pagination.page - 1) * conversationsData.pagination.limit) + 1} to{' '}
            {Math.min(conversationsData.pagination.page * conversationsData.pagination.limit, conversationsData.pagination.total)} of{' '}
            {conversationsData.pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </BaseButton>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {conversationsData.pagination.pages}
            </span>
            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= conversationsData.pagination.pages}
            >
              Next
            </BaseButton>
          </div>
        </div>
      )}
    </div>
  );
}
