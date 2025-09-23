'use client';

import React, { useState, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ScheduleBookingFlow } from '@/components/ScheduleBookingFlow';

export default function SchedulePage() {
  const [currentStartDate, setCurrentStartDate] = useState<Date>(() => {
    // Initialize with current week's Monday
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so go back 6 days to get Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [currentEndDate, setCurrentEndDate] = useState<Date>(() => {
    // Initialize with current week's Sunday
    const sunday = new Date(currentStartDate);
    sunday.setDate(currentStartDate.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
