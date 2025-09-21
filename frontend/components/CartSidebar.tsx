'use client';

import React from 'react';
import { XMarkIcon, PlusIcon, MinusIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CartBookingDetails } from './CartBookingDetails';
import { toast } from 'sonner';

export function CartSidebar() {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeBookingDetails,
    addBookingToPackage,
    removeBookingFromPackage,
    clearCart,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const totalPrice = getTotalPrice();
  
  // Check if there are packages in the cart
  const packageItems = cartItems.filter(item => item.type === 'package');
  const hasPackages = packageItems.length > 0;
  const packageCount = packageItems.length;
  const packagesWithBooking = packageItems.filter(item => item.bookingDetails).length;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
          >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
              {hasPackages && (
                <div className="flex items-center gap-1">
                  {packagesWithBooking > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      {packagesWithBooking} scheduled
                    </span>
                  )}
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                    {packageCount} package{packageCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex items-center space-x-3 p-3 border border-green-300 rounded-lg bg-white">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image || '/images/products/yoga-journal-1.jpg'}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.currency === 'PEN' ? 'S/ ' : item.currency + ' '}{item.price.toFixed(2)}
                        </p>
                        {item.type === 'package' && (
                          <div className="text-xs text-gray-500 mt-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                {item.sessions} sessions
                              </span>
                              {item.duration && (
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {item.duration} min each
                                </span>
                              )}
                            </div>
                            {item.packageType && (
                              <div className="text-gray-600 font-medium capitalize">
                                {item.packageType.toLowerCase()} package
                              </div>
                            )}
                          </div>
                        )}
                        {item.type === 'product' && item.sku && (
                          <div className="text-xs text-gray-400 mt-1">
                            SKU: {item.sku}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (item.type === 'package') {
                                // For packages, create a new package instead of incrementing quantity
                                const uniqueId = `${item.sku}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                addToCart({
                                  id: uniqueId,
                                  name: item.name,
                                  price: item.price,
                                  image: item.image,
                                  sku: item.sku,
                                  currency: item.currency,
                                  type: item.type,
                                  sessions: item.sessions,
                                  duration: item.duration,
                                  packageType: item.packageType,
                                  maxGroupSize: item.maxGroupSize
                                });
                                toast.success(`${item.name} added to cart`);
                              } else {
                                // For products, increment quantity
                                updateQuantity(item.id, item.quantity + 1);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors ml-2"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.currency === 'PEN' ? 'S/ ' : item.currency + ' '}{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    
                    {/* Enhanced Booking Details Display */}
                    {item.type === 'package' && item.bookingDetails && (
                      <CartBookingDetails 
                        bookingDetails={item.bookingDetails}
                        className="w-full"
                        showActions={true}
                        packageSessions={item.sessions}
                        packageId={item.id}
                        onRemove={(index) => {
                          if (index !== undefined) {
                            removeBookingFromPackage(item.id, index);
                          } else {
                            removeBookingDetails(item.id);
                          }
                        }}
                        onEdit={(index) => {
                          // Set editing flag and navigate to schedule page
                          if (typeof window !== 'undefined') {
                            sessionStorage.setItem('isEditingSchedule', 'true');
                            sessionStorage.setItem('editingPackageId', item.id);
                            if (index !== undefined) {
                              sessionStorage.setItem('editingBookingIndex', index.toString());
                            }
                            window.location.href = '/schedule';
                          }
                        }}
                        onAddMore={() => {
                          // Navigate to schedule page to add more bookings
                          if (typeof window !== 'undefined') {
                            sessionStorage.setItem('isAddingMoreBookings', 'true');
                            
                            // Check if there are multiple packages
                            const otherPackages = cartItems.filter(cartItem => 
                              cartItem.type === 'package' && cartItem.id !== item.id
                            );
                            
                            if (otherPackages.length > 0) {
                              // Multiple packages - clear addingToPackageId to show modal
                              sessionStorage.removeItem('addingToPackageId');
                              console.log('🔍 Multiple packages detected - clearing addingToPackageId for modal');
                            } else {
                              // Single package - set specific package ID
                              sessionStorage.setItem('addingToPackageId', item.id);
                              console.log('🔍 Single package - setting addingToPackageId:', item.id);
                            }
                            
                            window.location.href = '/schedule';
                          }
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <motion.div 
              className="border-t border-gray-200 p-4 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-[#6ea058]">
                  {cartItems.length > 0 && cartItems[0].currency === 'PEN' ? 'S/ ' : cartItems.length > 0 ? cartItems[0].currency + ' ' : ''}{totalPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-2">
                {/* Book a Class Now button - only show if there are packages */}
                {hasPackages && (
                  <button
                    onClick={() => {
                      // Clear direct checkout flag for booking flow
                      if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('isDirectCheckout');
                        
                        // Check if user is already on schedule page
                        const currentPath = window.location.pathname;
                        const isOnSchedulePage = currentPath === '/schedule';
                        
                        if (isOnSchedulePage) {
                          // Already on schedule page - just close sidecart and let existing page handle it
                          setIsCartOpen(false);
                        } else {
                          // Not on schedule page - set up session storage and navigate
                          if (packageItems.length > 0) {
                            sessionStorage.setItem('isAddingMoreBookings', 'true');
                            // Only set specific package ID if there's only one package
                            if (packageItems.length === 1) {
                              sessionStorage.setItem('addingToPackageId', packageItems[0].id);
                            } else {
                              // Multiple packages - don't set specific package ID, let schedule page show modal
                              sessionStorage.removeItem('addingToPackageId');
                            }
                          }
                          // Navigate to schedule page
                          setIsCartOpen(false);
                          window.location.href = '/schedule';
                        }
                      }
                    }}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <CalendarDaysIcon className="h-5 w-5" />
                    Book a Class Now
                    {packageCount > 1 && (
                      <span className="text-xs bg-orange-500 px-2 py-1 rounded-full">
                        {packageCount} packages
                      </span>
                    )}
                  </button>
                )}
                
                <Link
                  href="/checkout"
                  className="w-full bg-[#6ea058] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5a8a4a] transition-colors text-center block"
                  onClick={() => {
                    // Set direct checkout flag and clear schedule data
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('isDirectCheckout', 'true');
                      sessionStorage.removeItem('selectedSchedule');
                      sessionStorage.removeItem('selectedPackageForBooking');
                    }
                    // Close sidecart when proceeding to checkout
                    setIsCartOpen(false);
                  }}
                >
                  Proceed to Checkout
                </Link>
                
                <button
                  onClick={clearCart}
                  className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </motion.div>
          )}
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
