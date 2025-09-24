'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PackageSelectionStep } from '@/components/booking/steps/PackageSelectionStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';

export default function EnhancedPackagesPage() {
  const router = useRouter();

  // This page serves as an entry point for package browsing
  // Users can browse packages and when they click "Add to Cart",
  // they should be redirected to the booking schedule step
  const handlePackageAdded = (packageData: any) => {
    // Redirect to schedule selection with package ID (Package-First scenario)
    router.push(`/booking/schedule?packageId=${packageData.id}`);
  };

  return (
    <AppShell>
      <BookingLayout>
        <PackageSelectionStep onPackageAdded={handlePackageAdded} />
      </BookingLayout>
    </AppShell>
  );
}
