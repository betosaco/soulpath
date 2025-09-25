'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PackageSelectionStep } from '@/components/booking/steps/PackageSelectionStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';
import { usePackages } from '@/hooks/usePackages';

export default function EnhancedPackagesPage() {
  const _router = useRouter();
  
  // Check if packages are loading to show page-level loading state
  const { loading: packagesLoading } = usePackages('S/.');

  // This page serves as an entry point for package browsing
  // Users can browse packages and add multiple packages to cart
  const handlePackageAdded = (packageData: any) => {
    // Package is already added to cart by PackageSelectionStep
    // No automatic redirect - let users add multiple packages
    console.log('Package added to cart:', packageData.name);
  };

  // Show page-level loading state while packages are being fetched
  if (packagesLoading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Yoga Packages
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Discover our carefully crafted yoga packages designed to support your wellness journey.
              </p>
            </div>
            
            {/* Loading State */}
            <div className="flex justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Packages</h2>
                <p className="text-green-600 font-medium mb-2">Please wait while we fetch our available packages</p>
                <p className="text-sm text-gray-500">This may take a few moments...</p>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <BookingLayout>
        <PackageSelectionStep onPackageAdded={handlePackageAdded} />
      </BookingLayout>
    </AppShell>
  );
}
