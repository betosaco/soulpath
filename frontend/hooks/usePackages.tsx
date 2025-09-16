import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { safeGet } from '@/lib/safe-fetch';

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

export interface UsePackagesReturn {
  packages: PackagePrice[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastLoaded: Date | null;
}

export function usePackages(currency: string = 'PEN'): UsePackagesReturn {
  const { user } = useAuth();
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching packages for currency: ${currency}`);
      
      const headers: HeadersInit = {};
      
      // Add authorization header only if user is authenticated
      if (user?.access_token) {
        headers['Authorization'] = `Bearer ${user.access_token}`;
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
      
      // Handle the API response format - the response.data is already the API response
      const apiResponse = response.data as PackagesApiResponse;
      console.log('🔍 API Response structure:', {
        success: apiResponse?.success,
        hasData: !!apiResponse?.data,
        dataLength: apiResponse?.data?.length,
        dataType: typeof apiResponse?.data,
        dataIsArray: Array.isArray(apiResponse?.data)
      });
      
      // The API response is already the correct format
      const packages: PackagePrice[] = apiResponse?.success && Array.isArray(apiResponse.data) ? apiResponse.data : [];
      console.log('📦 Processed packages:', packages.length, packages);
      setPackages(packages);
      setLastLoaded(new Date());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch packages';
      console.error('❌ Error fetching packages:', errorMessage);
      setError(errorMessage);
      toast.error(`Error loading packages: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [user?.access_token, currency]);

  const refetch = useCallback(async () => {
    await fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    // Always fetch packages (public endpoint)
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    loading,
    error,
    refetch,
    lastLoaded,
  };
}

// Hook for fetching packages with currency selection
export function usePackagesWithCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState('PEN');
  const packagesData = usePackages(selectedCurrency);

  const changeCurrency = useCallback((currency: string) => {
    setSelectedCurrency(currency);
  }, []);

  return {
    ...packagesData,
    selectedCurrency,
    changeCurrency,
  };
}

// Hook for fetching a single package by ID
export function usePackage(packageId: number, currency: string = 'PEN') {
  const { packages, loading, error, refetch } = usePackages(currency);
  
  const packageData = packages.find(pkg => pkg.id === packageId);
  
  return {
    package: packageData,
    loading,
    error,
    refetch,
  };
}

// Hook for fetching popular packages only
export function usePopularPackages(currency: string = 'PEN') {
  const { packages, loading, error, refetch } = usePackages(currency);
  
  const popularPackages = packages.filter(pkg => pkg.packageDefinition.isPopular);
  
  return {
    packages: popularPackages,
    loading,
    error,
    refetch,
  };
}

// Hook for fetching featured packages only
export function useFeaturedPackages(currency: string = 'PEN') {
  const { packages, loading, error, refetch } = usePackages(currency);
  
  const featuredPackages = packages.filter(pkg => pkg.packageDefinition.featured);
  
  return {
    packages: featuredPackages,
    loading,
    error,
    refetch,
  };
}
