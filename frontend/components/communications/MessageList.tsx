'use client';

import React from 'react';
import { useMessages } from '@/hooks/useCommunications';
import { MessageListUI } from './MessageListUI';

interface ConversationState {
  botActive: boolean;
  humanTakeover: boolean;
  pendingTransfer: boolean;
  awaitingApproval: boolean;
}

interface MessageListProps {
  conversationId: string;
  conversationState?: ConversationState;
  funnel?: 'clients' | 'vendors' | 'coworkers';
}

export function MessageList({ conversationId, conversationState, funnel }: MessageListProps) {
  const { data, isLoading } = useMessages({ conversationId, page: 1, limit: 50 });
  return (
    <MessageListUI 
      messages={data?.messages}
      isLoading={isLoading}
      funnel={funnel}
      conversationState={conversationState}
    />
  );
}
