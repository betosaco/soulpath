/**
 * ========================================================================================
 * SCHEDULE SELECTION STEP COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Handles schedule selection for booking sessions. This component replaces the
 * schedule selection logic from the monolithic MasterBookingFlow.tsx.
 *
 * RESPONSIBILITIES:
 * - Display available time slots using EnhancedSchedule component
 * - Handle slot selection based on current booking scenario
 * - Validate selections against business rules (cross-package booking)
 * - Integrate with cart state for locked slots management
 *
 * SCENARIO HANDLING:
 * - Schedule-First: User selects slot, then goes to package selection
 * - Package-First: User selects slots for pre-selected package
 * - Add-More: User adds slots to existing packages
 * - Multi-Package: User selects which package to book for
 */

'use client';

import React from 'react';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useCart, useCartUI } from '@/store/appStore';
import { EnhancedSchedule } from '../../EnhancedSchedule';
import { PackageSelectionModal } from '../shared/PackageSelectionModal';

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
 * SCHEDULE SELECTION STEP PROPS
 * -----------------------------
 * Props passed to the ScheduleSelectionStep component
 */
interface ScheduleSelectionStepProps {
  /** Callback when user successfully selects a schedule */
  onScheduleSelected?: (scheduleData: ScheduleData) => void;
}

/**
 * SCHEDULE SELECTION STEP COMPONENT
 * ---------------------------------
 * Handles the schedule selection step of the booking flow
 *
 * @param props - Component props
 * @returns React component
 */
