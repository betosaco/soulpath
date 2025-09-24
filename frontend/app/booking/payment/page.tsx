/**
 * ========================================================================================
 * BOOKING PAYMENT PAGE
 * ========================================================================================
 *
 * ROUTE: /booking/payment
 * PURPOSE: Handles payment processing and order completion
 *
 * INTEGRATIONS:
 * - Stripe payment processing
 * - Order creation and confirmation
 * - Email notifications (future)
 *
 * VALIDATION REQUIREMENTS:
 * - All packages must have at least one scheduled session
 * - No duplicate time slots within packages
 * - Valid customer information
 * - Valid shipping information (if required)
 * - Non-zero total price
 *
 * FLOW:
 * - Previous: /booking/customer-info or /booking/shipping
 * - Next: /booking/confirmation (on successful payment)
 */

'use client';

import { AppShell } from '@/components/AppShell';
import { PaymentStep } from '@/components/booking/steps/PaymentStep';

/**
 * BOOKING PAYMENT PAGE COMPONENT
 * ------------------------------
 * Next.js page component for payment processing
 *
 * @returns React component
 */
export default function PaymentPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PaymentStep />
      </div>
    </AppShell>
  );
}
