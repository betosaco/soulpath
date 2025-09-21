'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { EnhancedPackagesFlow } from '@/components/EnhancedPackagesFlow';

export default function EnhancedPackagesPage() {
  return (
    <AppLayout>
      <EnhancedPackagesFlow />
    </AppLayout>
  );
}
