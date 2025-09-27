'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { CommunicationsSidebar } from './CommunicationsSidebar';
import { CommunicationsHeader } from './CommunicationsHeader';

interface CommunicationsLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function CommunicationsLayout({ children, activeView, onViewChange }: CommunicationsLayoutProps) {
  return (
    <div className={`${teacherUI.layout.shell} teacher-theme`}>
      <CommunicationsSidebar activeView={activeView} onViewChange={onViewChange} />
      <div className={teacherUI.layout.main}>
        <CommunicationsHeader activeView={activeView} />
        <main className={`${teacherUI.layout.content} h-full`}>
          {children}
        </main>
      </div>
    </div>
  );
}
