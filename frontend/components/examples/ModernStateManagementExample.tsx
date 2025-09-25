'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { usePackages } from '@/hooks/usePackages';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useCart, useCartUI, useUI } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * ModernStateManagementExample - Demonstrates the new state management system
 * 
 * This component showcases:
 * - TanStack Query for server state (packages, auth)
 * - Zustand for client state (cart, UI)
 * - Optimistic updates and error handling
 * - Loading states and caching
 * - TypeScript integration
 */
export function ModernStateManagementExample() {
  // TanStack Query hooks for server state
  const { packages, loading: packagesLoading, error: packagesError } = usePackages('S/.');
  const { user, isLoading: authLoading, isAuthenticated, signIn, signOut } = useAuthQuery();
  
  // Zustand hooks for client state
  const { items: cartItems, addItem, removeItem, getTotalPrice, getTotalItems } = useCart();
  const { isCartOpen, toggleCart } = useCartUI();
  const { addToast } = useUI();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToCart = (pkg: any) => {
    // Optimistic update - UI updates immediately
    addItem({
      id: pkg.id.toString(),
      name: pkg.packageDefinition.name,
      price: pkg.price,
      image: pkg.packageDefinition.name?.includes('MATPASS') 
        ? '/matpass-logo.png' 
        : '/placeholder-package.jpg',
      currency: pkg.currency?.code || 'S/.',
      type: 'package',
      sessions: pkg.packageDefinition.sessionsCount || 1,
      duration: pkg.packageDefinition.sessionDuration?.duration_minutes || 60,
      packageType: pkg.packageDefinition.packageType || 'standard',
    });
    
    // Show success toast
    addToast({
      type: 'success',
      message: `${pkg.packageDefinition.name} added to cart!`,
      duration: 3000,
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeItem(itemId);
    addToast({
      type: 'info',
      message: 'Item removed from cart',
      duration: 2000,
    });
  };

  const handleLogin = async () => {
    try {
      await signIn('demo@example.com', 'password');
    } catch {
      addToast({
        type: 'error',
        message: 'Login failed. Please try again.',
        duration: 5000,
      });
    }
  };

  return (
    <div className="unified-container unified-py-xl">
      <div className="unified-card">
        <div className="unified-card__header">
          <h1 className="unified-card__title">🚀 Modern State Management Demo</h1>
          <p className="unified-card__subtitle">
            Demonstrating TanStack Query + Zustand integration
          </p>
        </div>

        <div className="unified-card__content">
          {/* Authentication Section */}
          <section className="unified-mb-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              Authentication (TanStack Query)
            </h2>
            
            <div className="unified-grid unified-grid-cols-1 md:unified-grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Auth Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {authLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        <span>Authenticated</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Welcome, {user?.email}
                      </p>
                      <Button onClick={signOut} variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <AlertCircle size={16} />
                        <span>Not authenticated</span>
                      </div>
                      <Button onClick={handleLogin} size="sm">
                        Demo Login
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Query Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>✅ Automatic caching</li>
                    <li>✅ Background refetching</li>
                    <li>✅ Error handling</li>
                    <li>✅ Loading states</li>
                    <li>✅ Retry logic</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Packages Section */}
          <section className="unified-mb-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package size={20} />
              Packages (TanStack Query)
            </h2>
            
            {packagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={32} className="animate-spin" />
                <span className="ml-2">Loading packages...</span>
              </div>
            ) : packagesError ? (
              <div className="flex items-center gap-2 text-red-600 p-4 bg-red-50 rounded-lg">
                <AlertCircle size={20} />
                <span>Error loading packages: {typeof packagesError === 'string' ? packagesError : (packagesError as Error)?.message || 'Unknown error'}</span>
              </div>
            ) : (
              <div className="unified-grid unified-grid-cols-1 md:unified-grid-cols-2 lg:unified-grid-cols-3 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(packages as any[])?.slice(0, 6).map((pkg: any) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{pkg.packageDefinition.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {pkg.packageDefinition.sessionsCount} sessions
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-2xl font-bold text-green-600">
                            {pkg.currency.symbol}{pkg.price}
                          </p>
                          <p className="text-sm text-gray-600">
                            {pkg.packageDefinition.description}
                          </p>
                          <Button 
                            onClick={() => handleAddToCart(pkg)}
                            className="w-full"
                            size="sm"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Cart Section */}
          <section className="unified-mb-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart (Zustand Store)
            </h2>
            
            <div className="unified-grid unified-grid-cols-1 md:unified-grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Items: {getTotalItems()}</p>
                    <p>Total: S/. {getTotalPrice().toFixed(2)}</p>
                    <Button 
                      onClick={toggleCart}
                      variant={isCartOpen ? "outline" : "default"}
                      size="sm"
                    >
                      {isCartOpen ? 'Close' : 'Open'} Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>✅ Persistence (localStorage)</li>
                    <li>✅ Optimistic updates</li>
                    <li>✅ TypeScript support</li>
                    <li>✅ DevTools integration</li>
                    <li>✅ Performance optimized</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {cartItems.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Cart Items:</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.currency} {item.price} × {item.quantity}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRemoveFromCart(item.id)}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Performance Benefits */}
          <section>
            <h2 className="text-xl font-semibold mb-4">🎯 Performance Benefits</h2>
            
            <div className="unified-grid unified-grid-cols-1 md:unified-grid-cols-2 lg:unified-grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>TanStack Query</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>🚀 Intelligent caching</li>
                    <li>🔄 Background updates</li>
                    <li>⚡ Optimistic updates</li>
                    <li>🛡️ Error boundaries</li>
                    <li>🔧 DevTools support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zustand Store</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>🎯 Selective re-renders</li>
                    <li>💾 Automatic persistence</li>
                    <li>🔒 Type safety</li>
                    <li>📦 Minimal bundle size</li>
                    <li>🛠️ Easy testing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Developer Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>📝 Less boilerplate</li>
                    <li>🔍 Better debugging</li>
                    <li>⚡ Faster development</li>
                    <li>🧪 Easier testing</li>
                    <li>📚 Great documentation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
