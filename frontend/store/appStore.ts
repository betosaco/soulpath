import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// UI State Interface
interface UiState {
  // Cart state
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Mobile menu state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Loading states
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  
  // Toast notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  addToast: (toast: Omit<UiState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Theme state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Language state
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
}

// Cart State Interface
interface CartState {
  items: Array<{
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
    // Booking details
    bookingDetails?: {
      selectedDate?: string;
      selectedTime?: string;
      teacher?: string;
      dayOfWeek?: string;
      serviceType?: string;
      venue?: string;
      scheduleSlotId?: number;
    }[];
  }>;
  
  // Cart actions
  addItem: (item: Omit<CartState['items'][0], 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Booking actions
  addBookingToPackage: (packageId: string, bookingDetails: NonNullable<CartState['items'][0]['bookingDetails']>[0]) => void;
  removeBookingFromPackage: (packageId: string, bookingIndex: number) => void;
  removeBookingDetails: (id: string) => void;
  
  // Cart utilities
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hasMixedItems: () => boolean;
  requiresAddress: () => boolean;
}

// Auth State Interface
interface AuthState {
  user: {
    id: string;
    email: string;
    fullName?: string;
    role?: string;
    access_token: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Auth actions
  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

// Combined Store Interface
interface AppStore extends UiState, CartState, AuthState {}

/**
 * Central App Store using Zustand
 * 
 * This store manages all global client state including:
 * - UI state (modals, loading, toasts, theme, language)
 * - Cart state (items, quantities, bookings)
 * - Auth state (user, authentication status)
 * 
 * Features:
 * - Persistence for cart and user preferences
 * - Immer for immutable updates
 * - TypeScript support
 * - DevTools integration
 */
export const useAppStore = create<AppStore>()(
  persist(
    immer((set, get) => ({
      // UI State
      isCartOpen: false,
      toggleCart: () => set((state) => {
        state.isCartOpen = !state.isCartOpen;
      }),
      openCart: () => set((state) => {
        state.isCartOpen = true;
      }),
      closeCart: () => set((state) => {
        state.isCartOpen = false;
      }),
      
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
      }),
      openMobileMenu: () => set((state) => {
        state.isMobileMenuOpen = true;
      }),
      closeMobileMenu: () => set((state) => {
        state.isMobileMenuOpen = false;
      }),
      
      isGlobalLoading: false,
      setGlobalLoading: (loading: boolean) => set((state) => {
        state.isGlobalLoading = loading;
      }),
      
      toasts: [],
      addToast: (toast) => set((state) => {
        const id = Math.random().toString(36).substr(2, 9);
        state.toasts.push({ ...toast, id });
      }),
      removeToast: (id: string) => set((state) => {
        state.toasts = state.toasts.filter(toast => toast.id !== id);
      }),
      clearToasts: () => set((state) => {
        state.toasts = [];
      }),
      
      theme: 'system',
      setTheme: (theme) => set((state) => {
        state.theme = theme;
      }),
      
      language: 'en',
      setLanguage: (language) => set((state) => {
        state.language = language;
      }),
      
      // Cart State
      items: [],
      addItem: (item) => set((state) => {
        // Always use quantity 1 for both packages and products
        const quantity = 1;
        
        // Always add as new item with unique ID (no merging)
        state.items.push({ ...item, quantity });
        
        // Automatically open cart when item is added
        state.isCartOpen = true;
      }),
      
      removeItem: (id: string) => set((state) => {
        state.items = state.items.filter(item => item.id !== id);
      }),
      
      updateQuantity: (id: string, quantity: number) => set((state) => {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
          return;
        }
        
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }),
      
      clearCart: () => set((state) => {
        state.items = [];
      }),
      
      addBookingToPackage: (packageId: string, bookingDetails) => set((state) => {
        const item = state.items.find(item => item.id === packageId && item.type === 'package');
        if (item) {
          const currentBookings = Array.isArray(item.bookingDetails) ? item.bookingDetails : [];
          const packageSessions = item.sessions || 1;
          
          if (currentBookings.length >= packageSessions) {
            console.warn(`Package ${item.name} has reached its session limit (${packageSessions}). Cannot add more bookings.`);
            return;
          }
          
          item.bookingDetails = [...currentBookings, bookingDetails];
        }
      }),
      
      removeBookingFromPackage: (packageId: string, bookingIndex: number) => set((state) => {
        const item = state.items.find(item => item.id === packageId && item.type === 'package');
        if (item && Array.isArray(item.bookingDetails)) {
          item.bookingDetails = item.bookingDetails.filter((_, index) => index !== bookingIndex);
          if (item.bookingDetails.length === 0) {
            item.bookingDetails = undefined;
          }
        }
      }),
      
      removeBookingDetails: (id: string) => set((state) => {
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.bookingDetails = undefined;
        }
      }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      hasMixedItems: () => {
        const items = get().items;
        const hasProducts = items.some(item => item.type === 'product');
        const hasPackages = items.some(item => item.type === 'package');
        return hasProducts && hasPackages;
      },
      
      requiresAddress: () => {
        return get().items.some(item => item.type === 'product');
      },
      
      // Auth State
      user: null,
      isLoading: true,
      isAuthenticated: false,
      isAdmin: false,
      
      setUser: (user) => set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
        state.isAdmin = user?.role === 'ADMIN';
      }),
      
      setLoading: (loading: boolean) => set((state) => {
        state.isLoading = loading;
      }),
      
      signOut: () => set((state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.isLoading = false;
      }),
    })),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart and user preferences, not UI state
      partialize: (state) => ({
        items: state.items,
        theme: state.theme,
        language: state.language,
        user: state.user,
      }),
    }
  )
);

// Selector hooks for better performance
export const useCart = () => useAppStore((state) => ({
  items: state.items,
  addItem: state.addItem,
  removeItem: state.removeItem,
  updateQuantity: state.updateQuantity,
  clearCart: state.clearCart,
  addBookingToPackage: state.addBookingToPackage,
  removeBookingFromPackage: state.removeBookingFromPackage,
  removeBookingDetails: state.removeBookingDetails,
  getTotalItems: state.getTotalItems,
  getTotalPrice: state.getTotalPrice,
  hasMixedItems: state.hasMixedItems,
  requiresAddress: state.requiresAddress,
}));

export const useCartUI = () => useAppStore((state) => ({
  isCartOpen: state.isCartOpen,
  toggleCart: state.toggleCart,
  openCart: state.openCart,
  closeCart: state.closeCart,
}));

export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
  isAuthenticated: state.isAuthenticated,
  isAdmin: state.isAdmin,
  setUser: state.setUser,
  setLoading: state.setLoading,
  signOut: state.signOut,
}));

export const useUI = () => useAppStore((state) => ({
  isMobileMenuOpen: state.isMobileMenuOpen,
  toggleMobileMenu: state.toggleMobileMenu,
  openMobileMenu: state.openMobileMenu,
  closeMobileMenu: state.closeMobileMenu,
  isGlobalLoading: state.isGlobalLoading,
  setGlobalLoading: state.setGlobalLoading,
  toasts: state.toasts,
  addToast: state.addToast,
  removeToast: state.removeToast,
  clearToasts: state.clearToasts,
  theme: state.theme,
  setTheme: state.setTheme,
  language: state.language,
  setLanguage: state.setLanguage,
}));
