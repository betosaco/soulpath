/**
 * ========================================================================================
 * BOOKING CONFIRMATION PAGE
 * ========================================================================================
 *
 * ROUTE: /booking/confirmation
 * PURPOSE: Shows order confirmation and booking details
 *
 * FEATURES:
 * - Order summary with all items and bookings
 * - Booking details for each package
 * - Order number and total
 * - Next steps instructions
 * - Download/print options (future)
 *
 * FLOW:
 * - Previous: /booking/payment (on successful payment)
 * - Next: None (final step)
 */

'use client';

import { AppShell } from '@/components/AppShell';
import { ConfirmationStep } from '@/components/booking/steps/ConfirmationStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';

/**
 * BOOKING CONFIRMATION PAGE COMPONENT
 * -----------------------------------
 * Next.js page component for order confirmation
 *
 * @returns React component
 */
export default function ConfirmationPage() {
  return (
    <AppShell>
      <BookingLayout showStepIndicator={false}>
        <ConfirmationStep />
      </BookingLayout>
    </AppShell>
  );
}
