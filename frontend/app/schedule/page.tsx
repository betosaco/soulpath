'use client';

import React, { useState, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ScheduleBookingFlow } from '@/components/ScheduleBookingFlow';

export default function SchedulePage() {
  const [currentStartDate, setCurrentStartDate] = useState<Date>(() => {
    // Initialize with September 22, 2025 (Monday) - local time
    return new Date(2025, 8, 22, 0, 0, 0, 0); // September 22, 2025 at midnight local time
  });

  const [currentEndDate, setCurrentEndDate] = useState<Date>(() => {
    // Initialize with September 28, 2025 (Sunday) - local time
    return new Date(2025, 8, 28, 23, 59, 59, 999); // September 28, 2025 at 11:59:59 PM local time
  });

  const [totalSlots, setTotalSlots] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);


  const handleSlotsChange = useCallback((slots: Array<{
    id: number;
    date: string;
    time: string;
    isAvailable: boolean;
    capacity: number;
    bookedCount: number;
    duration: number;
    teacher: {
      id: number;
      name: string;
    };
    serviceType: {
      id: number;
      name: string;
    };
    venue: {
      id: number;
      name: string;
    };
  }>) => {
    setTotalSlots(slots.length);
  }, []);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Schedule Content - Week from September 22 to 28 */}
          <ScheduleBookingFlow
            startDate={currentStartDate}
            endDate={currentEndDate}
            onSlotsChange={handleSlotsChange}
            onStepChange={handleStepChange}
          />
        </div>
      </div>
    </AppLayout>
  );
}
