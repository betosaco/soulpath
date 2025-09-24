/**
 * ========================================================================================
 * BOOKING SCHEDULE PAGE
 * ========================================================================================
 *
 * ROUTE: /booking/schedule
 * PURPOSE: Handles schedule selection for booking sessions
 *
 * SCENARIOS SUPPORTED:
 * - Package-First: User has selected a package, now chooses schedule
 * - Add-More: User adds additional sessions to existing packages
 * - Multi-Package: User manages scheduling across multiple packages
 *
 * URL PARAMETERS:
 * - packageId: For package-first and add-more scenarios
 * - flowType: 'add-more' for add-more scenario
 * - multiPackage: 'true' for multi-package scenario
 *
 * FLOW:
 * - Previous: /booking/packages (if coming from package selection)
 * - Next: /booking/customer-info (when scheduling is complete)
 */

'use client';

import { AppShell } from '@/components/AppShell';
import { ScheduleSelectionStep } from '@/components/booking/steps/ScheduleSelectionStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';

/**
 * BOOKING SCHEDULE PAGE COMPONENT
 * -------------------------------
 * Next.js page component for the schedule selection step
 *
 * @returns React component
 */
export default function SchedulePage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScheduleSelectionStep />
      </div>
    </AppShell>
  );
}
