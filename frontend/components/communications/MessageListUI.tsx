'use client';

import React, { useEffect, useRef } from 'react';
import { Bot, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ConversationState {
  botActive: boolean;
  humanTakeover: boolean;
  pendingTransfer: boolean;
  awaitingApproval: boolean;
}

// Minimal shape expected for a message item
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageLike = any;

interface MessageListUIProps {
  messages?: MessageLike[];
  isLoading?: boolean;
  funnel?: 'clients' | 'vendors' | 'coworkers';
  conversationState?: ConversationState;
}

export function MessageListUI({ messages: input, isLoading, funnel, conversationState }: MessageListUIProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [input?.length]);

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

  let messages = input ?? [];

  if (funnel) {
    const allowedByFunnel: Record<string, string[]> = {
      clients: ['CUSTOMER'],
      vendors: ['BOT'],
      coworkers: ['AGENT', 'SYSTEM'],
    };
    const allowed = allowedByFunnel[funnel] || [];
    messages = messages.filter((m: any) => allowed.includes(String(m.senderType)));
  }

  const getChannelBadge = (msg: any) => {
    const rawName = (msg?.channel?.displayName || msg?.channel?.name || msg?.channelName || '') as string;
    const name = rawName || (msg?.channelId ? 'Channel' : '');
    const key = name.toLowerCase();
    let cls = 'bg-gray-100 text-gray-700 border border-gray-200';
    if (key.includes('whatsapp')) cls = 'bg-green-100 text-green-700 border border-green-200';
    else if (key.includes('instagram')) cls = 'bg-pink-100 text-pink-700 border border-pink-200';
    else if (key.includes('email')) cls = 'bg-blue-100 text-blue-700 border border-blue-200';
    else if (key.includes('sms')) cls = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    else if (key.includes('live')) cls = 'bg-purple-100 text-purple-700 border border-purple-200';
    else if (key.includes('web') || key.includes('site')) cls = 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    return { name: name || undefined, cls };
  };

  const getMessageColors = (senderType: string) => {
    switch (senderType) {
      case 'AGENT':
        return { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600', timestamp: 'text-blue-100' };
      case 'BOT':
        return { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-600', timestamp: 'text-purple-100' };
      case 'CUSTOMER':
        return { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-300', timestamp: 'text-gray-500' };
      case 'SYSTEM':
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', timestamp: 'text-gray-500' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200', timestamp: 'text-gray-500' };
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
      {messages.map((msg: any) => {
        const isFromCustomer = msg.senderType === 'CUSTOMER';
        const colors = getMessageColors(msg.senderType);
        const senderIcon = getSenderIcon(msg.senderType);

        return (
          <div key={msg.id} className={`flex ${isFromCustomer ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm border-2 ${colors.bg} ${colors.text} ${colors.border}`}>
              {(() => { const ch = getChannelBadge(msg); return ch.name ? (
                <div className="mb-1 flex justify-end">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${ch.cls}`}>{ch.name}</span>
                </div>
              ) : null; })()}

              {!isFromCustomer && (
                <div className="flex items-center gap-1 mb-1 text-xs opacity-90">
                  {senderIcon}
                  <span className="font-medium">
                    {msg.senderType === 'AGENT' ? 'Agent' : msg.senderType === 'BOT' ? 'Bot Assistant' : msg.senderType === 'SYSTEM' ? 'System' : msg.senderType}
                  </span>
                </div>
              )}

              {msg.replyToMessage && (
                <div className={`text-xs opacity-75 mb-2 p-2 rounded-lg ${isFromCustomer ? 'bg-gray-100 text-gray-600' : 'bg-black/10'}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-medium">Replying to:</span>
                  </div>
                  <div className="truncate">
                    "{msg.replyToMessage.content?.slice(0, 100)}{msg.replyToMessage.content && msg.replyToMessage.content.length > 100 ? '…' : ''}"
                  </div>
                </div>
              )}

              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {msg.content}
              </div>

              <div className={`flex items-center justify-between mt-2 text-[10px] ${colors.timestamp}`}>
                <span>
                  {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                </span>
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

export default MessageListUI;


