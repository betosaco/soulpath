'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ScheduleBookingFlow } from '@/components/ScheduleBookingFlow';

export default function SchedulePage() {
  return (
    <AppLayout>
      <ScheduleBookingFlow />
    </AppLayout>
  );
}
