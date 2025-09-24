'use client';

import React from 'react';

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
  // Lazy load TanStack Query to avoid SSR issues
  const [QueryClientProvider, setQueryClientProvider] = React.useState<any>(null);
  const [queryClient, setQueryClient] = React.useState<any>(null);

  React.useEffect(() => {
    // Dynamically import TanStack Query on client side only
    const loadQueryProvider = async () => {
      try {
        const { QueryClientProvider: QCP, QueryClient } = await import('@tanstack/react-query');
        
        const client = new QueryClient({
          defaultOptions: {
            queries: {
              // Cache data for 5 minutes by default
              staleTime: 5 * 60 * 1000,
              // Keep data in cache for 10 minutes
              gcTime: 10 * 60 * 1000,
              // Retry failed requests up to 3 times
              retry: 3,
              // Retry with exponential backoff
              retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
              // Refetch on window focus for fresh data
              refetchOnWindowFocus: true,
              // Refetch on reconnect
              refetchOnReconnect: true,
              // Don't refetch on mount if data is fresh
              refetchOnMount: true,
            },
            mutations: {
              // Retry mutations once on failure
              retry: 1,
              // Retry delay for mutations
              retryDelay: 1000,
            },
          },
        });

        setQueryClientProvider(() => QCP);
        setQueryClient(client);
      } catch (error) {
        console.error('Failed to load TanStack Query:', error);
      }
    };

    loadQueryProvider();
  }, []);

  // Show children without QueryProvider if not loaded yet
  if (!QueryClientProvider || !queryClient) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
        />
      )} */}
    </QueryClientProvider>
  );
}
