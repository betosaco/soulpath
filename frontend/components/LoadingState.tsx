'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <AppLayout className="min-h-screen bg-white">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{message}</p>
        </div>
      </div>
    </AppLayout>
  );
}
