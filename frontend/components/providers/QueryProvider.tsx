'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider - TanStack Query Provider Wrapper
 * 
 * This provider wraps the application with TanStack Query functionality:
 * - Server state caching and synchronization
 * - Background refetching and stale-while-revalidate
 * - Optimistic updates for mutations
 * - Error handling and retry logic
 * - DevTools integration (development only)
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
