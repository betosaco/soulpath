# 🚀 State Management Migration Guide

## Overview

This guide covers the migration from the legacy state management system to the new modern architecture using **TanStack Query** for server state and **Zustand** for client state.

## 🎯 Benefits of the New System

### TanStack Query (Server State)
- **Automatic Caching**: Data is cached intelligently with stale-while-revalidate
- **Background Refetching**: Fresh data is fetched in the background
- **Optimistic Updates**: UI updates immediately while mutations are in progress
- **Error Handling**: Built-in retry logic and error boundaries
- **DevTools**: Excellent debugging experience with React Query DevTools

### Zustand (Client State)
- **Performance**: No unnecessary re-renders, only components using specific state update
- **Simplicity**: Less boilerplate than Context API
- **Persistence**: Automatic localStorage persistence for cart and preferences
- **TypeScript**: Full type safety with excellent IntelliSense
- **DevTools**: Redux DevTools integration for debugging

## 📋 Migration Checklist

### ✅ Phase 1: Core Infrastructure (Completed)
- [x] Install TanStack Query and Zustand
- [x] Create QueryClient configuration
- [x] Set up QueryProvider wrapper
- [x] Create central Zustand store
- [x] Update AppShell with QueryProvider

### 🔄 Phase 2: Hook Migration (In Progress)
- [x] Create `usePackagesQuery` hook
- [x] Create `useAuthQuery` hook
- [ ] Migrate `useSchedule` hook
- [ ] Migrate `useProducts` hook
- [ ] Migrate `useUser` hook

### 🔄 Phase 3: Component Updates (Pending)
- [ ] Update components to use new hooks
- [ ] Replace cart context with Zustand store
- [ ] Update authentication components
- [ ] Test all functionality

## 🔧 Hook Migration Examples

### Before: Legacy usePackages
```typescript
// Old way with manual state management
export function usePackages(currency: string = 'PEN') {
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // ... manual fetch logic
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return { packages, loading, error, refetch: fetchPackages };
}
```

### After: TanStack Query usePackages
```typescript
// New way with automatic caching and state management
export function usePackages(currency: string = 'PEN') {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.packages.list(currency),
    queryFn: () => fetchPackagesAPI(currency, user?.access_token),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3,
    onError: (error) => {
      toast.error(`Error loading packages: ${error.message}`);
    },
  });
}
```

### Before: Legacy Cart Context
```typescript
// Old way with Context API
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // ... lots of useCallback and useMemo for performance
}
```

### After: Zustand Store
```typescript
// New way with Zustand
export const useAppStore = create<AppStore>()(
  persist(
    immer((set, get) => ({
      // Cart state
      items: [],
      addItem: (item) => set((state) => {
        state.items.push({ ...item, quantity: 1 });
        state.isCartOpen = true;
      }),
      // ... other actions
    })),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Usage in components
const { items, addItem, removeItem } = useCart();
```

## 🔄 Component Migration Examples

### Before: Using Legacy Hooks
```typescript
function PackagesList() {
  const { packages, loading, error, refetch } = usePackages('PEN');
  const { cartItems, addToCart } = useCart();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {packages.map(pkg => (
        <PackageCard 
          key={pkg.id} 
          package={pkg} 
          onAddToCart={() => addToCart(pkg)}
        />
      ))}
    </div>
  );
}
```

### After: Using New Hooks
```typescript
function PackagesList() {
  const { data: packages, isLoading, error, refetch } = usePackages('PEN');
  const { addItem } = useCart();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {packages?.map(pkg => (
        <PackageCard 
          key={pkg.id} 
          package={pkg} 
          onAddToCart={() => addItem(pkg)}
        />
      ))}
    </div>
  );
}
```

## 🎯 Key Changes in Component Usage

### TanStack Query Hooks
- `loading` → `isLoading`
- `error` → `error` (but now it's an Error object)
- `data` → `data` (now the actual data, not wrapped)
- `refetch` → `refetch` (same function, but now returns a promise)

### Zustand Store
- `useCart()` → `useCart()` (same interface, but now from Zustand)
- `useAuth()` → `useAuth()` (same interface, but now from Zustand)
- New: `useUI()` for UI state management
- New: `useCartUI()` for cart-specific UI state

## 🚀 Performance Improvements

### Before (Context API)
- All consumers re-render when any part of context changes
- Manual optimization with useMemo and useCallback
- Prop drilling for deeply nested components

### After (Zustand)
- Only components using specific state slices re-render
- Automatic optimization with selectors
- Direct access to state from any component

### Before (Manual Fetching)
- No caching, refetch on every mount
- Manual loading and error states
- No background updates

### After (TanStack Query)
- Intelligent caching with stale-while-revalidate
- Automatic loading and error states
- Background refetching for fresh data

## 🔧 Development Tools

### TanStack Query DevTools
- View all queries and their states
- Inspect cache contents
- Trigger refetches manually
- Monitor query performance

### Zustand DevTools
- Redux DevTools integration
- Time-travel debugging
- State inspection
- Action replay

## 📝 Migration Steps for Components

1. **Update Imports**
   ```typescript
   // Old
   import { usePackages } from '@/hooks/usePackages';
   import { useCart } from '@/lib/cart-context';
   
   // New
   import { usePackages } from '@/hooks/usePackagesQuery';
   import { useCart } from '@/store/appStore';
   ```

2. **Update Hook Usage**
   ```typescript
   // Old
   const { packages, loading, error } = usePackages('PEN');
   
   // New
   const { data: packages, isLoading, error } = usePackages('PEN');
   ```

3. **Update Error Handling**
   ```typescript
   // Old
   if (error) return <div>Error: {error}</div>;
   
   // New
   if (error) return <div>Error: {error.message}</div>;
   ```

4. **Update Loading States**
   ```typescript
   // Old
   if (loading) return <div>Loading...</div>;
   
   // New
   if (isLoading) return <div>Loading...</div>;
   ```

## 🧪 Testing the Migration

### Test Checklist
- [ ] Packages load correctly
- [ ] Cart functionality works
- [ ] Authentication flows work
- [ ] Error states display properly
- [ ] Loading states show correctly
- [ ] Data persists across page refreshes
- [ ] Background refetching works
- [ ] Optimistic updates work

### Common Issues and Solutions

1. **"Cannot read property of undefined"**
   - Solution: Use optional chaining (`data?.map`) or provide fallbacks

2. **"Query key mismatch"**
   - Solution: Ensure query keys are consistent across components

3. **"Store not updating"**
   - Solution: Check that you're using the correct selector hooks

4. **"DevTools not showing"**
   - Solution: Ensure you're in development mode and DevTools are installed

## 🎉 Benefits After Migration

- **Better Performance**: Reduced re-renders and intelligent caching
- **Better UX**: Background updates and optimistic UI
- **Better DX**: Excellent DevTools and TypeScript support
- **Better Maintainability**: Clear separation of concerns
- **Better Testing**: Easier to mock and test state

## 📚 Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Zustand DevTools](https://github.com/pmndrs/zustand#devtools)

## 🔄 Rollback Plan

If issues arise during migration:

1. **Keep Legacy Hooks**: Original hooks are preserved with `Legacy` suffix
2. **Gradual Migration**: Migrate components one by one
3. **Feature Flags**: Use environment variables to toggle between old/new systems
4. **Monitoring**: Watch for performance regressions or errors

The new system is designed to be backward-compatible, so you can migrate gradually without breaking existing functionality.
