'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Home, User } from 'lucide-react';
import { ShoppingCart, Package, Users, Boxes, LayoutDashboard } from 'lucide-react';
import { teacherUI } from '@/lib/styles/teacher-ui';

interface EcommerceSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function EcommerceSidebar({ activeTab, onTabChange }: EcommerceSidebarProps) {
  const [showQuickNav, setShowQuickNav] = useState(false);
  const menu = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'inventory', label: 'Inventory', icon: Boxes },
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
              <button
                onClick={() => { setShowQuickNav(false); onTabChange('overview'); }}
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Ecommerce overview
              </button>
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
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 border-l-2 ${
                isActive
                  ? 'bg-[var(--unified-accent)] text-[var(--unified-text-primary)] shadow-md border-l-[var(--unified-accent-dark)]'
                  : 'text-[var(--unified-text-inverse)] hover:bg-[var(--unified-accent)] hover:text-[var(--unified-text-primary)] hover:border-l-[var(--unified-accent-dark)] border-transparent'
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


