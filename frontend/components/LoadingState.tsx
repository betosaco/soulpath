'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <AppShell className="min-h-screen bg-[var(--color-surface-primary)]">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-text-tertiary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] text-lg">{message}</p>
        </div>
      </div>
    </AppShell>
  );
}
