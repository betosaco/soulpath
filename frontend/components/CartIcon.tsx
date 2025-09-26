'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart, useCartUI } from '@/store/appStore';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className = '' }: CartIconProps) {
  const { getTotalItems: _getTotalItems, items } = useCart();
  const { isCartOpen, toggleCart } = useCartUI();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration safely
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Calculate total items directly from items array for better reactivity
  const totalItems = isHydrated ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  // Always render cart icon - don't hide when empty

  return (
    <button
      onClick={() => toggleCart()}
      className={`relative flex items-center p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors ${className}`}
      aria-label={`${isCartOpen ? 'Close' : 'Open'} shopping cart with ${isHydrated ? totalItems : 0} items`}
      aria-expanded={isCartOpen}
    >
      <div className="flex items-center space-x-2 font-heading">
        <ShoppingCartIcon className="h-8 w-8" />
        <span className="text-sm font-medium">Cart</span>
      </div>
      {isHydrated && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[var(--color-primary-500)] text-[var(--primary-foreground)] text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