export function ScheduleSelectionStep({ onScheduleSelected }: ScheduleSelectionStepProps) {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================

  /**
   * BOOKING FLOW STATE
   * ------------------
   * Access to centralized flow management
   */
  const {
    scenario,
    urlParams,
    isScheduleFirst,
    isPackageFirst,
    isAddMore,
    isMultiPackage,
    goToNextStep
  } = useBookingFlow();

  /**
   * CART STATE
   * ----------
   * Access to cart items and booking operations
   */
  const {
    items: cartItems,
    addBookingToPackage
  } = useCart();

  /**
   * CART UI STATE
   * -------------
   * Control cart sidebar visibility
   */
  const { openCart } = useCartUI();

  // ============================================================================
  // LOCAL STATE MANAGEMENT
  // ============================================================================

  /**
   * PACKAGE SELECTION MODAL STATE
   * -----------------------------
   * State for managing the package selection modal
   */
  const [showPackageModal, setShowPackageModal] = React.useState(false);
  const [pendingScheduleData, setPendingScheduleData] = React.useState<ScheduleData | null>(null);

  /**
   * SELECTED SLOT STATE
   * -------------------
   * Track which slot is currently selected for visual feedback
   */
  const [selectedSlot, setSelectedSlot] = React.useState<any>(null);

  /**
   * USER BOOKINGS STATE
   * -------------------
   * Store user's existing bookings to prevent duplicate time slots
   */
  const [userBookings, setUserBookings] = React.useState<Array<{
    selectedDate: string;
    selectedTime: string;
    packageId?: string;
  }>>([]);

  // ============================================================================
  // BUSINESS LOGIC - LOCKED SLOTS CALCULATION
  // ============================================================================

  /**
   * FETCH USER BOOKINGS
   * -------------------
   * Load user's existing bookings to prevent duplicate time slots
   */
  React.useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        // Only fetch if we have authentication context
        const response = await fetch('/api/client/bookings?status=upcoming&limit=100');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Transform API response to match our booking format
            const transformedBookings = data.data.map((booking: any) => {
              const startTime = new Date(booking.scheduleSlot.startTime);
              return {
                selectedDate: startTime.toISOString().split('T')[0], // YYYY-MM-DD
                selectedTime: startTime.toTimeString().slice(0, 5), // HH:MM format
                packageId: booking.userPackage?.id || booking.userPackageId
              };
            });
            setUserBookings(transformedBookings);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch user bookings:', error);
        // Continue without user bookings - cart-based locking will still work
      }
    };

    fetchUserBookings();
  }, []);

  /**
   * CALCULATE LOCKED TIME SLOTS
   * ----------------------------
   * Prevents users from booking the same time slot multiple times
   * Combines cart bookings and existing user bookings from database
   */
  const lockedTimeSlots = React.useMemo(() => {
    // Combine bookings from cart and existing user bookings
    const allBookings: Array<{
      selectedDate: string;
      selectedTime: string;
      packageId?: string;
    }> = [];

    // Add cart bookings
    cartItems
      .filter(item => item.type === 'package' && item.bookingDetails)
      .forEach(item => {
        (item.bookingDetails || []).forEach(booking => {
          allBookings.push({
            selectedDate: booking.selectedDate || '',
            selectedTime: booking.selectedTime || '',
            packageId: item.id
          });
        });
      });

    // Add existing user bookings to prevent duplicate time slots
    userBookings.forEach(booking => {
      allBookings.push({
        selectedDate: booking.selectedDate,
        selectedTime: booking.selectedTime,
        packageId: booking.packageId
      });
    });

    return allBookings;
  }, [cartItems, userBookings]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE SCHEDULE SLOT SELECTION
   * ------------------------------
   * Processes slot selection based on current booking scenario
   *
   * @param slot - The selected schedule slot data
   */
  const handleScheduleSelection = (slot: any) => {
    console.log('📅 SCHEDULE SELECTION:', {
      slot: `${slot.date} ${slot.time}`,
      scenario,
      packageId: urlParams.packageId,
      isLocked: isTimeSlotLocked(slot.date, slot.time)
    });

    // Set selected slot for visual feedback
    setSelectedSlot(slot);

    // VALIDATION: Check for locked slots (user can only book one session per time slot)
    if (isTimeSlotLocked(slot.date, slot.time)) {
      console.warn('🚫 Time slot already booked - preventing duplicate booking');
      return;
    }

    // Prepare schedule data
    const scheduleData: ScheduleData = {
      selectedDate: slot.date,
      selectedTime: slot.time,
      teacher: slot.teacher.name,
      dayOfWeek: new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long' }),
      serviceType: slot.serviceType.name,
      venue: slot.venue.name,
      scheduleSlotId: slot.id
    };

    // Call optional callback
    onScheduleSelected?.(scheduleData);

    // Check if we need to show package selection modal
    const availablePackages = getAvailablePackagesForSlot(slot.date, slot.time);

    if (availablePackages.length === 0) {
      console.warn('🚫 No packages available for this slot');
      return;
    }

    // BOOKING COMPLETED - OPEN CART
    setTimeout(() => {
      openCart();
    }, 300);

    // SCENARIO-SPECIFIC HANDLING
    if (isScheduleFirst) {
      // Schedule-First: Store selection and go to package selection
      console.log('🎯 Schedule-First: Proceeding to package selection');
      goToNextStep();

    } else if (isPackageFirst && urlParams.packageId) {
      // Package-First: Add booking to specific package
      console.log('🎯 Package-First: Adding booking to package', urlParams.packageId);
      addBookingToPackage(urlParams.packageId, scheduleData);

      // Check if package is now at capacity
      const remaining = getPackageRemainingSessions(urlParams.packageId);
      if (remaining <= 0) {
        console.log('📦 Package at capacity - proceeding to next step');
        goToNextStep();
      } else {
        console.log('📦 Package has remaining sessions - staying on schedule page');
        // Stay on page, cart remains open
      }

    } else if (isAddMore) {
      // Add-More: Handle based on package configuration
      handleAddMoreBookingWithCart(slot, scheduleData);

    } else {
      // Multi-Package or general case: Show package selection modal if multiple packages available
      if (availablePackages.length === 1) {
        // Only one package available - direct assignment
        console.log('✅ Single package available - direct assignment');
        addBookingToPackage(availablePackages[0].id, scheduleData);

        // Check if package is now at capacity
        const remaining = getPackageRemainingSessions(availablePackages[0].id);
        if (remaining <= 0) {
          console.log('📦 Package at capacity - proceeding to next step');
          goToNextStep();
        } else {
          console.log('📦 Package has remaining sessions - staying on schedule page');
          // Stay on page, cart remains open
        }
      } else {
        // Multiple packages available - show modal
        console.log('📦 Multiple packages available - showing selection modal');
        setPendingScheduleData(scheduleData);
        setShowPackageModal(true);
      }
    }
  };

  /**
   * HANDLE ADD MORE BOOKINGS WITH CART
   * ----------------------------------
   * Special handling for adding sessions to existing packages
   * Always opens cart and checks package capacity
   *
   * @param slot - Raw slot data
   * @param scheduleData - Processed schedule data
   */
  const handleAddMoreBookingWithCart = (slot: any, scheduleData: any) => {
    const availablePackages = getAvailablePackagesForSlot(slot.date, slot.time);

    if (availablePackages.length === 0) {
      console.warn('🚫 No packages available for this slot');
      return;
    }

    if (availablePackages.length === 1) {
      // Direct assignment to single available package
      addBookingToPackage(availablePackages[0].id, scheduleData);
      console.log('✅ Auto-assigned to single available package');

      // Check if package is now at capacity
      const remaining = getPackageRemainingSessions(availablePackages[0].id);
      if (remaining <= 0) {
        console.log('📦 Package at capacity - proceeding to next step');
        goToNextStep();
      } else {
        console.log('📦 Package has remaining sessions - staying on schedule page');
        // Stay on page, cart remains open
      }
    } else {
      // Multiple packages available - show modal
      console.log('📦 Multiple packages available - showing selection modal');
      setPendingScheduleData(scheduleData);
      setShowPackageModal(true);
    }
  };

  /**
   * CHECK IF TIME SLOT IS LOCKED
   * ----------------------------
   * Determines if a specific time slot is already booked
   *
   * @param date - Slot date
   * @param time - Slot time
   * @returns True if slot is locked
   */
  const isTimeSlotLocked = (date: string, time: string): boolean => {
    return lockedTimeSlots.some(slot =>
      slot.selectedDate === date && slot.selectedTime === time
    );
  };

  /**
   * GET AVAILABLE PACKAGES FOR SLOT
   * -------------------------------
   * Returns packages that can still book sessions
   *
   * @param date - Slot date
   * @param time - Slot time
   * @returns Array of available packages
   */
  const getAvailablePackagesForSlot = (date: string, time: string) => {
    return cartItems
      .filter(item => {
        if (item.type !== 'package') return false;

        // Check if package has remaining sessions
        const remaining = getPackageRemainingSessions(item.id);
        if (remaining <= 0) return false;

        // For add-more scenario, respect locked slots
        if (isAddMore && isTimeSlotLocked(date, time)) {
          return false;
        }

        return true;
      });
  };

  /**
   * GET PACKAGE REMAINING SESSIONS
   * ------------------------------
   * Calculates how many sessions a package can still book
   *
   * @param packageId - The package ID
   * @returns Number of remaining sessions
   */
  const getPackageRemainingSessions = (packageId: string): number => {
    const pkg = cartItems.find(item => item.id === packageId && item.type === 'package');
    if (!pkg) return 0;

    const totalSessions = pkg.sessions || 1;
    const scheduledSessions = pkg.bookingDetails?.length || 0;
    return Math.max(0, totalSessions - scheduledSessions);
  };

  /**
   * HANDLE PACKAGE SELECTION FROM MODAL
   * -----------------------------------
   * Handles when a package is selected from the modal
   *
   * @param packageId - The selected package ID
   * @param scheduleData - The schedule data to book
   */
  const handlePackageSelectionFromModal = (packageId: string, scheduleData: ScheduleData) => {
    console.log('📦 Package selected from modal:', { packageId, scheduleData });

    // Add booking to selected package
    addBookingToPackage(packageId, scheduleData);

    // Close modal and clear pending data
    setShowPackageModal(false);
    setPendingScheduleData(null);

    // Open cart
    setTimeout(() => {
      openCart();
    }, 300);

    // Check if package is now at capacity
    const remaining = getPackageRemainingSessions(packageId);
    if (remaining <= 0) {
      console.log('📦 Package at capacity - proceeding to next step');
      goToNextStep();
    } else {
      console.log('📦 Package has remaining sessions - staying on schedule page');
      // Stay on page, cart remains open
    }
  };

  /**
   * HANDLE MODAL CLOSE
   * ------------------
   * Handles when the package selection modal is closed
   */
  const handleModalClose = () => {
    setShowPackageModal(false);
    setPendingScheduleData(null);
  };

  // ============================================================================
  // UI RENDERING
  // ============================================================================

  /**
   * RENDER SCENARIO-SPECIFIC HEADER
   * -------------------------------
   * Shows different header content based on booking scenario
   */

  /**
   * GET TOTAL REMAINING SESSIONS
   * ----------------------------
   * Calculates total remaining sessions across all packages
   */
  const getTotalRemainingSessions = (): number => {
    if (urlParams.packageId) {
      return getPackageRemainingSessions(urlParams.packageId);
    }

    return cartItems
      .filter(item => item.type === 'package')
      .reduce((total, item) => total + getPackageRemainingSessions(item.id), 0);
  };

  const getCartPackageItems = () => {
    return cartItems.filter(item => item.type === 'package');
  };

  const getSinglePackageRemainingSessions = (): number => {
    const packageItems = getCartPackageItems();
    if (packageItems.length === 1) {
      return getPackageRemainingSessions(packageItems[0].id);
    }
    return getTotalRemainingSessions();
  };

  return (
    <div className="space-y-6">
      {/* Header - Match main schedule page styling */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {(() => {
            if (isScheduleFirst) return 'Select Your Preferred Time';
            if (isPackageFirst) return 'Book Sessions for Your Package';
            if (isAddMore) return 'Book Additional Sessions';
            return 'Select Schedule';
          })()}
        </h2>
        <p className="text-gray-600 mb-6">
          {(() => {
            if (isScheduleFirst) return 'Choose 1 time slot, then select a package (1, 4, 8, 12, or 24 sessions)';
            if (isPackageFirst) return `Select time slots for your ${cartItems.find(item => item.id === urlParams.packageId)?.name || 'package'}`;
            if (isAddMore) {
              const packageItems = getCartPackageItems();
              const remaining = getSinglePackageRemainingSessions();
              const packageName = packageItems.length === 1 ? packageItems[0].name : 'your packages';
              return `You can book ${remaining} more session${remaining !== 1 ? 's' : ''} for ${packageName}`;
            }
            return 'Choose your preferred date and time';
          })()}
        </p>
      </div>

      {/* Schedule Component - Match main schedule page layout */}
      <EnhancedSchedule
        onBookSlot={handleScheduleSelection}
        showFilters={true}
        existingBookings={lockedTimeSlots}
        lockedTimeSlots={lockedTimeSlots}
        hasMultiplePackages={isMultiPackage || isAddMore}
        selectedSlot={selectedSlot}
      />

      {/* Navigation hints - Only show when relevant */}
      <div className="text-center">
        {isScheduleFirst && (
          <p className="text-sm text-gray-600">
            After selecting a time slot, you&apos;ll choose your package
          </p>
        )}

        {isPackageFirst && (
          <p className="text-sm text-gray-600">
            Book sessions for your selected package
          </p>
        )}

        {isAddMore && (
          <p className="text-sm text-gray-600">
            Add more sessions to your existing packages. Cart will open after each booking.
          </p>
        )}

        {isMultiPackage && (
          <p className="text-sm text-gray-600">
            Select time slots for your multiple packages
          </p>
        )}
      </div>

      {/* Package Selection Modal */}
      <PackageSelectionModal
        isOpen={showPackageModal}
        onClose={handleModalClose}
        scheduleData={pendingScheduleData!}
        availablePackages={pendingScheduleData ? getAvailablePackagesForSlot(
          pendingScheduleData.selectedDate,
          pendingScheduleData.selectedTime
        ).map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          sessions: pkg.sessions || 1,
          bookingDetails: pkg.bookingDetails
        })) : []}
        onPackageSelected={handlePackageSelectionFromModal}
        getPackageRemainingSessions={getPackageRemainingSessions}
      />
    </div>
  );
}
