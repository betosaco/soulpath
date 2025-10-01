import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enhanced Yoga Packages | Premium Classes & Sessions',
  description: 'Explore our enhanced yoga packages with flexible scheduling, personalized sessions, and premium wellness programs. Book your yoga classes in Miraflores, Lima with 30-day validity.',
  keywords: [
    'enhanced yoga packages',
    'premium yoga classes',
    'yoga sessions lima',
    'flexible yoga scheduling',
    'personalized yoga programs',
    'yoga packages miraflores',
    'yoga booking system',
    'yoga class packages',
    'wellness packages lima',
    'yoga membership lima',
    'matpass enhanced',
    'yoga session booking'
  ],
  openGraph: {
    title: 'Enhanced Yoga Packages | Premium Classes & Sessions',
    description: 'Explore our enhanced yoga packages with flexible scheduling, personalized sessions, and premium wellness programs.',
    type: 'website',
    url: 'https://matmax.world/packages/enhanced',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Enhanced Yoga Packages at MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Enhanced Yoga Packages | Premium Classes & Sessions',
    description: 'Explore our enhanced yoga packages with flexible scheduling, personalized sessions, and premium wellness programs.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/packages/enhanced',
  },
};

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PackageSelectionStep } from '@/components/booking/steps/PackageSelectionStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';
import { useLanguage } from '@/hooks/useTranslations';
import { StructuredData } from '@/components/StructuredData';

export default function EnhancedPackagesPage() {
  const _router = useRouter();
  const { language } = useLanguage();

  // This page serves as an entry point for package browsing
  // Users can browse packages and add multiple packages to cart
  const handlePackageAdded = (packageData: any) => {
    // Package is already added to cart by PackageSelectionStep
    // No automatic redirect - let users add multiple packages
    console.log('Package added to cart:', packageData.name);
  };

  // ULTRA-OPTIMIZATION: Remove unnecessary page-level loading
  // Let PackageSelectionStep handle its own loading state
  return (
    <AppShell className="min-h-screen bg-[var(--color-surface-primary)]">
      {/* Breadcrumb Structured Data */}
      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [
            { name: "Home", url: "https://matmax.world" },
            { name: "Packages", url: "https://matmax.world/packages" },
            { name: "Enhanced Packages", url: "https://matmax.world/packages/enhanced" }
          ]
        }}
      />
      
      <BookingLayout key={language}>
        <PackageSelectionStep key={language} onPackageAdded={handlePackageAdded} />
      </BookingLayout>
    </AppShell>
  );
}
