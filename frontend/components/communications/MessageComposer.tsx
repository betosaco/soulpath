'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Send, Bot, User, Zap, Clock } from 'lucide-react';
import { useCreateMessage } from '@/hooks/useCommunications';
import { BaseButton } from '../ui/BaseButton';

interface ConversationState {
  botActive: boolean;
  humanTakeover: boolean;
  pendingTransfer: boolean;
  awaitingApproval: boolean;
}

// Canned responses for quick replies
const CANNED_RESPONSES = [
  {
    id: 'greeting',
    label: 'Greeting',
    text: 'Hello! I\'m here to help you today. How can I assist you?',
  },
  {
    id: 'investigating',
    label: 'Investigating',
    text: 'I\'m looking into this for you right now. Please give me a moment to check on this.',
  },
  {
    id: 'follow_up',
    label: 'Follow Up',
    text: 'Is there anything else I can help you with today?',
  },
  {
    id: 'escalation',
    label: 'Escalation',
    text: 'I\'m going to escalate this to our specialist team who can better assist you with this specific issue.',
  },
  {
    id: 'closing',
    label: 'Closing',
    text: 'Thank you for contacting us today. If you need any further assistance, please don\'t hesitate to reach out!',
  },
];

interface MessageComposerProps {
  conversationId: string;
  channelId?: number;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  conversationState?: ConversationState;
}

export function MessageComposer({ 
  conversationId, 
  channelId, 
  value, 
  onChange, 
  disabled = false,
  conversationState 
}: MessageComposerProps) {
  const [internalValue, setInternalValue] = useState('');
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const content = useMemo(() => (value !== undefined ? value : internalValue), [value, internalValue]);
  const setContent = useMemo(() => (onChange ? onChange : setInternalValue), [onChange]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutateAsync: createMessage, isPending } = useCreateMessage();

  const isDisabled = disabled || (conversationState?.botActive && !conversationState?.humanTakeover);
  const canSend = !!conversationId && !!channelId && content.trim().length > 0 && !isPending && !isDisabled;

  const handleSend = async () => {
    if (!canSend || !channelId) return;
    
    try {
      await createMessage({
        conversationId,
        content: content.trim(),
        channelId,
      });
      setContent('');
      setShowCannedResponses(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const handleCannedResponse = (text: string) => {
    const newContent = content ? `${content}\n\n${text}` : text;
    setContent(newContent);
    setShowCannedResponses(false);
  };

  const insertAtCursor = (insertion: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((content || '') + insertion);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const next = `${before}${insertion}${after}`;
    setContent(next);
    // Restore cursor position after state update in next tick
    setTimeout(() => {
      try {
        el.focus();
        const pos = start + insertion.length;
        el.setSelectionRange(pos, pos);
      } catch {}
    }, 0);
  };

  const handleEmojiClick = (emoji: string) => {
    insertAtCursor(emoji);
    setShowEmojiPanel(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && canSend) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholderText = () => {
    if (!channelId) return 'Select a channel before sending';
    if (isDisabled && conversationState?.botActive) {
      return 'Bot is handling this conversation. Take over to send messages.';
    }
    if (conversationState?.pendingTransfer) {
      return 'Conversation is being transferred...';
    }
    return 'Type a message... (Ctrl+Enter to send)';
  };

  return (
    <div className="space-y-3"
      onDragOver={(e) => {
        // Allow drop of product payload
        try {
          const hasJson = Array.from(e.dataTransfer.types || []).includes('application/json');
          const hasText = Array.from(e.dataTransfer.types || []).includes('text/plain');
          if (hasJson || hasText) {
            e.preventDefault();
          }
        } catch {}
      }}
      onDrop={(e) => {
        try {
          const json = e.dataTransfer.getData('application/json');
          if (json) {
            const payload = JSON.parse(json);
            if (payload?.type === 'product' && payload?.name && payload?.url) {
              const price = typeof payload.price === 'number' ? payload.price.toFixed(2) : payload.price;
              const snippet = `[${payload.name}](${payload.url}) — ${(payload.currency || 'S/.')}${price}`;
              insertAtCursor(snippet);
              e.preventDefault();
              return;
            }
          }
          const txt = e.dataTransfer.getData('text/plain');
          if (txt) {
            insertAtCursor(txt);
            e.preventDefault();
          }
        } catch {}
      }}
    >
      {/* Status indicator */}
      {conversationState && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {conversationState.botActive && !conversationState.humanTakeover && (
              <span className="flex items-center gap-1 text-purple-600">
                <Bot className="h-3 w-3" />
                Bot is responding
              </span>
            )}
            {conversationState.humanTakeover && (
              <span className="flex items-center gap-1 text-blue-600">
                <User className="h-3 w-3" />
                You have control
              </span>
            )}
            {conversationState.pendingTransfer && (
              <span className="flex items-center gap-1 text-yellow-600">
                <Clock className="h-3 w-3 animate-pulse" />
                Transfer in progress
              </span>
            )}
          </div>
          
          {!isDisabled && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCannedResponses(!showCannedResponses)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Zap className="h-3 w-3" />
                Quick replies
              </button>
              <button
                onClick={() => setShowEmojiPanel(!showEmojiPanel)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Insert emoji"
                title="Insert emoji"
                type="button"
              >
                😊
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Canned responses */}
      {showCannedResponses && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Quick Replies</div>
          <div className="flex flex-wrap gap-1">
            {CANNED_RESPONSES.map((response) => (
              <button
                key={response.id}
                onClick={() => handleCannedResponse(response.text)}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
              >
                {response.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji panel */}
      {showEmojiPanel && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
          <div className="text-xs font-medium text-gray-700 mb-1">Emojis</div>
          <div className="flex flex-wrap gap-1 text-xl">
            {['😀','😂','😍','👍','🙏','🎉','💡','🔥','😅','😎','🤔','🙌','💬','📞','📧','🛠️','🚀','💖'].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => handleEmojiClick(e)}
                className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                aria-label={`Insert ${e}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Message input */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            className={`w-full min-h-[44px] max-h-40 border rounded-lg p-3 text-sm resize-none transition-colors ${
              isDisabled 
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                : 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            }`}
            placeholder={getPlaceholderText()}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isDisabled}
            rows={2}
            ref={textareaRef}
            inputMode="text"
            autoComplete="off"
          />
          
          {/* Character counter */}
          {content.length > 0 && (
            <div className="absolute bottom-1 right-2 text-xs text-gray-400">
              {content.length}
            </div>
          )}
        </div>
        
        <BaseButton 
          onClick={handleSend} 
          disabled={!canSend}
          className={`px-4 py-3 ${canSend ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          {isPending ? (
            <Clock className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </BaseButton>
      </div>
      
      {/* Help text */}
      {!isDisabled && (
        <div className="text-xs text-gray-500">
          Press Ctrl+Enter to send • Use quick replies for common responses
        </div>
      )}
    </div>
  );
}