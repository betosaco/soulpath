'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  currency: string;
  type: 'product' | 'package';
  // Package-specific fields
  sessions?: number;
  duration?: number;
  packageType?: string;
  maxGroupSize?: number;
  // Product-specific fields
  stock?: number;
  weight?: string;
  dimensions?: string;
  // Booking details (optional) - can have multiple bookings for packages
  bookingDetails?: {
    selectedDate?: string;
    selectedTime?: string;
    teacher?: string;
    dayOfWeek?: string;
    serviceType?: string;
    venue?: string;
    scheduleSlotId?: number;
  }[];
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeBookingDetails: (id: string) => void;
  addBookingToPackage: (packageId: string, bookingDetails: CartItem['bookingDetails'][0]) => void;
  removeBookingFromPackage: (packageId: string, bookingIndex: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  hasMixedItems: () => boolean;
  requiresAddress: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart and cart state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
      
      // Load cart open state
      const savedCartOpen = localStorage.getItem('isCartOpen');
      if (savedCartOpen) {
        setIsCartOpen(JSON.parse(savedCartOpen));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Save cart open state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isCartOpen', JSON.stringify(isCartOpen));
    }
  }, [isCartOpen]);

  // Check for cart open state changes periodically to ensure sync
  useEffect(() => {
    const checkCartState = () => {
      if (typeof window !== 'undefined') {
        const savedCartOpen = localStorage.getItem('isCartOpen');
        if (savedCartOpen) {
          const shouldBeOpen = JSON.parse(savedCartOpen);
          if (shouldBeOpen !== isCartOpen) {
            setIsCartOpen(shouldBeOpen);
          }
        }
      }
    };

    // Check immediately
    checkCartState();
    
    // Check periodically
    const interval = setInterval(checkCartState, 100);
    
    return () => clearInterval(interval);
  }, [isCartOpen]);


  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      // Always use quantity 1 for both packages and products
      // The sessions field represents how many sessions the package includes
      const quantity = 1;
      
      // Always add as new item with unique ID (no merging)
      return [...prevItems, { ...item, quantity }];
    });
    
    // Automatically open cart sidebar when item is added
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return updatedItems;
    });
  }, [removeFromCart]);

  const removeBookingDetails = useCallback((id: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, bookingDetails: undefined } : item
      )
    );
  }, []);

  const addBookingToPackage = useCallback((packageId: string, bookingDetails: CartItem['bookingDetails'][0]) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === packageId && item.type === 'package') {
          // Ensure currentBookings is always an array
          const currentBookings = Array.isArray(item.bookingDetails) ? item.bookingDetails : [];
          return {
            ...item,
            bookingDetails: [...currentBookings, bookingDetails]
          };
        }
        return item;
      })
    );
  }, []);

  const removeBookingFromPackage = useCallback((packageId: string, bookingIndex: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === packageId && item.type === 'package' && Array.isArray(item.bookingDetails)) {
          const updatedBookings = item.bookingDetails.filter((_, index) => index !== bookingIndex);
          return {
            ...item,
            bookingDetails: updatedBookings.length > 0 ? updatedBookings : undefined
          };
        }
        return item;
      });
      return updatedItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const hasMixedItems = useCallback(() => {
    const hasProducts = cartItems.some(item => item.type === 'product');
    const hasPackages = cartItems.some(item => item.type === 'package');
    return hasProducts && hasPackages;
  }, [cartItems]);

  const requiresAddress = useCallback(() => {
    // Address is required if any physical product is present
    return cartItems.some(item => item.type === 'product');
  }, [cartItems]);

  const value: CartContextType = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    removeBookingDetails,
    addBookingToPackage,
    removeBookingFromPackage,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
    hasMixedItems,
    requiresAddress,
  }), [cartItems, isCartOpen, addToCart, removeFromCart, updateQuantity, removeBookingDetails, addBookingToPackage, removeBookingFromPackage, clearCart, getTotalItems, getTotalPrice, hasMixedItems, requiresAddress]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
