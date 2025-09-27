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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Bot Toggle */}
          <BaseButton
            variant={botActive ? "primary" : "outline"}
            size="sm"
            onClick={onBotToggle}
            disabled={disabled || pendingTransfer}
            className={`
              ${botActive 
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                : 'text-blue-600 border-blue-200 hover:bg-blue-50'
              }
            `}
          >
            {botActive ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause Bot
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Resume Bot
              </>
            )}
          </BaseButton>

          {/* Human Takeover */}
          {botActive && (
            <BaseButton
              variant="outline"
              size="sm"
              onClick={onTakeOver}
              disabled={disabled || pendingTransfer}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <User className="h-4 w-4 mr-1" />
              Take Over
            </BaseButton>
          )}

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
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
        </div>

        <div className="flex items-center gap-2">
          {/* Transfer to Agent */}
          <BaseButton
            variant="outline"
            size="sm"
            onClick={onTransfer}
            disabled={disabled || pendingTransfer || awaitingApproval}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Transfer
          </BaseButton>

          {/* Request Admin Approval */}
          <BaseButton
            variant="outline"
            size="sm"
            onClick={onAdminApproval}
            disabled={disabled || awaitingApproval}
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <Shield className="h-4 w-4 mr-1" />
            {awaitingApproval ? 'Pending...' : 'Request Admin'}
          </BaseButton>
        </div>
      </div>
      
      {/* Help text */}
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
