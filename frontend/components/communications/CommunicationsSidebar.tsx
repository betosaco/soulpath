'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Home, User, LayoutDashboard } from 'lucide-react';
import { MessageSquare, Ticket, Users } from 'lucide-react';
import { teacherUI } from '@/lib/styles/teacher-ui';

interface CommunicationsSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function CommunicationsSidebar({ activeView, onViewChange }: CommunicationsSidebarProps) {
  const [showQuickNav, setShowQuickNav] = useState(false);
  const menu = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'inbox', label: 'Inbox', icon: MessageSquare },
    { key: 'tickets', label: 'Tickets', icon: Ticket },
    { key: 'settings', label: 'Settings', icon: Users },
  ];

  return (
    <div className={teacherUI.sidebar.container}>
      {/* Quick Navigation */}
      <div className={teacherUI.sidebar.section}>
        <div className="relative">
          <button
            onClick={() => setShowQuickNav(!showQuickNav)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-tertiary)] border border-[var(--unified-border-light)] transition-colors duration-200"
          >
            <span>Quick navigate</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showQuickNav && (
            <div className="absolute mt-2 w-full bg-[var(--unified-bg-surface)] border border-[var(--unified-border-light)] rounded-lg shadow-md z-10 overflow-hidden">
              <Link
                href="/admin"
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Admin dashboard
              </Link>
              <Link
                href="/ecommerce"
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Ecommerce
              </Link>
              <Link
                href="/account"
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <User className="w-4 h-4 mr-2" /> User account
              </Link>
              <Link
                href="/"
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <Home className="w-4 h-4 mr-2" /> Homepage
              </Link>
            </div>
          )}
        </div>
      </div>
      <nav className={teacherUI.sidebar.nav}>
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 border-l-2 ${
                isActive
                  ? 'bg-[var(--unified-accent)] text-white shadow-md border-l-[var(--unified-accent-dark)]'
                  : 'text-[var(--unified-text-inverse)] hover:bg-[var(--unified-accent)] hover:text-white hover:border-l-[var(--unified-accent-dark)] border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className={teacherUI.sidebar.footer} />
    </div>
  );
}
