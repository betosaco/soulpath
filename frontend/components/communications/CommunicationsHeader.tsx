'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, MessageSquare, Plus, Ticket as TicketIcon } from 'lucide-react';
import { BaseButton } from '../ui/BaseButton';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { useDashboardStats } from '@/hooks/useCommunications';

interface CommunicationsHeaderProps {
  activeView?: string;
  conversationData?: {
    customerName: string;
    channelName: string;
    messageCount: number;
    assignedAgent?: string;
    statusBadges: Array<{ text: string; className: string }>;
  };
  onBackToInbox?: () => void;
}

export function CommunicationsHeader({ activeView = 'overview', conversationData, onBackToInbox }: CommunicationsHeaderProps) {
  const router = useRouter();
  const { data: stats } = useDashboardStats('7d');
  const titleMap: Record<string, string> = {
    overview: 'Overview',
    inbox: 'Inbox',
    tickets: 'Tickets',
    ticket: 'Ticket',
    conversation: 'Conversation',
    settings: 'Settings',
  };
  const title = titleMap[activeView] || 'Overview';
  const goBackToOverview = () => router.push('/communications?view=overview');

  const renderContextRight = () => {
    if (activeView === 'conversation') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Bot responding</span>
          <BaseButton
            size="sm"
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            onClick={() => window.dispatchEvent(new CustomEvent('comm:botToggle'))}
          >
            Pause Bot
          </BaseButton>
          <BaseButton
            size="sm"
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50"
            onClick={() => window.dispatchEvent(new CustomEvent('comm:takeOver'))}
          >
            Take Over
          </BaseButton>
          <BaseButton
            size="sm"
            variant="outline"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={() => window.dispatchEvent(new CustomEvent('comm:transfer'))}
          >
            Transfer
          </BaseButton>
          <BaseButton
            size="sm"
            variant="outline"
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
            onClick={() => window.dispatchEvent(new CustomEvent('comm:adminApproval'))}
          >
            Request Admin
          </BaseButton>
        </div>
      );
    }
    if (activeView === 'inbox') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/communications?view=inbox')}
            className={teacherUI.button.primary + ' inline-flex items-center'}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </button>
        </div>
      );
    }
    if (activeView === 'tickets') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/communications?view=tickets')}
            className={teacherUI.button.primary + ' inline-flex items-center'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </button>
        </div>
      );
    }
    return (
      <button className="px-4 py-2 border border-[var(--unified-border-light)] rounded-lg text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)] inline-flex items-center">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </button>
    );
  };

  const renderContextLeft = () => {
    if (activeView === 'conversation' && conversationData) {
      return (
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToInbox}
              className="px-4 py-2 border border-[var(--unified-border-light)] rounded-lg text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)] inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inbox
            </button>
            <h1 className={teacherUI.header.title}>{conversationData.customerName}</h1>
            <div className="flex items-center gap-1">
              {conversationData.statusBadges.map((badge, index) => (
                <span key={index} className={badge.className}>
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
          <p className={teacherUI.header.subtitle}>
            {conversationData.channelName} • {conversationData.messageCount} messages
            {conversationData.assignedAgent && (
              <span className="ml-2">• Assigned to {conversationData.assignedAgent}</span>
            )}
          </p>
          <p className="text-xs text-[var(--unified-text-secondary)] mt-1">
            Bot is actively responding to customer messages. Click 'Take Over' to intervene.
          </p>
        </div>
      );
    }
    if (activeView === 'inbox') {
      return (
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={goBackToOverview}
              className="px-4 py-2 border border-[var(--unified-border-light)] rounded-lg text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)] inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className={teacherUI.header.title}>Unified Inbox</h1>
          </div>
          <p className={teacherUI.header.subtitle}>
            {stats?.conversations?.total || 0} conversations
          </p>
        </div>
      );
    }
    if (activeView === 'tickets') {
      return (
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={goBackToOverview}
              className="px-4 py-2 border border-[var(--unified-border-light)] rounded-lg text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)] inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className={teacherUI.header.title}>Support Tickets</h1>
          </div>
          <p className={teacherUI.header.subtitle}>
            {stats?.tickets?.total || 0} tickets
          </p>
        </div>
      );
    }
    return (
      <div>
        <h1 className={teacherUI.header.title}>{title}</h1>
      </div>
    );
  };

  return (
    <header className={teacherUI.header.container}>
      <div className="flex items-center justify-between">
        <div className={teacherUI.header.left}>{renderContextLeft()}</div>
        <div className={teacherUI.header.right}>
          <Link href="/admin" className="inline-flex items-center">
            <button className="px-4 py-2 border border-[var(--unified-border-light)] rounded-lg text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)] inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </button>
          </Link>
          <div className="ml-3">
            {renderContextRight()}
          </div>
        </div>
      </div>
    </header>
  );
}
