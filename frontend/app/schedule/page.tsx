'use client';

import React, { useEffect, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { EnhancedSchedule } from '@/components/EnhancedSchedule';
import { useCart } from '@/store/appStore';

// ULTRA-OPTIMIZATION: Memoized SchedulePage component with UI-first approach
const SchedulePage = memo(function SchedulePage() {
  const router = useRouter();
  const { items: cartItems } = useCart();

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

  // UI-first approach: Render immediately, let EnhancedSchedule handle its own loading
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
