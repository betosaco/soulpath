'use client';

/**
 * ========================================================================================
 * MASTER BOOKING FLOW COMPONENT
 * ========================================================================================
 * 
 * OVERVIEW:
 * ---------
 * Central component managing the complete booking process with multiple entry points
 * and flow scenarios. Handles package selection, schedule booking, customer info,
 * and checkout integration.
 * 
 * ARCHITECTURE:
 * -------------
 * 1. STATE MANAGEMENT: Centralized state for all booking scenarios
 * 2. FLOW DETECTION: Automatic detection of booking flow type
 * 3. VALIDATION RULES: Comprehensive validation for each step
 * 4. UI RENDERING: Dynamic content based on current step and flow
 * 5. INTEGRATION: Cart, packages, schedule, and payment integration
 * 
 * BOOKING SCENARIOS:
 * -----------------
 * A) Schedule-First: User selects slot → package → checkout
 * B) Package-First: User selects package → slots → checkout  
 * C) Add More: User adds sessions to existing packages
 * D) Multiple Packages: User manages multiple packages with modal selection
 * 
 * VALIDATION RULES:
 * ----------------
 * - Package session limits must be respected
 * - No duplicate slots within same package
 * - Cross-package booking allowed for different packages
 * - Required customer information validation
 * - Shipping address for physical products only
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Calendar, 
  User, 
  Truck, 
  CreditCard, 
  CheckCircle, 
  Package,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useCart, useCartUI } from '@/store/appStore';
import { usePackages } from '@/hooks/usePackagesQuery';
import { EnhancedSchedule } from './EnhancedSchedule';
import { StripeInlineForm } from './stripe/StripeInlineForm';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  currency: string;
  type: 'product' | 'package';
  sessions?: number;
  duration?: number;
  packageType?: string;
  maxGroupSize?: number;
  bookingDetails?: Array<{
    selectedDate?: string;
    selectedTime?: string;
    teacher?: string;
    dayOfWeek?: string;
    serviceType?: string;
    venue?: string;
    scheduleSlotId?: number;
  }>;
}

/**
 * BOOKING STEP INTERFACE
 * ----------------------
 * Represents a step in the booking flow process
 */
interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: any;
}

/**
 * CUSTOMER FORM DATA INTERFACE
 * ----------------------------
 * Customer information collected during booking
 */
interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  birthPlace: string;
}

/**
 * SHIPPING FORM DATA INTERFACE
 * ----------------------------
 * Shipping address information for physical products
 */
interface ShippingFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * COMPONENT PROPS INTERFACE
 * -------------------------
 * Props passed to the MasterBookingFlow component
 */
