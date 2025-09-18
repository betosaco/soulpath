"use client";

import React from 'react';
import { AlertTriangle, XCircle, Info, CheckCircle } from 'lucide-react';

interface DuplicateInfo {
  type: 'exact_match' | 'time_overlap' | 'same_teacher_same_day' | 'same_venue_same_day';
  message: string;
  conflictingScheduleId: number;
  conflictingSchedule: any;
  severity: 'error' | 'warning';
}

interface ScheduleDuplicateWarningProps {
  duplicates: DuplicateInfo[];
  warnings: string[];
  onDismiss?: () => void;
  showWarnings?: boolean;
}

export default function ScheduleDuplicateWarning({
  duplicates,
  warnings,
  onDismiss,
  showWarnings = true
}: ScheduleDuplicateWarningProps) {
  const errorDuplicates = duplicates.filter(d => d.severity === 'error');
  const warningDuplicates = duplicates.filter(d => d.severity === 'warning');

  if (errorDuplicates.length === 0 && warningDuplicates.length === 0 && warnings.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'exact_match':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'time_overlap':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'same_teacher_same_day':
      case 'same_venue_same_day':
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };


  return (
    <div className="space-y-3">
      {/* Error Duplicates */}
      {errorDuplicates.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Schedule Conflicts Found ({errorDuplicates.length})
              </h3>
              <div className="space-y-2">
                {errorDuplicates.map((duplicate, index) => (
                  <div key={index} className="text-sm text-red-700">
                    <div className="flex items-start">
                      {getIcon(duplicate.type)}
                      <span className="ml-2">{duplicate.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-3 text-red-400 hover:text-red-600"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Warning Duplicates */}
      {showWarnings && warningDuplicates.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Schedule Warnings ({warningDuplicates.length})
              </h3>
              <div className="space-y-2">
                {warningDuplicates.map((duplicate, index) => (
                  <div key={index} className="text-sm text-yellow-700">
                    <div className="flex items-start">
                      {getIcon(duplicate.type)}
                      <span className="ml-2">{duplicate.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Warnings */}
      {showWarnings && warnings.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                System Warnings ({warnings.length})
              </h3>
              <div className="space-y-1">
                {warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-blue-700">
                    • {warning}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {(errorDuplicates.length > 0 || warningDuplicates.length > 0 || warnings.length > 0) && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
            <span>
              {errorDuplicates.length > 0 
                ? `Cannot proceed due to ${errorDuplicates.length} conflict(s)`
                : `Found ${warningDuplicates.length + warnings.length} warning(s) - schedule can be created`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for inline duplicate checking
export function InlineDuplicateChecker({
  scheduleData,
  onDuplicatesFound,
  children
}: {
  scheduleData: any;
  onDuplicatesFound: (duplicates: DuplicateInfo[], warnings: string[]) => void;
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = React.useState(false);

  const checkDuplicates = async () => {
    if (!scheduleData) return;

    setIsChecking(true);
    try {
      const response = await fetch('/api/admin/schedule-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduleData }),
      });

      const result = await response.json();
      
      if (result.success) {
        onDuplicatesFound(result.data.duplicates, result.data.warnings);
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
    } finally {
      setIsChecking(false);
    }
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(checkDuplicates, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [scheduleData]);

  return (
    <div className="relative">
      {children}
      {isChecking && (
        <div className="absolute top-2 right-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
