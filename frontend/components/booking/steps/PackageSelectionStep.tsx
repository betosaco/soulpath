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

import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
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
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { defaultTranslations } from '@/lib/data/translations';
import { StructuredData } from '@/components/StructuredData';

// Debug the import
console.log('🔍 Imported defaultTranslations:', defaultTranslations);
console.log('🔍 Imported defaultTranslations keys:', Object.keys(defaultTranslations));

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
   * TRANSLATION HOOKS
   * -----------------
   * Access to language and translation system
   */
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  
  // Debug the useLanguage hook
  console.log('🔍 useLanguage hook result:', { language });
  
  // Use default translations directly to ensure packages translations are always available
  // Make it reactive to language changes by accessing it directly
  const packagesTranslations = defaultTranslations[language]?.packages || defaultTranslations.en.packages || {};
  
      // Debug logging for language switching (always show for troubleshooting)
      console.log('🔍 PackageSelectionStep - Language:', language);
      console.log('🔍 PackageSelectionStep - DefaultTranslations object:', defaultTranslations);
      console.log('🔍 PackageSelectionStep - Available languages:', Object.keys(defaultTranslations));
      console.log('🔍 PackageSelectionStep - English object:', defaultTranslations.en);
      console.log('🔍 PackageSelectionStep - Spanish object:', defaultTranslations.es);
      console.log('🔍 PackageSelectionStep - English packages:', defaultTranslations.en?.packages);
      console.log('🔍 PackageSelectionStep - Spanish packages:', defaultTranslations.es?.packages);
      console.log('🔍 PackageSelectionStep - Current language packages:', defaultTranslations[language]?.packages);
      console.log('🔍 PackageSelectionStep - Final packages translations:', packagesTranslations);
      console.log('🔍 PackageSelectionStep - Title:', packagesTranslations?.title);

      // Helper function to translate package descriptions
      const translatePackageDescription = useCallback((description: string): string => {
        if (!description) return '';
        
        // Check if it matches the pattern "X sessions of Y hour each"
        const sessionMatch = description.match(/(\d+)\s+sessions\s+of\s+(\d+)\s+hour\s+each/);
        if (sessionMatch) {
          const sessionCount = sessionMatch[1];
          const hourCount = sessionMatch[2];
          return `${sessionCount} ${packagesTranslations.sessionsOf || 'sessions of'} ${hourCount} ${packagesTranslations.hourEach || 'hour each'}`;
        }
        
        // Return original description if no pattern match
        return description;
      }, [packagesTranslations, language]);

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
    // Use default values to prevent crash
    bookingFlow = {
      urlParams: {},
      isScheduleFirst: false,
      goToNextStep: () => console.warn('goToNextStep not available')
    };
  }
  
  // Add safety check for bookingFlow
  if (!bookingFlow) {
    console.warn('⚠️ PackageSelectionStep: useBookingFlow returned undefined');
    bookingFlow = {
      urlParams: {},
      isScheduleFirst: false,
      goToNextStep: () => console.warn('goToNextStep not available')
    };
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
    // Use default values to prevent crash
    cart = {
      items: [],
      addItem: () => console.warn('addToCart not available'),
      removeItem: () => console.warn('removeFromCart not available'),
      updateQuantity: () => console.warn('updateQuantity not available'),
      getTotalPrice: () => 0
    };
  }
  
  // Add safety check for cart
  if (!cart) {
    console.warn('⚠️ PackageSelectionStep: useCart returned undefined');
    cart = {
      items: [],
      addItem: () => console.warn('addToCart not available'),
      removeItem: () => console.warn('removeFromCart not available'),
      updateQuantity: () => console.warn('updateQuantity not available'),
      getTotalPrice: () => 0
    };
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
    // Use default values to prevent crash
    cartUI = {
      openCart: () => console.warn('openCart not available')
    };
  }
  
  // Add safety check for cartUI
  if (!cartUI) {
    console.warn('⚠️ PackageSelectionStep: useCartUI returned undefined');
    cartUI = {
      openCart: () => console.warn('openCart not available')
    };
  }
  
  const { openCart = () => console.warn('openCart not available') } = cartUI;

  /**
   * PACKAGES DATA
   * -------------
   * Access to available packages
   */
  const { packages, loading: packagesLoading, error: packagesError } = usePackages('PEN');
  
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
    // UI-first approach: Don't show error immediately, render skeleton instead
    // Error will be handled in the render section
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
      image: pkg.packageDefinition.name?.includes('MATPASS') 
        ? '/matpass-logo.png' 
        : '/placeholder-package.jpg',
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
      toast.success(`${pkg.packageDefinition.name} ${packagesTranslations.packageAddedWithSchedule || 'added to cart with 1 scheduled session'}`);

      setPreSelectedSchedules([]); // Clear schedules (now in package)
      updateLockedTimeSlots(); // Update locked slots

      // Keep cart open across navigation
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('isCartOpen', 'true'); } catch {}
      }

      // Determine max sessions for this package
      const maxSessions = Number(pkg.packageDefinition?.sessionsCount || 1);
      const scheduledNow = preSelectedSchedules.length;

      // If we've reached the session cap (e.g., 1 for MATPASS), navigate directly
      if (scheduledNow >= (Number.isFinite(maxSessions) && maxSessions > 0 ? maxSessions : 1)) {
        // Ensure cart remains open across navigation
        try { localStorage.setItem('isCartOpen', 'true'); } catch {}
        // Use router push to avoid full reload and preserve state
        try {
          // Avoid duplicate navigation if already on target
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          if (!currentPath.startsWith('/booking/customer-info')) {
            void ((window as any).next?.router?.push?.('/booking/customer-info?isDirectCheckout=true') || window.location.assign('/booking/customer-info?isDirectCheckout=true'));
          }
        } catch (err) {
          console.warn('⚠️ Navigation fallback to window.location', err);
          window.location.href = '/booking/customer-info?isDirectCheckout=true';
        }
        return;
      }

      // Otherwise, show cart and continue normal flow
      setTimeout(() => {
        openCart();
      }, 300);
      goToNextStep();
    } else {
      // SCENARIO B: Package-first flow - just add to cart, no automatic redirect
      console.log('🎯 Package added to cart - user can add more packages');
      toast.success(`${pkg.packageDefinition.name} ${packagesTranslations.packageAdded || 'added to cart! You can add more packages or proceed to checkout.'}`);

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
      toast.error(packagesTranslations.allSessionsBooked || 'All available sessions have been booked. Please proceed to checkout.');
      console.log('🚫 Book Now blocked - all sessions already booked');
      return;
    }

    // Navigate to schedule step for booking additional sessions
    goToNextStep();
    toast.success(packagesTranslations.readyToBookSessions || 'Ready to book sessions for your packages!');
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
        <div className="bg-gradient-to-r from-[var(--color-status-success)]/10 to-[var(--color-primary-500)]/10 border border-[var(--color-status-success)]/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-status-success)]/20 rounded-full">
              <Calendar className="h-5 w-5 text-[var(--color-status-success)]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {packagesTranslations.selectedSchedule || 'Your Selected Schedule'}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {packagesTranslations.selectedScheduleDescription || 'You\'ve selected 1 time slot. Now choose a package that matches your needs.'}
              </p>
            </div>
          </div>
          
          <div className="bg-[var(--color-surface-primary)] rounded-lg p-4 border border-[var(--color-border-500)] shadow-sm">
            {preSelectedSchedules.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-status-success)]/20 rounded-full">
                    <CheckCircle className="h-4 w-4 text-[var(--color-status-success)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {new Date(schedule.selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {schedule.selectedTime} - {schedule.serviceType}
                    </p>
                    {schedule.teacher && (
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {packagesTranslations.with || 'with'} {schedule.teacher}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-status-success)]">{packagesTranslations.selected || 'Selected'}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{packagesTranslations.readyToBook || 'Ready to book'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /**
   * RENDER PACKAGE CARD SKELETON
   * ----------------------------
   * Skeleton component for loading state
   */
  const PackageCardSkeleton = ({ index }: { index: number }) => (
    <Card 
      className="unified-card animate-pulse"
      style={{animationDelay: `${index * 100}ms`}}
    >
      <div className="absolute top-3 right-3 z-10">
        <div className="w-9 h-9 rounded-full bg-[var(--color-surface-secondary)]"></div>
      </div>
      <CardHeader>
        <div className="h-6 bg-[var(--color-surface-secondary)] rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[var(--color-surface-secondary)] rounded w-full mb-1"></div>
        <div className="h-4 bg-[var(--color-surface-secondary)] rounded w-5/6"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <div className="h-8 bg-[var(--color-surface-secondary)] rounded w-24"></div>
              <div className="h-3 bg-[var(--color-surface-secondary)] rounded w-32"></div>
            </div>
            <div className="h-6 bg-[var(--color-surface-secondary)] rounded w-20"></div>
          </div>
          <div className="h-10 bg-[var(--color-surface-secondary)] rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * RENDER PACKAGES GRID
   * --------------------
   * Displays available packages for selection with UI-first approach
   */
  const renderPackagesGrid = () => {
    // Debug: Log all package names
    console.log('🔍 All packages in PackageSelectionStep:', packages?.map(p => ({
      id: p.id,
      name: p.packageDefinition?.name,
      type: p.packageDefinition?.packageType
    })));
    
    return (
      <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        {/* Packages Header - Always renders first */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{packagesTranslations.title || 'Available Packages'}</h2>
            {packagesLoading && hasLoadedOnce && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[var(--color-border-200)] border-t-[var(--color-primary-500)]"></div>
            )}
          </div>
          <p className="text-[var(--color-text-secondary)]">{packagesTranslations.subtitle || 'Choose the perfect package for your yoga journey'}</p>
        </div>
        
        {/* UI-first approach: Show skeleton while loading, then show content */}
        {packagesLoading && !hasLoadedOnce ? (
          // Initial load - show skeleton cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <PackageCardSkeleton key={index} index={index} />
            ))}
          </div>
        ) : !packagesLoading && packages && Array.isArray(packages) && packages.length === 0 ? (
          // No packages available
          <div className="text-center py-12">
            <div className="text-[var(--color-text-tertiary)] mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{packagesTranslations.noPackagesAvailable || 'No Packages Available'}</h3>
            <p className="text-[var(--color-text-secondary)]">{packagesTranslations.noPackagesDescription || 'We\'re currently updating our package offerings. Please check back later.'}</p>
          </div>
        ) : (
          // Packages loaded - show content
          <div className="relative">
            {packagesLoading && hasLoadedOnce && (
              <div className="absolute inset-0 bg-[var(--color-background-primary)]/50 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-border-200)] border-t-[var(--color-primary-500)] mx-auto mb-2"></div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{packagesTranslations.refreshingPackages || 'Refreshing packages...'}</p>
                </div>
              </div>
            )}
            {/* Structured Data for each package */}
            {packages && Array.isArray(packages) && packages.map((pkg: any) => (
              <StructuredData
                key={`structured-data-${pkg.id}`}
                type="YogaPackage"
                data={{
                  name: pkg.packageDefinition?.name || pkg.name,
                  description: pkg.packageDefinition?.description || pkg.description,
                  image: "/matpass-logo.png",
                  sku: pkg.id,
                  price: pkg.packagePrice?.price || pkg.price,
                  url: `https://matmax.world/packages/enhanced`,
                  sessions: pkg.packageDefinition?.sessionsCount || pkg.sessions,
                  duration: pkg.sessionDuration?.durationMinutes ? `${pkg.sessionDuration.durationMinutes} minutes` : "60 minutes",
                  packageType: pkg.packageDefinition?.packageType || pkg.packageType || "Individual"
                }}
              />
            ))}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages && Array.isArray(packages) && packages.map((pkg: any, index: number) => (
              <Card 
                key={pkg.id} 
                className="unified-card hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 hover:animate-pulse relative"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Matpass image in top-right corner */}
                <div className="absolute top-3 right-3 z-10">
                  <Image
                    src="/matpass-logo.png"
                    alt="Matpass"
                    width={36}
                    height={36}
                    className="rounded-full object-cover shadow-sm"
                  />
                </div>
                <CardHeader>
                  <CardTitle 
                    as="h2" 
                    className={`unified-card__title ${
                      pkg.packageDefinition.name?.includes('MATPASS') || pkg.packageDefinition.packageType === 'matpass'
                        ? '!text-[var(--color-accent-500)] !font-bold'
                        : ''
                    }`}
                  >
                    {pkg.packageDefinition.name}
                  </CardTitle>
                  <p className="unified-card__subtitle">{translatePackageDescription(pkg.packageDefinition.description)}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-black">
                          S/ {pkg.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          S/ {pkg.pricePerClass?.toFixed(2) || (pkg.price / (pkg.packageDefinition.sessionsCount || 1)).toFixed(2)} {packagesTranslations.perClass || 'per class'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-semibold text-[var(--color-text-primary)]">
                          {pkg.packageDefinition.sessionsCount || 1} {packagesTranslations.sessions || 'sessions'}
                        </span>
                        {(pkg.packageDefinition.name?.includes('MATPASS') || pkg.packageDefinition.packageType === 'matpass') && (
                          <span className="text-xs text-[var(--color-accent-500)] font-medium">
                            {packagesTranslations.validFor30Days || 'Valid for 30 days'}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddPackage(pkg)}
                      variant="success"
                      className="w-full"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {packagesTranslations.addToCart || 'Add to Cart'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        )}
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

// ULTRA-OPTIMIZATION: Memoize the component to prevent unnecessary re-renders
export default memo(PackageSelectionStep);
