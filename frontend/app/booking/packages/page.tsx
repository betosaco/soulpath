/**
 * ========================================================================================
 * BOOKING PACKAGES PAGE
 * ========================================================================================
 *
 * ROUTE: /booking/packages
 * PURPOSE: Handles package selection for booking sessions
 *
 * SCENARIOS SUPPORTED:
 * - Schedule-First: User selected a time slot, now chooses package
 * - Direct Package Selection: User wants to browse and select packages
 *
 * URL PARAMETERS:
 * - slotId: For schedule-first scenario (pre-selected time slot)
 * - flowType: 'schedule-first' for schedule-first scenario
 *
 * FLOW:
 * - Previous: /schedule (if coming from schedule page)
 * - Next: /booking/schedule (when package is selected)
 */

'use client';

import { AppShell } from '@/components/AppShell';
import { PackageSelectionStep } from '@/components/booking/steps/PackageSelectionStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';

/**
 * BOOKING PACKAGES PAGE COMPONENT
 * -------------------------------
 * Next.js page component for the package selection step
 *
 * @returns React component
 */
export default function PackagesPage() {
  return (
    <AppShell>
      <BookingLayout>
        <PackageSelectionStep />
      </BookingLayout>
    </AppShell>
  );
}
