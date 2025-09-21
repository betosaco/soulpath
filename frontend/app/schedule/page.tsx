'use client';

import React, { useState, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ScheduleBookingFlow } from '@/components/ScheduleBookingFlow';
import { ScheduleNavigator } from '@/components/ScheduleNavigator';

export default function SchedulePage() {
  const [currentStartDate, setCurrentStartDate] = useState<Date>(() => {
    // Initialize with current week
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(today.setDate(diff));
  });
  
  const [currentEndDate, setCurrentEndDate] = useState<Date>(() => {
    // Initialize with current week end (Sunday)
    const weekStart = new Date(currentStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  });

  const [totalSlots, setTotalSlots] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handleDateChange = useCallback((startDate: Date, endDate: Date) => {
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
  }, []);

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
          {/* Schedule Navigator - Only show in step 0 (Schedule Selection) */}
          {currentStep === 0 && (
            <ScheduleNavigator
              onDateChange={handleDateChange}
              totalSlots={totalSlots}
            />
          )}
          
          {/* Schedule Content */}
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
