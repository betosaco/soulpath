'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';

export default function PackagesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const packages = (t && typeof t === 'object' && 'packages' in t) ? t.packages as Record<string, string> : {};

  useEffect(() => {
    // Redirect directly to enhanced packages flow
    router.push('/packages/enhanced');
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-primary)] flex items-center justify-center">
      <div className="space-y-6">
        {/* Minimal Loading Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{packages.title || 'Available Packages'}</h2>
          <p className="text-[var(--color-text-secondary)]">{packages.loadingPackages || 'Loading packages...'}</p>
        </div>
        
        {/* Subtle Loading Animation - Same as other pages */}
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-primary-500)]/25 border-t-[var(--color-primary-500)]"></div>
        </div>
      </div>
    </div>
  );
}
