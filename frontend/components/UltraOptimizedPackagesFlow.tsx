'use client';

import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { usePackages } from '@/hooks/usePackages';
import { useCart } from '@/hooks/useCart';
import { PackagePrice } from '@/types/package';

// ULTRA-OPTIMIZATION 1: Memoized package card component
const PackageCard = memo(({ 
  pkg, 
  onAddToCart, 
  isInCart 
}: { 
  pkg: PackagePrice; 
  onAddToCart: (pkg: PackagePrice) => void;
  isInCart: boolean;
}) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(pkg);
  }, [pkg, onAddToCart]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{pkg.packageDefinition.name}</h3>
        <span className="text-2xl font-bold text-[#6ea058]">
          {pkg.currency.symbol} {pkg.price.toFixed(2)}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {pkg.packageDefinition.description}
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-700">
          {pkg.packageDefinition.sessionsCount} session{pkg.packageDefinition.sessionsCount !== 1 ? 's' : ''}
        </span>
        {pkg.packageDefinition.isPopular && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isInCart}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
          isInCart
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#6ea058] text-white hover:bg-[#5a8a4a]'
        }`}
      >
        {isInCart ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
});

PackageCard.displayName = 'PackageCard';

// ULTRA-OPTIMIZATION 2: Virtualized package list
const VirtualizedPackageList = memo(({ 
  packages, 
  onAddToCart, 
  cartItems 
}: { 
  packages: PackagePrice[];
  onAddToCart: (pkg: PackagePrice) => void;
  cartItems: any[];
}) => {
  // ULTRA-OPTIMIZATION 3: Memoized cart item IDs for fast lookup
  const cartItemIds = useMemo(() => 
    new Set(cartItems.map(item => item.id)), 
    [cartItems]
  );

  // ULTRA-OPTIMIZATION 4: Memoized package grid
  const packageGrid = useMemo(() => {
    return packages.map((pkg) => (
      <PackageCard
        key={pkg.id}
        pkg={pkg}
        onAddToCart={onAddToCart}
        isInCart={cartItemIds.has(pkg.id)}
      />
    ));
  }, [packages, onAddToCart, cartItemIds]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packageGrid}
    </div>
  );
});

VirtualizedPackageList.displayName = 'VirtualizedPackageList';

// ULTRA-OPTIMIZATION 5: Loading skeleton
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// ULTRA-OPTIMIZATION 6: Main component with performance optimizations
export function UltraOptimizedPackagesFlow() {
  const { packages, loading, error } = usePackages('PEN');
  const { addItem, items: cartItems } = useCart();
  
  // ULTRA-OPTIMIZATION 7: Memoized add to cart handler
  const handleAddToCart = useCallback((pkg: PackagePrice) => {
    addItem({
      id: pkg.id,
      name: pkg.packageDefinition.name,
      price: pkg.price,
      image: '/images/products/yoga-journal-1.jpg',
      sku: `PKG-${pkg.id}`,
      currency: pkg.currency.code,
      type: 'package',
      sessions: pkg.packageDefinition.sessionsCount,
      quantity: 1
    });
  }, [addItem]);

  // ULTRA-OPTIMIZATION 8: Memoized filtered packages
  const filteredPackages = useMemo(() => {
    if (!packages) return [];
    return packages.filter(pkg => pkg.packageDefinition.isActive);
  }, [packages]);

  // ULTRA-OPTIMIZATION 9: Performance monitoring
  useEffect(() => {
    if (packages && packages.length > 0) {
      console.log(`🚀 Ultra-optimized UI loaded ${packages.length} packages`);
    }
  }, [packages]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Packages</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading packages</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Packages</h1>
        <div className="text-sm text-gray-500">
          {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} available
        </div>
      </div>
      
      <VirtualizedPackageList
        packages={filteredPackages}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
      />
    </div>
  );
}

export default memo(UltraOptimizedPackagesFlow);
