'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to enhanced packages flow
    router.push('/packages/enhanced');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="space-y-6">
        {/* Minimal Loading Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Packages</h2>
          <p className="text-gray-600">Loading packages...</p>
        </div>
        
        {/* Subtle Loading Animation - Same as other pages */}
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600"></div>
        </div>
      </div>
    </div>
  );
}
