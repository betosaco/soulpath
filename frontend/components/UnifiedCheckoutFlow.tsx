'use client';

import React from 'react';
import { MasterBookingFlow } from './MasterBookingFlow';
import { AppLayout } from '@/components/AppLayout';

interface UnifiedCheckoutFlowProps {
  onCheckoutComplete?: (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: any[];
  }) => void;
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
  onCheckoutComplete
}: UnifiedCheckoutFlowProps) {
  return (
    <AppLayout showFooter={false}>
      <div className="min-h-screen bg-gray-50 py-8">
        <MasterBookingFlow onCheckoutComplete={onCheckoutComplete} />
      </div>
    </AppLayout>
  );
}

export default function UnifiedCheckoutFlow(props: UnifiedCheckoutFlowProps) {
  return <UnifiedCheckoutFlowContent {...props} />;
}
