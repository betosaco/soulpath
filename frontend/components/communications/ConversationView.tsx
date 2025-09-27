'use client';

import React from 'react';
import { ChatWindow } from './ChatWindow';

interface ConversationViewProps {
  conversationId: string;
  onBackClick: () => void;
}

export function ConversationView({ conversationId, onBackClick }: ConversationViewProps) {
  return <ChatWindow conversationId={conversationId} onBackClick={onBackClick} />;
}
