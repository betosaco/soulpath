/**
 * ========================================================================================
 * PACKAGE SELECTION STEP COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Handles package selection for the booking flow. This component replaces the
 * packages section from the monolithic MasterBookingFlow.tsx.
 *
 * RESPONSIBILITIES:
 * - Display available packages from the API
 * - Handle package addition to cart
 * - Show cart summary with booking details
 * - Provide "Book Now" button for packages
 * - Support schedule-first scenario (pre-selected schedules)
 *
 * SCENARIOS SUPPORTED:
 * - Schedule-First: User selected time slot, now chooses package
 * - Direct Package Selection: User browsing and selecting packages
 *
 * INTEGRATIONS:
 * - usePackages hook for package data
 * - useCart store for cart operations
 * - useBookingFlow hook for flow navigation
 * - useCartUI for cart display
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CheckCircle,
  Package,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useCart, useCartUI } from '@/store/appStore';
import { usePackages } from '@/hooks/usePackages';

/**
 * PACKAGE SELECTION STEP PROPS
 * ----------------------------
 * Props passed to the PackageSelectionStep component
 */
interface PackageSelectionStepProps {
  /** Optional callback when package is successfully added */
  onPackageAdded?: (packageData: any) => void;
}

/**
 * SCHEDULE DATA INTERFACE
 * -----------------------
 * Represents pre-selected schedule data for schedule-first flow
 */
interface ScheduleData {
  selectedDate: string;
  selectedTime: string;
  teacher: string;
  dayOfWeek: string;
  serviceType: string;
  venue: string;
  scheduleSlotId: number;
}

/**
 * PACKAGE SELECTION STEP COMPONENT
 * --------------------------------
 * Handles the package selection step of the booking flow
 *
 * @param props - Component props
 * @returns React component
 */
