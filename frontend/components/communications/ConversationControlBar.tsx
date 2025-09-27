'use client';

import React from 'react';
import { Bot, User, UserPlus, Shield, Play, Pause, AlertCircle } from 'lucide-react';
import { BaseButton } from '../ui/BaseButton';

interface ConversationState {
  botActive: boolean;
  humanTakeover: boolean;
  pendingTransfer: boolean;
  awaitingApproval: boolean;
  lastBotToggle?: Date;
  lastAssignment?: Date;
}

interface ConversationControlBarProps {
  conversationState: ConversationState;
  onBotToggle: () => void;
  onTakeOver: () => void;
  onTransfer: () => void;
  onAdminApproval: () => void;
  disabled?: boolean;
}

export function ConversationControlBar({
  conversationState,
  onBotToggle,
  onTakeOver,
  onTransfer,
  onAdminApproval,
  disabled = false,
}: ConversationControlBarProps) {
  const { botActive, humanTakeover, pendingTransfer, awaitingApproval } = conversationState;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 shadow-sm">
      {/* Status indicators only; buttons moved to header */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        {botActive && !humanTakeover && (
          <span className="flex items-center gap-1">
            <Bot className="h-4 w-4 text-blue-500" />
            Bot responding
          </span>
        )}
        {humanTakeover && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4 text-green-500" />
            Human control
          </span>
        )}
        {pendingTransfer && (
          <span className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />
            Transfer in progress...
          </span>
        )}
        {awaitingApproval && (
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-orange-500 animate-pulse" />
            Awaiting admin approval...
          </span>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {botActive && !humanTakeover && (
          "Bot is actively responding to customer messages. Click 'Take Over' to intervene."
        )}
        {humanTakeover && (
          "You have control. Bot responses are paused until you resume or reassign."
        )}
        {!botActive && !humanTakeover && (
          "Bot is paused. Customer messages will queue until bot is resumed or agent responds."
        )}
      </div>
    </div>
  );
}
