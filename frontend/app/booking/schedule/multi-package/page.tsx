/**
 * ========================================================================================
 * BOOKING MULTI-PACKAGE SCHEDULE PAGE
 * ========================================================================================
 *
 * ROUTE: /booking/schedule/multi-package
 * PURPOSE: Handles schedule selection when user has multiple packages in cart
 *
 * SCENARIO: Multi-Package
 * - User has multiple packages in cart
 * - System shows package selection modal for each booking
 * - Allows cross-package booking with proper validation
 *
 * URL PARAMETERS:
 * - multiPackage: 'true' (indicates multi-package scenario)
 *
 * FLOW:
 * - Previous: Usually from cart "Book Now" action
 * - Next: /booking/customer-info (when all packages are scheduled)
 */

'use client';

import { AppShell } from '@/components/AppShell';
import { ScheduleSelectionStep } from '@/components/booking/steps/ScheduleSelectionStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';

/**
 * BOOKING MULTI-PACKAGE SCHEDULE PAGE COMPONENT
 * ---------------------------------------------
 * Next.js page component for multi-package schedule selection
 *
 * @returns React component
 */
export default function MultiPackageSchedulePage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BookingLayout>
          <ScheduleSelectionStep />
        </BookingLayout>
      </div>
    </AppShell>
  );
}
