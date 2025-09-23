import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 * 
 * This configuration provides:
 * - Intelligent caching with stale-while-revalidate
 * - Background refetching for fresh data
 * - Optimistic updates for mutations
 * - Error handling and retry logic
 * - DevTools integration for debugging
 */
export const queryClient = new QueryClient({
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

// Query key factory for consistent key generation
export const queryKeys = {
  // Packages queries
  packages: {
    all: ['packages'] as const,
    lists: () => [...queryKeys.packages.all, 'list'] as const,
    list: (currency: string) => [...queryKeys.packages.lists(), { currency }] as const,
    details: () => [...queryKeys.packages.all, 'detail'] as const,
    detail: (id: number, currency: string) => [...queryKeys.packages.details(), { id, currency }] as const,
    popular: (currency: string) => [...queryKeys.packages.all, 'popular', { currency }] as const,
    featured: (currency: string) => [...queryKeys.packages.all, 'featured', { currency }] as const,
  },
  
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    verify: () => [...queryKeys.auth.all, 'verify'] as const,
  },
  
  // Schedule queries
  schedule: {
    all: ['schedule'] as const,
    slots: () => [...queryKeys.schedule.all, 'slots'] as const,
    slotsByDate: (startDate: string, endDate: string) => 
      [...queryKeys.schedule.slots(), { startDate, endDate }] as const,
  },
  
  // User queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    bookings: () => [...queryKeys.user.all, 'bookings'] as const,
    packages: () => [...queryKeys.user.all, 'packages'] as const,
  },
  
  // Products queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (category?: string) => [...queryKeys.products.lists(), { category }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), { id }] as const,
  },
} as const;
