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

// Cart Item Type
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
}

// Cart State Interface
interface CartState {
  items: CartItem[];
  
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

// Customer Data Interface
interface CustomerData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

// Customer State Interface
interface CustomerState {
  customerData: CustomerData | null;
  setCustomerData: (data: CustomerData) => void;
  clearCustomerData: () => void;
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
interface AppStore extends UiState, CartState, CustomerState, AuthState {}

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

          const newBookings = [...currentBookings, bookingDetails];
          console.log('🔄 addBookingToPackage:', {
            packageId,
            packageName: item.name,
            currentBookings: currentBookings.length,
            packageSessions,
            bookingDetails,
            newBookingsCount: newBookings.length,
            willExceedLimit: newBookings.length > packageSessions
          });

          if (currentBookings.length >= packageSessions) {
            console.warn(`❌ Package ${item.name} has reached its session limit (${packageSessions}). Cannot add more bookings.`);
            return;
          }
          
          item.bookingDetails = [...currentBookings, bookingDetails];

          console.log('✅ Booking added successfully:', {
            packageId,
            packageName: item.name,
            finalBookingsCount: item.bookingDetails?.length || 0,
            packageSessions,
            isAtMaxNow: (item.bookingDetails?.length || 0) >= packageSessions
          });
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
      
      // Customer State
      customerData: null,
      setCustomerData: (data) => set((state) => {
        state.customerData = data;
      }),
      clearCustomerData: () => set((state) => {
        state.customerData = null;
      }),
      
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
      // Only persist cart, customer data, and user preferences, not UI state
      partialize: (state) => ({
        items: state.items,
        customerData: state.customerData,
        theme: state.theme,
        language: state.language,
        user: state.user,
      }),
    }
  )
);

// Individual selector hooks to prevent infinite loops
export const useCartItems = () => useAppStore((state) => state.items);
export const useCartAddItem = () => useAppStore((state) => state.addItem);
export const useCartRemoveItem = () => useAppStore((state) => state.removeItem);
export const useCartUpdateQuantity = () => useAppStore((state) => state.updateQuantity);
export const useCartClearCart = () => useAppStore((state) => state.clearCart);
export const useCartAddBookingToPackage = () => useAppStore((state) => state.addBookingToPackage);
export const useCartRemoveBookingFromPackage = () => useAppStore((state) => state.removeBookingFromPackage);
export const useCartRemoveBookingDetails = () => useAppStore((state) => state.removeBookingDetails);
export const useCartGetTotalItems = () => useAppStore((state) => state.getTotalItems);
export const useCartGetTotalPrice = () => useAppStore((state) => state.getTotalPrice);
export const useCartHasMixedItems = () => useAppStore((state) => state.hasMixedItems);
export const useCartRequiresAddress = () => useAppStore((state) => state.requiresAddress);

// Combined cart hook for convenience
export const useCart = () => {
  const items = useCartItems();
  const addItem = useCartAddItem();
  const removeItem = useCartRemoveItem();
  const updateQuantity = useCartUpdateQuantity();
  const clearCart = useCartClearCart();
  const addBookingToPackage = useCartAddBookingToPackage();
  const removeBookingFromPackage = useCartRemoveBookingFromPackage();
  const removeBookingDetails = useCartRemoveBookingDetails();
  const getTotalItems = useCartGetTotalItems();
  const getTotalPrice = useCartGetTotalPrice();
  const hasMixedItems = useCartHasMixedItems();
  const requiresAddress = useCartRequiresAddress();
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    addBookingToPackage,
    removeBookingFromPackage,
    removeBookingDetails,
    getTotalItems,
    getTotalPrice,
    hasMixedItems,
    requiresAddress,
  };
};

// Individual cart UI selectors
export const useCartIsOpen = () => useAppStore((state) => state.isCartOpen);
export const useCartToggle = () => useAppStore((state) => state.toggleCart);
export const useCartOpen = () => useAppStore((state) => state.openCart);
export const useCartClose = () => useAppStore((state) => state.closeCart);

// Combined cart UI hook
export const useCartUI = () => {
  const isCartOpen = useCartIsOpen();
  const toggleCart = useCartToggle();
  const openCart = useCartOpen();
  const closeCart = useCartClose();
  
  return {
    isCartOpen,
    toggleCart,
    openCart,
    closeCart,
  };
};

// Individual auth selectors
export const useAuthUser = () => useAppStore((state) => state.user);
export const useAuthIsLoading = () => useAppStore((state) => state.isLoading);
export const useAuthIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useAuthIsAdmin = () => useAppStore((state) => state.isAdmin);
export const useAuthSetUser = () => useAppStore((state) => state.setUser);
export const useAuthSetLoading = () => useAppStore((state) => state.setLoading);
export const useAuthSignOut = () => useAppStore((state) => state.signOut);

// Combined auth hook
export const useAuth = () => {
  const user = useAuthUser();
  const isLoading = useAuthIsLoading();
  const isAuthenticated = useAuthIsAuthenticated();
  const isAdmin = useAuthIsAdmin();
  const setUser = useAuthSetUser();
  const setLoading = useAuthSetLoading();
  const signOut = useAuthSignOut();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    setUser,
    setLoading,
    signOut,
  };
};

// Individual UI selectors
export const useUIIsMobileMenuOpen = () => useAppStore((state) => state.isMobileMenuOpen);
export const useUIToggleMobileMenu = () => useAppStore((state) => state.toggleMobileMenu);
export const useUIOpenMobileMenu = () => useAppStore((state) => state.openMobileMenu);
export const useUICloseMobileMenu = () => useAppStore((state) => state.closeMobileMenu);
export const useUIIsGlobalLoading = () => useAppStore((state) => state.isGlobalLoading);
export const useUISetGlobalLoading = () => useAppStore((state) => state.setGlobalLoading);
export const useUIToasts = () => useAppStore((state) => state.toasts);
export const useUIAddToast = () => useAppStore((state) => state.addToast);
export const useUIRemoveToast = () => useAppStore((state) => state.removeToast);
export const useUIClearToasts = () => useAppStore((state) => state.clearToasts);
export const useUITheme = () => useAppStore((state) => state.theme);
export const useUISetTheme = () => useAppStore((state) => state.setTheme);
export const useUILanguage = () => useAppStore((state) => state.language);
export const useUISetLanguage = () => useAppStore((state) => state.setLanguage);

// Combined UI hook
export const useUI = () => {
  const isMobileMenuOpen = useUIIsMobileMenuOpen();
  const toggleMobileMenu = useUIToggleMobileMenu();
  const openMobileMenu = useUIOpenMobileMenu();
  const closeMobileMenu = useUICloseMobileMenu();
  const isGlobalLoading = useUIIsGlobalLoading();
  const setGlobalLoading = useUISetGlobalLoading();
  const toasts = useUIToasts();
  const addToast = useUIAddToast();
  const removeToast = useUIRemoveToast();
  const clearToasts = useUIClearToasts();
  const theme = useUITheme();
  const setTheme = useUISetTheme();
  const language = useUILanguage();
  const setLanguage = useUISetLanguage();
  
  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    isGlobalLoading,
    setGlobalLoading,
    toasts,
    addToast,
    removeToast,
    clearToasts,
    theme,
    setTheme,
    language,
    setLanguage,
  };
};
