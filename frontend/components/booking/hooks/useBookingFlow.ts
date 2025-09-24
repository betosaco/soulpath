/**
 * ========================================================================================
 * BOOKING FLOW HOOK
 * ========================================================================================
 *
 * CENTRALIZED FLOW MANAGEMENT
 * ---------------------------
 * This hook serves as the single source of truth for booking flow logic, replacing
 * the complex sessionStorage-based state management in MasterBookingFlow.tsx.
 *
 * KEY RESPONSIBILITIES:
 * - Reads URL parameters to determine current flow state
 * - Provides navigation functions (goToNextStep, goToPreviousStep)
 * - Validates transitions between steps
 * - Manages scenario-specific logic
 * - Integrates with Zustand store for cart data
 *
 * ARCHITECTURE PRINCIPLES:
 * - URL is the single source of truth for flow state
 * - No sessionStorage dependencies
 * - Pure functions for validation logic
 * - Clear separation of concerns
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useCart } from '@/store/appStore';

/**
 * BOOKING SCENARIO TYPES
 * ----------------------
 * Defines the different user journey scenarios supported by the booking system
 */
export type BookingScenario =
  | 'schedule-first'      // User starts by selecting a schedule slot
  | 'package-first'       // User starts by selecting a package
  | 'add-more'           // User adds sessions to existing packages
  | 'multi-package'      // User manages multiple packages
  | 'direct-checkout'    // Cart is ready, skip to checkout
  | 'product-checkout';  // User has products in cart, needs checkout with potential shipping

/**
 * BOOKING STEP TYPES
 * ------------------
 * Defines the individual steps in the booking flow
 */
export type BookingStep =
  | 'packages'
  | 'schedule'
  | 'multi-package'
  | 'customer-info'
  | 'shipping'
  | 'payment'
  | 'confirmation';

/**
 * FLOW CONFIGURATION
 * ------------------
 * Defines the valid transitions and requirements for each step
 */
const FLOW_CONFIG = {
  'packages': {
    next: 'schedule' as BookingStep,
    requiresValidation: false,
    url: '/booking/packages'
  },
  'schedule': {
    next: 'customer-info' as BookingStep,
    requiresValidation: true,
    url: '/booking/schedule'
  },
  'multi-package': {
    next: 'customer-info' as BookingStep,
    requiresValidation: true,
    url: '/booking/schedule/multi-package'
  },
  'customer-info': {
    next: 'shipping' as BookingStep,
    requiresValidation: true,
    url: '/booking/customer-info'
  },
  'shipping': {
    next: 'payment' as BookingStep,
    requiresValidation: true,
    url: '/booking/shipping'
  },
  'payment': {
    next: 'confirmation' as BookingStep,
    requiresValidation: true,
    url: '/booking/payment'
  },
  'confirmation': {
    next: null,
    requiresValidation: false,
    url: '/booking/confirmation'
  }
} as const;

/**
 * SCENARIO HANDLERS
 * -----------------
 * Maps scenarios to their specific logic and validation rules
 */
