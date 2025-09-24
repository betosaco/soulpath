'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { useCart, useCartUI } from '@/store/appStore';

interface MobileCartToggleProps {
  className?: string;
}

export function MobileCartToggle({ className = '' }: MobileCartToggleProps) {
  const { getTotalItems } = useCart();
  const { isCartOpen, toggleCart } = useCartUI();
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

  // Don't render if cart is empty (after hydration)
  if (isHydrated && totalItems === 0) {
    return null;
  }

  return (
    <motion.button 
      onClick={() => toggleCart()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center rounded-lg header-button-menu touch-manipulation focus-visible px-4 py-2 min-h-[44px] min-w-[44px] relative overflow-hidden ${className}`}
      aria-label={isCartOpen ? 'Close cart' : 'Open cart'}
      aria-expanded={isCartOpen}
    >
      {/* Mobile: Show "Cart" text with icon */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">
          {isCartOpen ? 'Close' : 'Cart'}
        </span>
        <motion.div
          animate={{ rotate: isCartOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isCartOpen ? <X size={16} /> : <ShoppingCart size={16} />}
        </motion.div>
      </div>

      {/* Item count badge - only show after hydration */}
      {isHydrated && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#6ea058] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}

      {/* Ripple effect for mobile */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
