'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { EcommerceSidebar } from './EcommerceSidebar';
import { EcommerceHeader } from './EcommerceHeader';

interface EcommerceLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function EcommerceLayout({ children, activeTab, onTabChange }: EcommerceLayoutProps) {
  return (
    <div className={`${teacherUI.layout.shell} teacher-theme`}>
      <EcommerceSidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className={teacherUI.layout.main}>
        <EcommerceHeader />
        <main className={teacherUI.layout.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

