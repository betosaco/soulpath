'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart, useCartUI } from '@/store/appStore';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className = '' }: CartIconProps) {
  const { getTotalItems } = useCart();
  const { openCart } = useCartUI();
  const [isHydrated, setIsHydrated] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Handle hydration safely
  useEffect(() => {
    setIsHydrated(true);
    setTotalItems(getTotalItems());
  }, [getTotalItems]);

  // Update total items when cart changes
  useEffect(() => {
    if (isHydrated) {
      setTotalItems(getTotalItems());
    }
  }, [getTotalItems, isHydrated]);

  return (
    <button
      onClick={() => openCart()}
      className={`relative flex items-center p-2 text-gray-600 hover:text-[#6ea058] transition-colors ${className}`}
      aria-label={`Shopping cart with ${isHydrated ? totalItems : 0} items`}
    >
      <div className="flex items-center space-x-2">
        <ShoppingCartIcon className="h-8 w-8" />
        <span className="text-base sm:text-lg font-medium">Cart</span>
      </div>
      {isHydrated && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#6ea058] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
