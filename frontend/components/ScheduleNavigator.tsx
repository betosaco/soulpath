'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ScheduleNavigatorProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
  totalSlots?: number;
  isLoading?: boolean;
}

export function ScheduleNavigator({
  onDateChange,
  totalSlots = 0,
  isLoading = false
}: ScheduleNavigatorProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate week start (Monday) and end (Sunday)
  const getWeekStart = useCallback((date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }, []);

  const getWeekEnd = useCallback((date: Date) => {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }, [getWeekStart]);

  // Calculate month start and end
  const getMonthStart = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }, []);

  const getMonthEnd = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }, []);

  // Navigate functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
    updateDateRange(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    updateDateRange(newDate);
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    updateDateRange(today);
  };

  const updateDateRange = useCallback((date: Date) => {
    let startDate: Date;
    let endDate: Date;

    if (viewMode === 'week') {
      startDate = getWeekStart(date);
      endDate = getWeekEnd(date);
    } else {
      startDate = getMonthStart(date);
      endDate = getMonthEnd(date);
    }

    onDateChange(startDate, endDate);
  }, [viewMode, onDateChange, getWeekStart, getWeekEnd, getMonthStart, getMonthEnd]);

  // Handle view mode change
  const handleViewModeChange = (mode: 'week' | 'month') => {
    setViewMode(mode);
    updateDateRange(currentDate);
  };

  // Format date for display
  const formatDateRange = () => {
    if (viewMode === 'week') {
      const weekStart = getWeekStart(currentDate);
      const weekEnd = getWeekEnd(currentDate);
      return `${weekStart.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${weekEnd.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  // Initialize with current date range
  useEffect(() => {
    updateDateRange(currentDate);
  }, [currentDate, updateDateRange]);

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('week')}
              className="px-3 text-xs"
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('month')}
              className="px-3 text-xs"
            >
              Month
            </Button>
          </div>

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