interface MasterBookingFlowProps {
  onCheckoutComplete?: (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: CartItem[];
  }) => void;
  initialStep?: number; // 0=packages, 1=schedule
  isDirectCheckout?: boolean; // When coming from cart with all sessions booked
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MasterBookingFlow({ onCheckoutComplete, initialStep = 0, isDirectCheckout = false }: MasterBookingFlowProps) {
  
  // =============================================================================
  // EXTERNAL HOOKS AND STATE
  // =============================================================================
  
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
    getTotalPrice, 
    requiresAddress, 
    addBookingToPackage 
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
  
  // =============================================================================
  // INTERNAL STATE MANAGEMENT
  // =============================================================================
  
  /**
   * STEP NAVIGATION STATE
   * ---------------------
   * Manages current step in the booking flow
   */
  const [currentStep, setCurrentStep] = useState(() => {
    // FLOW DETECTION LOGIC:
    // - Check isDirectCheckout prop (when coming from cart with all sessions booked)
    // - Check for "add more bookings" scenario (packages in cart + sessionStorage flags)
    // - Fall back to initialStep prop (0=packages, 1=schedule)

    console.log('🔍 FLOW DETECTION - Initial render:', {
      isDirectCheckout, initialStep,
      scenario: isDirectCheckout ? 'D (Direct Checkout)' : 'Standard flow'
    });

    // SCENARIO D: Direct checkout - user has all sessions booked, go to customer info
    if (isDirectCheckout) {
      console.log('🔍 SCENARIO D: Direct checkout - routing to customer info step');
      return 2; // SCENARIO D: Go directly to customer info step
    }

    // SCENARIO C: Add more bookings - check for packages in cart and sessionStorage flags
    if (typeof window !== 'undefined') {
      const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
      const hasPackagesInCart = cartItems && cartItems.some(item => item.type === 'package');
      
      if (isAddingMore && hasPackagesInCart) {
        console.log('🔍 SCENARIO C: Add more bookings detected - routing to schedule step');
        return 1; // SCENARIO C: Go to schedule step for adding more bookings
      }
    }

    console.log('🔍 Using initialStep prop:', initialStep);
    return initialStep;
  });

  /**
   * PAYMENT AND ORDER STATE
   * -----------------------
   * Manages payment processing and order completion
   */
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orderData, setOrderData] = useState<{ orderNumber: string; total: number; items: Array<{ name: string; quantity: number; price: number }> } | null>(null);
  
  /**
   * SCHEDULE-FIRST FLOW STATE (SCENARIO A)
   * --------------------------------------
   * Used when user selects schedule first, then chooses package
   */
  const [, setFlowType] = useState<'schedule-first' | 'package-first' | null>(null);
  const [selectedSchedules, setSelectedSchedules] = useState<Array<{
    selectedDate: string;
    selectedTime: string;
    teacher: string;
    dayOfWeek: string;
    serviceType: string;
    venue: string;
    scheduleSlotId: number;
  }>>([]);

  /**
   * ADD MORE BOOKINGS FLOW STATE (SCENARIO C)
   * -----------------------------------------
   * Activated when user clicks "Book Now" from cart with existing bookings
   */
  const [isAddingMoreBookings, setIsAddingMoreBookings] = useState(false);
  const [addingToPackageId, setAddingToPackageId] = useState<string | null>(null);

  /**
   * MULTIPLE PACKAGES FLOW STATE (SCENARIO D)
   * -----------------------------------------
   * Shows modal when user has multiple packages and needs to choose which one for a booking
   */
  const [showPackageSelectionModal, setShowPackageSelectionModal] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPackageSelectionModal) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      // Scroll to top of page
      window.scrollTo(0, 0);
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPackageSelectionModal]);

  // LOCKED TIME SLOTS STATE (USED IN SCENARIO C)
  // - Prevents booking same slot twice under same package
  // - Calculated from cartItems bookingDetails
  const [lockedTimeSlots, setLockedTimeSlots] = useState<Array<{
    selectedDate: string;
    selectedTime: string;
    packageId: string;
  }>>([]);

  // Force re-render trigger for UI updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // =============================================================================
  // FORM DATA STATE
  // =============================================================================
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    birthPlace: ''
  });

  const [shippingData, setShippingFormData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'PE'
  });

  // =============================================================================
  // FLOW DETECTION AND STATE SYNCHRONIZATION - SCENARIO MANAGEMENT
  // =============================================================================

  /**
   * HYDRATION-SAFE FLOW DETECTION
   * ------------------------------
   * Handles sessionStorage checks after hydration to avoid server/client mismatches.
   * Note: isDirectCheckout is handled via props in initial state, not sessionStorage.
   */
  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
      const flowType = sessionStorage.getItem('bookingFlowType');

      console.log('🔍 FLOW DETECTION - Post-hydration:', {
        isAddingMore, flowType, isDirectCheckout,
        scenario: isAddingMore ? 'C (Add More)' : flowType === 'schedule-first' ? 'A (Schedule-first)' : flowType === 'package-first' ? 'B (Package-first)' : 'Standard flow'
      });

      if (isAddingMore) {
        console.log('🔍 SCENARIO C: Add more bookings - routing to schedule step');
        setCurrentStep(1); // SCENARIO C: Go directly to schedule step
      }
      // SCENARIO A: Schedule-first flow starts with schedule selection
      else if (flowType === 'schedule-first') {
        setCurrentStep(1); // Start with schedule selection
      }
      // SCENARIO B: Package-first flow starts with package selection
      else if (flowType === 'package-first') {
        setCurrentStep(0); // Start with package selection
      }
    }
  }, []); // Empty dependency array - only run once after hydration

  /**
   * SCENARIO C: ADD MORE BOOKINGS DETECTION (MOUNT)
   * ------------------------------------------------
   * Detects when user clicks "Book Now" from cart and activates add more bookings mode.
   * This runs on component mount to detect sessionStorage flags.
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
      const packageId = sessionStorage.getItem('addingToPackageId');
      const detectedFlowType = sessionStorage.getItem('bookingFlowType');
      const lockedSlotsData = sessionStorage.getItem('lockedTimeSlots');
      
      console.log('🔍 SCENARIO DETECTION - Component mount:', {
        isAddingMore, packageId, detectedFlowType, hasLockedSlots: !!lockedSlotsData
      });
      
      if (isAddingMore) {
        // SCENARIO C ACTIVATION: Add more bookings mode
        console.log('🎯 SCENARIO C: Activating add more bookings flow');
        setIsAddingMoreBookings(true);
        setAddingToPackageId(packageId);
        setFlowType('package-first'); // Adding more is always package-first
        setCurrentStep(1); // Route to schedule step

        // CLEANUP: Clear sessionStorage flags after activation
        sessionStorage.removeItem('isAddingMoreBookings');
        sessionStorage.removeItem('addingToPackageId');
        sessionStorage.removeItem('bookingFlowType');
        
        console.log('✅ Add more bookings flow activated');
      }
      else if (detectedFlowType) {
        // SCENARIO A/B: Initial flow type detection
        console.log('🎯 SCENARIO A/B: Flow type detected:', detectedFlowType);
        setFlowType(detectedFlowType as 'schedule-first' | 'package-first');
        sessionStorage.removeItem('bookingFlowType');
      }

      // LOCKED SLOTS: Restore from sessionStorage if available
      if (lockedSlotsData) {
        try {
          const parsed = JSON.parse(lockedSlotsData);
          setLockedTimeSlots(parsed);
          sessionStorage.removeItem('lockedTimeSlots');
          console.log('🔒 Locked slots restored from sessionStorage:', parsed.length);
        } catch (error) {
          console.error('❌ Error parsing locked time slots:', error);
        }
      }
    }
  }, []); // Run only on mount

  /**
   * SCENARIO C: LOCKED SLOTS UPDATE
   * --------------------------------
   * Updates locked slots when cart items change (for add more bookings mode).
   */
  useEffect(() => {
    if (isAddingMoreBookings && cartItems) {
      // LOCKED SLOTS: Load from cart to prevent duplicate bookings
      const existingLockedSlots = cartItems
        .filter(item => item.type === 'package' && item.bookingDetails)
        .flatMap(item =>
          (item.bookingDetails || []).map(booking => ({
            selectedDate: booking.selectedDate || '',
            selectedTime: booking.selectedTime || '',
            packageId: item.id
          }))
        );
      setLockedTimeSlots(existingLockedSlots);
      console.log('🔒 Locked slots updated for add more bookings:', existingLockedSlots.length);
    }
  }, [cartItems, isAddingMoreBookings]); // Re-run when cart changes

  /**
   * SCENARIO C: REAL-TIME FLOW ACTIVATION
   * --------------------------------------
   * Listens for sessionStorage changes to detect "Book Now" clicks from cart.
   * This handles cases where the user is already on the schedule page.
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'isAddingMoreBookings' && e.newValue === 'true') {
          console.log('🔄 REAL-TIME: Book Now clicked from cart - activating add more bookings');

          const packageId = sessionStorage.getItem('addingToPackageId');
          
          // SCENARIO C: Activate add more bookings mode
          setIsAddingMoreBookings(true);
          setAddingToPackageId(packageId);
          setFlowType('package-first');
          setCurrentStep(1);
          
          // LOCKED SLOTS: Load from current cart state
          const existingLockedSlots = cartItems
            .filter(item => item.type === 'package' && item.bookingDetails)
            .flatMap(item =>
              (item.bookingDetails || []).map(booking => ({
                selectedDate: booking.selectedDate || '',
                selectedTime: booking.selectedTime || '',
                packageId: item.id
              }))
            );
          setLockedTimeSlots(existingLockedSlots);

          // CLEANUP: Clear flags
          sessionStorage.removeItem('isAddingMoreBookings');
          sessionStorage.removeItem('addingToPackageId');
          
          console.log('🎯 Add more bookings activated via storage event');
        }
      };

      // POLLING FALLBACK: For same-tab changes (storage events don't fire for same tab)
      const interval = setInterval(() => {
        const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
        if (isAddingMore && !isAddingMoreBookings) {
          console.log('🔄 POLLING: Detected add more bookings mode');

          const packageId = sessionStorage.getItem('addingToPackageId');
          
          // SCENARIO C: Activate add more bookings mode
          setIsAddingMoreBookings(true);
          setAddingToPackageId(packageId);
          setFlowType('package-first');
          setCurrentStep(1);
          
          // LOCKED SLOTS: Load from current cart state
          const existingLockedSlots = cartItems
            .filter(item => item.type === 'package' && item.bookingDetails)
            .flatMap(item =>
              (item.bookingDetails || []).map(booking => ({
                selectedDate: booking.selectedDate || '',
                selectedTime: booking.selectedTime || '',
                packageId: item.id
              }))
            );
          setLockedTimeSlots(existingLockedSlots);

          // CLEANUP: Clear flags
          sessionStorage.removeItem('isAddingMoreBookings');
          sessionStorage.removeItem('addingToPackageId');
          
          console.log('🎯 Add more bookings activated via polling');
        }
      }, 100); // Check every 100ms

      // EVENT LISTENERS
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [isAddingMoreBookings, cartItems]);

  /**
   * LOCKED TIME SLOTS SYNCHRONIZATION
   * ----------------------------------
   * Keeps locked time slots in sync with cart state.
   * Recalculates whenever cart items change.
   */
  useEffect(() => {
    updateLockedTimeSlots();
    setForceUpdate(prev => prev + 1); // Force re-render of UI components
    console.log('🔄 Locked time slots synchronized with cart changes');
  }, [cartItems]);

  // Auto-progress to customer info when all sessions are booked (only from schedule step)
  useEffect(() => {
    const maxReached = isAtMaxSessions();
    const currentStepIsSchedule = currentStep === 1; // Schedule step

    if (maxReached && currentStepIsSchedule) {
      console.log('🎯 Auto-progressing to customer info - all sessions booked from schedule step');
      setTimeout(() => {
        setCurrentStep(2); // Go to customer info step
        openCart(); // Open cart
      }, 1500); // Delay to show success state
    }
  }, [cartItems]); // Only depend on cartItems, not currentStep to avoid re-triggering on navigation

  // =============================================================================
  // EVENT HANDLERS - ORGANIZED BY SCENARIO
  // =============================================================================

  /**
   * SCENARIO B/C: BOOK NOW FROM CART
   * --------------------------------
   * Handles "Book Now" button clicks from shopping cart.
   * Routes to schedule page for booking additional sessions.
   *
   * SCENARIO B: Package-first → Schedule (initial booking)
   * SCENARIO C: Add more bookings (existing bookings)
   */
  const handleBookNowClick = () => {
    // Check if all sessions are already booked
    if (isAtMaxSessions()) {
      toast.error('All available sessions have been booked. Please proceed to checkout.');
      console.log('🚫 Book Now blocked - all sessions already booked');
      return;
    }

    const packageItems = cartItems.filter(item => item.type === 'package');

    if (packageItems.length === 0) {
      toast.error('Please add a package to your cart before booking sessions.');
      return;
    }

    // SCENARIO C: Add more bookings mode activation
    console.log('🎯 BOOK NOW: Activating add more bookings mode');

    if (packageItems.length === 1) {
      // SINGLE PACKAGE: Direct assignment
      const packageId = packageItems[0].id;
      console.log('📦 Single package detected:', packageId);

      setAddingToPackageId(packageId);
      setIsAddingMoreBookings(true);
      setFlowType('package-first');
      setCurrentStep(1); // Route to schedule step

      // PERSISTENCE: Store state for cross-page navigation
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('isAddingMoreBookings', 'true');
        sessionStorage.setItem('addingToPackageId', packageId);
        sessionStorage.setItem('bookingFlowType', 'package-first');
      }

      toast.success('Ready to book sessions for your package!');
    } else {
      // MULTIPLE PACKAGES: Modal selection (Scenario D)
      console.log('📦 Multiple packages detected - showing selection modal');

      setIsAddingMoreBookings(true);
      setAddingToPackageId(null); // No specific package selected yet
      setFlowType('package-first');
      setCurrentStep(1); // Route to schedule step

      // PERSISTENCE: Store state for cross-page navigation
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('isAddingMoreBookings', 'true');
        sessionStorage.removeItem('addingToPackageId'); // Clear specific package
        sessionStorage.setItem('bookingFlowType', 'package-first');
      }

      toast.success('Ready to book sessions! You can select which package to use for each booking.');
    }
  };

  // =============================================================================
  // STEP DEFINITIONS AND NAVIGATION
  // =============================================================================

  /**
   * STEP CONFIGURATION
   * ------------------
   * Defines the booking flow steps based on current scenario and requirements.
   * Dynamic steps: shipping is optional, confirmation is final.
   */
  const steps: BookingStep[] = useMemo(() => {
    const baseSteps: BookingStep[] = [
      {
        id: 'packages',
        title: 'Select Packages & Products',
        description: 'Add items to your cart',
        completed: false,
        icon: ShoppingCart
      },
      {
        id: 'schedule',
        title: 'Select Schedule',
        description: 'Choose your preferred date and time',
        completed: false,
        icon: Calendar
      },
      {
        id: 'customer',
        title: 'Customer Information',
        description: 'Provide your details',
        completed: false,
        icon: User
      }
    ];

    // CONDITIONAL STEP: Shipping only if physical products require address
    if (requiresAddress()) {
      baseSteps.push({
        id: 'shipping',
        title: 'Shipping Address',
        description: 'Provide shipping details',
        completed: false,
        icon: Truck
      });
    }

    // FINAL STEPS: Always present
    baseSteps.push(
      {
        id: 'payment',
        title: 'Payment',
        description: 'Complete your purchase',
        completed: false,
        icon: CreditCard
      },
      {
        id: 'confirmation',
        title: 'Confirmation',
        description: 'Order confirmed',
        completed: false,
        icon: CheckCircle
      }
    );

    return baseSteps;
  }, [requiresAddress]);

  // Update sessionStorage when currentStep changes to communicate with cart sidebar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Store current step info for cart sidebar to detect checkout state
      sessionStorage.setItem('currentCheckoutStep', currentStep.toString());
      sessionStorage.setItem('currentStepId', steps[currentStep]?.id || '');

      // Clear the step info when component unmounts or user leaves checkout
      return () => {
        sessionStorage.removeItem('currentCheckoutStep');
        sessionStorage.removeItem('currentStepId');
      };
    }
  }, [currentStep, steps]);

  // Update step completion
  const completedSteps = useMemo(() => {
    return steps.map((step) => {
      let completed = false;
      
      switch (step.id) {
        case 'packages':
          completed = cartItems.length > 0;
          break;
        case 'schedule':
          // For schedule page (initialStep === 1), completed if 1 schedule selected
          if (initialStep === 1) {
            completed = selectedSchedules.length === 1;
          } else if (isAddingMoreBookings) {
            // For "add more bookings" mode, completed if all packages are at max sessions
            completed = isAtMaxSessions();
          } else {
            // For other flows, check if packages have booking details
            const packageItems = cartItems.filter(item => item.type === 'package');
            completed = packageItems.length === 0 || packageItems.every(item => 
              item.bookingDetails && item.bookingDetails.length > 0
            );
          }
          break;
        case 'customer':
          completed = !!(customerData.name && customerData.email && customerData.birthDate && customerData.birthPlace);
          break;
        case 'shipping':
          completed = !requiresAddress() || 
                     !!(shippingData.firstName && shippingData.lastName && shippingData.address && shippingData.city);
          break;
        case 'payment':
          completed = paymentStatus === 'success';
          break;
        case 'confirmation':
          completed = paymentStatus === 'success' && !!orderData;
          break;
      }
      
      return { ...step, completed };
    });
  }, [steps, cartItems, customerData, shippingData, paymentStatus, orderData, selectedSchedules, initialStep, requiresAddress]);

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      console.log(`➡️ Navigating from step ${currentStep} to step ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const targetStep = currentStep - 1;

      // Prevent going back to schedule step (step 1) when all sessions are booked
      if (targetStep === 1 && isAtMaxSessions()) {
        console.log('🚫 Preventing navigation to schedule step - all sessions booked');
        toast.info('All available sessions have been booked. You can proceed to checkout or go back to packages.');
        return;
      }

      console.log(`⬅️ Navigating from step ${currentStep} to step ${targetStep}`);
      setCurrentStep(targetStep);
    }
  };

  /**
   * SCENARIO A/B: PACKAGE SELECTION
   * -------------------------------
   * Handles package selection from packages page.
   * Different behavior based on current flow scenario.
   *
   * SCENARIO A: Schedule-first - package selected after schedule
   * SCENARIO B: Package-first - package selected first, then schedule
   */
  const handleAddPackage = (pkg: any) => {
    console.log('📦 PACKAGE SELECTION:', {
      packageName: pkg.packageDefinition.name,
      packageType: pkg.packageDefinition.packageType,
      sessionsCount: pkg.packageDefinition.sessionsCount,
      hasSelectedSchedules: selectedSchedules.length > 0,
      scenario: selectedSchedules.length > 0 ? 'A (Schedule-first)' : 'B (Package-first)'
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
      // SCENARIO A: Assign selected schedule to package
      bookingDetails: selectedSchedules.length > 0 ? selectedSchedules : undefined
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
    
    if (selectedSchedules.length > 0) {
      // SCENARIO A: Schedule-first flow completion
      console.log('🎯 SCENARIO A: Schedule-first flow - package added with schedule');
      toast.success(`${pkg.packageDefinition.name} added to cart with 1 scheduled session`);

      setSelectedSchedules([]); // Clear schedules (now in package)
      updateLockedTimeSlots(); // Update locked slots

      // OPEN CART: After first booking
      setTimeout(() => {
        openCart();
      }, 500);

      setCurrentStep(2); // Skip to customer info
    } else {
      // SCENARIO B: Package-first flow initiation
      console.log('🎯 SCENARIO B: Package-first flow - routing to schedule selection');
      setFlowType('package-first');
      toast.success(`${pkg.packageDefinition.name} added to cart. Now select your schedule.`);
      setCurrentStep(1); // Go to schedule step
    }
  };

  /**
   * SCENARIO A/C: SCHEDULE SELECTION
   * --------------------------------
   * Handles schedule selection from schedule page.
   * Different behavior based on current scenario.
   *
   * SCENARIO A: Schedule-first - select slot, then choose package
   * SCENARIO C: Add more bookings - book additional slots for packages
   */
  const handleScheduleSelection = (slot: any) => {
    console.log('📅 SCHEDULE SELECTION:', {
      slot: `${slot.date} ${slot.time}`,
      isLocked: isTimeSlotLocked(slot.date, slot.time),
      isAddingMore: isAddingMoreBookings,
      scenario: isAddingMoreBookings ? 'C (Add More)' : 'A (Schedule-first)'
    });

    // VALIDATION: Check if slot is already locked
    if (isTimeSlotLocked(slot.date, slot.time)) {
      toast.error('This time slot is already booked. Please select a different time slot.');
      return;
    }

    // SCENARIO C: Add more bookings mode
    if (isAddingMoreBookings) {
      handleAddMoreBookings(slot);
      return;
    }

    // SCENARIO A: Schedule-first validation
    if (selectedSchedules.length >= 1) {
      toast.error('You can only select 1 time slot. Please go to packages to continue.');
      return;
    }
    
    // SCENARIO A: Store schedule and route to packages
    const newSchedule = {
      selectedDate: slot.date,
      selectedTime: slot.time,
      teacher: slot.teacher.name,
      dayOfWeek: new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long' }),
      serviceType: slot.serviceType.name,
      venue: slot.venue.name,
      scheduleSlotId: slot.id
    };
    
    setSelectedSchedules([newSchedule]);
    setFlowType('schedule-first');
    toast.success(`Selected ${slot.serviceType.name} for ${slot.date} at ${slot.time}. Going to package selection...`);
    
    // ROUTING: Auto-navigate to packages after selection
    setTimeout(() => {
      setCurrentStep(0); // Go to packages step
    }, 1000);
  };

  // =============================================================================
  // PAYMENT AND ORDER HANDLING
  // =============================================================================

  /**
   * PAYMENT SUCCESS HANDLER
   * -----------------------
   * Processes successful payment completion.
   * Updates order status and triggers completion callback.
   */
  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentStatus('success');
    setOrderData({
      orderNumber: `ORD-${Date.now()}`,
      total: getTotalPrice(),
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });

    if (onCheckoutComplete) {
      onCheckoutComplete({
        orderId: paymentIntentId,
        status: 'completed',
        amount: getTotalPrice(),
        currency: 'PEN',
        items: cartItems
      });
    }
  };

  // =============================================================================
  // BUSINESS LOGIC - PACKAGE MANAGEMENT
  // =============================================================================
  
  /**
   * PACKAGE SESSION CALCULATIONS
   * -----------------------------
   * Functions to calculate remaining sessions and validate package limits
   */

  /**
   * PACKAGE CAPACITY CALCULATIONS
   * ------------------------------
   * Functions to manage package session limits and availability.
   */
  const getPackageRemainingSessions = (packageId: string) => {
    const pkg = cartItems.find(item => item.id === packageId && item.type === 'package');
    if (!pkg) return 0;
    
    const totalSessions = pkg.sessions || 1;
    const scheduledSessions = pkg.bookingDetails?.length || 0;
    const remaining = Math.max(0, totalSessions - scheduledSessions);

    // Debug packages when they're at max capacity
    if (remaining <= 0) {
      console.log('🏁 Package at max capacity:', {
        packageId,
        name: pkg.name,
        totalSessions,
        scheduledSessions: pkg.bookingDetails?.length || 0
      });
    }

    return remaining;
  };

  const isPackageAtMaxSessions = (packageId: string) => {
    return getPackageRemainingSessions(packageId) <= 0;
  };

  const getTotalRemainingSessions = () => {
    if (addingToPackageId) {
      return getPackageRemainingSessions(addingToPackageId);
    }
    
    // If no specific package, calculate for all packages
    return cartItems
      .filter(item => item.type === 'package')
      .reduce((total, item) => total + getPackageRemainingSessions(item.id), 0);
  };

  const isAtMaxSessions = () => {
    // Check if ALL packages in cart have reached their maximum sessions
    const packageItems = cartItems.filter(item => item.type === 'package');
    if (packageItems.length === 0) return false;

    // Button should be disabled only when EVERY package has reached its max sessions
    const result = packageItems.every(item => isPackageAtMaxSessions(item.id));

    // Always log current state for debugging
    console.log('🔍 isAtMaxSessions CHECK:', {
      packageCount: packageItems.length,
      result,
      packages: packageItems.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        type: pkg.packageType,
        sessions: pkg.sessions,
        booked: pkg.bookingDetails?.length || 0,
        atMax: isPackageAtMaxSessions(pkg.id),
        remaining: getPackageRemainingSessions(pkg.id)
      }))
    });

    return result;
  };


  // =============================================================================
  // BUSINESS LOGIC - SLOT VALIDATION AND LOCKING
  // =============================================================================
  
  /**
   * SLOT LOCKING MECHANISM (SCENARIO C)
   * -----------------------------------
   * Prevents duplicate bookings within the same package
   * Functions to validate and manage locked time slots
   */

  /**
   * LOCKED SLOTS VALIDATION
   * ------------------------
   * Functions to prevent duplicate bookings within the same package.
   */
  const isTimeSlotLocked = (date: string, time: string, packageId?: string) => {
    return lockedTimeSlots.some(slot =>
      slot.selectedDate === date &&
      slot.selectedTime === time &&
      (!packageId || slot.packageId === packageId)
    );
  };

  const isTimeSlotBookedByPackage = (date: string, time: string, packageId: string) => {
    const pkg = cartItems.find(item => item.id === packageId && item.type === 'package');
    if (!pkg || !pkg.bookingDetails) return false;

    return pkg.bookingDetails.some(booking =>
      booking.selectedDate === date && booking.selectedTime === time
    );
  };

  const getAvailablePackagesForSlot = (date: string, time: string) => {
    return cartItems
      .filter(item =>
        item.type === 'package' &&
        getPackageRemainingSessions(item.id) > 0 &&
        !isTimeSlotBookedByPackage(date, time, item.id)
      );
  };

  const updateLockedTimeSlots = () => {
    const newLockedSlots = cartItems
      .filter(item => item.type === 'package' && item.bookingDetails)
      .flatMap(item =>
        (item.bookingDetails || []).map(booking => ({
              selectedDate: booking.selectedDate || '',
              selectedTime: booking.selectedTime || '',
          packageId: item.id
        }))
      );
    setLockedTimeSlots(newLockedSlots);

    // PERSISTENCE: Store in session storage for cross-page navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lockedTimeSlots', JSON.stringify(newLockedSlots));
    }

    console.log('🔒 Updated locked time slots:', newLockedSlots.length);
  };

  /**
   * SCENARIO C: ADD MORE BOOKINGS HANDLER
   * -------------------------------------
   * Handles additional schedule bookings when user is in "add more bookings" mode.
   * Routes to cart after booking for user to continue or checkout.
   */
  // =============================================================================
  // EVENT HANDLERS - BOOKING ACTIONS
  // =============================================================================
  
  /**
   * ADD MORE BOOKINGS HANDLER (SCENARIO C)
   * --------------------------------------
   * Handles slot selection when adding more sessions to existing packages
   */
  const handleAddMoreBookings = (slot: any) => {
    console.log('🎯 ADD MORE BOOKINGS:', {
      slot: `${slot.date} ${slot.time}`,
      addingToPackageId,
      availablePackages: getAvailablePackagesForSlot(slot.date, slot.time).length
    });

    // VALIDATION: Check if all packages are at max capacity
    if (isAtMaxSessions()) {
      toast.error('All packages have reached their maximum number of sessions.');
      return;
    }

    // VALIDATION: Check if slot is already locked
    if (isTimeSlotLocked(slot.date, slot.time)) {
      toast.error('This time slot is already booked. Please select a different time slot.');
      return;
    }

    const newSchedule = {
      selectedDate: slot.date,
      selectedTime: slot.time,
      teacher: slot.teacher.name,
      dayOfWeek: new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long' }),
      serviceType: slot.serviceType.name,
      venue: slot.venue.name,
      scheduleSlotId: slot.id
    };

    // SCENARIO C1: Single package mode
    if (addingToPackageId) {
      // VALIDATION: Check for duplicate booking in this package
      if (isTimeSlotBookedByPackage(slot.date, slot.time, addingToPackageId)) {
        toast.error('This package has already booked this time slot. Please select a different slot.');
        return;
      }

      // BOOKING: Add to specific package
      addBookingToPackage(addingToPackageId, newSchedule);
      
      const pkg = cartItems.find(item => item.id === addingToPackageId);
      toast.success(`Added session for ${slot.date} at ${slot.time} to ${pkg?.name || 'package'}`);

      // UPDATE: Locked slots
      updateLockedTimeSlots();

      // OPEN CART: After each booking
      setTimeout(() => {
        openCart();
      }, 500);

      // NOTE: Allow users to continue booking until they reach package maximums

    } else {
      // SCENARIO C2/D: Multiple packages mode
      const availablePackages = getAvailablePackagesForSlot(slot.date, slot.time);
      
      if (availablePackages.length === 0) {
        toast.error('No packages available for this time slot. All packages have either reached capacity or already booked this slot.');
        return;
      }
      else if (availablePackages.length === 1) {
        // DIRECT ASSIGNMENT: Only one package available
        addBookingToPackage(availablePackages[0].id, newSchedule);
        toast.success(`Added session for ${slot.date} at ${slot.time} to ${availablePackages[0].name}`);

      // UPDATE: Locked slots
      updateLockedTimeSlots();

      // CHECK IF MAXIMUM REACHED: If all packages now have maximum bookings, proceed to checkout
      const maxReachedAfterBooking = isAtMaxSessions();
      console.log('🔍 After booking - max check:', {
        maxReachedAfterBooking,
        currentStep,
        willProceedToCustomerInfo: maxReachedAfterBooking
      });
      if (maxReachedAfterBooking) {
        console.log('🎯 MAXIMUM REACHED - Auto-proceeding to customer info step');
        setTimeout(() => {
          console.log('🚀 Setting currentStep to 2 (Customer Info)');
          setCurrentStep(2); // Go to customer info step
          openCart(); // Open cart
          console.log('🛒 Cart opened');
        }, 1000);
        return; // Don't continue with normal cart opening logic
      }

      // OPEN CART: After each booking (if not at maximum)
      setTimeout(() => {
        openCart();
      }, 500);

      } else {
        // SCENARIO D: Multiple packages - show selection modal
        setSelectedSchedules(prev => [...prev, newSchedule]);
        setShowPackageSelectionModal(true);
        toast.success(`Selected ${slot.serviceType.name} for ${slot.date} at ${slot.time}. Please choose a package.`);
      }
    }
  };

  /**
   * PACKAGE SELECTION HANDLER (SCENARIO D)
   * --------------------------------------
   * Handles package selection when multiple packages are available for a booking.
   * Closes modal and routes to cart after selection.
   */
  const handlePackageSelection = (packageId: string) => {
    if (selectedSchedules.length > 0) {
      const schedule = selectedSchedules[selectedSchedules.length - 1];

      console.log('📦 PACKAGE SELECTION FROM MODAL:', {
        packageId,
        slot: `${schedule.selectedDate} ${schedule.selectedTime}`,
        isDuplicate: isTimeSlotBookedByPackage(schedule.selectedDate, schedule.selectedTime, packageId)
      });

      // VALIDATION: Check if package has reached session limit
      if (isPackageAtMaxSessions(packageId)) {
        toast.error('This package has reached its maximum number of sessions. Please select a different package.');
        return;
      }

      // VALIDATION: Check for duplicate booking
      if (isTimeSlotBookedByPackage(schedule.selectedDate, schedule.selectedTime, packageId)) {
        toast.error('This package has already booked this time slot. Please select a different package.');
        return;
      }

      // BOOKING: Add to selected package
      addBookingToPackage(packageId, schedule);
      
      const pkg = cartItems.find(item => item.id === packageId);
      toast.success(`Added session to ${pkg?.name || 'package'}`);
      
      // UPDATE: Locked slots
      updateLockedTimeSlots();
      setSelectedSchedules(prev => prev.slice(0, -1));
      setShowPackageSelectionModal(false);

      // CHECK IF MAXIMUM REACHED: If all packages now have maximum bookings, proceed to checkout
      const maxReachedAfterBooking = isAtMaxSessions();
      if (maxReachedAfterBooking) {
        setTimeout(() => {
          setCurrentStep(2); // Go to customer info step
          openCart(); // Open cart
        }, 1000);
        return; // Don't continue with normal cart opening logic
      }

      // OPEN CART: After each booking (if not at maximum)
      setTimeout(() => {
        openCart();
      }, 500);
    }
  };

  // =============================================================================
  // UI RENDERING LOGIC
  // =============================================================================
  
  /**
   * STEP CONTENT RENDERING
   * ----------------------
   * Renders the appropriate UI for each step based on current scenario.
   * Different content is shown depending on flow type and step.
   * 
   * RENDERING LOGIC:
   * - Step 0 (packages): Package selection with cart integration
   * - Step 1 (schedule): EnhancedSchedule with conditional locking rules
   * - Step 2 (customer): Customer information form
   * - Step 3 (shipping): Shipping address (if required)
   * - Step 4 (payment): Stripe payment integration
   */
  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.id) {
      case 'packages':
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

            {/* Show selected schedules if coming from schedule-first flow */}
            {selectedSchedules.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Your Selected Schedules
                </h3>
                <p className="text-blue-700 mb-3">
                  You've selected {selectedSchedules.length} time slot(s). Now choose a package that matches your needs.
                </p>
                <div className="space-y-2">
                  {selectedSchedules.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center bg-blue-100 p-2 rounded">
                      <span className="text-blue-800">
                        {schedule.selectedDate} at {schedule.selectedTime} - {schedule.serviceType}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedSchedules(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages Grid */}
            {packagesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
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
            )}

            {/* Cart Summary */}
            {cartItems.length > 0 && (
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
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
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
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    
                    {/* Book Now Button */}
                    {cartItems.some(item => item.type === 'package') && (() => {
                      const atMax = isAtMaxSessions();
                      const packageItems = cartItems.filter(item => item.type === 'package');

                      // More detailed debugging
                      console.log('🎯 BOOK NOW BUTTON RENDER:', {
                        timestamp: new Date().toISOString(),
                        atMax,
                        buttonDisabled: atMax,
                        buttonText: atMax ? 'All Sessions Booked' : 'Book Now',
                        cartItemsCount: cartItems.length,
                        packageItemsCount: packageItems.length,
                        forceUpdate: forceUpdate,
                        packagesDetailed: packageItems.map(pkg => ({
                          id: pkg.id,
                          name: pkg.name,
                          sessions: pkg.sessions,
                          booked: pkg.bookingDetails?.length || 0,
                          remaining: getPackageRemainingSessions(pkg.id),
                          atMax: isPackageAtMaxSessions(pkg.id)
                        }))
                      });

                      return (
                        <div className="mt-4 pt-4 border-t">
                          <Button
                            key={`book-now-${forceUpdate}-${atMax ? 'disabled' : 'enabled'}`}
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
            )}
          </div>
        );

      case 'schedule':
        // For schedule page (initialStep === 1), show direct schedule access
        if (initialStep === 1) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Book Your Wellness Session
                </h2>
                <p className="text-gray-600">
                  Choose 1 time slot, then select a package (1, 4, 8, 12, or 24 sessions)
                </p>
              </div>

              <div className="space-y-4">
                {/* Direct Schedule Access */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">
                    Direct Schedule Access
                  </h3>
                  <p className="text-orange-700 mb-3">
                    Choose 1 time slot, then select a package (1, 4, 8, 12, or 24 sessions) to continue.
                  </p>
                  {selectedSchedules.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-orange-800 mb-2">Selected Schedule:</h4>
                      <div className="space-y-2">
                        {selectedSchedules.map((schedule, index) => (
                          <div key={index} className="flex justify-between items-center bg-orange-100 p-2 rounded">
                            <span className="text-orange-800">
                              {schedule.selectedDate} at {schedule.selectedTime} - {schedule.serviceType}
                            </span>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedSchedules([]);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">
                          ✅ Schedule selected! Redirecting to package selection...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule component - hide after selection to prevent multiple selections */}
                {selectedSchedules.length === 0 && (
                <EnhancedSchedule
                  onBookSlot={handleScheduleSelection}
                  showFilters={true}
                  existingBookings={selectedSchedules}
                    lockedTimeSlots={lockedTimeSlots}
                />
                )}
              </div>
            </div>
          );
        }

        // For "add more bookings" mode
        if (isAddingMoreBookings) {
          const remainingSessions = getTotalRemainingSessions();
          const isMaxReached = isAtMaxSessions();
          
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Book Additional Sessions
                </h2>
                <p className="text-gray-600">
                  {isMaxReached 
                    ? "All packages have reached their maximum sessions"
                    : `You can book ${remainingSessions} more session${remainingSessions !== 1 ? 's' : ''}`
                  }
                </p>
              </div>

              {/* Enhanced Session Progress */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-800">
                  Session Progress
                </h3>
                  <div className="text-sm text-blue-600">
                    {getTotalRemainingSessions()} sessions remaining
                  </div>
                </div>
                <div className="space-y-2">
                  {cartItems
                    .filter(item => item.type === 'package')
                    .map((pkg, index) => {
                      const scheduled = pkg.bookingDetails?.length || 0;
                      const total = pkg.sessions || 1;
                      const remaining = total - scheduled;
                      
                      const progressPercentage = (scheduled / total) * 100;
                      
                      return (
                        <div key={index} className="bg-blue-100 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                          <span className="text-blue-800 font-medium">{pkg.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-700 text-sm">
                              {scheduled}/{total} sessions
                            </span>
                            {remaining > 0 && (
                              <span className="text-green-600 text-sm font-semibold">
                                {remaining} remaining
                              </span>
                            )}
                            {remaining === 0 && (
                              <span className="text-red-600 text-sm font-semibold">
                                  ✓ Complete
                              </span>
                            )}
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Schedule Component with locked time slots */}
              {!isMaxReached && (
                <EnhancedSchedule
                  onBookSlot={handleAddMoreBookings}
                  showFilters={true}
                  existingBookings={cartItems
                    .filter(item => item.type === 'package')
                    .flatMap(item => (item.bookingDetails || []).map(booking => ({
                      selectedDate: booking.selectedDate || '',
                      selectedTime: booking.selectedTime || ''
                    })))
                  }
                  lockedTimeSlots={lockedTimeSlots}
                />
              )}

              {/* Max Sessions Reached - Auto proceed to next step */}
              {isMaxReached && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    🎉 All Sessions Booked!
                  </h3>
                  <p className="text-green-700 mb-4">
                    You have successfully booked all available sessions for your packages.
                  </p>
                  <Button 
                    onClick={() => {
                      setCurrentStep(2); // Go to customer info step
                      openCart(); // Open cart
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue to Checkout
                  </Button>
                </div>
              )}

            </div>
          );
        }

        // For other flows, show package-based scheduling
        const packageItems = cartItems.filter((item: any) => item.type === 'package');
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select Schedule
              </h2>
              <p className="text-gray-600">
                Choose your preferred date and time
              </p>
            </div>

            {packageItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    No Packages Selected
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    Please go back and select a package first before scheduling your sessions.
                  </p>
                  <Button 
                    onClick={() => setCurrentStep(0)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Package Selection
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Show selected packages */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Selected Packages
                  </h3>
                  <div className="space-y-2">
                    {packageItems.map((item: any, index: number) => (
                      <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                        <span className="text-green-700">{item.name}</span>
                        <span className="text-green-600 font-semibold">
                          {item.bookingDetails?.length || 0} / {item.sessions || 1} sessions scheduled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule component */}
                <EnhancedSchedule
                  onBookSlot={(slot) => {
                    const packageNeedingSessions = packageItems.find((item: any) => 
                      !item.bookingDetails || item.bookingDetails.length < (item.sessions || 1)
                    );
                    
                    if (packageNeedingSessions) {
                      const updatedPackage = {
                        ...packageNeedingSessions,
                        bookingDetails: [
                          ...(packageNeedingSessions.bookingDetails || []),
                          {
                            selectedDate: slot.date,
                            selectedTime: slot.time,
                            teacher: slot.teacher.name,
                            dayOfWeek: new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long' }),
                            serviceType: slot.serviceType.name,
                            venue: slot.venue.name,
                            scheduleSlotId: slot.id
                          }
                        ]
                      };
                      
                      addToCart(updatedPackage);
                      toast.success(`Scheduled ${slot.serviceType.name} for ${slot.date} at ${slot.time}`);

                      // OPEN CART: After first booking
                      setTimeout(() => {
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('isCartOpen', 'true');
                        }
                      }, 500);
                    } else {
                      toast.info('All sessions for your packages have been scheduled');
                    }
                  }}
                  showFilters={true}
                  existingBookings={packageItems.flatMap((item: any) => item.bookingDetails || [])}
                  lockedTimeSlots={lockedTimeSlots}
                />
              </div>
            )}
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Customer Information
              </h2>
              <p className="text-gray-600">
                Provide your details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="unified-form-group">
                <Label htmlFor="name" className="unified-form-label">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="email" className="unified-form-label">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="phone" className="unified-form-label">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  className="unified-form-input"
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="birthDate" className="unified-form-label">
                  Birth Date *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={customerData.birthDate}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>

              <div className="unified-form-group md:col-span-2">
                <Label htmlFor="birthPlace" className="unified-form-label">
                  Birth Place *
                </Label>
                <Input
                  id="birthPlace"
                  type="text"
                  value={customerData.birthPlace}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, birthPlace: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Shipping Address
              </h2>
              <p className="text-gray-600">
                Provide shipping details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="unified-form-group">
                <Label htmlFor="firstName" className="unified-form-label">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={shippingData.firstName}
                  onChange={(e) => setShippingFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="lastName" className="unified-form-label">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={shippingData.lastName}
                  onChange={(e) => setShippingFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>

              <div className="unified-form-group md:col-span-2">
                <Label htmlFor="address" className="unified-form-label">
                  Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={shippingData.address}
                  onChange={(e) => setShippingFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="city" className="unified-form-label">
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={shippingData.city}
                  onChange={(e) => setShippingFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="unified-form-input"
                  required
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="state" className="unified-form-label">
                  State
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={shippingData.state}
                  onChange={(e) => setShippingFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="unified-form-input"
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="postalCode" className="unified-form-label">
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  type="text"
                  value={shippingData.postalCode}
                  onChange={(e) => setShippingFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="unified-form-input"
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="country" className="unified-form-label">
                  Country
                </Label>
                <Select value={shippingData.country} onValueChange={(value) => setShippingFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger className="unified-form-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PE">Peru</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment
              </h2>
              <p className="text-gray-600">
                Complete your purchase
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <StripeInlineForm
                  amount={getTotalPrice() * 100}
                  currency="PEN"
                  description="Wellness Package Purchase"
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    console.error('Payment error:', error);
                    toast.error('Payment failed. Please try again.');
                  }}
                />
              </div>

              <div>
                <Card className="unified-card">
                  <CardHeader>
                    <CardTitle className="unified-card__title">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex items-center justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-4">
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>S/ {getTotalPrice().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-gray-600">
                Thank you for your purchase
              </p>
            </div>

            {orderData && (
              <Card className="unified-card">
                <CardHeader>
                  <CardTitle className="unified-card__title">Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong>Order Number:</strong> {orderData.orderNumber}
                    </div>
                    <div>
                      <strong>Total:</strong> S/ {orderData.total.toFixed(2)}
                    </div>
                    <div>
                      <strong>Items:</strong>
                      <ul className="mt-2 space-y-1">
                        {orderData.items.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {item.name} x {item.quantity} - S/ {(item.price * item.quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  /**
   * STEP VALIDATION LOGIC
   * ---------------------
   * Validates current step before allowing progression to next step.
   * Different validation rules apply based on scenario and step.
   */
  const validateCurrentStep = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.id) {
      case 'packages':
        // VALIDATION: Ensure cart has items
        if (cartItems.length === 0) {
          toast.error('Please add at least one item to your cart');
          return false;
        }

        // VALIDATION: Check package validity
        const packageItems = cartItems.filter(item => item.type === 'package');
        const invalidPackages = packageItems.filter(pkg => !pkg.sessions || pkg.sessions <= 0);
        if (invalidPackages.length > 0) {
          toast.error('Some packages have invalid session counts. Please remove and re-add them.');
          return false;
        }
        break;
        
      case 'schedule':
        if (initialStep === 1) {
          // SCENARIO A: Schedule-first validation
          if (selectedSchedules.length !== 1) {
            toast.error('Please select exactly 1 time slot');
            return false;
          }
        } else if (isAddingMoreBookings) {
          // SCENARIO C: Add more bookings - allow partial bookings
          if (isAtMaxSessions()) {
            toast.success('All sessions have been booked!');
          }
          // Note: Allow proceeding even with partial bookings in this mode
        } else {
          // SCENARIO B: Package-first validation
          const packageItems = cartItems.filter((item: any) => item.type === 'package');
          const packagesWithoutBookings = packageItems.filter((item: any) => 
            !item.bookingDetails || item.bookingDetails.length === 0
          );
          
          if (packagesWithoutBookings.length > 0) {
            toast.error('Please schedule sessions for all packages before continuing');
            return false;
          }

          // VALIDATION: Check for duplicate slots within packages
          const hasDuplicates = packageItems.some(pkg => {
            if (!pkg.bookingDetails || pkg.bookingDetails.length <= 1) return false;

            const timeSlots = pkg.bookingDetails.map((booking: any) =>
              `${booking.selectedDate}-${booking.selectedTime}`
            );
            return new Set(timeSlots).size !== timeSlots.length;
          });

          if (hasDuplicates) {
            toast.error('Duplicate time slots detected within the same package. Please remove duplicates before continuing.');
            return false;
          }
        }
        break;
        
      case 'customer':
        if (!customerData.name || !customerData.email || !customerData.birthDate || !customerData.birthPlace) {
          toast.error('Please fill in all required customer information');
          return false;
        }
        
        // Enhanced validation: Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        
        // Enhanced validation: Birth date validation
        const birthDate = new Date(customerData.birthDate);
        const today = new Date();
        if (birthDate >= today) {
          toast.error('Birth date must be in the past');
          return false;
        }
        
        // Enhanced validation: Age validation (must be at least 13)
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
          toast.error('You must be at least 13 years old to make a purchase');
          return false;
        }
        break;
        
      case 'shipping':
        if (requiresAddress()) {
          if (!shippingData.firstName || !shippingData.lastName || !shippingData.address || !shippingData.city) {
            toast.error('Please fill in all required shipping information');
            return false;
          }
          
          // Enhanced validation: Name validation
          if (shippingData.firstName.length < 2 || shippingData.lastName.length < 2) {
            toast.error('First and last names must be at least 2 characters long');
            return false;
          }
          
          // Enhanced validation: Address validation
          if (shippingData.address.length < 10) {
            toast.error('Please provide a complete address (at least 10 characters)');
            return false;
          }
        }
        break;
        
      case 'payment':
        // Enhanced validation: Final checkout validation
        const finalPackageItems = cartItems.filter(item => item.type === 'package');
        
        // Check if all packages have at least one booking (unless it's a product-only purchase)
        if (finalPackageItems.length > 0) {
          const packagesWithoutBookings = finalPackageItems.filter(pkg => 
            !pkg.bookingDetails || pkg.bookingDetails.length === 0
          );
          
          if (packagesWithoutBookings.length > 0) {
            toast.error('All packages must have at least one scheduled session before checkout');
            return false;
          }
          
          // Check for any duplicate time slots
          const allBookings = finalPackageItems.flatMap(pkg => pkg.bookingDetails || []);
          const timeSlots = allBookings.map(booking => 
            `${booking.selectedDate}-${booking.selectedTime}`
          );
          const uniqueTimeSlots = new Set(timeSlots);
          
          if (timeSlots.length !== uniqueTimeSlots.size) {
            toast.error('Duplicate time slots detected. Please remove duplicates before checkout.');
            return false;
          }
        }
        
        // Check if total price is valid
        if (getTotalPrice() <= 0) {
          toast.error('Invalid total price. Please check your cart items.');
          return false;
        }
        break;
    }
    
    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  // =============================================================================
  // MAIN COMPONENT RENDER
  // =============================================================================
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8">
        {completedSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
              step.completed 
                ? 'bg-green-600 border-green-600 text-white' 
                : index === currentStep 
                  ? 'border-green-600 text-green-600' 
                  : 'border-gray-300 text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
            {index < completedSteps.length - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 ${
                step.completed ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Enhanced Navigation with better UX */}
      <div className="flex justify-between items-center">
        <Button
          onClick={prevStep}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center"
          title={currentStep === 0 ? "You're at the first step" : "Go back to previous step"}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {/* Step indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
          <p className="text-xs text-gray-500">
            {steps[currentStep].title}
          </p>
        </div>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            className="flex items-center"
            disabled={!validateCurrentStep()}
            title={!validateCurrentStep() ? "Please complete the current step before continuing" : "Continue to next step"}
          >
            {currentStep === steps.length - 2 ? 'Complete Order' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-semibold">Order Complete!</p>
          </div>
        )}
      </div>

        {/* Enhanced Package Selection Modal */}
        {showPackageSelectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Package for Booking</h3>
              <div className="text-sm text-gray-500">
                {selectedSchedules.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {selectedSchedules[selectedSchedules.length - 1].selectedDate} at {selectedSchedules[selectedSchedules.length - 1].selectedTime}
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              You have multiple packages available. Which package would you like to use for this booking?
            </p>
            
            <div className="space-y-3">
              {selectedSchedules.length > 0 && (() => {
                const currentSchedule = selectedSchedules[selectedSchedules.length - 1];
                const availablePackages = getAvailablePackagesForSlot(currentSchedule.selectedDate, currentSchedule.selectedTime);
                
                return availablePackages.map((pkg, index) => {
                  const remaining = getPackageRemainingSessions(pkg.id);
                  const scheduled = pkg.bookingDetails?.length || 0;
                  const total = pkg.sessions || 1;

                  return (
                    <button
                      key={`${pkg.id}-${index}`}
                      onClick={() => handlePackageSelection(pkg.id)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                      title={`Select ${pkg.name} for this booking`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-green-800">
                            {pkg.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {scheduled}/{total} sessions booked
                          </p>
                          <p className="text-xs text-blue-600 font-medium">
                            ✓ Available for {currentSchedule.selectedDate} at {currentSchedule.selectedTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-green-600 font-semibold text-lg">
                            {remaining}
                          </span>
                          <p className="text-xs text-gray-500">remaining</p>
                        </div>
                      </div>
                    </button>
                  );
                });
              })()}
              
              {selectedSchedules.length > 0 && (() => {
                const currentSchedule = selectedSchedules[selectedSchedules.length - 1];
                const availablePackages = getAvailablePackagesForSlot(currentSchedule.selectedDate, currentSchedule.selectedTime);
                
                if (availablePackages.length === 0) {
                  return (
                    <div className="text-center py-4 text-gray-500">
                      <p>No packages available for this time slot.</p>
                      <p className="text-sm">All packages have either reached capacity or already booked this slot.</p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPackageSelectionModal(false);
                  setSelectedSchedules(prev => prev.slice(0, -1));
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}