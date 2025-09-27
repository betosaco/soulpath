'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ArrowLeft, Send, Bot, User, UserPlus, Shield, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { useConversation, useUpdateConversation } from '@/hooks/useCommunications';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { OperatorTools } from './OperatorTools';
import { ConversationControlBar } from './ConversationControlBar';
import { TransferModal } from './TransferModal';
import { AdminApprovalModal } from './AdminApprovalModal';
import { ConversationStatus, Priority } from '@/lib/types/communications';
import { CreateTicketModal } from './CreateTicketModal';

interface ChatWindowProps {
  conversationId: string;
  onBackClick: () => void;
}

// Bot state management
interface ConversationState {
  botActive: boolean;
  humanTakeover: boolean;
  pendingTransfer: boolean;
  awaitingApproval: boolean;
  lastBotToggle?: Date;
  lastAssignment?: Date;
}

export function ChatWindow({ conversationId, onBackClick }: ChatWindowProps) {
  const { data: conversation, isLoading } = useConversation(conversationId);
  const { mutateAsync: updateConversation } = useUpdateConversation();
  const [draft, setDraft] = useState('');
  
  // Modal states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  
  // Conversation state - in real app this would come from the conversation object
  const [conversationState, setConversationState] = useState<ConversationState>({
    botActive: true,
    humanTakeover: false,
    pendingTransfer: false,
    awaitingApproval: false,
  });

  const channelId = useMemo(() => {
    return conversation?.primaryChannel?.id ?? conversation?.primaryChannelId ?? undefined;
  }, [conversation?.primaryChannel?.id, conversation?.primaryChannelId]);

  const handleInsertTemplate = useCallback((content: string) => {
    setDraft(prev => (prev ? prev + '\n' + content : content));
  }, []);
  
  const handleBotToggle = useCallback(async () => {
    const newBotState = !conversationState.botActive;
    setConversationState(prev => ({
      ...prev,
      botActive: newBotState,
      humanTakeover: !newBotState,
      lastBotToggle: new Date(),
    }));
    
    // In real app, update conversation status via API
    // await updateConversation({ id: conversationId, data: { botEnabled: newBotState } });
  }, [conversationState.botActive, conversationId]);
  
  const handleTakeOver = useCallback(() => {
    setConversationState(prev => ({
      ...prev,
      botActive: false,
      humanTakeover: true,
      lastBotToggle: new Date(),
    }));
  }, []);
  
  const handleTransferRequest = useCallback(() => {
    setShowTransferModal(true);
  }, []);
  
  const handleAdminApproval = useCallback(() => {
    setShowApprovalModal(true);
  }, []);
  
  const handleTransferSubmit = useCallback(async (agentId: string, note?: string) => {
    setConversationState(prev => ({ ...prev, pendingTransfer: true }));
    
    try {
      await updateConversation({ 
        id: conversationId, 
        data: { assignedAgentId: agentId }
      });
      setShowTransferModal(false);
      setConversationState(prev => ({ ...prev, pendingTransfer: false, lastAssignment: new Date() }));
    } catch (error) {
      console.error('Transfer failed:', error);
      setConversationState(prev => ({ ...prev, pendingTransfer: false }));
    }
  }, [conversationId, updateConversation]);
  
  const handleApprovalSubmit = useCallback(async (request: { type: string; reason: string; details?: any }) => {
    setConversationState(prev => ({ ...prev, awaitingApproval: true }));
    
    // In real app, send approval request to admin
    console.log('Admin approval requested:', request);
    setShowApprovalModal(false);
    
    // Simulate approval process
    setTimeout(() => {
      setConversationState(prev => ({ ...prev, awaitingApproval: false }));
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Conversation Header spanning both columns */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BaseButton variant="outline" size="sm" onClick={onBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inbox
            </BaseButton>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {conversation?.customer?.fullName || conversation?.customer?.email || 'Conversation'}
                </h2>
                {/* Conversation Status Indicators */}
                <div className="flex items-center gap-1">
                  {conversationState.botActive && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Bot className="h-3 w-3 mr-1" />
                      Bot Active
                    </span>
                  )}
                  {conversationState.humanTakeover && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <User className="h-3 w-3 mr-1" />
                      Human
                    </span>
                  )}
                  {conversationState.pendingTransfer && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Transferring
                    </span>
                  )}
                  {conversationState.awaitingApproval && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pending Approval
                    </span>
                  )}
                  {conversation?.priority === 'HIGH' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      High Priority
                    </span>
                  )}
                  {conversation?.priority === 'URGENT' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                      URGENT
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {conversation?.primaryChannel?.displayName || 'Channel'} • {conversation?.totalMessages ?? 0} messages
                {conversation?.assignedAgent && (
                  <span className="ml-2">• Assigned to {conversation.assignedAgent.fullName}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column content area under the header */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left column */}
        <div className="flex flex-col h-full max-h-full overflow-hidden">
          <div className="flex-1 flex flex-col space-y-4 p-4 min-h-0 overflow-hidden">
            {/* Conversation Control Bar */}
            <ConversationControlBar
              conversationState={conversationState}
              onBotToggle={handleBotToggle}
              onTakeOver={handleTakeOver}
              onTransfer={handleTransferRequest}
              onAdminApproval={handleAdminApproval}
              disabled={isLoading}
            />


            {/* Chat area */}
            <Card className="border-0 shadow-sm bg-white flex-1 flex flex-col min-h-0 max-h-full overflow-hidden">
              <CardContent className="p-0 flex-1 flex flex-col h-full">
                {/* Messages area - scrollable */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
                  <MessageList 
                    conversationId={conversationId} 
                    conversationState={conversationState}
                  />
                </div>
                {/* Message composer - fixed at bottom */}
                <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
                  <MessageComposer
                    conversationId={conversationId}
                    channelId={channelId}
                    value={draft}
                    onChange={setDraft}
                    disabled={conversationState.botActive && !conversationState.humanTakeover}
                    conversationState={conversationState}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 h-full p-4 pt-4 overflow-hidden">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-gray-900 font-medium">{conversation?.customer?.fullName || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{conversation?.customer?.email}</p>
                  {conversation?.customer?.phone && (
                    <p className="text-sm text-gray-600">{conversation.customer.phone}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <OperatorTools
            onInsertTemplate={handleInsertTemplate}
            onInsertLink={handleInsertTemplate}
            disabled={!channelId}
            onCreateTicket={() => setShowCreateTicket(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSubmit={handleTransferSubmit}
        conversationId={conversationId}
      />
      
      <AdminApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSubmit={handleApprovalSubmit}
        conversationId={conversationId}
      />

      <CreateTicketModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        conversationId={conversationId}
        customerId={conversation?.customer?.id || ''}
        defaultSubject={conversation?.subject || 'Support needed'}
      />
    </div>
  );
}
