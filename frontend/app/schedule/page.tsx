'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';
import { EnhancedSchedule } from '@/components/EnhancedSchedule';

export default function SchedulePage() {
  const handleScheduleSelected = (slot: any) => {
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
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Class Schedule
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our available yoga classes. Book a session and we&apos;ll guide you through the package selection.
            </p>
          </div>

          <EnhancedSchedule
            onBookSlot={handleScheduleSelected}
            showFilters={true}
          />
        </div>
      </div>
    </AppShell>
  );
}
