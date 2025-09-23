'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';
import { MasterBookingFlow } from '@/components/MasterBookingFlow';

export default function EnhancedPackagesPage() {
  return (
    <AppShell>
      <MasterBookingFlow onCheckoutComplete={(orderData) => {
        console.log('Package purchase completed:', orderData);
      }} />
    </AppShell>
  );
}
