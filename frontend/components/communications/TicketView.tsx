'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ArrowLeft,
  User,
  Clock,
  AlertCircle,
  MessageSquare,
  Tag,
  Plus,
  FileText,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { useTicket, useUpdateTicket, useCreateTicketNote } from '../../hooks/useCommunications';
import { Priority } from '../../lib/types/communications';

interface TicketViewProps {
  ticketId: string;
  onBackClick: () => void;
}

export function TicketView({ ticketId, onBackClick }: TicketViewProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const { data: ticket, isLoading, error } = useTicket(ticketId);
  const { mutateAsync: updateTicket, isPending: isUpdating } = useUpdateTicket();
  const { mutateAsync: createNote, isPending: isCreatingNote } = useCreateTicketNote();

  const handleStatusChange = async (newStatusId: string) => {
    if (!ticket) return;
    try {
      await updateTicket({
        id: ticketId,
        data: { statusId: parseInt(newStatusId) }
      });
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const handlePriorityChange = async (newPriority: Priority) => {
    if (!ticket) return;
    try {
      await updateTicket({
        id: ticketId,
        data: { priority: newPriority }
      });
    } catch (error) {
      console.error('Failed to update ticket priority:', error);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim() || !ticket) return;
    try {
      await createNote({
        ticketId,
        data: {
          content: noteContent.trim(),
          noteType: 'NOTE',
          isInternal: false,
        }
      });
      setNoteContent('');
      setIsAddingNote(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'NORMAL': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Not Found</h3>
        <p className="text-gray-600 mb-4">The requested ticket could not be found or loaded.</p>
        <BaseButton onClick={onBackClick} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </BaseButton>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BaseButton variant="outline" size="sm" onClick={onBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </BaseButton>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {ticket.ticketNumber}
              </h2>
              <Badge className={getStatusColor(ticket.status?.displayName || 'open')}>
                {ticket.status?.displayName || 'Open'}
              </Badge>
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mt-1">{ticket.subject}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={ticket.statusId.toString()} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Open</SelectItem>
              <SelectItem value="2">In Progress</SelectItem>
              <SelectItem value="3">Pending</SelectItem>
              <SelectItem value="4">Resolved</SelectItem>
              <SelectItem value="5">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ticket.priority} onValueChange={handlePriorityChange} disabled={isUpdating}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="flex-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ticket Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                      {ticket.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-gray-900">{ticket.category || 'Uncategorized'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tags</label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {ticket.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {ticket.customFields && Object.keys(ticket.customFields).length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Custom Fields</label>
                      <div className="mt-1 space-y-2">
                        {Object.entries(ticket.customFields).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-gray-600">{key}:</span>
                            <span className="text-sm text-gray-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="flex-1 space-y-4">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Notes & Comments
                    </span>
                    <BaseButton
                      size="sm"
                      onClick={() => setIsAddingNote(!isAddingNote)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </BaseButton>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {isAddingNote && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Add a note or comment..."
                        className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <BaseButton
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAddingNote(false);
                            setNoteContent('');
                          }}
                        >
                          Cancel
                        </BaseButton>
                        <BaseButton
                          size="sm"
                          onClick={handleAddNote}
                          disabled={!noteContent.trim() || isCreatingNote}
                        >
                          {isCreatingNote ? 'Adding...' : 'Add Note'}
                        </BaseButton>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {ticket.notes && ticket.notes.length > 0 ? (
                      ticket.notes.map((note) => (
                        <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">
                                {note.author?.fullName || 'Unknown'}
                              </span>
                              <Badge variant={note.isInternal ? 'secondary' : 'default'} className="text-xs">
                                {note.isInternal ? 'Internal' : 'Public'}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No notes yet</p>
                        <p className="text-sm">Add the first note to start the conversation</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Activity History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Ticket created</p>
                        <p className="text-xs text-gray-500">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {ticket.assignedAt && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            Assigned to {ticket.assignedAgent?.fullName || 'agent'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(ticket.assignedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {ticket.firstResponseAt && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">First response sent</p>
                          <p className="text-xs text-gray-500">
                            {new Date(ticket.firstResponseAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Customer Info & Actions */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">
                  {ticket.customer?.fullName || 'Unknown Customer'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a 
                    href={`mailto:${ticket.customer?.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {ticket.customer?.email}
                  </a>
                </div>
              </div>
              
              {ticket.customer?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${ticket.customer.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {ticket.customer.phone}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <BaseButton variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Profile
                </BaseButton>
              </div>
            </CardContent>
          </Card>

          {/* Assignment & SLA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Assignment & SLA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Assigned Agent</label>
                <p className="mt-1 text-gray-900">
                  {ticket.assignedAgent?.fullName || 'Unassigned'}
                </p>
              </div>
              
              {ticket.slaDueAt && (
                <div>
                  <label className="text-sm font-medium text-gray-700">SLA Due</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(ticket.slaDueAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              {ticket.responseTimeMinutes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Response Time</label>
                  <p className="mt-1 text-gray-900">
                    {ticket.responseTimeMinutes} minutes
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <BaseButton variant="outline" size="sm" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Reassign Ticket
                </BaseButton>
          </div>
        </CardContent>
      </Card>

          {/* Related Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Related Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.conversationId && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Related Conversation</label>
                  <div className="mt-1">
                    <a href={`/communications/conversations/${ticket.conversationId}`}>
                      <BaseButton variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Conversation
                      </BaseButton>
                    </a>
                  </div>
                </div>
              )}
              
              {ticket.customer?.orders && ticket.customer.orders.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Recent Orders</label>
                  <div className="mt-1 space-y-1">
                    {ticket.customer.orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="text-sm text-gray-600">
                        {order.orderNumber} - ${order.totalAmount}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
