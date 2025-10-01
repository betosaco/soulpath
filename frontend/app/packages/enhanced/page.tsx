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
