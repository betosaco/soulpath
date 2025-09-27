'use client';

import React, { useEffect, useRef } from 'react';
import { Bot, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useMessages } from '@/hooks/useCommunications';

interface ConversationState {
  botActive: boolean;
  humanTakeover: boolean;
  pendingTransfer: boolean;
  awaitingApproval: boolean;
}

interface MessageListProps {
  conversationId: string;
  conversationState?: ConversationState;
}

export function MessageList({ conversationId, conversationState }: MessageListProps) {
  const { data, isLoading } = useMessages({ conversationId, page: 1, limit: 50 });
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages?.length]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
          <Clock className="h-4 w-4 animate-spin" />
          Loading messages...
        </div>
      </div>
    );
  }

  const messages = data?.messages ?? [];

  const getMessageColors = (senderType: string) => {
    switch (senderType) {
      case 'AGENT':
        return {
          bg: 'bg-blue-600',
          text: 'text-white',
          border: 'border-blue-600',
          timestamp: 'text-blue-100',
        };
      case 'BOT':
        return {
          bg: 'bg-purple-600',
          text: 'text-white', 
          border: 'border-purple-600',
          timestamp: 'text-purple-100',
        };
      case 'CUSTOMER':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          border: 'border-gray-300',
          timestamp: 'text-gray-500',
        };
      case 'SYSTEM':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200', 
          timestamp: 'text-gray-500',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-800',
          border: 'border-gray-200',
          timestamp: 'text-gray-500',
        };
    }
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case 'AGENT':
        return <User className="h-3 w-3" />;
      case 'BOT':
        return <Bot className="h-3 w-3" />;
      case 'SYSTEM':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const isFromCustomer = msg.senderType === 'CUSTOMER';
        const colors = getMessageColors(msg.senderType);
        const senderIcon = getSenderIcon(msg.senderType);
        
        return (
          <div key={msg.id} className={`flex ${isFromCustomer ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm border-2 ${
              colors.bg
            } ${colors.text} ${colors.border}`}>
              {/* Sender info for non-customer messages */}
              {!isFromCustomer && (
                <div className="flex items-center gap-1 mb-1 text-xs opacity-90">
                  {senderIcon}
                  <span className="font-medium">
                    {msg.senderType === 'AGENT' ? 'Agent' : 
                     msg.senderType === 'BOT' ? 'Bot Assistant' : 
                     msg.senderType === 'SYSTEM' ? 'System' : msg.senderType}
                  </span>
                </div>
              )}
              
              {/* Reply context */}
              {msg.replyToMessage && (
                <div className={`text-xs opacity-75 mb-2 p-2 rounded-lg ${
                  isFromCustomer ? 'bg-gray-100 text-gray-600' : 'bg-black/10'
                }`}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-medium">Replying to:</span>
                  </div>
                  <div className="truncate">
                    "{msg.replyToMessage.content?.slice(0, 100)}{msg.replyToMessage.content && msg.replyToMessage.content.length > 100 ? '…' : ''}"
                  </div>
                </div>
              )}
              
              {/* Message content */}
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {msg.content}
              </div>
              
              {/* Message status and timestamp */}
              <div className={`flex items-center justify-between mt-2 text-[10px] ${colors.timestamp}`}>
                <span>
                  {new Date(msg.sentAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
                
                {/* Message status indicators */}
                <div className="flex items-center gap-1">
                  {msg.status === 'DELIVERED' && <CheckCircle className="h-3 w-3" />}
                  {msg.status === 'PENDING' && <Clock className="h-3 w-3 animate-pulse" />}
                  {msg.status === 'FAILED' && <AlertTriangle className="h-3 w-3 text-red-400" />}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Conversation state indicators */}
      {conversationState && (
        <div className="flex justify-center">
          <div className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 shadow-sm">
            {conversationState.botActive && !conversationState.humanTakeover && (
              <span className="flex items-center gap-1">
                <Bot className="h-3 w-3 text-purple-500" />
                Bot is responding...
              </span>
            )}
            {conversationState.humanTakeover && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3 text-blue-500" />
                Agent is handling this conversation
              </span>
            )}
            {conversationState.pendingTransfer && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-500 animate-pulse" />
                Transfer in progress...
              </span>
            )}
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}
