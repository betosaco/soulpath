import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/store/appStore';
import { safeGet } from '@/lib/safe-fetch';
import { queryKeys } from '@/lib/query-client';
import { toast } from 'sonner';

// API response interface for packages endpoint
interface PackagesApiResponse {
  success: boolean;
  data: PackagePrice[];
  meta: {
    currency: string;
    total: number;
  };
  message?: string;
  error?: string;
}

export interface PackagePrice {
  id: number;
  price: number;
  pricePerClass?: number;
  packageDefinition: {
    id: number;
    name: string;
    description: string;
    sessionsCount: number;
    packageType: string;
    maxGroupSize?: number;
    isActive: boolean;
    isPopular?: boolean;
    featured?: boolean;
    displayOrder?: number;
    sessionDuration: {
      id: number;
      name: string;
      duration_minutes: number;
      description?: string;
    };
  };
  currency: {
    id: number;
    code: string;
    symbol: string;
    name: string;
  };
  pricingMode: string;
  isActive: boolean;
}

// API function for fetching packages
async function fetchPackagesAPI(currency: string, accessToken?: string): Promise<PackagePrice[]> {
  console.log(`🔍 Fetching packages for currency: ${currency}`);
  
  const headers: HeadersInit = {};
  
  // Add authorization header only if user is authenticated
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await safeGet(`/api/packages?currency=${currency}&active=true`, {
    headers,
    timeout: 10000,
    retries: 1,
  });

  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch packages');
  }

  console.log('✅ Packages fetched successfully:', response.data);
  
  // Handle the API response format - response.data is the actual API response
  const apiResponse = response.data as PackagesApiResponse;
  console.log('🔍 API Response structure:', {
    success: apiResponse?.success,
    hasData: !!apiResponse?.data,
    dataLength: apiResponse?.data?.length,
    dataType: typeof apiResponse?.data,
    dataIsArray: Array.isArray(apiResponse?.data)
  });
  
  // Extract packages from the API response
  const packages: PackagePrice[] = apiResponse?.success && Array.isArray(apiResponse.data) ? apiResponse.data : [];
  console.log('📦 Processed packages:', packages.length, packages);
  
  if (apiResponse?.message && apiResponse.message.includes('mock data')) {
    console.log('📝 Using mock packages - database unavailable');
  }
  
  return packages;
}

/**
 * usePackages - TanStack Query hook for fetching packages
 * 
 * Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching for fresh data
 * - Error handling and retry logic
 * - Loading states management
 * - Optimistic updates support
 */
export function usePackages(currency: string = 'PEN') {
  console.log('🚀 usePackagesQuery hook called with currency:', currency);
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.packages.list(currency),
    queryFn: () => {
      console.log('🚀 TanStack Query calling fetchPackagesAPI with:', { currency, hasToken: !!user?.access_token });
      return fetchPackagesAPI(currency, user?.access_token);
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Error handling is now done via error boundary or try-catch
    // Don't provide placeholder data to avoid showing empty state during loading
    // placeholderData: [],
  });
}

/**
 * usePackage - Hook for fetching a single package by ID
 */
export function usePackage(packageId: number, currency: string = 'PEN') {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.packages.detail(packageId, currency),
    queryFn: async () => {
      const packages = await fetchPackagesAPI(currency, user?.access_token);
      const packageData = packages.find(pkg => pkg.id === packageId);
      
      if (!packageData) {
        throw new Error(`Package with ID ${packageId} not found`);
      }
      
      return packageData;
    },
    enabled: !!packageId, // Only run query if packageId is provided
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

/**
 * usePopularPackages - Hook for fetching popular packages only
 */
export function usePopularPackages(currency: string = 'PEN') {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.packages.popular(currency),
    queryFn: async () => {
      const packages = await fetchPackagesAPI(currency, user?.access_token);
      return packages.filter(pkg => pkg.packageDefinition.isPopular);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

/**
 * useFeaturedPackages - Hook for fetching featured packages only
 */
export function useFeaturedPackages(currency: string = 'PEN') {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.packages.featured(currency),
    queryFn: async () => {
      const packages = await fetchPackagesAPI(currency, user?.access_token);
      return packages.filter(pkg => pkg.packageDefinition.featured);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

/**
 * usePackagesWithCurrency - Hook for fetching packages with currency selection
 */
export function usePackagesWithCurrency() {
  const [selectedCurrency, setSelectedCurrency] = React.useState('S/.');
  const packagesQuery = usePackages(selectedCurrency);

  const changeCurrency = React.useCallback((currency: string) => {
    setSelectedCurrency(currency);
  }, []);

  return {
    ...packagesQuery,
    selectedCurrency,
    changeCurrency,
  };
}

/**
 * usePackagePurchase - Mutation hook for purchasing packages
 */
export function usePackagePurchase() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ packageId, quantity = 1 }: { packageId: number; quantity?: number }) => {
      if (!user?.access_token) {
        throw new Error('User must be authenticated to purchase packages');
      }
      
      const response = await fetch('/api/packages/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ packageId, quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to purchase package');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch packages to update availability
      queryClient.invalidateQueries({ queryKey: queryKeys.packages.all });
      
      // Invalidate user packages
      queryClient.invalidateQueries({ queryKey: queryKeys.user.packages() });
      
      toast.success('Package purchased successfully!');
    },
    onError: (error) => {
      console.error('❌ Error purchasing package:', error);
      toast.error(`Failed to purchase package: ${error.message}`);
    },
  });
}

// Re-export the original hook for backward compatibility
export { usePackages as usePackagesLegacy } from './usePackages';
