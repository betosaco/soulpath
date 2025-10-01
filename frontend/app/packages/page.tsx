'use client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yoga Packages & Classes | MatMax Yoga Studio',
  description: 'Choose from our premium yoga packages in Miraflores, Lima. Individual sessions, group classes, and personalized yoga programs. Book your yoga package today with flexible scheduling.',
  keywords: [
    'yoga packages lima',
    'yoga classes miraflores',
    'yoga sessions lima',
    'individual yoga classes',
    'group yoga classes',
    'yoga packages peru',
    'yoga booking lima',
    'yoga pricing lima',
    'yoga membership',
    'yoga passes lima',
    'matpass yoga',
    'yoga packages booking'
  ],
  openGraph: {
    title: 'Yoga Packages & Classes | MatMax Yoga Studio',
    description: 'Choose from our premium yoga packages in Miraflores, Lima. Individual sessions, group classes, and personalized yoga programs.',
    type: 'website',
    url: 'https://matmax.world/packages',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Yoga Packages and Classes at MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Yoga Packages & Classes | MatMax Yoga Studio',
    description: 'Choose from our premium yoga packages in Miraflores, Lima. Individual sessions, group classes, and personalized yoga programs.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/packages',
  },
};

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
