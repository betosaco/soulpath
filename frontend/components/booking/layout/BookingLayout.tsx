/**
 * ========================================================================================
 * BOOKING LAYOUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Provides a consistent layout and navigation structure for all booking flow steps.
 * This component extracts the progress stepper and navigation logic from the
 * monolithic MasterBookingFlow.tsx component.
 *
 * RESPONSIBILITIES:
 * - Render progress stepper showing current step
 * - Provide Previous/Next navigation buttons
 * - Show step indicators and titles
 * - Handle step validation and navigation
 * - Provide consistent styling across all booking steps
 *
 * ARCHITECTURE:
 * ------------
 * - Uses useBookingFlow hook for centralized flow management
 * - Accepts children to render step-specific content
 * - Handles conditional shipping step based on cart contents
 * - Provides consistent UX across all booking scenarios
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Calendar,
  User,
  Truck,
  CreditCard,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useCart } from '@/store/appStore';

/**
 * BOOKING LAYOUT PROPS
 * --------------------
 * Props for the BookingLayout component
 */
interface BookingLayoutProps {
  /** The content to render for the current step */
  children: React.ReactNode;
  /** Optional custom className for the container */
  className?: string;
  /** Whether to show the step indicator in the center */
  showStepIndicator?: boolean;
  /** Whether to hide the navigation buttons */
  hideNavigation?: boolean;
}

/**
 * BOOKING STEP CONFIGURATION
 * --------------------------
 * Defines the configuration for each step in the booking flow
 */
interface BookingStepConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  alwaysVisible: boolean;
}

/**
 * STATIC STEP CONFIGURATIONS
 * --------------------------
 * Defines the base steps that are always available in the booking flow
 */
const STEP_CONFIGS: Record<string, BookingStepConfig> = {
  packages: {
    id: 'packages',
    title: '',
    description: 'Add items to your cart',
    icon: ShoppingCart,
    alwaysVisible: true
  },
  schedule: {
    id: 'schedule',
    title: 'Select Schedule',
    description: 'Choose your preferred date and time',
    icon: Calendar,
    alwaysVisible: true
  },
  'multi-package': {
    id: 'multi-package',
    title: 'Select Schedule',
    description: 'Choose dates and times for multiple packages',
    icon: Calendar,
    alwaysVisible: false // Only shown in multi-package scenario
  },
  customer: {
    id: 'customer',
    title: 'Customer Information',
    description: 'Provide your details',
    icon: User,
    alwaysVisible: true
  },
  shipping: {
    id: 'shipping',
    title: 'Shipping Address',
    description: 'Provide shipping details',
    icon: Truck,
    alwaysVisible: false // Conditionally shown based on cart contents
  },
  payment: {
    id: 'payment',
    title: 'Payment',
    description: 'Complete your purchase',
    icon: CreditCard,
    alwaysVisible: true
  },
  confirmation: {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Order confirmed',
    icon: CheckCircle,
    alwaysVisible: true
  }
};

/**
 * BOOKING LAYOUT COMPONENT
 * ------------------------
 * Provides consistent layout and navigation for all booking steps
 *
 * @param props - Component props
 * @returns React component
 */
export function BookingLayout({
  children,
  className = '',
  showStepIndicator = true,
  hideNavigation = false
}: BookingLayoutProps) {
  // ============================================================================
  // HOOKS AND STATE
  // ============================================================================

  /**
   * BOOKING FLOW STATE
   * ------------------
   * Access to centralized flow management
   */
  const {
    currentStep,
    canGoNext,
    goToNextStep,
    isMultiPackage,
    isDirectCheckout
  } = useBookingFlow();

  /**
   * CART STATE
   * ----------
   * Access to cart contents for conditional step rendering
   */
  const { requiresAddress } = useCart();


  // ============================================================================
  // STEP CONFIGURATION
  // ============================================================================

  /**
   * BUILD STEPS ARRAY
   * -----------------
   * Dynamically builds the steps array based on current scenario and cart contents
   */
  const [steps, setSteps] = React.useState<BookingStepConfig[]>([]);

  // Build steps on client-side only to prevent hydration mismatch
  React.useEffect(() => {
    const stepList: BookingStepConfig[] = [];

    // For direct checkout, skip packages and schedule steps
    if (!isDirectCheckout) {
      // Always include base steps
      stepList.push(STEP_CONFIGS.packages);
      stepList.push(STEP_CONFIGS.schedule);

      // Add multi-package step if in multi-package scenario
      if (isMultiPackage) {
        stepList.push(STEP_CONFIGS['multi-package']);
      }
    }

    // Always include customer info
    stepList.push(STEP_CONFIGS.customer);

    // Conditionally include shipping based on cart contents
    if (requiresAddress()) {
      stepList.push(STEP_CONFIGS.shipping);
    }

    // Always include payment and confirmation
    stepList.push(STEP_CONFIGS.payment);
    stepList.push(STEP_CONFIGS.confirmation);

    setSteps(stepList);
  }, [isMultiPackage, requiresAddress, isDirectCheckout]);

  /**
   * BUILD COMPLETED STEPS
   * ---------------------
   * Determines which steps are completed based on current progress
   */
  const completedSteps = React.useMemo(() => {
    if (steps.length === 0) return [];
    
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return steps.map((step, index) => ({
      ...step,
      completed: index < currentStepIndex
    }));
  }, [steps, currentStep]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE NEXT STEP
   * ----------------
   * Navigate to the next step in the flow
   */
  const handleNextStep = () => {
    goToNextStep();
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * RENDER PROGRESS STEPPER
   * -----------------------
   * Renders the visual progress stepper showing completed and current steps
   */
  const renderProgressStepper = () => {
    if (!showStepIndicator || completedSteps.length === 0) return null;
    
    return (
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8">
        {completedSteps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step Circle */}
          <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ${
            step.completed
              ? 'bg-green-600 border-green-600 text-white shadow-md'
              : index === completedSteps.findIndex(s => s.id === currentStep)
                ? 'border-green-600 text-green-600 shadow-md'
                : 'border-gray-300 text-gray-400'
          }`}>
            {step.completed ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>

          {/* Connector Line */}
          {index < completedSteps.length - 1 && (
            <div className={`w-8 sm:w-12 h-0.5 transition-all duration-200 ${
              step.completed ? 'bg-green-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
      </div>
    );
  };

  /**
   * RENDER STEP INDICATOR
   * ---------------------
   * Shows current step information in the center of navigation
   */
  const renderStepIndicator = () => {
    // Step indicator removed as requested
    return null;
  };

  /**
   * RENDER NAVIGATION BUTTONS
   * -------------------------
   * Renders Previous/Next buttons with appropriate states
   */
  const renderNavigationButtons = () => {
    // Hide navigation if hideNavigation prop is true
    if (hideNavigation) {
      return null;
    }

    // Next button removed as requested
    return null;
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Progress Stepper - only show if showStepIndicator is true */}
      {showStepIndicator && renderProgressStepper()}

      {/* Step Content */}
      <div className="mb-8">
        {children}
      </div>

      {/* Navigation */}
      {renderNavigationButtons()}
    </div>
  );
}
