/**
 * ========================================================================================
 * BOOKING SHIPPING PAGE
 * ========================================================================================
 *
 * ROUTE: /booking/shipping
 * PURPOSE: Collects shipping address information for physical products
 *
 * CONDITIONAL RENDERING:
 * - Only shown when cart contains physical products that require shipping
 * - Automatically skipped if no shipping is required
 *
 * VALIDATION REQUIREMENTS:
 * - First Name: Required
 * - Last Name: Required
 * - Address: Required, minimum 10 characters
 * - City: Required
 * - State: Optional
 * - Postal Code: Optional
 * - Country: Required (defaults to Peru)
 *
 * FLOW:
 * - Previous: /booking/customer-info
 * - Next: /booking/payment
 */

'use client';

import { AppShell } from '@/components/AppShell';
import { ShippingStep } from '@/components/booking/steps/ShippingStep';

/**
 * BOOKING SHIPPING PAGE COMPONENT
 * -------------------------------
 * Next.js page component for shipping address collection
 *
 * @returns React component
 */
export default function ShippingPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ShippingStep />
      </div>
    </AppShell>
  );
}
