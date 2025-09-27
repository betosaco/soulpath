'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { CommunicationsSidebar } from './CommunicationsSidebar';
import { CommunicationsHeader } from './CommunicationsHeader';

interface CommunicationsLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  sidebarCollapsed?: boolean;
  conversationData?: {
    customerName: string;
    channelName: string;
    messageCount: number;
    assignedAgent?: string;
    statusBadges: Array<{ text: string; className: string }>;
  };
  onBackToInbox?: () => void;
}

export function CommunicationsLayout({ children, activeView, onViewChange, sidebarCollapsed, conversationData, onBackToInbox }: CommunicationsLayoutProps) {
  return (
    <div className={`${teacherUI.layout.shell} teacher-theme`}>
      <CommunicationsSidebar activeView={activeView} onViewChange={onViewChange} collapsed={!!sidebarCollapsed} />
      <div className={teacherUI.layout.main}>
        <CommunicationsHeader 
          activeView={activeView} 
          conversationData={conversationData}
          onBackToInbox={onBackToInbox}
        />
        <main className={teacherUI.layout.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