const SCENARIO_HANDLERS = {
  'schedule-first': {
    initialStep: 'packages' as BookingStep,
    validateTransition: (_from: BookingStep, _to: BookingStep, params: URLSearchParams) => {
      if (_from === 'packages' && _to === 'schedule') {
        return params.has('slotId');
      }
      return true;
    }
  },
  'package-first': {
    initialStep: 'schedule' as BookingStep,
    validateTransition: (_from: BookingStep, _to: BookingStep, params: URLSearchParams) => {
      if (_from === 'schedule' && _to === 'customer-info') {
        return params.has('packageId');
      }
      return true;
    }
  },
  'add-more': {
    initialStep: 'schedule' as BookingStep,
    validateTransition: (_from: BookingStep, _to: BookingStep, params: URLSearchParams) => {
      return params.has('packageId');
    }
  },
  'multi-package': {
    initialStep: 'multi-package' as BookingStep,
    validateTransition: () => {
      return true; // Multi-package logic handled in component
    }
  },
  'direct-checkout': {
    initialStep: 'customer-info' as BookingStep,
    validateTransition: (from: BookingStep, to: BookingStep) => {
      // For direct checkout, allow transitions from customer-info onwards
      // Skip validation for packages and schedule steps
      if (from === 'customer-info' && ['shipping', 'payment'].includes(to)) {
        return true;
      }
      if (from === 'shipping' && to === 'payment') {
        return true;
      }
      if (from === 'payment' && to === 'confirmation') {
        return true;
      }
      return false;
    }
  },
  'product-checkout': {
    initialStep: 'customer-info' as BookingStep,
    validateTransition: (from: BookingStep, to: BookingStep) => {
      // For product checkout, allow transitions from customer-info onwards
      // Include shipping step since products may require physical delivery
      if (from === 'customer-info' && ['shipping', 'payment'].includes(to)) {
        return true;
      }
      if (from === 'shipping' && to === 'payment') {
        return true;
      }
      if (from === 'payment' && to === 'confirmation') {
        return true;
      }
      return false;
    }
  }
};

/**
 * BOOKING FLOW HOOK INTERFACE
 * ---------------------------
 * Return type for the useBookingFlow hook
 */
interface UseBookingFlowReturn {
  // Current state
  currentStep: BookingStep;
  scenario: BookingScenario | null;
  canGoNext: boolean;
  canGoPrevious: boolean;

  // URL parameters
  urlParams: {
    slotId?: string;
    packageId?: string;
    flowType?: string;
    readyForSchedule?: boolean;
    slotDate?: string;
    slotTime?: string;
  };

  // Navigation functions
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: BookingStep) => void;

  // Scenario detection
  isScheduleFirst: boolean;
  isPackageFirst: boolean;
  isAddMore: boolean;
  isMultiPackage: boolean;
  isDirectCheckout: boolean;
  
  // Cart state
  hasPhysicalProducts: boolean;
}

/**
 * DETERMINE BOOKING SCENARIO
 * --------------------------
 * Analyzes URL parameters to determine which booking scenario the user is in
 *
 * @param searchParams - Current URL search parameters
 * @returns The detected booking scenario
 */
function determineScenario(searchParams: URLSearchParams): BookingScenario | null {
  // Direct checkout (highest priority)
  if (searchParams.get('isDirectCheckout') === 'true') {
    return 'direct-checkout';
  }

  // Product checkout scenario
  if (searchParams.get('hasProducts') === 'true') {
    return 'product-checkout';
  }

  // Multi-package scenario
  if (searchParams.get('multiPackage') === 'true') {
    return 'multi-package';
  }

  // Add more bookings
  if (searchParams.get('flowType') === 'add-more') {
    return 'add-more';
  }

  // Schedule-first: has slotId but no packageId
  if (searchParams.has('slotId') && !searchParams.has('packageId')) {
    return 'schedule-first';
  }

  // Package-first: has packageId
  if (searchParams.has('packageId')) {
    return 'package-first';
  }

  // Fallback: If we have any booking-related parameters, assume product-checkout
  // This handles cases where we're on shipping page but don't have explicit scenario markers
  if (searchParams.has('slotId') || searchParams.has('packageId') || searchParams.has('flowType')) {
    return 'product-checkout';
  }

  return null;
}

/**
 * DETERMINE CURRENT STEP
 * ----------------------
 * Based on the current URL path and scenario, determine which step we're on
 *
 * @param pathname - Current URL pathname
 * @param scenario - Detected booking scenario
 * @returns The current booking step
 */
