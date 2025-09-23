'use client';

import React from 'react';
import { MasterBookingFlow } from './MasterBookingFlow';
import { AppShell } from '@/components/AppShell';

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
 * This component now serves as a wrapper around MasterBookingFlow, providing
 * the complete booking and checkout experience in a single, coherent flow.
 * 
 * Features:
 * - Unified package and product selection
 * - Integrated scheduling for packages
 * - Customer information collection
 * - Conditional shipping address collection
 * - Payment processing
 * - Order confirmation
 */
function UnifiedCheckoutFlowContent({
  onCheckoutComplete,
  isDirectCheckout = false
}: UnifiedCheckoutFlowProps) {
  return (
    <AppShell showFooter={false}>
      <div className="min-h-screen bg-gray-50 py-8">
        <MasterBookingFlow onCheckoutComplete={onCheckoutComplete} isDirectCheckout={isDirectCheckout} />
      </div>
    </AppShell>
  );
}

export default function UnifiedCheckoutFlow(props: UnifiedCheckoutFlowProps) {
  return <UnifiedCheckoutFlowContent {...props} />;
}
