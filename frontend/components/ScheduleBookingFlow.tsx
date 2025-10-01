'use client';

/**
 * @deprecated This component is deprecated. Use MasterBookingFlow instead.
 * 
 * The ScheduleBookingFlow component has been consolidated into MasterBookingFlow.tsx
 * which provides a unified booking and checkout experience.
 * 
 * Migration: Replace usage with MasterBookingFlow component
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Package,
  ArrowRight,
  AlertCircle,
  Users,
  Star,
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedSchedule } from './EnhancedSchedule';
import { usePackages, PackagePrice } from '@/hooks/usePackages';
import { toast } from 'sonner';
import { useCart, useCartUI } from '@/store/appStore';
// Payment integration will be added here

interface Teacher {
  id: number;
  name: string;
  bio?: string;
  shortBio?: string;
  experience: number;
  avatarUrl?: string;
}

interface ServiceType {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  duration: number;
  difficulty?: string;
  color?: string;
  icon?: string;
}

interface Venue {
  id: number;
  name: string;
  address?: string;
  city?: string;
}

interface ScheduleSlot {
  id: number;
  date: string;
  time: string;
  isAvailable: boolean;
  capacity: number;
  bookedCount: number;
  duration: number;
  teacher: Teacher;
  serviceType: ServiceType;
  venue: Venue;
  dayOfWeek: string;
}

interface BookingFormData {
  selectedSchedule: ScheduleSlot | null;
  selectedPackage: PackagePrice | null;
  // Customer information
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  countryCode: string;
  billingDocumentType: string;
  dni: string;
  ruc: string;
  companyName: string;
  notes: string;
}


interface ScheduleBookingFlowProps {
  startDate?: Date;
  endDate?: Date;
  onSlotsChange?: (slots: ScheduleSlot[]) => void;
  onStepChange?: (step: number) => void;
}


// Helper function to check for existing duplicate schedules across all packages
const checkForExistingDuplicateSchedules = (cartItems?: Array<{ id: string; type: string; bookingDetails?: Array<{ scheduleSlotId: number; date: string; time: string }> }>) => {
  console.log('🔍 checkForExistingDuplicateSchedules called');
  
  if (typeof window === 'undefined') {
    console.log('🔍 Window undefined, returning no duplicates');
    return { hasDuplicates: false, conflictingBookings: [] };
  }
  
  let localCartItems: Array<{ id: string; type: string; bookingDetails?: Array<{ scheduleSlotId: number; date: string; time: string }> }> = [];
  
  // Try to get cart items from context first, then localStorage
  if (cartItems) {
    console.log('🔍 Using cart context items:', cartItems);
    localCartItems = cartItems;
  } else {
    // Fallback to localStorage
    const savedCart = localStorage.getItem('cart');
    console.log('🔍 Saved cart from localStorage:', savedCart);
    
    if (!savedCart) {
      console.log('🔍 No saved cart, returning no duplicates');
      return { hasDuplicates: false, conflictingBookings: [] };
    }
    
    try {
      localCartItems = JSON.parse(savedCart);
      console.log('🔍 Parsed cart items from localStorage:', localCartItems);
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return { hasDuplicates: false, conflictingBookings: [] };
    }
  }
  
  try {
    
    const packageItems = localCartItems.filter((item: { type: string }) => item.type === 'package');
    console.log('🔍 Package items:', packageItems);
    
    // Collect all bookings from all packages
    const allBookings: Array<{ scheduleSlotId: number; date: string; time: string; packageId: string; packageName: string }> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    packageItems.forEach((packageItem: any) => {
      console.log('🔍 Processing package:', packageItem.name, 'bookings:', packageItem.bookingDetails);
      if (packageItem.bookingDetails && Array.isArray(packageItem.bookingDetails)) {
        packageItem.bookingDetails.forEach((booking: { scheduleSlotId: number; date: string; time: string }) => {
          const bookingWithPackage = {
            ...booking,
            packageId: packageItem.id,
            packageName: packageItem.name
          };
          console.log('🔍 Adding booking:', bookingWithPackage);
          allBookings.push(bookingWithPackage);
        });
      }
    });
    
    console.log('🔍 All bookings collected:', allBookings);
    console.log('🔍 Total bookings count:', allBookings.length);
    
    // Group bookings by package ID and date/time to only check for duplicates within the same package
    const packageScheduleGroups: { [packageId: string]: { [key: string]: Array<{ scheduleSlotId: number; date: string; time: string; packageId: string; packageName: string }> } } = {};
    
    allBookings.forEach(booking => {
      const packageId = booking.packageId;
      const key = `${booking.date}-${booking.time}`;
      
      if (!packageScheduleGroups[packageId]) {
        packageScheduleGroups[packageId] = {};
      }
      
      if (!packageScheduleGroups[packageId][key]) {
        packageScheduleGroups[packageId][key] = [];
      }
      
      packageScheduleGroups[packageId][key].push(booking);
    });
    
    console.log('🔍 Package schedule groups:', packageScheduleGroups);
    
    // Find groups with more than one booking within the same package (duplicates)
    const duplicateGroups: Array<{ scheduleSlotId: number; date: string; time: string; packageId: string; packageName: string }> = [];
    
    Object.values(packageScheduleGroups).forEach(packageGroups => {
      Object.values(packageGroups).forEach(group => {
        if (group.length > 1) {
          duplicateGroups.push(...group);
        }
      });
    });
    
    console.log('🔍 Duplicate groups found within packages:', duplicateGroups);
    console.log('🔍 Number of duplicate groups:', duplicateGroups.length);
    
    if (duplicateGroups.length > 0) {
      console.log('🔍 Returning duplicates:', duplicateGroups);
      return {
        hasDuplicates: true,
        conflictingBookings: duplicateGroups
      };
    }
    
    console.log('🔍 No duplicates found');
    return { hasDuplicates: false, conflictingBookings: [] };
  } catch (error) {
    console.error('Error checking for duplicate schedules:', error);
    return { hasDuplicates: false, conflictingBookings: [] };
  }
};

// Helper function to handle duplicate schedule conflict for existing bookings
const handleDuplicateScheduleConflict = (conflictingBookings: Array<{ scheduleSlotId: number; date: string; time: string; packageId: string; packageName: string }>, setIsGroupBooking?: (value: boolean) => void, setCurrentStep?: (step: number) => void, onStepChange?: (step: number) => void) => {
  if (conflictingBookings.length === 0) return;
  
  // Group conflicting bookings by schedule time
  const scheduleGroups: { [key: string]: Array<{ scheduleSlotId: number; date: string; time: string; packageId: string; packageName: string }> } = {};
  conflictingBookings.forEach(booking => {
    const key = `${booking.date}-${booking.time}`;
    if (!scheduleGroups[key]) {
      scheduleGroups[key] = [];
    }
    scheduleGroups[key].push(booking);
  });
  
  // Show warning for each conflicting schedule
  Object.entries(scheduleGroups).forEach(([scheduleKey, bookings]) => {
    const [date, time] = scheduleKey.split('-');
    const packageNames = bookings.map(b => b.packageName).join(', ');
    
    toast.warning(
      `You have multiple packages booked for ${date} at ${time}: ${packageNames}. ` +
      `Please change or remove conflicting bookings to proceed with individual booking.`,
      {
        duration: 8000,
        action: {
          label: 'Manage Bookings',
          onClick: () => {
            // Navigate to schedule page to manage bookings
            if (typeof window !== 'undefined') {
              window.location.href = '/schedule';
            }
          }
        }
      }
    );
    
    // Show additional option to change to group booking
    setTimeout(() => {
      toast.info(
        `Alternatively, you can change to group booking to allow multiple packages to attend the same class.`,
        {
          duration: 6000,
          action: {
            label: 'Change to Group Booking',
            onClick: () => {
              // Change to group booking and proceed
              if (setIsGroupBooking) setIsGroupBooking(true);
              if (setCurrentStep) setCurrentStep(2);
              if (onStepChange) onStepChange(2);
              toast.success('Changed to group booking! You can now proceed with package selection.');
            }
          }
        }
      );
    }, 1000);
  });
};


export function ScheduleBookingFlow({
  startDate,
  endDate,
  onSlotsChange,
  onStepChange
}: ScheduleBookingFlowProps = {}) {
  const { packages, loading: packagesLoading, error: packagesError } = usePackages('PEN');
  const cartContext = useCart();
  const { items: cartItems, addItem: addToCart, removeItem: removeFromCart, updateQuantity } = cartContext;
  const { openCart: setIsCartOpen } = useCartUI();
  
  const [currentStep, setCurrentStep] = useState(0);
  
  // Check if we're in editing mode
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  
  // Initialize editing mode from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionEditingSchedule = sessionStorage.getItem('isEditingSchedule');
      const sessionEditingPackageId = sessionStorage.getItem('editingPackageId');
      
      console.log('🚀 INITIALIZING EDITING MODE from session storage:', {
        sessionEditingSchedule,
        sessionEditingPackageId
      });
      
      // Check for valid values (not "null" string)
      if (sessionEditingSchedule === 'true' && sessionEditingPackageId && sessionEditingPackageId !== 'null') {
        console.log('🎯 SETTING EDITING MODE from session storage');
        setIsEditingSchedule(true);
        setEditingPackageId(sessionEditingPackageId);
      } else {
        console.log('❌ NOT SETTING EDITING MODE - invalid session storage values');
        console.log('  sessionEditingSchedule === "true":', sessionEditingSchedule === 'true');
        console.log('  sessionEditingPackageId exists:', !!sessionEditingPackageId);
        console.log('  sessionEditingPackageId !== "null":', sessionEditingPackageId !== 'null');
      }
    }
  }, []);
  
  // State for package selection when multiple packages exist
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const [selectedScheduleForPackage, setSelectedScheduleForPackage] = useState<ScheduleSlot | null>(null);
  const [isGroupBooking, setIsGroupBooking] = useState<boolean | null>(null); // null = not decided, true = group, false = individual
  
  // Debug modal state changes
  React.useEffect(() => {
    console.log('🔍 Modal state changed - showPackageSelection:', showPackageSelection, 'selectedScheduleForPackage:', selectedScheduleForPackage?.id);
  }, [showPackageSelection, selectedScheduleForPackage]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (showPackageSelection) {
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
  }, [showPackageSelection]);

  // Debug cart changes and force re-evaluation of package modal logic
  React.useEffect(() => {
    const packageItems = cartItems?.filter(item => item.type === 'package') || [];
    console.log('🔍 Cart changed - package count:', packageItems.length, 'packages:', packageItems.map(p => ({ id: p.id, name: p.name, quantity: p.quantity })));
    
    // Force re-evaluation of modal logic when cart changes
    const shouldShow = packageItems.length > 1 || packageItems.reduce((sum, item) => sum + (item.quantity || 1), 0) > 1;
    console.log('🔍 Should show modal after cart change:', shouldShow);
  }, [cartItems]);

  // Auto-redirect from group booking step if no multiple packages
  React.useEffect(() => {
    if (currentStep === 1) {
      const currentCartItems = cartItems || [];
      const currentPackageItems = currentCartItems.filter(item => item.type === 'package');
      
      if (currentPackageItems.length <= 1) {
        console.log('🔍 No multiple packages detected, redirecting to package selection');
        setCurrentStep(2);
        onStepChange?.(2);
      }
    }
  }, [currentStep, cartItems, onStepChange]);
  
  // Country dropdown state
  
  const [formData, setFormData] = useState<BookingFormData>({
    selectedSchedule: null,
    selectedPackage: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    countryCode: 'PE',
    billingDocumentType: 'boleta_simple',
    dni: '',
    ruc: '',
    companyName: '',
    notes: ''
  });

  // Calculate existing bookings from cart - this will update when cart changes
  const existingBookings = useMemo(() => {
    const packageItems = cartItems.filter(item => item.type === 'package') || [];
    
    const allExistingBookings = packageItems
      .filter(item => item.bookingDetails)
      .flatMap(item => (item.bookingDetails || []).map(booking => ({
        ...booking,
        packageName: item.name,
        packageId: item.id
      }))) || [];
    
    const bookings = allExistingBookings
      .filter(booking => booking.selectedDate && booking.selectedTime)
      .map(booking => ({
        selectedDate: booking.selectedDate!,
        selectedTime: booking.selectedTime!,
        packageName: booking.packageName,
        packageId: booking.packageId
    }));
    
    console.log('🔍 existingBookings calculated:', {
      packageItemsCount: packageItems.length,
      packageItems: packageItems.map(p => ({ id: p.id, name: p.name, sessions: p.sessions, bookings: p.bookingDetails?.length || 0 })),
      allExistingBookings: allExistingBookings.length,
      filteredBookings: bookings.length,
      hasMultiplePackages: packageItems.length > 1
    });
    
    return bookings;
  }, [cartItems]);

  // Calculate max bookings per slot - allow unlimited bookings for different packages
  // Multiple packages can book the same slot without restriction
  const maxBookingsPerSlot = useMemo(() => {
    // Allow unlimited bookings per slot - different packages can book the same slot
    const result = 999; // Set to a high number to effectively allow unlimited bookings
    console.log('🔍 maxBookingsPerSlot set to unlimited (999) to allow multiple packages to book same slot');
    return result;
  }, [cartItems]);

  // Create a reload trigger that updates when cart items change
  const reloadTrigger = useMemo(() => {
    if (!cartItems) return 0;
    return cartItems.length + cartItems.reduce((sum, item) => {
      return sum + (item.quantity || 1) + (item.bookingDetails?.length || 0);
    }, 0);
  }, [cartItems]);


  // Check for editing mode or adding more bookings on mount
  React.useEffect(() => {
    // Force reset modal state on mount to ensure it works properly
    setShowPackageSelection(false);
    setSelectedScheduleForPackage(null);
    
    if (typeof window !== 'undefined') {
      const isEditing = sessionStorage.getItem('isEditingSchedule') === 'true';
      const packageId = sessionStorage.getItem('editingPackageId');
      const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
      const addingToPackageId = sessionStorage.getItem('addingToPackageId');
      
      console.log('🔍 ScheduleBookingFlow mount - isEditing:', isEditing, 'packageId:', packageId);
      console.log('🔍 ScheduleBookingFlow mount - isAddingMore:', isAddingMore, 'addingToPackageId:', addingToPackageId);
      console.log('🔍 ScheduleBookingFlow mount - cartItems:', cartItems?.length || 0);
      
      if (isEditing && packageId) {
        console.log('✅ Setting editing mode for package:', packageId);
        setIsEditingSchedule(true);
        setEditingPackageId(packageId);
        // Don't clear session storage here - we need it for editing mode detection
      } else if (isAddingMore) {
        // Check if there are multiple packages
        const packageItems = cartItems?.filter(item => item.type === 'package') || [];
        console.log('🔍 Adding more mode - package count:', packageItems.length);
        
        if (packageItems.length > 1) {
          // Multiple packages - don't set editing mode, let modal handle it
          console.log('✅ Multiple packages detected - clearing session storage for modal');
          sessionStorage.removeItem('isAddingMoreBookings');
          sessionStorage.removeItem('addingToPackageId');
          setEditingPackageId(null);
          // Reset to schedule selection step - modal will show when schedule is selected
          setCurrentStep(0);
          onStepChange?.(0);
          setShowPackageSelection(false);
          setSelectedScheduleForPackage(null);
        } else if (addingToPackageId) {
          // Single package - set editing mode
          console.log('✅ Single package - setting adding more mode for package:', addingToPackageId);
        setEditingPackageId(addingToPackageId);
        // Clear the adding more flags
        sessionStorage.removeItem('isAddingMoreBookings');
        sessionStorage.removeItem('addingToPackageId');
        }
      } else if (isAddingMore && !addingToPackageId) {
        console.log('✅ Multiple packages mode - will show package selection modal');
        // Multiple packages - will show package selection modal when user selects a slot
      }
    }
  }, [onStepChange, cartItems]);

  // Listen for "Book a Class Now" clicks from sidecart
  React.useEffect(() => {
    const checkForBookingRequest = () => {
      const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
      const addingToPackageId = sessionStorage.getItem('addingToPackageId');
      
      if (isAddingMore && addingToPackageId && !editingPackageId) {
        // User clicked "Book a Class Now" from sidecart while on schedule page
        setEditingPackageId(addingToPackageId);
        // Clear the adding more flags
        sessionStorage.removeItem('isAddingMoreBookings');
        sessionStorage.removeItem('addingToPackageId');
      }
    };

    // Check periodically for booking requests
    const interval = setInterval(checkForBookingRequest, 100);
    
    // Also check immediately
    checkForBookingRequest();

    return () => {
      clearInterval(interval);
    };
  }, [editingPackageId]);

  // Monitor cart changes and update session storage accordingly
  React.useEffect(() => {
    if (!cartContext) return;
    
    const packageItems = cartItems.filter(item => item.type === 'package');
    const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
    
    console.log('Cart monitoring - cartItems:', cartItems.length);
    console.log('Cart monitoring - packageItems:', packageItems.length);
    console.log('Cart monitoring - isAddingMore:', isAddingMore);
    console.log('Cart monitoring - current editingPackageId:', editingPackageId);
    
    if (isAddingMore) {
      // Update session storage based on current package count
      if (packageItems.length === 1) {
        // Single package - set specific package ID
        console.log('Setting single package mode:', packageItems[0].id);
        sessionStorage.setItem('addingToPackageId', packageItems[0].id);
        setEditingPackageId(packageItems[0].id);
      } else if (packageItems.length > 1) {
        // Multiple packages - remove specific package ID to show modal
        console.log('Setting multiple packages mode - removing specific package ID');
        sessionStorage.removeItem('addingToPackageId');
        setEditingPackageId(null);
        // Reset to schedule selection step - modal will show when schedule is selected
        setCurrentStep(0);
        onStepChange?.(0);
        setShowPackageSelection(false);
        setSelectedScheduleForPackage(null);
      }
    }
  }, [cartItems, editingPackageId, cartContext, onStepChange]);

  // Alternative approach: Monitor cart changes with a different method
  React.useEffect(() => {
    if (!cartContext) return;
    
    const checkCartChanges = () => {
      const packageItems = cartItems.filter(item => item.type === 'package');
      const isAddingMore = sessionStorage.getItem('isAddingMoreBookings') === 'true';
      
      if (isAddingMore) {
        if (packageItems.length === 1 && !editingPackageId) {
          // Single package - set specific package ID
          sessionStorage.setItem('addingToPackageId', packageItems[0].id);
          setEditingPackageId(packageItems[0].id);
        } else if (packageItems.length > 1 && editingPackageId) {
          // Multiple packages - remove specific package ID to show modal
          sessionStorage.removeItem('addingToPackageId');
          setEditingPackageId(null);
        }
      }
    };

    // Check immediately
    checkCartChanges();
    
    // Check periodically
    const interval = setInterval(checkCartChanges, 500);
    
    return () => clearInterval(interval);
  }, [cartContext, editingPackageId, onStepChange]);

  // ============================================================================
  // PACKAGE MODAL HANDLING - ONLY SHOW WHEN NEEDED
  // ============================================================================
  
  // Simple function to check if modal should be shown
  const shouldShowPackageModal = useCallback(() => {
    if (!cartItems) return false;
    
    const packageItems = cartItems.filter(item => item.type === 'package');
    const totalPackageQuantity = packageItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    console.log('🔍 shouldShowPackageModal check:', {
      packageItemsCount: packageItems.length,
      totalPackageQuantity,
      shouldShow: packageItems.length > 1 || totalPackageQuantity > 1,
      packageItems: packageItems.map(p => ({ id: p.id, name: p.name, quantity: p.quantity }))
    });
    
    // Show modal only if: 
    // 1. Multiple package items OR 
    // 2. Single package with quantity > 1
    // Note: Single matpass with sessions > 1 (4,8,12,24) should NOT show modal
    // but still allow multiple bookings based on sessions
    return packageItems.length > 1 || totalPackageQuantity > 1;
  }, [cartItems]);

  // Function to trigger modal when user tries to book a schedule
  const triggerPackageModalIfNeeded = useCallback((slot: { id: number; date: string; time: string; teacher?: { name: string }; serviceType?: { name: string }; venue?: { name: string } }) => {
    const shouldShow = shouldShowPackageModal();
    console.log('🔍 Checking if modal should show:', shouldShow);
    console.log('🔍 Current cart items:', cartItems);
    
    if (shouldShow) {
      console.log('🔍 Multiple packages detected, showing package selection modal');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSelectedScheduleForPackage(slot as any);
      setShowPackageSelection(true);
      return true; // Modal was shown
    }
    return false; // No modal needed
  }, [shouldShowPackageModal, cartItems]);





  const handleScheduleSelect = (slot: ScheduleSlot) => {
    console.log('🎯 SCHEDULE SELECTED:', slot);
    console.log('🎯 All cart items:', JSON.stringify(cartItems, null, 2));
    
    setFormData(prev => ({ ...prev, selectedSchedule: slot }));
    
    // FIRST: Check if we're in editing mode (returning from conflict resolution)
    // Check both component state and session storage for robustness
    const sessionEditingSchedule = sessionStorage.getItem('isEditingSchedule');
    const sessionEditingPackageId = sessionStorage.getItem('editingPackageId');
    
    // Handle "null" string case from session storage
    const validSessionEditingPackageId = sessionEditingPackageId && sessionEditingPackageId !== 'null' ? sessionEditingPackageId : null;
    const validSessionEditingSchedule = sessionEditingSchedule === 'true';
    
    const isInEditingMode = (editingPackageId || validSessionEditingPackageId) && (isEditingSchedule || validSessionEditingSchedule);
    
    console.log('🔍 EDITING MODE CHECK (FIRST):');
    console.log('  Component state - editingPackageId:', editingPackageId, 'isEditingSchedule:', isEditingSchedule);
    console.log('  Session storage - editingPackageId:', sessionEditingPackageId, 'isEditingSchedule:', sessionEditingSchedule);
    console.log('  Valid session values - editingPackageId:', validSessionEditingPackageId, 'isEditingSchedule:', validSessionEditingSchedule);
    console.log('  Final decision - isInEditingMode:', isInEditingMode);
    console.log('  Raw session storage values:');
    console.log('    isEditingSchedule:', `"${sessionStorage.getItem('isEditingSchedule')}"`);
    console.log('    editingPackageId:', `"${sessionStorage.getItem('editingPackageId')}"`);
    console.log('    editingBookingIndex:', `"${sessionStorage.getItem('editingBookingIndex')}"`);
    console.log('    returnToCheckout:', `"${sessionStorage.getItem('returnToCheckout')}"`);
    console.log('    checkoutStep:', `"${sessionStorage.getItem('checkoutStep')}"`);
    
    // If we're in editing mode, handle it immediately and return
    if (isInEditingMode) {
      const packageIdToUse = editingPackageId || validSessionEditingPackageId;
      console.log('🎯 EDITING MODE DETECTED - using packageId:', packageIdToUse);
      
      if (!packageIdToUse) {
        console.log('❌ ERROR: packageIdToUse is null, cannot proceed with editing');
        return;
      }
      
      const currentItem = cartItems.find(item => item.id === packageIdToUse);
      console.log('🎯 Found currentItem:', currentItem);
      
      if (currentItem && cartContext) {
        const newBookingDetails = {
          selectedDate: slot.date,
          selectedTime: slot.time,
          teacher: slot.teacher?.name,
          dayOfWeek: slot.dayOfWeek,
          serviceType: slot.serviceType?.name,
          venue: slot.venue?.name,
          scheduleSlotId: slot.id
        };

        // Check for duplicate booking within the same package only (exclude current booking being edited)
        const currentPackageBookings = (currentItem.bookingDetails || []).filter((_, index) => {
          const editingIndex = sessionStorage.getItem('editingBookingIndex');
          return editingIndex ? index !== parseInt(editingIndex) : true;
        });
        
        const isDuplicate = currentPackageBookings.some(booking => 
          booking.selectedDate === newBookingDetails.selectedDate && 
          booking.selectedTime === newBookingDetails.selectedTime
        );
        
        if (isDuplicate) {
          toast.error('This package already has a booking for this time slot. Please select a different slot.');
          return;
        }

        // Check if this is updating an existing booking or adding a new one
        const editingIndex = sessionStorage.getItem('editingBookingIndex');
        if (editingIndex !== null) {
          const index = parseInt(editingIndex);
          
          // Remove the old booking and add the new one
          cartContext.removeBookingFromPackage(packageIdToUse, index);
          cartContext.addBookingToPackage(packageIdToUse, newBookingDetails);
          toast.success('Schedule updated successfully!');
          
          // Clear editing flags
          sessionStorage.removeItem('isEditingSchedule');
          sessionStorage.removeItem('editingPackageId');
          sessionStorage.removeItem('editingBookingIndex');
          sessionStorage.removeItem('conflictingSchedule');
          
          // Check if user should return to checkout
          const returnToCheckout = sessionStorage.getItem('returnToCheckout');
          console.log('🔧 EDIT MODE - returnToCheckout:', returnToCheckout);
          
          if (returnToCheckout === 'true') {
            const checkoutStep = sessionStorage.getItem('checkoutStep');
            console.log('🔧 EDIT MODE - checkoutStep:', checkoutStep);
            const step = checkoutStep ? parseInt(checkoutStep as string) : 3;
            console.log('🔧 EDIT MODE - redirecting to step:', step);
            
            // Clear the return flags
            sessionStorage.removeItem('returnToCheckout');
            sessionStorage.removeItem('checkoutStep');
            
            // Redirect to checkout with the correct step
            window.location.href = `/checkout?step=${step}`;
            return;
          }
        } else {
          // This is adding a new booking to an existing package
          const currentBookings = currentItem.bookingDetails || [];
          
          // Check if this package has already booked this specific slot
          const hasAlreadyBookedThisSlot = currentBookings.some(booking => 
            booking.selectedDate === newBookingDetails.selectedDate && 
            booking.selectedTime === newBookingDetails.selectedTime
          );

          if (hasAlreadyBookedThisSlot) {
            toast.error('This package has already booked this time slot. Please select a different slot.');
            return;
          }

          // Add booking to the single package
          cartContext.addBookingToPackage(packageIdToUse, newBookingDetails);
          setIsCartOpen();
          toast.success('Class added to your package!');
          
          // Check if user should return to checkout
          const returnToCheckout = sessionStorage.getItem('returnToCheckout');
          if (returnToCheckout === 'true') {
            const checkoutStep = sessionStorage.getItem('checkoutStep');
            const step = checkoutStep ? parseInt(checkoutStep as string) : 3;
            
            // Clear the return flags
            sessionStorage.removeItem('returnToCheckout');
            sessionStorage.removeItem('checkoutStep');
            
            // Redirect to checkout with the correct step
            window.location.href = `/checkout?step=${step}`;
            return;
          }
        }
      }
      
      // IMPORTANT: Return early to prevent normal flow and modal
      return;
    }
    
    // Get all package items
    const allPackageItems = cartItems?.filter(item => item.type === 'package') || [];
    
    console.log('🔍 Schedule selection - package count check:', {
      allPackageItemsCount: allPackageItems.length,
      allPackageItems: allPackageItems.map(p => ({ id: p.id, name: p.name, quantity: p.quantity })),
      shouldShowModal: allPackageItems.length > 1
    });
    
    // Only show modal if there are multiple packages
    if (allPackageItems.length > 1) {
      console.log('🎯 Multiple packages detected, showing modal for package selection');
      setEditingPackageId(null);
      setSelectedScheduleForPackage(slot);
      setShowPackageSelection(true);
      return;
    }
    
    // If there are no packages, proceed to normal flow (package selection step)
    if (allPackageItems.length === 0) {
      console.log('🎯 No packages detected, proceeding to package selection step');
      // Continue to normal flow below
    }
    
    // If there's only one package, auto-select it and proceed
    if (allPackageItems.length === 1) {
      console.log('🎯 Single package detected, auto-selecting and proceeding');
      const singlePackage = allPackageItems[0];
      setEditingPackageId(singlePackage.id);
      
      // Proceed with booking for the single package
      const newBookingDetails = {
        selectedDate: slot.date,
        selectedTime: slot.time,
        teacher: slot.teacher?.name,
        dayOfWeek: slot.dayOfWeek,
        serviceType: slot.serviceType?.name,
        venue: slot.venue?.name,
        scheduleSlotId: slot.id
      };

      // Check for duplicate booking within the same package
      const currentPackageBookings = (singlePackage.bookingDetails || []);
      const isDuplicate = currentPackageBookings.some(booking => 
        booking.selectedDate === newBookingDetails.selectedDate && 
        booking.selectedTime === newBookingDetails.selectedTime
      );
      
      if (isDuplicate) {
        toast.error('This package has already booked this time slot. Please select a different slot.');
        return;
      }

      // Add booking to the single package
      cartContext.addBookingToPackage(singlePackage.id, newBookingDetails);
      setIsCartOpen();
      toast.success('Class added to your package!');
      return;
    }
    
    
    // If we're in editing mode or adding more bookings, update the cart item
    if (editingPackageId) {
      console.log('🎯 ENTERING EDITING MODE - editingPackageId:', editingPackageId);
      const currentItem = cartItems.find(item => item.id === editingPackageId);
      
      console.log('🎯 Found currentItem:', currentItem);
      
      if (currentItem && cartContext) {
        const newBookingDetails = {
          selectedDate: slot.date,
          selectedTime: slot.time,
          teacher: slot.teacher?.name,
          dayOfWeek: slot.dayOfWeek,
          serviceType: slot.serviceType?.name,
          venue: slot.venue?.name,
          scheduleSlotId: slot.id
        };

        if (isEditingSchedule) {
          // Check for duplicate booking within the same package only (exclude current booking being edited)
          const currentPackageBookings = (currentItem.bookingDetails || []).filter((_, index) => {
                  const editingIndex = sessionStorage.getItem('editingBookingIndex');
                  return editingIndex ? index !== parseInt(editingIndex) : true;
            });
          
          const isDuplicate = currentPackageBookings.some(booking => 
            booking.selectedDate === newBookingDetails.selectedDate && 
            booking.selectedTime === newBookingDetails.selectedTime
          );
          
          if (isDuplicate) {
            toast.error('This package has already booked this time slot. Please select a different slot.');
            return;
          }
          
          // Editing existing booking - replace the entire bookingDetails
          const updatedItem = {
            ...currentItem,
            bookingDetails: [newBookingDetails]
          };
          
          // Remove the old item and add the updated one
          removeFromCart(editingPackageId);
          addToCart(updatedItem);
          
          // Open sidecart to show updated booking
          setIsCartOpen();
        } else {
          // Adding more bookings - check if we haven't reached the package limit
          const currentBookings = currentItem.bookingDetails || [];
          const packageSessions = currentItem.sessions || 0;
          
          if (currentBookings.length >= packageSessions) {
            toast.error(`You've reached the maximum number of sessions for this package (${packageSessions}).`);
            return;
          }
          
          // Check for duplicate booking within the same package only
          const isDuplicate = currentBookings.some(booking => 
            booking.selectedDate === newBookingDetails.selectedDate && 
            booking.selectedTime === newBookingDetails.selectedTime
          );
          
          if (isDuplicate) {
            toast.error('This package has already booked this time slot. Please select a different slot.');
            return;
          }
          
          // Add to existing bookings
          cartContext.addBookingToPackage(editingPackageId, newBookingDetails);
          
          // Open sidecart to show updated bookings
          setIsCartOpen();
          
          // Show success message and stay on schedule page for more selections
          toast.success('Class added! You can select more classes or continue to checkout.');
          return; // Stay on schedule page to allow more selections
        }
      }
      
      // Store updated schedule in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedSchedule', JSON.stringify({
          selectedDate: slot.date,
          selectedTime: slot.time,
          teacher: slot.teacher,
          dayOfWeek: slot.dayOfWeek,
          serviceType: slot.serviceType,
          venue: slot.venue,
          scheduleSlotId: slot.id
        }));
      }
      
      // Check if editing from checkout or cart
      const editingFromCheckout = typeof window !== 'undefined' && sessionStorage.getItem('editingFromCheckout') === 'true';
      
      if (editingFromCheckout) {
        // Clear the checkout editing flag
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('editingFromCheckout');
        }
        // Go to checkout page
        if (typeof window !== 'undefined') {
          window.location.href = '/checkout';
        }
      } else {
        // If we were adding more bookings, ensure cart stays open and navigate to packages page
        const isAddingMore = typeof window !== 'undefined' && sessionStorage.getItem('isAddingMoreBookings') === 'true';
        if (isAddingMore) {
          // Clear the adding more flag
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('isAddingMoreBookings');
            sessionStorage.removeItem('addingToPackageId');
          }
          // Keep cart open and navigate to packages page
          setIsCartOpen();
          // Add a small delay to ensure cart context is updated before navigation
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/packages';
            }
          }, 100);
        } else {
          // Go back to the previous page (likely cart)
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        }
      }
      
      toast.success('Schedule updated successfully!');
      return;
    }
    
    // Check if there are packages in cart and user clicked "Book a Class Now"
    const packageItems = cartItems.filter(item => item.type === 'package');
    
    // If there are packages, check if we can book more of this slot
    if (packageItems.length > 0) {
      console.log('🔍 Packages detected, checking slot capacity...');
      console.log('🔍 Package items:', packageItems.map(p => ({ 
        id: p.id, 
        name: p.name, 
        quantity: p.quantity, 
        sessions: p.sessions,
        bookings: p.bookingDetails?.length || 0
      })));
      console.log('🔍 Package IDs:', packageItems.map(p => p.id));
      console.log('🔍 Are IDs unique?', new Set(packageItems.map(p => p.id)).size === packageItems.length);
      
      // Force clear editing mode when there are packages
      if (editingPackageId) {
        console.log('🔍 FORCE CLEARING editing mode for packages');
        setEditingPackageId(null);
      }
      
      // Check if any package has capacity (regardless of slot)
      const hasAnyPackageWithCapacity = packageItems.some(packageItem => {
        const currentBookings = Array.isArray(packageItem.bookingDetails) ? packageItem.bookingDetails : [];
        const packageQuantity = packageItem.quantity || packageItem.sessions || 1;
        const hasCapacity = currentBookings.length < packageQuantity;
        console.log(`🔍 Package ${packageItem.name}: ${currentBookings.length}/${packageQuantity} bookings, hasCapacity: ${hasCapacity}`);
        return hasCapacity;
      });
      
      console.log('🔍 Package capacity check:');
      console.log('🔍 - Slot:', slot.date, slot.time);
      console.log('🔍 - Has any package with capacity:', hasAnyPackageWithCapacity);
      
      if (!hasAnyPackageWithCapacity) {
        toast.error('All packages have reached their maximum number of bookings.');
        return;
      }
      
      // Check if we should show modal or use single package directly
      const modalShown = triggerPackageModalIfNeeded(slot);
      
      if (!modalShown) {
        console.log('🔍 Single package with quantity 1 detected, using it directly');
        const singlePackage = packageItems[0];
        
        // Check if this package has already booked this specific slot
        const currentBookings = Array.isArray(singlePackage.bookingDetails) ? singlePackage.bookingDetails : [];
        const hasAlreadyBookedThisSlot = currentBookings.some(booking => 
          booking.selectedDate === slot.date && 
          booking.selectedTime === slot.time
        );
        
        if (hasAlreadyBookedThisSlot) {
          toast.error('This package has already booked this time slot. Please select a different slot.');
          return;
        }
        
        // Add booking to the single package
        const newBookingDetails = {
          selectedDate: slot.date,
          selectedTime: slot.time,
          teacher: slot.teacher?.name,
          dayOfWeek: slot.dayOfWeek,
          serviceType: slot.serviceType?.name,
          venue: slot.venue?.name,
          scheduleSlotId: slot.id
        };
        
        cartContext.addBookingToPackage(singlePackage.id, newBookingDetails);
        setIsCartOpen();
        toast.success('Class added to your package!');
        return;
      }
      // If modal was shown, the function will return early and modal will handle the booking
      return;
    }
    
    // If we're in editing mode (adding more bookings), add directly to the editing package
    if (editingPackageId) {
      console.log('🔍 EDITING MODE DETECTED - editingPackageId:', editingPackageId);
      console.log('🔍 This should NOT happen with multiple packages!');
      const editingPackage = packageItems.find(item => item.id === editingPackageId);
      if (editingPackage) {
        const newBookingDetails = {
          selectedDate: slot.date,
          selectedTime: slot.time,
          teacher: slot.teacher?.name || 'TBA',
          serviceType: slot.serviceType?.name || 'Class',
          venue: slot.venue?.name || 'Studio',
          dayOfWeek: slot.dayOfWeek,
          scheduleSlotId: slot.id
        };

        // Check if we haven't reached the package quantity limit
        const currentBookings = Array.isArray(editingPackage.bookingDetails) ? editingPackage.bookingDetails : [];
        // Use both quantity (sessions count) and sessions field for validation
        const packageQuantity = editingPackage.quantity || editingPackage.sessions || 1;
        
        if (currentBookings.length >= packageQuantity) {
          toast.error(`You've reached the maximum number of classes for this package (${packageQuantity}).`);
          return;
        }

        // Check if this package has already booked this specific slot
        const hasAlreadyBookedThisSlot = currentBookings.some(booking => 
          booking.selectedDate === newBookingDetails.selectedDate && 
          booking.selectedTime === newBookingDetails.selectedTime
        );

        if (hasAlreadyBookedThisSlot) {
          toast.error('This package has already booked this time slot. Please select a different slot.');
          return;
        }

        // Add booking to the editing package
        cartContext.addBookingToPackage(editingPackageId, newBookingDetails);
        setIsCartOpen();
        toast.success('Class added to your package!');
        return;
      }
    }
    
    // Check if we should show modal or use single package directly
    const modalShown = triggerPackageModalIfNeeded(slot);
    
    if (!modalShown) {
      // Only proceed if there are packages in the cart
      if (packageItems.length === 0) {
        console.log('🎯 No packages in cart, proceeding to package selection step');
        // Continue to normal flow below - this will lead to package selection
      } else {
        const singlePackage = packageItems[0];
        const newBookingDetails = {
          selectedDate: slot.date,
          selectedTime: slot.time,
          teacher: slot.teacher?.name || 'TBA',
          serviceType: slot.serviceType?.name || 'Class',
          venue: slot.venue?.name || 'Studio',
          dayOfWeek: slot.dayOfWeek,
          scheduleSlotId: slot.id
        };

        // Check if we haven't reached the package session limit
        const currentBookings = Array.isArray(singlePackage.bookingDetails) ? singlePackage.bookingDetails : [];
        // Use sessions field for validation (this represents the number of sessions the package includes)
        const packageSessions = singlePackage.sessions || 1;
        
        if (currentBookings.length >= packageSessions) {
          toast.error(`You've reached the maximum number of sessions for this package (${packageSessions}). Please choose a different package or remove existing bookings.`);
          return;
        }

        // Check if this package has already booked this specific slot
        const hasAlreadyBookedThisSlot = currentBookings.some(booking => 
          booking.selectedDate === newBookingDetails.selectedDate && 
          booking.selectedTime === newBookingDetails.selectedTime
        );

        if (hasAlreadyBookedThisSlot) {
          toast.error('This package has already booked this time slot. Please select a different slot.');
          return;
        }

        // Add booking to the single package
        cartContext.addBookingToPackage(singlePackage.id, newBookingDetails);
        setIsCartOpen();
        toast.success('Class added to your package!');
        return;
      }
    }
    // If modal was shown, the function will return early and modal will handle the booking
    
    // Normal flow - check if we need group booking step
    const allCartItems = cartItems || [];
    const normalFlowPackageItems = allCartItems.filter(item => item.type === 'package');
    
    if (normalFlowPackageItems.length > 1) {
      // Multiple packages - go to group booking selection
      setCurrentStep(1);
      onStepChange?.(1);
      toast.success('Schedule selected! Now choose your booking type.');
    } else if (normalFlowPackageItems.length === 1) {
      // Single package - skip to package selection
      setCurrentStep(2);
      onStepChange?.(2);
      toast.success('Schedule selected! Now choose your package.');
    } else {
      // No packages - go to package selection step
      setCurrentStep(2);
      onStepChange?.(2);
      toast.success('Schedule selected! Now choose your package.');
    }
  };







  return (
    <div className="min-h-screen bg-white">
      {/* Step Content */}
      <div className="container mx-auto px-4 pb-8 mobile-step-container">
        <AnimatePresence mode="wait">
          {/* Step 1: Schedule Selection */}
          {currentStep === 0 && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {isEditingSchedule 
                    ? 'Change Your Schedule' 
                    : editingPackageId 
                      ? 'Add More Classes' 
                      : 'Select Your Schedule'
                  }
                </h2>
                <p className="text-xl text-muted">
                  {isEditingSchedule 
                    ? 'Choose a new date and time for your session' 
                    : editingPackageId
                      ? 'Add additional classes to your package'
                      : 'Choose your preferred date and time for your session'
                  }
                </p>
                {editingPackageId && !isEditingSchedule && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {(() => {
                        const currentItem = cartItems.find(item => item.id === editingPackageId);
                        if (currentItem) {
                          const currentBookings = currentItem.bookingDetails || [];
                          const packageSessions = currentItem.sessions || 0;
                          const remainingSessions = packageSessions - currentBookings.length;
                          return `Package: ${currentItem.name} | Sessions used: ${currentBookings.length}/${packageSessions} | Remaining: ${remainingSessions}`;
                        }
                        return '';
                      })()}
                    </p>
                  </div>
                )}
                {isEditingSchedule && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      You&apos;re editing the schedule for your package. Select a new time slot to update your booking.
                    </p>
                  </div>
                )}
              </div>
              
              <EnhancedSchedule
                onBookSlot={handleScheduleSelect}
                showBookingButton={false}
                className="max-w-full"
                startDate={startDate}
                endDate={endDate}
                onSlotsChange={onSlotsChange}
                existingBookings={existingBookings}
                maxBookingsPerSlot={maxBookingsPerSlot}
                reloadTrigger={reloadTrigger}
                showFilters={false}
                hasMultiplePackages={(cartItems?.filter(item => item.type === 'package').length || 0) > 1}
              />
              
              {/* Continue to Checkout button when adding more bookings */}
              {editingPackageId && !isEditingSchedule && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => {
                      // Store customer information in sessionStorage for checkout
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('customerInfo', JSON.stringify({
                          clientName: formData.clientName,
                          clientEmail: formData.clientEmail,
                          clientPhone: formData.clientPhone,
                          countryCode: formData.countryCode,
                          billingDocumentType: formData.billingDocumentType,
                          dni: formData.dni,
                          ruc: formData.ruc,
                          companyName: formData.companyName,
                          notes: formData.notes
                        }));
                      }
                      
                      // Redirect to checkout page
                      if (typeof window !== 'undefined') {
                        window.location.href = '/checkout';
                      }
                    }}
                    className="flex items-center gap-2 h-12 text-lg bg-primary hover:bg-primary/90"
                  >
                    Continue to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Group Booking Selection - Only show when multiple packages exist */}
          {currentStep === 1 && (() => {
            return shouldShowPackageModal();
          })() && (
            <motion.div
              key="groupBooking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Choose Booking Type</h2>
                <p className="text-xl text-muted">How would you like to book your classes?</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
                     onClick={() => setIsGroupBooking(true)}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isGroupBooking === true ? 'border-primary bg-primary' : 'border-gray-300'
                    }`}>
                      {isGroupBooking === true && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Booking</h3>
                      <p className="text-gray-600 mb-3">
                        Multiple people can attend the same class. Perfect for families, friends, or couples who want to practice together.
                      </p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• All packages can book the same schedule slot</li>
                        <li>• Everyone attends together in one class</li>
                        <li>• More flexible scheduling</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
                     onClick={() => {
                       console.log('🔍 Individual booking selected, checking for conflicts...');
                       setIsGroupBooking(false);
                       // Check for conflicts after state is set
                       setTimeout(() => {
                         console.log('🔍 Checking for duplicate schedules after individual booking selection');
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const duplicateCheck = checkForExistingDuplicateSchedules(cartContext as any);
                         console.log('🔍 Duplicate check result:', duplicateCheck);
                         if (duplicateCheck.hasDuplicates) {
                           console.log('🔍 Duplicates found, showing conflict resolution');
                           handleDuplicateScheduleConflict(duplicateCheck.conflictingBookings, setIsGroupBooking, setCurrentStep, onStepChange);
                         } else {
                           console.log('🔍 No duplicates found, proceeding to package selection');
                         }
                       }, 100);
                     }}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isGroupBooking === false ? 'border-primary bg-primary' : 'border-gray-300'
                    }`}>
                      {isGroupBooking === false && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Individual Booking</h3>
                      <p className="text-gray-600 mb-3">
                        Each package gets its own separate class. Perfect when you want different schedules for different people.
                      </p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Each package must book different schedule slots</li>
                        <li>• Separate classes for each person</li>
                        <li>• More personalized experience</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug section - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">Debug: Test Duplicate Detection</h4>
                  <div className="space-x-2">
                    <Button
                      onClick={() => {
                        console.log('🔍 Testing duplicate detection...');
                        console.log('🔍 Current cart items:', cartItems);
                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                         const testResult = checkForExistingDuplicateSchedules(cartContext as any);
                        console.log('🔍 Test result:', testResult);
                        toast.info(`Test result: ${testResult.hasDuplicates ? 'Duplicates found' : 'No duplicates'}`);
                      }}
                      className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800"
                    >
                      Test Duplicate Detection
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('🧪 Testing package modal...');
                        const shouldShow = shouldShowPackageModal();
                        console.log('🧪 Should show modal:', shouldShow);
                        console.log('🧪 Current cart items:', cartItems);
                        if (shouldShow) {
                          setShowPackageSelection(true);
                          setSelectedScheduleForPackage(null);
                          setFormData(prev => ({ ...prev, selectedSchedule: null }));
                          toast.info('Package modal should now be visible');
                        } else {
                          toast.error('No multiple packages detected');
                        }
                      }}
                      className="text-xs bg-green-200 hover:bg-green-300 text-green-800"
                    >
                      Test Package Modal
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('🧪 Testing schedule selection with mock slot...');
          const mockSlot = {
            id: 999,
                          date: '2025-09-15',
                          time: '09:00',
                          teacher: { id: 1, name: 'Test Teacher', experience: 5 },
                          serviceType: { id: 1, name: 'Yoga', duration: 60 },
                          venue: { id: 1, name: 'Studio' },
                          dayOfWeek: 'Monday',
                          isAvailable: true,
                          bookedCount: 0,
                          capacity: 10,
                          duration: 60
                        };
                        handleScheduleSelect(mockSlot);
                      }}
                      className="text-xs bg-blue-200 hover:bg-blue-300 text-blue-800 ml-2"
                    >
                      Test Schedule Selection
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => {
                    if (isGroupBooking !== null) {
                      console.log('🔍 Proceeding to package selection with booking type:', isGroupBooking ? 'Group' : 'Individual');
                      setCurrentStep(2);
                      onStepChange?.(2);
                    } else {
                      toast.error('Please select a booking type to continue.');
                    }
                  }}
                  className="px-8 py-3 text-lg"
                  disabled={isGroupBooking === null}
                >
                  Continue to Package Selection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}


          {/* Step 3: Package Selection */}
          {currentStep === 2 && (
            <motion.div
              key="packageSelection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Select Your Package</h2>
                <p className="text-xl text-muted">Choose the package that best fits your needs</p>
              </div>

              {packagesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-[var(--color-text-secondary)] text-lg">Loading packages...</p>
                </div>
              ) : packagesError ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                  <p className="text-red-600 text-lg mb-4">Error loading packages: {packagesError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => {
                    const cartItemsOfThisType = cartItems?.filter(item => item.sku === `PKG-${pkg.id}`) || [];
                    const isInCart = cartItemsOfThisType.length > 0;
                    const cartItem = cartItemsOfThisType[0]; // Use first instance for display purposes

                    return (
                      <Card key={pkg.id} className="card-base card-hover hover-scale relative">
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
                        <CardHeader className="text-center">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl text-primary">
                            {pkg.packageDefinition.name}
                          </CardTitle>
                          <div className="text-3xl font-bold text-black">
                            {pkg.currency.symbol}{pkg.price}
                          </div>
                          <div className="text-xs text-gray-600">
                            {pkg.currency.symbol}{pkg.pricePerClass?.toFixed(2) || (pkg.price / (pkg.packageDefinition.sessionsCount || 1)).toFixed(2)} per class
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted mb-4 text-center">
                            {pkg.packageDefinition.description}
                          </p>
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 mr-2 text-primary" />
                              <span className="text-lg font-semibold text-gray-700">{pkg.packageDefinition.sessionsCount} Sessions</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2 text-primary" />
                              <span className="text-muted">{pkg.packageDefinition.sessionDuration.duration_minutes === 60 ? '1 hour' : `${pkg.packageDefinition.sessionDuration.duration_minutes} minutes`} each</span>
                            </div>
                            {(pkg.packageDefinition.name?.includes('MATPASS') || pkg.packageDefinition.packageType === 'matpass') && (
                              <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 mr-2 text-primary" />
                                <span className="text-muted">Valid for 30 days</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <Star className="w-4 h-4 mr-2 text-primary" />
                              <span className="text-muted">Personalized guidance</span>
                            </div>
                          </div>
                          {isInCart ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(pkg.id.toString(), (cartItem?.quantity || 1) - 1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-semibold">{cartItem?.quantity || 0}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(pkg.id.toString(), (cartItem?.quantity || 0) + 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <Button
                                onClick={() => removeFromCart(pkg.id.toString())}
                                variant="destructive"
                                className="w-full"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove from Cart
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => {
                                if (addToCart) {
                                  // Create package with schedule information using formData.selectedSchedule
                                  // Always create new package item with unique ID (no merging)
                                  // This allows multiple packages of the same type to be treated separately
                                  const uniqueId = `${pkg.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                  const packageData = {
                                    id: uniqueId,
                                    name: pkg.packageDefinition.name,
                                    price: pkg.price,
                                    image: '/images/products/yoga-journal-1.jpg',
                                    sku: `PKG-${pkg.id}`,
                                    currency: pkg.currency?.code || 'S/.',
                                    type: 'package',
                                    sessions: pkg.packageDefinition.sessionsCount,
                                    duration: pkg.packageDefinition.sessionDuration?.duration_minutes,
                                    packageType: pkg.packageDefinition.packageType,
                                    maxGroupSize: pkg.packageDefinition.maxGroupSize,
                                    bookingDetails: formData.selectedSchedule ? [{
                                      selectedDate: formData.selectedSchedule.date,
                                      selectedTime: formData.selectedSchedule.time,
                                      teacher: formData.selectedSchedule.teacher?.name,
                                      dayOfWeek: formData.selectedSchedule.dayOfWeek,
                                      serviceType: formData.selectedSchedule.serviceType?.name,
                                      venue: formData.selectedSchedule.venue?.name,
                                      scheduleSlotId: formData.selectedSchedule.id
                                    }] : undefined
                                  };

                                  addToCart({...packageData, type: 'package' as const});
                                  
                                  // Show success message
                                  toast.success(`${pkg.packageDefinition.name} added to cart${formData.selectedSchedule ? ' with selected schedule' : ''}`);
                                  
                                  // Open cart to show both schedule and package
                                  if (setIsCartOpen) {
                                    setIsCartOpen();
                                  }
                                  
                                  // Go back to schedule page (Step 0) so user can add more packages
                                  setCurrentStep(0);
                                  onStepChange?.(0);
                                }
                              }}
                              variant="success"
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Continue to Checkout button */}
              {cartItems && cartItems.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => {
                      // Store customer information in sessionStorage for checkout
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('customerInfo', JSON.stringify({
                          clientName: formData.clientName,
                          clientEmail: formData.clientEmail,
                          clientPhone: formData.clientPhone,
                          countryCode: formData.countryCode,
                          billingDocumentType: formData.billingDocumentType,
                          dni: formData.dni,
                          ruc: formData.ruc,
                          companyName: formData.companyName,
                          notes: formData.notes
                        }));
                      }

                      // Redirect to checkout page
                      if (typeof window !== 'undefined') {
                        window.location.href = '/checkout';
                      }
                    }}
                    className="flex items-center gap-2 h-12 text-lg bg-primary hover:bg-primary/90"
                  >
                    Continue to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Package Selection Modal */}
      {showPackageSelection && selectedScheduleForPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[9999]" style={{ top: 0, left: 0, right: 0, bottom: 0, paddingTop: '10vh' }}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Package for Booking</h3>
              <div className="text-sm text-gray-500">
                {selectedScheduleForPackage.date} at {selectedScheduleForPackage.time}
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {cartItems
                .filter(item => item.type === 'package')
                .map((pkg) => {
                  const scheduled = pkg.bookingDetails?.length || 0;
                  const total = pkg.sessions || 1;
                  const isAtMax = scheduled >= total;
                  
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        if (isAtMax) {
                          toast.error('This package has reached its maximum number of sessions. Please select a different package.');
                          return;
                        }
                        
                        // Check for duplicate booking
                        const hasAlreadyBookedThisSlot = pkg.bookingDetails?.some(booking => 
                          booking.selectedDate === selectedScheduleForPackage.date && 
                          booking.selectedTime === selectedScheduleForPackage.time
                        );
                        
                        if (hasAlreadyBookedThisSlot) {
                          toast.error('This package has already booked this time slot. Please select a different package.');
                          return;
                        }
                        
                        // Add booking to package
                        const newBookingDetails = {
                          selectedDate: selectedScheduleForPackage.date,
                          selectedTime: selectedScheduleForPackage.time,
                          teacher: selectedScheduleForPackage.teacher?.name || 'TBA',
                          serviceType: selectedScheduleForPackage.serviceType?.name || 'Class',
                          venue: selectedScheduleForPackage.venue?.name || 'Studio',
                          dayOfWeek: selectedScheduleForPackage.dayOfWeek,
                          scheduleSlotId: selectedScheduleForPackage.id
                        };
                        
                        cartContext.addBookingToPackage(pkg.id, newBookingDetails);
                        setIsCartOpen();
                        toast.success(`Added session to ${pkg.name}`);
                        
                        // Close modal
                        setShowPackageSelection(false);
                        setSelectedScheduleForPackage(null);
                      }}
                      disabled={isAtMax}
                      className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                        isAtMax 
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                          : 'border-gray-200 hover:border-green-500 hover:bg-green-50 group'
                      }`}
                      title={isAtMax ? 'Package has reached maximum sessions' : `Select ${pkg.name} for this booking`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className={`font-medium ${isAtMax ? 'text-gray-400' : 'text-gray-900 group-hover:text-green-800'}`}>
                            {pkg.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {scheduled}/{total} sessions booked
                          </p>
                        </div>
                        <div className="text-right">
                          {isAtMax ? (
                            <span className="text-xs text-red-600 font-medium">Max Reached</span>
                          ) : (
                            <span className="text-xs text-green-600 font-medium">Available</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPackageSelection(false);
                  setSelectedScheduleForPackage(null);
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