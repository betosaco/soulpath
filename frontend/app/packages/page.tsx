'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { PackagesBookingFlow } from '@/components/PackagesBookingFlow';

export default function PackagesPage() {
  return (
    <AppLayout>
      <PackagesBookingFlow />
    </AppLayout>
  );
}
