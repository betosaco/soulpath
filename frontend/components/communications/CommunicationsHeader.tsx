'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, MessageSquare, Plus, Ticket as TicketIcon } from 'lucide-react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { useDashboardStats } from '@/hooks/useCommunications';

export function CommunicationsHeader({ activeView = 'overview' }: { activeView?: string }) {
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
