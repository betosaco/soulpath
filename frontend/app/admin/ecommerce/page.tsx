'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { EcommerceDashboard } from '@/components/ecommerce/EcommerceDashboard';

export default function EcommercePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <AppShell className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-text-tertiary)] mx-auto mb-4"></div>
            <p className="text-[var(--color-text-secondary)] text-lg">Loading ecommerce dashboard...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell className="min-h-screen bg-white">
      <EcommerceDashboard />
    </AppShell>
  );
}
