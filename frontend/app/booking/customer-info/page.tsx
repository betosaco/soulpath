/**
 * ========================================================================================
 * BOOKING CUSTOMER INFO PAGE
 * ========================================================================================
 *
 * ROUTE: /booking/customer-info
 * PURPOSE: Collects customer information for the booking
 *
 * SCENARIOS SUPPORTED:
 * - All scenarios: Every booking requires customer information
 * - Direct Checkout: Skip to here when cart is ready for payment
 *
 * VALIDATION REQUIREMENTS:
 * - Name: Required
 * - Email: Required, valid format
 * - Birth Date: Required, must be in past
 * - Birth Place: Required
 * - Phone: Optional but recommended
 *
 * FLOW:
 * - Previous: /booking/schedule or /booking/multi-package
 * - Next: /booking/shipping (if physical products) or /booking/payment
 */

'use client';

import { AppShell } from '@/components/AppShell';
import { CustomerInfoStep } from '@/components/booking/steps/CustomerInfoStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';

/**
 * BOOKING CUSTOMER INFO PAGE COMPONENT
 * ------------------------------------
 * Next.js page component for customer information collection
 *
 * @returns React component
 */
export default function CustomerInfoPage() {
  return (
    <AppShell>
      <BookingLayout>
        <CustomerInfoStep />
      </BookingLayout>
    </AppShell>
  );
}
