'use client';

import React, { useState, useEffect, memo } from 'react';

interface PerformanceMetrics {
  apiResponseTime: number;
  uiRenderTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  networkRequests: number;
}

// ULTRA-OPTIMIZATION 1: Performance monitoring component
export const PerformanceDashboard = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    apiResponseTime: 0,
    uiRenderTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkRequests: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  // ULTRA-OPTIMIZATION 2: Real-time performance monitoring
  useEffect(() => {
    const updateMetrics = () => {
      // Monitor API response times
      const originalFetch = window.fetch;
      let totalResponseTime = 0;
      let requestCount = 0;

      window.fetch = async (...args) => {
        const start = performance.now();
        const response = await originalFetch(...args);
        const end = performance.now();
        
        totalResponseTime += (end - start);
        requestCount++;
        
        return response;
      };

      // Monitor memory usage
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;

      // Monitor cache hit rate
      const cacheStats = localStorage.getItem('cache-stats');
      const cacheData = cacheStats ? JSON.parse(cacheStats) : { hits: 0, misses: 0 };
      const cacheHitRate = cacheData.hits + cacheData.misses > 0 
        ? (cacheData.hits / (cacheData.hits + cacheData.misses)) * 100 
        : 0;

      setMetrics({
        apiResponseTime: requestCount > 0 ? totalResponseTime / requestCount : 0,
        uiRenderTime: 0, // Will be updated by React DevTools
        cacheHitRate,
        memoryUsage,
        networkRequests: requestCount
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  // ULTRA-OPTIMIZATION 3: Keyboard shortcut to toggle dashboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          📊 Perf
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Dashboard</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* API Response Time */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">API Response:</span>
          <span className={`text-sm font-medium ${
            metrics.apiResponseTime < 100 ? 'text-green-600' :
            metrics.apiResponseTime < 300 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {metrics.apiResponseTime.toFixed(2)}ms
          </span>
        </div>

        {/* Cache Hit Rate */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Cache Hit Rate:</span>
          <span className={`text-sm font-medium ${
            metrics.cacheHitRate > 80 ? 'text-green-600' :
            metrics.cacheHitRate > 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {metrics.cacheHitRate.toFixed(1)}%
          </span>
        </div>

        {/* Memory Usage */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Memory Usage:</span>
          <span className={`text-sm font-medium ${
            metrics.memoryUsage < 50 ? 'text-green-600' :
            metrics.memoryUsage < 100 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {metrics.memoryUsage.toFixed(1)}MB
          </span>
        </div>

        {/* Network Requests */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Network Requests:</span>
          <span className="text-sm font-medium text-gray-900">
            {metrics.networkRequests}
          </span>
        </div>

        {/* Performance Score */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Performance Score:</span>
            <span className={`text-sm font-bold ${
              metrics.apiResponseTime < 100 && metrics.cacheHitRate > 80 ? 'text-green-600' :
              metrics.apiResponseTime < 300 && metrics.cacheHitRate > 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.apiResponseTime < 100 && metrics.cacheHitRate > 80 ? '🚀 Excellent' :
               metrics.apiResponseTime < 300 && metrics.cacheHitRate > 60 ? '✅ Good' : '⚠️ Needs Optimization'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Press Ctrl+Shift+P to toggle
        </p>
      </div>
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

// ULTRA-OPTIMIZATION 4: Performance optimization tips
export const PerformanceTips = memo(() => {
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    const performanceTips = [
      "Use React.memo() for expensive components",
      "Implement virtual scrolling for large lists",
      "Optimize images with next/image",
      "Use service workers for caching",
      "Minimize bundle size with code splitting",
      "Implement request deduplication",
      "Use Web Workers for heavy computations",
      "Optimize database queries with indexes",
      "Implement edge caching with CDN",
      "Use compression for API responses"
    ];

    setTips(performanceTips);
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-blue-900 mb-2">Performance Tips</h4>
      <ul className="text-xs text-blue-800 space-y-1">
        {tips.slice(0, 5).map((tip, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
});

PerformanceTips.displayName = 'PerformanceTips';
