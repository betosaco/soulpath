'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ScheduleNavigatorProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
  totalSlots?: number;
  isLoading?: boolean;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

export function ScheduleNavigator({
  onDateChange,
  totalSlots = 0,
  isLoading = false,
  initialStartDate,
  initialEndDate
}: ScheduleNavigatorProps) {
  // Initialize with provided dates or current week
  const [currentStartDate, setCurrentStartDate] = useState<Date | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);

  // Set initial dates
  useEffect(() => {
    let start: Date;
    let end: Date;

    if (initialStartDate && initialEndDate) {
      start = new Date(initialStartDate);
      end = new Date(initialEndDate);
    } else {
      // Default to current week starting Monday
      const today = new Date();
      const monday = new Date(today);
      const dayOfWeek = monday.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      monday.setDate(today.getDate() - daysToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      start = monday;
      end = sunday;
    }

    setCurrentStartDate(start);
    setCurrentEndDate(end);
  }, [initialStartDate, initialEndDate]);

  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    if (!currentStartDate || !currentEndDate) return;

    const days = direction === 'prev' ? -7 : 7;
    const newStartDate = new Date(currentStartDate);
    const newEndDate = new Date(currentEndDate);

    newStartDate.setDate(newStartDate.getDate() + days);
    newEndDate.setDate(newEndDate.getDate() + days);

    setCurrentStartDate(newStartDate);
    setCurrentEndDate(newEndDate);
    onDateChange(newStartDate, newEndDate);
  };

  const navigatePrevious = () => navigateWeek('prev');
  const navigateNext = () => navigateWeek('next');

  const navigateToToday = () => {
    // Calculate current week (Monday to Sunday)
    const today = new Date();
    const monday = new Date(today);
    const dayOfWeek = monday.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    setCurrentStartDate(monday);
    setCurrentEndDate(sunday);
    onDateChange(monday, sunday);
  };

  // Format date for display
  const formatDateRange = () => {
    if (!currentStartDate || !currentEndDate) {
      return 'Loading...';
    }

    return `${currentStartDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })} - ${currentEndDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  // Call onDateChange when dates are set
  useEffect(() => {
    if (currentStartDate && currentEndDate) {
      onDateChange(currentStartDate, currentEndDate);
    }
  }, [currentStartDate, currentEndDate, onDateChange]);

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={navigatePrevious}
              disabled={isLoading}
              className="px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="text-center min-w-[180px]">
              <div className="font-semibold text-base">
                {formatDateRange()}
              </div>
              <div className="text-xs text-muted">
                {totalSlots} classes available
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={navigateNext}
              disabled={isLoading}
              className="px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Today Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToToday}
            disabled={isLoading}
            className="px-3 text-xs"
          >
            Today
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}