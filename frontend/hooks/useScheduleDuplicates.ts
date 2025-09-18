"use client";

import { useState, useCallback, useEffect } from 'react';

interface DuplicateInfo {
  type: 'exact_match' | 'time_overlap' | 'same_teacher_same_day' | 'same_venue_same_day';
  message: string;
  conflictingScheduleId: number;
  conflictingSchedule: any;
  severity: 'error' | 'warning';
}

interface DuplicateCheckResult {
  hasDuplicates: boolean;
  duplicates: DuplicateInfo[];
  warnings: string[];
}

interface UseScheduleDuplicatesOptions {
  debounceMs?: number;
  autoCheck?: boolean;
}

export function useScheduleDuplicates(
  scheduleData: any,
  options: UseScheduleDuplicatesOptions = {}
) {
  const { debounceMs = 500, autoCheck = true } = options;
  
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult>({
    hasDuplicates: false,
    duplicates: [],
    warnings: []
  });
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDuplicates = useCallback(async (data: any) => {
    if (!data || !data.startTime || !data.endTime || !data.type) {
      setDuplicateCheck({
        hasDuplicates: false,
        duplicates: [],
        warnings: []
      });
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/schedule-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduleData: data }),
      });

      const result = await response.json();
      
      if (result.success) {
        setDuplicateCheck(result.data);
      } else {
        setError(result.message || 'Failed to check duplicates');
        setDuplicateCheck({
          hasDuplicates: false,
          duplicates: [],
          warnings: []
        });
      }
    } catch (err) {
      console.error('Error checking duplicates:', err);
      setError('Network error while checking duplicates');
      setDuplicateCheck({
        hasDuplicates: false,
        duplicates: [],
        warnings: []
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Auto-check when scheduleData changes
  useEffect(() => {
    if (!autoCheck) return;

    const timeoutId = setTimeout(() => {
      checkDuplicates(scheduleData);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [scheduleData, checkDuplicates, debounceMs, autoCheck]);

  // Manual check function
  const manualCheck = useCallback(() => {
    checkDuplicates(scheduleData);
  }, [checkDuplicates, scheduleData]);

  // Get day summary
  const getDaySummary = useCallback(async (dayOfWeek: string) => {
    try {
      const response = await fetch(`/api/admin/schedule-duplicates?dayOfWeek=${dayOfWeek}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to get day summary');
      }
    } catch (err) {
      console.error('Error getting day summary:', err);
      throw err;
    }
  }, []);

  // Helper functions
  const hasErrors = duplicateCheck.duplicates.some(d => d.severity === 'error');
  const hasWarnings = duplicateCheck.duplicates.some(d => d.severity === 'warning') || duplicateCheck.warnings.length > 0;
  const canProceed = !hasErrors;

  return {
    duplicateCheck,
    isChecking,
    error,
    hasErrors,
    hasWarnings,
    canProceed,
    manualCheck,
    getDaySummary,
    clearError: () => setError(null)
  };
}

// Hook for checking duplicates in a form
export function useScheduleFormDuplicates(
  formData: any,
  options: UseScheduleDuplicatesOptions = {}
) {
  const duplicateHook = useScheduleDuplicates(formData, options);
  
  // Additional form-specific helpers
  const getFieldErrors = useCallback(() => {
    const errors: Record<string, string> = {};
    
    if (duplicateHook.hasErrors) {
      const errorDuplicates = duplicateHook.duplicateCheck.duplicates.filter(d => d.severity === 'error');
      if (errorDuplicates.length > 0) {
        errors.schedule = errorDuplicates[0].message;
      }
    }
    
    return errors;
  }, [duplicateHook.hasErrors, duplicateHook.duplicateCheck.duplicates]);

  const getFieldWarnings = useCallback(() => {
    const warnings: Record<string, string[]> = {};
    
    if (duplicateHook.hasWarnings) {
      const warningDuplicates = duplicateHook.duplicateCheck.duplicates.filter(d => d.severity === 'warning');
      const warningMessages = [
        ...warningDuplicates.map(d => d.message),
        ...duplicateHook.duplicateCheck.warnings
      ];
      
      if (warningMessages.length > 0) {
        warnings.schedule = warningMessages;
      }
    }
    
    return warnings;
  }, [duplicateHook.hasWarnings, duplicateHook.duplicateCheck]);

  return {
    ...duplicateHook,
    getFieldErrors,
    getFieldWarnings
  };
}
