'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';
import { MasterBookingFlow } from '@/components/MasterBookingFlow';

export default function SchedulePage() {
  const handleCheckoutComplete = (orderData: any) => {
    console.log('Booking completed:', orderData);
    // Redirect to confirmation or account page
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Unified Booking Flow - includes package selection and scheduling */}
          <MasterBookingFlow 
            onCheckoutComplete={handleCheckoutComplete}
            initialStep={1} // Start from scheduling step
          />
        </div>
      </div>
    </AppShell>
  );
}
