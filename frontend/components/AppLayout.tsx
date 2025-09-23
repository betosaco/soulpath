'use client';

import React from 'react';
import { AppShell } from './AppShell';

interface AppLayoutProps {
  children: React.ReactNode;
  user?: { email: string } | null;
  isAdmin?: boolean;
  showFooter?: boolean;
  className?: string;
}

/**
 * AppLayout - Legacy wrapper component for backward compatibility
 * 
 * This component now simply delegates to the new AppShell component.
 * It maintains the same interface for existing pages while centralizing
 * the core layout logic in AppShell.
 * 
 * @deprecated Consider using AppShell directly for new components
 */
export function AppLayout({ 
  children, 
  user = null, 
  isAdmin = false, 
  showFooter = true,
  className = "min-h-screen bg-white"
}: AppLayoutProps) {
  return (
    <AppShell 
      user={user}
      isAdmin={isAdmin}
      showFooter={showFooter}
      className={className}
    >
      {children}
    </AppShell>
  );
}
