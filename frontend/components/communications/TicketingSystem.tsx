'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  AlertCircle,
  Clock,
  User,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useTickets } from '../../hooks/useCommunications';
import { Priority, TicketFilters } from '../../lib/types/communications';

interface TicketingSystemProps {
  onTicketSelect: (ticketId: string) => void;
  onBackClick?: () => void;
}

export function TicketingSystem({ onTicketSelect, onBackClick }: TicketingSystemProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters for tickets query
  const ticketFilters = useMemo((): TicketFilters => {
    const filters: TicketFilters = {
      page: currentPage,
      limit: 20,
      search: searchTerm || undefined,
    };

    if (selectedStatus !== 'all') {
      filters.statusId = selectedStatus;
    }

    if (selectedPriority !== 'all') {
      filters.priority = selectedPriority as Priority;
    }

    if (selectedAgent !== 'all') {
      filters.assignedAgentId = selectedAgent === 'unassigned' ? 'unassigned' : selectedAgent;
    }

    return filters;
  }, [currentPage, searchTerm, selectedStatus, selectedPriority, selectedAgent]);

  const {
    data: ticketsData,
    isLoading,
    error,
  } = useTickets(ticketFilters);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'NORMAL': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'LOW': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedAgent('all');
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
                  placeholder="Search tickets by subject, customer, or ticket number..."
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
                <SelectItem value="1">Open</SelectItem>
                <SelectItem value="2">In Progress</SelectItem>
                <SelectItem value="3">Pending Customer</SelectItem>
                <SelectItem value="4">Resolved</SelectItem>
                <SelectItem value="5">Closed</SelectItem>
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

            {/* Agent Filter */}
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {/* TODO: Add actual agents from API */}
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

      {/* Statistics Cards */}
      {ticketsData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ticketsData.stats.byStatus.map((stat) => (
            <Card key={stat.statusId} className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status {stat.statusId}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat._count}</p>
                  </div>
                  <TicketIcon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tickets List */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">Failed to load tickets</p>
            </div>
          ) : !ticketsData?.tickets || ticketsData.tickets.length === 0 ? (
            <div className="p-8 text-center">
              <TicketIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No tickets found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ticketsData.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTicketSelect(ticket.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Priority Indicator */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        ticket.priority === 'URGENT' ? 'bg-red-500' :
                        ticket.priority === 'HIGH' ? 'bg-orange-500' :
                        ticket.priority === 'NORMAL' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                    </div>

                    {/* Ticket Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            #{ticket.ticketNumber}
                          </h3>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          {ticket.status && (
                            <Badge 
                              variant="outline"
                              style={{ 
                                backgroundColor: ticket.status.color ? `${ticket.status.color}20` : undefined,
                                borderColor: ticket.status.color,
                                color: ticket.status.color,
                              }}
                            >
                              {ticket.status.displayName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(ticket.createdAt)}
                        </p>
                      </div>

                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {ticket.subject}
                      </h4>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.customer?.fullName || ticket.customer?.email}
                          </span>
                          {ticket.assignedAgent && (
                            <span>Assigned to {ticket.assignedAgent.fullName}</span>
                          )}
                          {ticket.category && (
                            <span>Category: {ticket.category}</span>
                          )}
                          {ticket._count?.notes && ticket._count.notes > 0 && (
                            <span>{ticket._count.notes} notes</span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {ticketsData?.pagination && ticketsData.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {((ticketsData.pagination.page - 1) * ticketsData.pagination.limit) + 1} to{' '}
            {Math.min(ticketsData.pagination.page * ticketsData.pagination.limit, ticketsData.pagination.total)} of{' '}
            {ticketsData.pagination.total} results
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
              Page {currentPage} of {ticketsData.pagination.pages}
            </span>
            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= ticketsData.pagination.pages}
            >
              Next
            </BaseButton>
          </div>
        </div>
      )}
    </div>
  );
}
