'use client';

import React, { useEffect, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { EnhancedSchedule } from '@/components/EnhancedSchedule';
import { useCart } from '@/store/appStore';

// ULTRA-OPTIMIZATION: Memoized SchedulePage component
const SchedulePage = memo(function SchedulePage() {
  const router = useRouter();
  const { items: cartItems } = useCart();
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  // ULTRA-OPTIMIZATION: Memoized cart monitoring
  const handleCartChange = useCallback(() => {
    // Only redirect if we're on the schedule page and cart becomes empty
    if (cartItems.length === 0) {
      console.log('🔄 Cart is empty, reloading schedule page for fresh start');
      // Use router.refresh() to reload the current page
      router.refresh();
    }
  }, [cartItems.length, router]);

  // Monitor cart state and redirect to fresh start when cart becomes empty
  useEffect(() => {
    handleCartChange();
  }, [handleCartChange]);

  // ULTRA-OPTIMIZATION: Handle initial loading state
  useEffect(() => {
    // Simulate a brief loading state for consistency
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 100); // Very brief to maintain ultra-fast performance

    return () => clearTimeout(timer);
  }, []);

  // ULTRA-OPTIMIZATION: Memoized schedule selection handler
  const handleScheduleSelected = useCallback((slot: any) => {
    // Navigate to booking flow when a slot is selected
    // Pass slot details including teacher and service information
    const params = new URLSearchParams({
      slotId: slot.id.toString(),
      slotDate: slot.date,
      slotTime: slot.time,
      teacherName: slot.teacher?.name || '',
      serviceType: slot.serviceType?.name || '',
      venueName: slot.venue?.name || '',
      readyForSchedule: 'true'
    });
    window.location.href = `/booking/packages?${params.toString()}`;
  }, []);

  // ULTRA-OPTIMIZATION: Show consistent loading state
  if (isInitialLoading) {
    return (
      <AppShell className="min-h-screen bg-[var(--color-surface-primary)]">
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Minimal Loading Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Classes</h2>
                <p className="text-[var(--color-text-secondary)]">Loading schedule...</p>
              </div>
              
              {/* Subtle Loading Animation - Same as other pages */}
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-border-200)] border-t-[var(--color-primary-500)]"></div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell className="min-h-screen bg-[var(--color-surface-primary)]">
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedSchedule
            onBookSlot={handleScheduleSelected}
            showFilters={true}
          />
        </div>
      </div>
    </AppShell>
  );
});

export default SchedulePage;
