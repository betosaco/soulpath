'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PackagePrice } from '@/types/package';

// ULTRA-OPTIMIZATION 1: In-memory cache for packages
const packageCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// ULTRA-OPTIMIZATION 2: Request deduplication
const pendingRequests = new Map();

// ULTRA-OPTIMIZATION 3: Performance monitoring
const performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  avgResponseTime: 0,
  totalRequests: 0
};

interface UseUltraOptimizedPackagesReturn {
  packages: PackagePrice[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  performance: typeof performanceMetrics;
}

export function useUltraOptimizedPackages(currency: string = 'PEN'): UseUltraOptimizedPackagesReturn {
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ULTRA-OPTIMIZATION 4: Memoized cache key
  const cacheKey = useMemo(() => `packages:${currency}`, [currency]);

  // ULTRA-OPTIMIZATION 5: Optimized fetch function with request deduplication
  const fetchPackages = useCallback(async () => {
    const startTime = performance.now();
    
    // Check cache first
    const cached = packageCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      performanceMetrics.cacheHits++;
      console.log('🚀 Ultra-optimized cache hit');
      setPackages(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    // Check if request is already pending
    if (pendingRequests.has(cacheKey)) {
      console.log('🚀 Request deduplication - waiting for pending request');
      await pendingRequests.get(cacheKey);
      return;
    }

    // Create new request
    const requestPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        performanceMetrics.cacheMisses++;

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        const response = await fetch(
          `/api/packages?currency=${currency}&active=true&t=${Date.now()}`,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch packages');
        }

        const packagesData = data.data || [];
        
        // Update cache
        packageCache.set(cacheKey, {
          data: packagesData,
          timestamp: Date.now()
        });

        // Update performance metrics
        const responseTime = performance.now() - startTime;
        performanceMetrics.totalRequests++;
        performanceMetrics.avgResponseTime = 
          (performanceMetrics.avgResponseTime * (performanceMetrics.totalRequests - 1) + responseTime) / 
          performanceMetrics.totalRequests;

        console.log(`🚀 Ultra-optimized fetch: ${responseTime.toFixed(2)}ms`);

        setPackages(packagesData);
        setLoading(false);
        setError(null);

      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('🚀 Request aborted');
          return;
        }

        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch packages';
        console.error('❌ Ultra-optimized fetch error:', errorMessage);
        
        setError(errorMessage);
        setLoading(false);
      } finally {
        // Remove from pending requests
        pendingRequests.delete(cacheKey);
      }
    })();

    // Store the promise for deduplication
    pendingRequests.set(cacheKey, requestPromise);
    await requestPromise;
  }, [cacheKey, currency]);

  // ULTRA-OPTIMIZATION 6: Optimized refetch with cache invalidation
  const refetch = useCallback(async () => {
    // Clear cache
    packageCache.delete(cacheKey);
    await fetchPackages();
  }, [cacheKey, fetchPackages]);

  // ULTRA-OPTIMIZATION 7: Initial load with intersection observer
  useEffect(() => {
    fetchPackages();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPackages]);

  // ULTRA-OPTIMIZATION 8: Memoized performance metrics
  const performance = useMemo(() => ({ ...performanceMetrics }), [
    performanceMetrics.cacheHits,
    performanceMetrics.cacheMisses,
    performanceMetrics.avgResponseTime,
    performanceMetrics.totalRequests
  ]);

  return {
    packages,
    loading,
    error,
    refetch,
    performance
  };
}

// ULTRA-OPTIMIZATION 9: Cache management utilities
export const packageCacheUtils = {
  clear: () => {
    packageCache.clear();
    pendingRequests.clear();
    console.log('🚀 Package cache cleared');
  },
  
  getStats: () => ({
    cacheSize: packageCache.size,
    pendingRequests: pendingRequests.size,
    performance: { ...performanceMetrics }
  }),
  
  preload: async (currency: string = 'PEN') => {
    const cacheKey = `packages:${currency}`;
    if (!packageCache.has(cacheKey)) {
      const hook = useUltraOptimizedPackages(currency);
      await hook.refetch();
    }
  }
};
