'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { CustomerInfoStep } from './booking/steps/CustomerInfoStep';
import { BookingLayout } from './booking/layout/BookingLayout';

interface UnifiedCheckoutFlowProps {
  onCheckoutComplete?: (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: Array<{ name: string; quantity: number; price: number }>;
  }) => void;
  isDirectCheckout?: boolean;
}

/**
 * UnifiedCheckoutFlow - Entry point for the unified booking and checkout experience
 *
 * This component now serves as a wrapper around the new modular booking system,
 * providing direct checkout when the cart is ready for payment.
 *
 * Features:
 * - Direct checkout for ready-to-pay carts
 * - Customer information collection
 * - Conditional shipping address collection
 * - Payment processing
 * - Order confirmation
 */
function UnifiedCheckoutFlowContent({
  onCheckoutComplete: _onCheckoutComplete,
  isDirectCheckout = false
}: UnifiedCheckoutFlowProps) {
  const router = useRouter();

  // Handle redirect for non-direct checkout scenarios
  React.useEffect(() => {
    if (!isDirectCheckout) {
      router.push('/packages/enhanced');
    }
  }, [isDirectCheckout, router]);

  // Don't render anything if not direct checkout
  if (!isDirectCheckout) {
    return null;
  }

  const handleDataSaved = (_data: any) => {
    // Navigate to shipping step
    router.push('/booking/shipping?isDirectCheckout=true');
  };

  return (
    <AppShell showFooter={false}>
      <BookingLayout>
        <CustomerInfoStep onDataSaved={handleDataSaved} />
      </BookingLayout>
    </AppShell>
  );
}

export default function UnifiedCheckoutFlow(props: UnifiedCheckoutFlowProps) {
  return <UnifiedCheckoutFlowContent {...props} />;
}