export function PackageSelectionStep({ onPackageAdded }: PackageSelectionStepProps) {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================

  /**
   * BOOKING FLOW STATE
   * ------------------
   * Access to centralized flow management
   */
  let bookingFlow;
  try {
    bookingFlow = useBookingFlow();
  } catch (error) {
    console.warn('⚠️ PackageSelectionStep: useBookingFlow failed:', error);
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading booking flow...</p>
      </div>
    );
  }
  
  // Add safety check for bookingFlow
  if (!bookingFlow) {
    console.warn('⚠️ PackageSelectionStep: useBookingFlow returned undefined');
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading booking flow...</p>
      </div>
    );
  }
  
  const {
    urlParams = {},
    isScheduleFirst = false,
    goToNextStep = () => console.warn('goToNextStep not available')
  } = bookingFlow;

  /**
   * CART MANAGEMENT
   * ---------------
   * Access to cart state and operations
   */
  let cart;
  try {
    cart = useCart();
  } catch (error) {
    console.warn('⚠️ PackageSelectionStep: useCart failed:', error);
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }
  
  // Add safety check for cart
  if (!cart) {
    console.warn('⚠️ PackageSelectionStep: useCart returned undefined');
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }
  
  const {
    items: cartItems = [],
    addItem: addToCart = () => console.warn('addToCart not available'),
    removeItem: removeFromCart = () => console.warn('removeFromCart not available'),
    updateQuantity = () => console.warn('updateQuantity not available'),
    getTotalPrice = () => 0
  } = cart;

  /**
   * CART UI MANAGEMENT
   * ------------------
   * Access to cart UI operations
   */
  let cartUI;
  try {
    cartUI = useCartUI();
  } catch (error) {
    console.warn('⚠️ PackageSelectionStep: useCartUI failed:', error);
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading cart UI...</p>
      </div>
    );
  }
  
  // Add safety check for cartUI
  if (!cartUI) {
    console.warn('⚠️ PackageSelectionStep: useCartUI returned undefined');
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading cart UI...</p>
      </div>
    );
  }
  
  const { openCart = () => console.warn('openCart not available') } = cartUI;

  /**
   * PACKAGES DATA
   * -------------
   * Access to available packages
   */
  const { packages, loading: packagesLoading, error: packagesError } = usePackages('S/.');
  
  // Debug packages data
  console.log('🔍 PackageSelectionStep - Packages state:', {
    packages,
    packagesLoading,
    packagesError,
    packagesLength: packages?.length,
    packagesType: typeof packages,
    packagesIsArray: Array.isArray(packages)
  });

  // Track if packages have been loaded at least once
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  useEffect(() => {
    if (packages && packages.length > 0 && !packagesLoading) {
      setHasLoadedOnce(true);
      // Show success animation for first load
      if (!hasLoadedOnce) {
        console.log('🎉 Packages loaded successfully!');
      }
    }
  }, [packages, packagesLoading, hasLoadedOnce]);
  
  // Add safety check for packages
  if (packagesError) {
    console.warn('⚠️ PackageSelectionStep: Error loading packages:', packagesError);
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading packages: {packagesError}</p>
      </div>
    );
  }

  // ============================================================================
  // BUSINESS LOGIC - SCHEDULE-FIRST SCENARIO
  // ============================================================================

  /**
   * SCHEDULE-FIRST SCHEDULES STATE
   * ------------------------------
   * In schedule-first scenario, we need to manage pre-selected schedules
   * This replaces the selectedSchedules state from MasterBookingFlow
   */
  const [preSelectedSchedules, setPreSelectedSchedules] = React.useState<ScheduleData[]>([]);

  /**
   * INITIALIZE PRE-SELECTED SCHEDULES
   * ---------------------------------
   * For schedule-first scenario, we need to reconstruct the selected schedule
   * from URL parameters
   */
  React.useEffect(() => {
    if (isScheduleFirst && urlParams.slotId && urlParams.slotDate && urlParams.slotTime) {
      console.log('🎯 Schedule-first scenario detected, initializing pre-selected schedule', {
        slotId: urlParams.slotId,
        slotDate: urlParams.slotDate,
        slotTime: urlParams.slotTime,
        readyForSchedule: urlParams.readyForSchedule
      });

      // Use actual slot data passed from the schedule page
      const slotId = parseInt(urlParams.slotId);
      const scheduleDate = new Date(urlParams.slotDate);

      const placeholderSchedule: ScheduleData = {
        selectedDate: urlParams.slotDate, // Use actual date from slot
        selectedTime: urlParams.slotTime, // Use actual time from slot
        teacher: (urlParams as any).teacherName || `Teacher ${(slotId % 5) + 1}`, // Use real teacher name from URL
        dayOfWeek: scheduleDate.toLocaleDateString('en-US', { weekday: 'long' }),
        serviceType: (urlParams as any).serviceType || 'Yoga Class', // Use real service type from URL
        venue: (urlParams as any).venueName || `Studio ${(slotId % 3) + 1}`, // Use real venue name from URL
        scheduleSlotId: slotId
      };

      console.log('📅 Created schedule from actual slot data:', placeholderSchedule);
      setPreSelectedSchedules([placeholderSchedule]);
    } else {
      // Clear schedules if not in schedule-first scenario or missing slot data
      setPreSelectedSchedules([]);
    }
  }, [isScheduleFirst, urlParams.slotId, urlParams.slotDate, urlParams.slotTime, (urlParams as any).teacherName, (urlParams as any).serviceType, (urlParams as any).venueName, urlParams.readyForSchedule]);

  // ============================================================================
  // BUSINESS LOGIC - PACKAGE MANAGEMENT
  // ============================================================================

  /**
   * GET PACKAGE REMAINING SESSIONS
   * ------------------------------
   * Calculates how many sessions a package can still book
   */
  const getPackageRemainingSessions = (packageId: string) => {
    const pkg = cartItems.find(item => item.id === packageId && item.type === 'package');
    if (!pkg) return 0;

    const totalSessions = pkg.sessions || 1;
    const scheduledSessions = pkg.bookingDetails?.length || 0;
    return Math.max(0, totalSessions - scheduledSessions);
  };

  /**
   * CHECK IF AT MAX SESSIONS
   * ------------------------
   * Determines if all packages in cart have reached their maximum sessions
   */
  const isAtMaxSessions = () => {
    const packageItems = cartItems.filter(item => item.type === 'package');
    if (packageItems.length === 0) return false;

    return packageItems.every(item => getPackageRemainingSessions(item.id) <= 0);
  };

  /**
   * UPDATE LOCKED TIME SLOTS
   * ------------------------
   * Updates the locked time slots when cart changes
   * (Placeholder - would need to be implemented based on your locking logic)
   */
  const updateLockedTimeSlots = () => {
    // TODO: Implement locked time slots update logic
    console.log('🔒 Updating locked time slots');
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE ADD PACKAGE
   * ------------------
   * Handles package selection and addition to cart
   * Different behavior based on current scenario
   */
  const handleAddPackage = (pkg: any) => {
    console.log('📦 PACKAGE SELECTION:', {
      packageName: pkg.packageDefinition.name,
      packageType: pkg.packageDefinition.packageType,
      sessionsCount: pkg.packageDefinition.sessionsCount,
      hasPreSelectedSchedules: preSelectedSchedules.length > 0,
      scenario: preSelectedSchedules.length > 0 ? 'Schedule-first' : 'Package-first'
    });

    const packageData = {
      id: pkg.id.toString(),
      name: pkg.packageDefinition.name,
      price: pkg.price,
      image: '/placeholder-package.jpg',
      currency: 'S/.',
      type: 'package' as const,
      sessions: pkg.packageDefinition.sessionsCount || 1,
      duration: pkg.packageDefinition.sessionDuration?.duration_minutes || 60,
      packageType: pkg.packageDefinition.packageType || 'standard',
      maxGroupSize: pkg.packageDefinition.maxGroupSize || 1,
      // Schedule-first: Assign pre-selected schedule to package
      bookingDetails: preSelectedSchedules.length > 0 ? preSelectedSchedules : undefined
    };

    // Debug package creation for matpass packages
    if (pkg.packageDefinition.packageType === 'matpass' || pkg.packageDefinition.name?.toLowerCase().includes('mat')) {
      console.log('📦 CREATING MATPASS PACKAGE:', {
        originalData: {
          id: pkg.id,
          name: pkg.packageDefinition.name,
          packageType: pkg.packageDefinition.packageType,
          sessionsCount: pkg.packageDefinition.sessionsCount
        },
        createdPackage: {
          id: packageData.id,
          name: packageData.name,
          sessions: packageData.sessions,
          packageType: packageData.packageType,
          bookingDetails: packageData.bookingDetails
        }
      });
    }

    addToCart(packageData);
    onPackageAdded?.(packageData);

    if (preSelectedSchedules.length > 0) {
      // SCENARIO A: Schedule-first flow completion
      console.log('🎯 Schedule-first flow - package added with schedule');
      toast.success(`${pkg.packageDefinition.name} added to cart with 1 scheduled session`);

      setPreSelectedSchedules([]); // Clear schedules (now in package)
      updateLockedTimeSlots(); // Update locked slots

      // OPEN CART: After first booking
      setTimeout(() => {
        openCart();
      }, 500);

      // Navigate to customer info (skip schedule step)
      goToNextStep();
    } else {
      // SCENARIO B: Package-first flow - just add to cart, no automatic redirect
      console.log('🎯 Package added to cart - user can add more packages');
      toast.success(`${pkg.packageDefinition.name} added to cart! You can add more packages or proceed to checkout.`);

      // Open cart to show the added package
      setTimeout(() => {
        openCart();
      }, 500);

      // No automatic navigation - let user decide what to do next
    }
  };

  /**
   * HANDLE BOOK NOW
   * ---------------
   * Handles the "Book Now" button click for existing packages
   */
  const handleBookNowClick = () => {
    if (isAtMaxSessions()) {
      toast.error('All available sessions have been booked. Please proceed to checkout.');
      console.log('🚫 Book Now blocked - all sessions already booked');
      return;
    }

    // Navigate to schedule step for booking additional sessions
    goToNextStep();
    toast.success('Ready to book sessions for your packages!');
  };

  /**
   * REMOVE PRE-SELECTED SCHEDULE
   * ----------------------------
   * Removes a pre-selected schedule in schedule-first scenario
   * Note: This function is kept for potential future use but remove button
   * is no longer shown on the page - removal is handled in cart
   */
  const removePreSelectedSchedule = (index: number) => {
    setPreSelectedSchedules(prev => prev.filter((_, i) => i !== index));
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * RENDER PRE-SELECTED SCHEDULES
   * -----------------------------
   * Shows selected schedules for schedule-first scenario
   * Now displays below packages with improved styling and no remove button
   */
  const renderPreSelectedSchedules = () => {
    if (preSelectedSchedules.length === 0) return null;

    return (
      <div className="mt-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Your Selected Schedule
              </h3>
              <p className="text-sm text-gray-600">
                You've selected 1 time slot. Now choose a package that matches your needs.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            {preSelectedSchedules.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(schedule.selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {schedule.selectedTime} - {schedule.serviceType}
                    </p>
                    {schedule.teacher && (
                      <p className="text-xs text-gray-500">
                        with {schedule.teacher}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Selected</p>
                  <p className="text-xs text-gray-500">Ready to book</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /**
   * RENDER PACKAGES GRID
   * --------------------
   * Displays available packages for selection
   */
  const renderPackagesGrid = () => {
    // Show loading state while packages are being fetched (initial load or refetch)
    if (packagesLoading) {
      return (
        <div className="space-y-6">
          {/* Loading Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Packages</h2>
            <p className="text-gray-600">Loading our yoga packages...</p>
          </div>
          
          {/* Enhanced Loading Animation */}
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-100 border-t-green-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-green-300 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <p className="text-green-600 font-medium text-lg animate-pulse">Loading packages...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we fetch our available packages</p>
            </div>
          </div>
          
          {/* Enhanced Loading Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="unified-card animate-pulse hover:shadow-md transition-all duration-300" style={{animationDelay: `${i * 100}ms`}}>
                <CardHeader>
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-20 animate-pulse"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Show empty state if no packages (only after loading is complete and we have data)
    if (!packagesLoading && packages && Array.isArray(packages) && packages.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Packages Available</h3>
          <p className="text-gray-600">We're currently updating our package offerings. Please check back later.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        {/* Packages Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Available Packages</h2>
            {packagesLoading && hasLoadedOnce && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-200 border-t-green-600"></div>
            )}
          </div>
          <p className="text-gray-600">Choose the perfect package for your yoga journey</p>
        </div>
        
        {/* Packages Grid with Smooth Animations */}
        <div className="relative">
          {packagesLoading && hasLoadedOnce && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Refreshing packages...</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages && Array.isArray(packages) && packages.map((pkg: any, index: number) => (
            <Card 
              key={pkg.id} 
              className="unified-card hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 hover:animate-pulse"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <CardHeader>
                <CardTitle className="unified-card__title">{pkg.packageDefinition.name}</CardTitle>
                <p className="unified-card__subtitle">{pkg.packageDefinition.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      S/ {pkg.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {pkg.packageDefinition.sessionsCount || 1} sessions
                    </span>
                  </div>
                  <Button
                    onClick={() => handleAddPackage(pkg)}
                    className="w-full btn-primary"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </div>
    );
  };


  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Packages Grid - Show first for better flow */}
      {renderPackagesGrid()}

      {/* Show pre-selected schedules below packages for better integration */}
      {renderPreSelectedSchedules()}
    </div>
  );
}
