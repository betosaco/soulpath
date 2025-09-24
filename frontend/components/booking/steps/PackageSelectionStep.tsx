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

import React from 'react';
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
import { usePackages } from '@/hooks/usePackagesQuery';

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
  const {
    urlParams,
    isScheduleFirst,
    goToNextStep
  } = useBookingFlow();

  /**
   * CART MANAGEMENT
   * ---------------
   * Access to cart state and operations
   */
  const {
    items: cartItems,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateQuantity,
    getTotalPrice
  } = useCart();

  /**
   * CART UI MANAGEMENT
   * ------------------
   * Access to cart UI operations
   */
  const { openCart } = useCartUI();

  /**
   * PACKAGES DATA
   * -------------
   * Access to available packages
   */
  const { data: packages, isLoading: packagesLoading } = usePackages('PEN');

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
        teacher: `Teacher ${(slotId % 5) + 1}`, // Keep placeholder teacher for now
        dayOfWeek: scheduleDate.toLocaleDateString('en-US', { weekday: 'long' }),
        serviceType: 'Yoga Class', // Keep placeholder service type
        venue: `Studio ${(slotId % 3) + 1}`, // Keep placeholder venue
        scheduleSlotId: slotId
      };

      console.log('📅 Created schedule from actual slot data:', placeholderSchedule);
      setPreSelectedSchedules([placeholderSchedule]);
    } else {
      // Clear schedules if not in schedule-first scenario or missing slot data
      setPreSelectedSchedules([]);
    }
  }, [isScheduleFirst, urlParams.slotId, urlParams.slotDate, urlParams.slotTime, urlParams.readyForSchedule]);

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
      currency: 'PEN',
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
      // SCENARIO B: Package-first flow initiation
      console.log('🎯 Package-first flow - routing to schedule selection');
      toast.success(`${pkg.packageDefinition.name} added to cart. Now select your schedule.`);

      // Navigate to schedule step
      goToNextStep();
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
   */
  const renderPreSelectedSchedules = () => {
    if (preSelectedSchedules.length === 0) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Your Selected Schedule
        </h3>
        <p className="text-blue-700 mb-3">
          You&apos;ve selected 1 time slot. Now choose a package that matches your needs.
        </p>
        <div className="space-y-2">
          {preSelectedSchedules.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center bg-blue-100 p-2 rounded">
              <span className="text-blue-800">
                {schedule.selectedDate} at {schedule.selectedTime} - {schedule.serviceType}
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removePreSelectedSchedule(index)}
              >
                Remove
              </Button>
            </div>
          ))}
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
    if (packagesLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages?.map((pkg: any) => (
          <Card key={pkg.id} className="unified-card">
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
    );
  };

  /**
   * RENDER CART SUMMARY
   * -------------------
   * Shows current cart contents and booking details
   */
  const renderCartSummary = () => {
    if (cartItems.length === 0) return null;

    return (
      <Card className="unified-card">
        <CardHeader>
          <CardTitle className="unified-card__title">Cart Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cartItems.map((item: any, index: number) => (
              <div key={`${item.id}-${index}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Show booking details for packages */}
                {item.type === 'package' && item.bookingDetails && item.bookingDetails.length > 0 && (
                  <div className="ml-4 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="text-green-800 font-semibold mb-1">Scheduled Sessions:</div>
                    {item.bookingDetails.map((booking: any, bookingIndex: number) => (
                      <div key={bookingIndex} className="text-green-700">
                        {booking.selectedDate} at {booking.selectedTime} - {booking.serviceType}
                      </div>
                    ))}
                    <div className="text-green-600 text-xs mt-1">
                      {item.bookingDetails.length} / {item.sessions || 1} sessions scheduled
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>S/ {getTotalPrice().toFixed(2)}</span>
            </div>

            {/* Book Now Button */}
            {cartItems.some(item => item.type === 'package') && (() => {
              const atMax = isAtMaxSessions();

              return (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={handleBookNowClick}
                    className={`w-full text-white ${
                      atMax
                        ? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed border border-gray-600'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={atMax}
                  >
                    {atMax ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        All Sessions Booked
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </>
                    )}
                  </Button>
                </div>
              );
            })()}

            {isAtMaxSessions() && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium text-center">
                    All Sessions Booked - Ready to Checkout!
                  </p>
                </div>
                <p className="text-green-600 text-sm text-center mt-1">
                  You have successfully booked all available sessions for your packages.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Packages & Products
        </h2>
        <p className="text-gray-600">
          Add items to your cart
        </p>
      </div>

      {/* Show pre-selected schedules for schedule-first flow */}
      {renderPreSelectedSchedules()}

      {/* Packages Grid */}
      {renderPackagesGrid()}

      {/* Cart Summary */}
      {renderCartSummary()}
    </div>
  );
}
