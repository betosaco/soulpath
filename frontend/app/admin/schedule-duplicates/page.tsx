"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { useScheduleDuplicates } from '@/hooks/useScheduleDuplicates';

interface DaySummary {
  totalSchedules: number;
  duplicates: number;
  warnings: number;
  scheduleList: any[];
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function ScheduleDuplicatesPage() {
  const [daySummaries, setDaySummaries] = useState<Record<string, DaySummary>>({});
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getDaySummary } = useScheduleDuplicates(null, { autoCheck: false });

  const loadDaySummary = async (day: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await getDaySummary(day);
      setDaySummaries(prev => ({
        ...prev,
        [day]: summary
      }));
    } catch (err) {
      console.error('Error loading day summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load day summary');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllDays = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const promises = DAYS_OF_WEEK.map(day => getDaySummary(day));
      const summaries = await Promise.all(promises);
      
      const summaryMap: Record<string, DaySummary> = {};
      DAYS_OF_WEEK.forEach((day, index) => {
        summaryMap[day] = summaries[index];
      });
      
      setDaySummaries(summaryMap);
    } catch (err) {
      console.error('Error loading all day summaries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load day summaries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDaySummary(selectedDay);
  }, [selectedDay]);


  const getSeverityIcon = (count: number) => {
    if (count === 0) return <CheckCircle className="h-4 w-4" />;
    if (count <= 2) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const totalDuplicates = Object.values(daySummaries).reduce((sum, day) => sum + day.duplicates, 0);
  const totalWarnings = Object.values(daySummaries).reduce((sum, day) => sum + day.warnings, 0);
  const totalSchedules = Object.values(daySummaries).reduce((sum, day) => sum + day.totalSchedules, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Duplicates</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage duplicate schedules across all days
          </p>
        </div>
        <Button 
          onClick={loadAllDays} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{totalSchedules}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Duplicates</p>
                <p className="text-2xl font-bold text-gray-900">{totalDuplicates}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-gray-900">{totalWarnings}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSchedules > 0 ? Math.round(((totalSchedules - totalDuplicates) / totalSchedules) * 100) : 100}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Day Overview</CardTitle>
          <CardDescription>
            Select a day to view detailed schedule information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const summary = daySummaries[day];
              const duplicateCount = summary?.duplicates || 0;
              const warningCount = summary?.warnings || 0;
              const totalCount = summary?.totalSchedules || 0;
              
              return (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  onClick={() => setSelectedDay(day)}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getSeverityIcon(duplicateCount)}
                    <span className="font-medium">{day.slice(0, 3)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalCount} schedules
                  </div>
                  {duplicateCount > 0 && (
                    <Badge variant="destructive" className="mt-1 text-xs">
                      {duplicateCount} duplicates
                    </Badge>
                  )}
                  {warningCount > 0 && duplicateCount === 0 && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {warningCount} warnings
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDay && daySummaries[selectedDay] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedDay} Schedule Details
            </CardTitle>
            <CardDescription>
              {daySummaries[selectedDay].totalSchedules} total schedules, 
              {daySummaries[selectedDay].duplicates} duplicates, 
              {daySummaries[selectedDay].warnings} warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {daySummaries[selectedDay].scheduleList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No schedules found for {selectedDay}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {daySummaries[selectedDay].scheduleList.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      
                      {schedule.type === 'teacher' && schedule.teacher && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {schedule.teacher.name}
                          </span>
                        </div>
                      )}
                      
                      {schedule.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {schedule.venue.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {schedule.type}
                      </Badge>
                      {schedule.isAvailable ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading schedule data...</span>
        </div>
      )}
    </div>
  );
}