function determineCurrentStep(pathname: string, scenario: BookingScenario | null): BookingStep {
  // Extract step from pathname first
  const pathSegments = pathname.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Handle multi-package special case
  if (lastSegment === 'multi-package') {
    return 'multi-package';
  }

  // Map URL segments to step types
  const stepMap: Record<string, BookingStep> = {
    'packages': 'packages',
    'schedule': 'schedule',
    'customer-info': 'customer-info',
    'shipping': 'shipping',
    'payment': 'payment',
    'confirmation': 'confirmation'
  };

  const step = stepMap[lastSegment];
  if (step) {
    return step;
  }

  // Default to scenario's initial step if no valid step found in URL
  if (scenario && SCENARIO_HANDLERS[scenario]) {
    return SCENARIO_HANDLERS[scenario].initialStep;
  }

  // Ultimate fallback
  return 'packages';
}

/**
 * MAIN BOOKING FLOW HOOK
 * ----------------------
 * Central hook that manages all booking flow logic
 *
 * @returns Object containing current flow state and navigation functions
 */
export function useBookingFlow(): UseBookingFlowReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { items: cartItems } = useCart();

  // Parse current URL state
  const scenario = useMemo(() => determineScenario(searchParams), [searchParams]);
  const currentStep = useMemo(() => determineCurrentStep(pathname, scenario), [pathname, scenario]);

  // Extract URL parameters
  const urlParams = useMemo(() => ({
    slotId: searchParams.get('slotId') || undefined,
    packageId: searchParams.get('packageId') || undefined,
    flowType: searchParams.get('flowType') || undefined,
    readyForSchedule: searchParams.get('readyForSchedule') === 'true',
    slotDate: searchParams.get('slotDate') || undefined,
    slotTime: searchParams.get('slotTime') || undefined,
    teacherName: searchParams.get('teacherName') || undefined,
    serviceType: searchParams.get('serviceType') || undefined,
    venueName: searchParams.get('venueName') || undefined,
  }), [searchParams]);

  // Check if cart contains physical products (requires shipping)
  const hasPhysicalProducts = useMemo(() => {
    return cartItems.some(item => item.type === 'product');
  }, [cartItems]);

  // Scenario booleans for convenience
  const isScheduleFirst = scenario === 'schedule-first';
  const isPackageFirst = scenario === 'package-first';
  const isAddMore = scenario === 'add-more';
  const isMultiPackage = scenario === 'multi-package';
  const isDirectCheckout = scenario === 'direct-checkout';

  /**
   * VALIDATE STEP TRANSITION
   * ------------------------
   * Checks if transitioning from one step to another is valid for the current scenario
   *
   * @param from - Current step
   * @param to - Target step
   * @returns Whether the transition is valid
   */
  const validateStepTransition = useCallback((from: BookingStep, to: BookingStep): boolean => {
    if (!scenario) {
      // Fallback: Allow basic transitions for common steps
      if (from === 'shipping' && to === 'payment') {
        return true;
      }
      if (from === 'customer-info' && to === 'shipping') {
        return true;
      }
      if (from === 'customer-info' && to === 'payment') {
        return true;
      }
      return false;
    }

    // Use scenario-specific validation
    const handler = SCENARIO_HANDLERS[scenario];
    return handler.validateTransition(from, to, searchParams);
  }, [scenario, searchParams]);

  /**
   * CHECK IF CAN GO TO NEXT STEP
   * -----------------------------
   * Validates whether the current step allows progression to the next step
   */
  const canGoNext = useMemo(() => {
    const config = FLOW_CONFIG[currentStep];
    if (!config.next) {
      return false;
    }

    // Skip validation for non-required steps
    if (!config.requiresValidation) {
      return true;
    }

    // Scenario-specific validation
    const isValid = validateStepTransition(currentStep, config.next);
    return isValid;
  }, [currentStep, validateStepTransition, scenario]);

  /**
   * CHECK IF CAN GO TO PREVIOUS STEP
   * ---------------------------------
   * Determines if the user can navigate backwards in the flow
   */
  const canGoPrevious = useMemo(() => {
    // Can't go back from first step or confirmation
    if (currentStep === 'confirmation') return false;

    // In direct checkout scenario, can't go back to packages or schedule
    if (isDirectCheckout && (currentStep === 'customer-info')) return false;

    // Can't go back to packages step normally
    return currentStep !== 'packages';
  }, [currentStep, isDirectCheckout]);

  /**
   * NAVIGATE TO NEXT STEP
   * ---------------------
   * Advances to the next step in the booking flow
   */
  const goToNextStep = useCallback(() => {
    console.log('🚀 goToNextStep called:', { currentStep, canGoNext, hasPhysicalProducts });
    
    if (!canGoNext) {
      console.log('❌ Cannot go to next step - canGoNext is false');
      return;
    }

    const config = FLOW_CONFIG[currentStep];
    if (!config.next) {
      console.log('❌ No next step configured for:', currentStep);
      return;
    }

    // Determine the actual next step (skip shipping if no physical products, except for product-checkout)
    let actualNextStep = config.next;
    if (config.next === 'shipping' && !hasPhysicalProducts && scenario !== 'product-checkout') {
      actualNextStep = 'payment';
      console.log('🔄 Skipping shipping step, going directly to payment');
    }

    console.log('📍 Navigating from', currentStep, 'to', actualNextStep);

    // Build URL for next step
    const nextUrl = new URL(FLOW_CONFIG[actualNextStep].url, window.location.origin);

    // Preserve existing search parameters
    searchParams.forEach((value, key) => {
      nextUrl.searchParams.set(key, value);
    });

    // Add step-specific parameters if needed
    if (config.next === 'schedule' && currentStep === 'packages') {
      // Package selection complete, ready for scheduling
      nextUrl.searchParams.set('readyForSchedule', 'true');
    }

    router.push(nextUrl.pathname + nextUrl.search);
  }, [canGoNext, currentStep, searchParams, router]);

  /**
   * NAVIGATE TO PREVIOUS STEP
   * -------------------------
   * Goes back to the previous step in the booking flow
   */
  const goToPreviousStep = useCallback(() => {
    if (!canGoPrevious) return;

    // Define reverse step mapping
    const reverseMap: Partial<Record<BookingStep, BookingStep>> = {
      'schedule': 'packages',
      'multi-package': 'schedule',
      'customer-info': 'schedule',
      'shipping': 'customer-info',
      'payment': hasPhysicalProducts ? 'shipping' : 'customer-info'
    };

    const prevStep = reverseMap[currentStep];
    if (!prevStep) return;

    const config = FLOW_CONFIG[prevStep];
    const prevUrl = new URL(config.url, window.location.origin);

    // Preserve existing search parameters
    searchParams.forEach((value, key) => {
      prevUrl.searchParams.set(key, value);
    });

    router.push(prevUrl.pathname + prevUrl.search);
  }, [canGoPrevious, currentStep, searchParams, router]);

  /**
   * NAVIGATE TO SPECIFIC STEP
   * -------------------------
   * Jumps directly to a specific step (used for error recovery or special flows)
   *
   * @param step - The step to navigate to
   */
  const goToStep = useCallback((step: BookingStep) => {
    const config = FLOW_CONFIG[step];
    const stepUrl = new URL(config.url, window.location.origin);

    // Preserve existing search parameters
    searchParams.forEach((value, key) => {
      stepUrl.searchParams.set(key, value);
    });

    router.push(stepUrl.pathname + stepUrl.search);
  }, [searchParams, router]);

  return {
    // Current state
    currentStep,
    scenario,
    canGoNext,
    canGoPrevious,

    // URL parameters
    urlParams,

    // Navigation functions
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // Scenario detection
    isScheduleFirst,
    isPackageFirst,
    isAddMore,
    isMultiPackage,
    isDirectCheckout,
    
    // Cart state
    hasPhysicalProducts
  };
}
