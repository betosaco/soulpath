'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Package,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedSchedule } from './EnhancedSchedule';
import { usePackages, PackagePrice } from '@/hooks/usePackages';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';
import { useCart } from '@/lib/cart-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { countries } from '@/lib/countries';
import { validateEmailWithMessage } from '@/lib/email-validation';
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

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ScheduleBookingFlowProps {
  startDate?: Date;
  endDate?: Date;
  onSlotsChange?: (slots: ScheduleSlot[]) => void;
  onStepChange?: (step: number) => void;
}

// Helper function to check for duplicate schedule bookings across different package types
const checkForDuplicateScheduleAcrossPackages = (selectedSchedule: ScheduleSlot, currentPackageId: string, cartItems: any[]) => {
  const packageItems = cartItems.filter(item => item.type === 'package' && item.id !== currentPackageId);
  
  for (const packageItem of packageItems) {
    const currentBookings = Array.isArray(packageItem.bookingDetails) ? packageItem.bookingDetails : [];
    const hasSameSchedule = currentBookings.some((booking: any) => 
      booking.selectedDate === selectedSchedule.date && 
      booking.selectedTime === selectedSchedule.time
    );
    
    if (hasSameSchedule) {
      return {
        hasDuplicate: true,
        conflictingPackage: packageItem
      };
    }
  }
  
  return { hasDuplicate: false, conflictingPackage: null };
};

// Helper function to check for existing duplicate schedules across all packages
const checkForExistingDuplicateSchedules = (cartContext?: any) => {
  console.log('🔍 checkForExistingDuplicateSchedules called');
  
  if (typeof window === 'undefined') {
    console.log('🔍 Window undefined, returning no duplicates');
    return { hasDuplicates: false, conflictingBookings: [] };
  }
  
  let cartItems: any[] = [];
  
  // Try to get cart items from context first, then localStorage
  if (cartContext?.cartItems) {
    console.log('🔍 Using cart context items:', cartContext.cartItems);
    cartItems = cartContext.cartItems;
  } else {
    // Fallback to localStorage
    const savedCart = localStorage.getItem('cart');
    console.log('🔍 Saved cart from localStorage:', savedCart);
    
    if (!savedCart) {
      console.log('🔍 No saved cart, returning no duplicates');
      return { hasDuplicates: false, conflictingBookings: [] };
    }
    
    try {
      cartItems = JSON.parse(savedCart);
      console.log('🔍 Parsed cart items from localStorage:', cartItems);
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return { hasDuplicates: false, conflictingBookings: [] };
    }
  }
  
  try {
    
    const packageItems = cartItems.filter((item: any) => item.type === 'package');
    console.log('🔍 Package items:', packageItems);
    
    // Collect all bookings from all packages
    const allBookings: any[] = [];
    packageItems.forEach((packageItem: any) => {
      console.log('🔍 Processing package:', packageItem.name, 'bookings:', packageItem.bookingDetails);
      if (packageItem.bookingDetails && Array.isArray(packageItem.bookingDetails)) {
        packageItem.bookingDetails.forEach((booking: any) => {
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
    
    // Group bookings by date and time
    const scheduleGroups: { [key: string]: any[] } = {};
    allBookings.forEach(booking => {
      const key = `${booking.selectedDate}-${booking.selectedTime}`;
      console.log('🔍 Grouping booking:', booking, 'with key:', key);
      if (!scheduleGroups[key]) {
        scheduleGroups[key] = [];
      }
      scheduleGroups[key].push(booking);
    });
    
    console.log('🔍 Schedule groups:', scheduleGroups);
    console.log('🔍 Schedule group keys:', Object.keys(scheduleGroups));
    console.log('🔍 Schedule group sizes:', Object.entries(scheduleGroups).map(([key, group]) => ({ key, size: group.length })));
    
    // Find groups with more than one booking (duplicates)
    const duplicateGroups = Object.values(scheduleGroups).filter(group => group.length > 1);
    console.log('🔍 Duplicate groups found:', duplicateGroups);
    console.log('🔍 Number of duplicate groups:', duplicateGroups.length);
    
    if (duplicateGroups.length > 0) {
      console.log('🔍 Returning duplicates:', duplicateGroups.flat());
      return {
        hasDuplicates: true,
        conflictingBookings: duplicateGroups.flat()
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
const handleDuplicateScheduleConflict = (conflictingBookings: any[], setIsGroupBooking?: (value: boolean) => void, setCurrentStep?: (step: number) => void, onStepChange?: (step: number) => void) => {
  if (conflictingBookings.length === 0) return;
  
  // Group conflicting bookings by schedule time
  const scheduleGroups: { [key: string]: any[] } = {};
  conflictingBookings.forEach(booking => {
    const key = `${booking.selectedDate}-${booking.selectedTime}`;
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

// Helper function to handle duplicate schedule conflict for package selection
const handlePackageDuplicateScheduleConflict = (conflictingPackage: any, selectedSchedule: ScheduleSlot) => {
  const packageName = conflictingPackage.name;
  const scheduleTime = `${selectedSchedule.date} at ${selectedSchedule.time}`;
  
  // Show warning message instead of dialog
  toast.warning(
    `You already have a booking for ${scheduleTime} with ${packageName}. ` +
    `Please select a different schedule slot to avoid conflicts.`,
    {
      duration: 5000,
      action: {
        label: 'Change Schedule',
        onClick: () => {
          // Set up editing mode for the conflicting package
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('isEditingSchedule', 'true');
            sessionStorage.setItem('editingPackageId', conflictingPackage.id);
            // Find the booking index for this schedule
            const bookingIndex = conflictingPackage.bookingDetails?.findIndex((booking: any) => 
              booking.selectedDate === selectedSchedule.date && 
              booking.selectedTime === selectedSchedule.time
            );
            if (bookingIndex !== undefined && bookingIndex >= 0) {
              sessionStorage.setItem('editingBookingIndex', bookingIndex.toString());
            }
          }
          
          // Navigate to schedule page for editing
          if (typeof window !== 'undefined') {
            window.location.href = '/schedule';
          }
        }
      }
    }
  );
};

export function ScheduleBookingFlow({ 
  startDate, 
  endDate, 
  onSlotsChange,
  onStepChange
}: ScheduleBookingFlowProps = {}) {
  const { packages, loading: packagesLoading, error: packagesError } = usePackages('PEN');
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;
  const setIsCartOpen = cartContext?.setIsCartOpen;
  
  const [currentStep, setCurrentStep] = useState(0);
  
  // Check if we're in editing mode
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  
  // State for package selection when multiple packages exist
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const [selectedScheduleForPackage, setSelectedScheduleForPackage] = useState<ScheduleSlot | null>(null);
  const [isGroupBooking, setIsGroupBooking] = useState<boolean | null>(null); // null = not decided, true = group, false = individual
  
  // Debug modal state changes
  React.useEffect(() => {
    console.log('🔍 Modal state changed - showPackageSelection:', showPackageSelection, 'selectedScheduleForPackage:', selectedScheduleForPackage?.id);
  }, [showPackageSelection, selectedScheduleForPackage]);

  // Auto-redirect from group booking step if no multiple packages
  React.useEffect(() => {
    if (currentStep === 1) {
      const currentCartItems = cartContext?.cartItems || [];
      const currentPackageItems = currentCartItems.filter(item => item.type === 'package');
      
      if (currentPackageItems.length <= 1) {
        console.log('🔍 No multiple packages detected, redirecting to package selection');
        setCurrentStep(2);
        onStepChange?.(2);
      }
    }
  }, [currentStep, cartContext?.cartItems, onStepChange]);
  
  // Country dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  
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
    const allExistingBookings = cartContext?.cartItems
      .filter(item => item.type === 'package' && item.bookingDetails)
      .flatMap(item => item.bookingDetails || []) || [];
    
    const bookings = allExistingBookings
      .filter(booking => booking.selectedDate && booking.selectedTime)
      .map(booking => ({
        selectedDate: booking.selectedDate!,
        selectedTime: booking.selectedTime!
    }));
    
    return bookings;
  }, [cartContext?.cartItems]);

  // Calculate max bookings per slot - this will update when cart changes
  // Now allows multiple bookings of the same slot based on package quantities
  const maxBookingsPerSlot = useMemo(() => {
    const packageItems = cartContext?.cartItems.filter(item => item.type === 'package') || [];
    const total = packageItems.reduce((total, item) => total + (item.quantity || 1), 0);
    console.log('🔍 maxBookingsPerSlot calculated:', total, 'from packages:', packageItems.map(p => ({ name: p.name, quantity: p.quantity })));
    return total;
  }, [cartContext?.cartItems]);

  // Create a reload trigger that updates when cart items change
  const reloadTrigger = useMemo(() => {
    if (!cartContext?.cartItems) return 0;
    return cartContext.cartItems.length + cartContext.cartItems.reduce((sum, item) => {
      return sum + (item.quantity || 1) + (item.bookingDetails?.length || 0);
    }, 0);
  }, [cartContext?.cartItems]);

  // Get selected country
  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

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
      console.log('🔍 ScheduleBookingFlow mount - cartItems:', cartContext?.cartItems?.length || 0);
      
      if (isEditing && packageId) {
        console.log('✅ Setting editing mode for package:', packageId);
        setIsEditingSchedule(true);
        setEditingPackageId(packageId);
        // Clear the editing flags
        sessionStorage.removeItem('isEditingSchedule');
        sessionStorage.removeItem('editingPackageId');
      } else if (isAddingMore) {
        // Check if there are multiple packages
        const packageItems = cartContext?.cartItems?.filter(item => item.type === 'package') || [];
        console.log('🔍 Adding more mode - package count:', packageItems.length);
        
        if (packageItems.length > 1) {
          // Multiple packages - don't set editing mode, let modal handle it
          console.log('✅ Multiple packages detected - clearing session storage for modal');
          sessionStorage.removeItem('isAddingMoreBookings');
          sessionStorage.removeItem('addingToPackageId');
          setEditingPackageId(null);
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
  }, []);

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
    
    const cartItems = cartContext.cartItems || [];
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
      }
    }
  }, [cartContext?.cartItems, editingPackageId]);

  // Alternative approach: Monitor cart changes with a different method
  React.useEffect(() => {
    if (!cartContext) return;
    
    const checkCartChanges = () => {
      const cartItems = cartContext.cartItems || [];
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
  }, [cartContext, editingPackageId]);

  // ============================================================================
  // PACKAGE MODAL HANDLING - ONLY SHOW WHEN NEEDED
  // ============================================================================
  
  // Simple function to check if modal should be shown
  const shouldShowPackageModal = useCallback(() => {
    if (!cartContext?.cartItems) return false;
    
    const packageItems = cartContext.cartItems.filter(item => item.type === 'package');
    const totalPackageQuantity = packageItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Show modal if: multiple package items OR single package with quantity > 1
    return packageItems.length > 1 || totalPackageQuantity > 1;
  }, [cartContext?.cartItems]);

  // Function to trigger modal when user tries to book a schedule
  const triggerPackageModalIfNeeded = useCallback((slot: any) => {
    const shouldShow = shouldShowPackageModal();
    console.log('🔍 Checking if modal should show:', shouldShow);
    console.log('🔍 Current cart items:', cartContext?.cartItems);
    
    if (shouldShow) {
      console.log('🔍 Multiple packages detected, showing package selection modal');
      setSelectedScheduleForPackage(slot);
      setShowPackageSelection(true);
      return true; // Modal was shown
    }
    return false; // No modal needed
  }, [shouldShowPackageModal, cartContext?.cartItems]);


  // Helper function to safely access nested translation properties
  const getTranslation = useCallback((path: string, fallback: string = ''): string => {
    const keys = path.split('.');
    let current: Record<string, unknown> = (t && typeof t === 'object') ? t as Record<string, unknown> : {};

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key] as Record<string, unknown>;
      } else {
        return fallback;
      }
    }

    return typeof current === 'string' ? current : fallback;
  }, [t]);

  const steps: BookingStep[] = React.useMemo(() => [
    { id: 'schedule', title: getTranslation('bookingFlow.selectSchedule', 'Select Schedule'), description: getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time'), completed: false },
    { id: 'groupBooking', title: 'Booking Type', description: 'Choose between group or individual booking', completed: false },
    { id: 'package', title: getTranslation('bookingFlow.selectPackage', 'Select Package'), description: getTranslation('bookingFlow.selectPackageDesc', 'Choose the package that best fits your needs'), completed: false },
    { id: 'customer', title: 'Customer Information', description: 'Provide your contact and billing details', completed: false }
  ], [getTranslation]);


  const handleScheduleSelect = (slot: ScheduleSlot) => {
    console.log('🎯 SCHEDULE SELECTED:', slot);
    console.log('🎯 Current editingPackageId:', editingPackageId);
    console.log('🎯 Current showPackageSelection:', showPackageSelection);
    console.log('🎯 Current selectedScheduleForPackage:', selectedScheduleForPackage?.id);
    console.log('🎯 All cart items:', JSON.stringify(cartContext?.cartItems, null, 2));
    console.log('🎯 Package count:', cartContext?.cartItems?.filter(item => item.type === 'package').length || 0);
    
    setFormData(prev => ({ ...prev, selectedSchedule: slot }));
    
    // First check if we should show modal for multiple packages (before checking editing mode)
    const allPackageItems = cartContext?.cartItems?.filter(item => item.type === 'package') || [];
    const totalPackageQuantity = allPackageItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const shouldShowModal = allPackageItems.length > 1 || totalPackageQuantity > 1;
    
    if (shouldShowModal) {
      console.log('🎯 Multiple packages detected, showing package selection modal');
      // Clear editing mode when showing modal for multiple packages
      setEditingPackageId(null);
      setSelectedScheduleForPackage(slot);
      setShowPackageSelection(true);
      return;
    }
    
    // If we're in editing mode or adding more bookings, update the cart item
    if (editingPackageId) {
      console.log('🎯 ENTERING EDITING MODE - editingPackageId:', editingPackageId);
      const cartItems = cartContext?.cartItems || [];
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
          cartContext.removeFromCart(editingPackageId);
          cartContext.addToCart(updatedItem);
          
          // Open sidecart to show updated booking
          if (cartContext?.setIsCartOpen) {
            cartContext.setIsCartOpen(true);
          }
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
          if (cartContext?.setIsCartOpen) {
            cartContext.setIsCartOpen(true);
          }
          
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
          venue: slot.venue
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
          if (cartContext?.setIsCartOpen) {
            cartContext.setIsCartOpen(true);
          }
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
    const cartItems = cartContext?.cartItems || [];
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
        cartContext.setIsCartOpen(true);
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
        cartContext.setIsCartOpen(true);
        toast.success('Class added to your package!');
        return;
      }
    }
    
    // Check if we should show modal or use single package directly
    const modalShown = triggerPackageModalIfNeeded(slot);
    
    if (!modalShown) {
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

      // Check if we haven't reached the package quantity limit
      const currentBookings = Array.isArray(singlePackage.bookingDetails) ? singlePackage.bookingDetails : [];
      // Use both quantity (sessions count) and sessions field for validation
      const packageQuantity = singlePackage.quantity || singlePackage.sessions || 1;
      
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

      // Add booking to the single package
      cartContext.addBookingToPackage(singlePackage.id, newBookingDetails);
      cartContext.setIsCartOpen(true);
      toast.success('Class added to your package!');
      return;
    }
    // If modal was shown, the function will return early and modal will handle the booking
    return;
    
    // Normal flow - check if we need group booking step
    const allCartItems = cartContext?.cartItems || [];
    const normalFlowPackageItems = allCartItems.filter(item => item.type === 'package');
    
    if (normalFlowPackageItems.length > 1) {
      // Multiple packages - go to group booking selection
    setCurrentStep(1);
    onStepChange?.(1);
      toast.success('Schedule selected! Now choose your booking type.');
    } else {
      // Single package or no packages - skip to package selection
      setCurrentStep(2);
      onStepChange?.(2);
    toast.success('Schedule selected! Now choose your package.');
    }
  };

  const handlePackageSelectionForBooking = (packageId: string) => {
    if (!cartContext) return;
    
    const cartItems = cartContext.cartItems || [];
    const selectedPackage = cartItems.find(item => item.id === packageId);
    
    console.log('🔍 Package selection for booking:');
    console.log('🔍 - Selected package ID:', packageId);
    console.log('🔍 - Selected package:', selectedPackage);
    console.log('🔍 - Selected schedule:', selectedScheduleForPackage);
    console.log('🔍 - All cart items:', cartItems.map(item => ({ id: item.id, name: item.name, bookings: item.bookingDetails?.length || 0 })));
    
    if (!selectedPackage) return;
    
    // If no schedule is selected yet, just set the editing package and close modal
    if (!selectedScheduleForPackage) {
      console.log('🔍 No schedule selected yet, setting editing package and closing modal');
      setEditingPackageId(packageId);
      setShowPackageSelection(false);
      toast.info('Package selected! Now choose a schedule slot.');
      return;
    }
    
    const newBookingDetails = {
      selectedDate: selectedScheduleForPackage.date,
      selectedTime: selectedScheduleForPackage.time,
      teacher: selectedScheduleForPackage.teacher?.name,
      dayOfWeek: selectedScheduleForPackage.dayOfWeek,
      serviceType: selectedScheduleForPackage.serviceType?.name,
      venue: selectedScheduleForPackage.venue?.name,
      scheduleSlotId: selectedScheduleForPackage.id
    };
    
    // Check if we haven't reached the package quantity limit
    const currentBookings = Array.isArray(selectedPackage.bookingDetails) ? selectedPackage.bookingDetails : [];
    // Use both quantity (sessions count) and sessions field for validation
    const packageQuantity = selectedPackage.quantity || selectedPackage.sessions || 1;
    
    if (currentBookings.length >= packageQuantity) {
      toast.error(`You've reached the maximum number of classes for this package (${packageQuantity}).`);
      return;
    }

    // Check if this specific package has already booked this specific slot
    // This prevents the same package from booking the same slot twice
    const hasAlreadyBookedThisSlot = currentBookings.some(booking => 
      booking.selectedDate === selectedScheduleForPackage.date && 
      booking.selectedTime === selectedScheduleForPackage.time
    );
    
    console.log('🔍 Slot validation:');
    console.log('🔍 - Package current bookings:', currentBookings.length);
    console.log('🔍 - Slot to book:', selectedScheduleForPackage.date, selectedScheduleForPackage.time);
    console.log('🔍 - Has already booked this slot:', hasAlreadyBookedThisSlot);
    console.log('🔍 - Existing bookings for this slot:', currentBookings.filter(booking => 
      booking.selectedDate === selectedScheduleForPackage.date && 
      booking.selectedTime === selectedScheduleForPackage.time
    ));
    
    if (hasAlreadyBookedThisSlot) {
      toast.error('This package has already booked this time slot. Please select a different slot or package.');
      return;
    }

    // Check for duplicate schedule bookings across different package types only when user has declared it's not a group booking
    if (isGroupBooking === false) {
      const duplicateScheduleCheck = checkForDuplicateScheduleAcrossPackages(selectedScheduleForPackage, packageId, cartItems);
      if (duplicateScheduleCheck.hasDuplicate) {
        handlePackageDuplicateScheduleConflict(duplicateScheduleCheck.conflictingPackage, selectedScheduleForPackage);
        return;
      }
    }

    // Per-package validation is now handled above
    console.log('🔍 Modal package validation passed - adding booking to package');
    
    // Add booking to selected package
    cartContext.addBookingToPackage(packageId, newBookingDetails);
    
    // Open sidecart to show updated bookings
    if (cartContext.setIsCartOpen) {
      cartContext.setIsCartOpen(true);
    }
    
    // Close package selection modal
    console.log('🔍 Closing package selection modal and resetting state');
    setShowPackageSelection(false);
    setSelectedScheduleForPackage(null);
    
    // Add a small delay to ensure state is properly reset
    setTimeout(() => {
      console.log('🔍 Modal state reset completed');
    }, 100);
    
    toast.success('Class added to package! You can select more classes or continue to checkout.');
  };

  const handlePackageSelect = (pkg: PackagePrice) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg }));
    
    // No duplicate validation needed here - multiple packages can book the same slot
    // Individual package validation happens in handlePackageSelectionForBooking
    
    // Add package to cart
    if (addToCart) {
      addToCart({
        id: pkg.id.toString(),
        name: pkg.packageDefinition.name,
        price: pkg.price,
        image: '/images/products/yoga-journal-1.jpg', // Default package image
        sku: `PKG-${pkg.id}`,
        currency: pkg.currency?.code || 'PEN',
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
      });
    } else {
      console.error('addToCart function is not available');
    }
    
    // Store schedule selection in sessionStorage for checkout
    if (formData.selectedSchedule && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('selectedSchedule', JSON.stringify({
          selectedDate: formData.selectedSchedule.date,
          selectedTime: formData.selectedSchedule.time,
          teacher: formData.selectedSchedule.teacher,
          dayOfWeek: formData.selectedSchedule.dayOfWeek,
          serviceType: formData.selectedSchedule.serviceType,
          venue: formData.selectedSchedule.venue
        }));
      } catch (error) {
        console.error('Failed to store schedule in sessionStorage:', error);
      }
    }
    
    // Keep cart open
    if (setIsCartOpen) {
      setIsCartOpen(true);
    }
    
    // Check if there's only one package in cart - if so, stay on schedule step
    const shouldShowModal = shouldShowPackageModal();
    
    if (!shouldShowModal) {
      // Single package with quantity 1 - stay on schedule step for class selection
      setCurrentStep(0);
      onStepChange?.(0);
      toast.success('Package selected! Now choose your class schedule.');
    } else {
      // Multiple packages - go to customer information step
      setCurrentStep(3);
      onStepChange?.(3);
      toast.success('Package selected! Please provide your information.');
    }
  };





  return (
    <div className="min-h-screen bg-white">
      {/* Progress Steps */}
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto max-w-full">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                    currentStep >= index 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-400 text-gray-400'
                  }`}>
                    {currentStep > index ? (
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                    ) : (
                      <span className="font-semibold text-xs sm:text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-2 sm:ml-3 hidden sm:block">
                    <p className={`font-semibold text-sm ${
                      currentStep >= index ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400 mx-1 sm:mx-2 md:mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container mx-auto px-4 py-8 mobile-step-container">
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
                        const cartItems = cartContext?.cartItems || [];
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
                      You're editing the schedule for your package. Select a new time slot to update your booking.
                    </p>
                  </div>
                )}
                {editingPackageId && !isEditingSchedule && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      You're adding more classes to your package. Select additional time slots to book more sessions.
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
                         const duplicateCheck = checkForExistingDuplicateSchedules(cartContext);
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
                        console.log('🔍 Current cart items:', cartContext?.cartItems);
                        const testResult = checkForExistingDuplicateSchedules(cartContext);
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
                        console.log('🧪 Current cart items:', cartContext?.cartItems);
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
              key="package"
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Loading packages...</p>
                </div>
              ) : packagesError ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                  <p className="text-red-600 text-lg mb-4">Error loading packages: {packagesError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid-responsive">
                  {packages.map((pkg) => (
                    <Card key={pkg.id} className="card-base card-hover hover-scale">
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
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted mb-6 text-center">
                          {pkg.packageDefinition.description}
                        </p>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-muted">{pkg.packageDefinition.sessionsCount} Sessions</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-muted">{pkg.packageDefinition.sessionDuration.duration_minutes} minutes each</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-muted">Valid for 30 days</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-muted">Personalized guidance</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePackageSelect(pkg)}
                          className="w-full bg-[#6ea058] hover:bg-[#5a8a47] text-white"
                        >
                          {getTranslation('bookingFlow.selectPackage', 'Select Package')}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    onStepChange?.(0);
                  }}
                  className="px-8 py-4 text-lg font-medium text-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#6ea058] hover:text-white transition-all duration-200 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 text-[#6ea058]" />
                  {getTranslation('bookingFlow.backToSchedule', 'Back to Schedule')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Customer Information */}
          {currentStep === 3 && (
            <motion.div
              key="customer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto mobile-step-content mobile-form-container"
            >
              <Card className="card-base">
                <CardHeader>
                  <CardTitle 
                    className="text-2xl text-primary text-center"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile-input-group">
                    <div>
                      <Label htmlFor="clientName" className="text-black text-lg font-medium mb-2 block">Full Name *</Label>
                      <Input
                        id="clientName"
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail" className="text-black text-lg font-medium mb-2 block">Email Address *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="clientPhone" className="text-black text-lg font-medium mb-2 block">Phone Number *</Label>
                      <div className="flex gap-2 mobile-input-group">
                        {/* Country Code Dropdown */}
                        <div className="relative country-dropdown mobile-country-dropdown">
                          <button
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className="h-14 w-36 px-3 flex items-center space-x-2 border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mobile-touch-target rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            <span className="text-lg">{selectedCountry.flag}</span>
                            <span className="text-sm text-gray-700 font-medium">{selectedCountry.code}</span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Country Dropdown Menu */}
                          {isCountryDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 bg-black bg-opacity-20 z-40 animate-[fadeIn_0.2s_ease-out_forwards]"
                                onClick={() => {
                                  setIsCountryDropdownOpen(false);
                                  setCountrySearchTerm('');
                                }}
                              />
                              
                              <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform translate-x-full animate-[slideInRight_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] flex flex-col">
                                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                                  <h3 className="text-lg font-semibold text-gray-900">Select Country</h3>
                                  <button
                                    onClick={() => {
                                      setIsCountryDropdownOpen(false);
                                      setCountrySearchTerm('');
                                    }}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-150"
                                  >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                
                                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                                  <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                      type="text"
                                      placeholder="Search countries..."
                                      value={countrySearchTerm}
                                      onChange={(e) => setCountrySearchTerm(e.target.value)}
                                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto overscroll-contain country-menu-scroll">
                                  {countries
                                    .filter(country => 
                                      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                                      country.code.includes(countrySearchTerm)
                                    )
                                    .map((country, index) => (
                                      <button
                                        key={`${country.code}-${country.country}`}
                                        type="button"
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, countryCode: country.code }));
                                          setIsCountryDropdownOpen(false);
                                          setCountrySearchTerm('');
                                        }}
                                        className={`w-full px-4 py-4 text-left hover:bg-gray-50 flex items-center space-x-4 transition-all duration-200 border-b border-gray-100 hover:translate-x-1 hover:shadow-sm animate-[slideInFromRight_0.3s_ease-out_forwards] ${
                                          selectedCountry.code === country.code ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-700'
                                        }`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                      >
                                        <span className="text-2xl">{country.flag}</span>
                                        <div className="flex-1">
                                          <div className="text-base font-medium">{country.name}</div>
                                          <div className="text-sm text-gray-500">{country.code}</div>
                                        </div>
                                        {selectedCountry.code === country.code && (
                                          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </button>
                                    ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Phone Number Input */}
                        <Input
                          id="clientPhone"
                          type="tel"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                          className="flex-1 h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                          placeholder="999 999 999"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep(1);
                        onStepChange?.(1);
                      }}
                      className="flex items-center gap-2 h-12 text-lg"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Packages
                    </Button>
                    <Button
                      onClick={() => {
                        // Validate required fields
                        if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
                          toast.error('Please fill in all required fields');
                          return;
                        }

                        // Validate email
                        const emailError = validateEmailWithMessage(formData.clientEmail);
                        if (emailError) {
                          toast.error(emailError);
                          return;
                        }

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
                </CardContent>
              </Card>
            </motion.div>
          )}


        </AnimatePresence>
      </div>

      {/* Package Selection Modal */}
      {showPackageSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Package for Booking
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {selectedScheduleForPackage ? 
                  `You have packages with available slots. Which package would you like to add this class (${selectedScheduleForPackage.date} at ${selectedScheduleForPackage.time}) to?` :
                  'You have packages in your cart. Select which package you want to use for booking a class.'
                }
              </p>
              
              
              <div className="space-y-3">
                {(() => {
                  // Show all packages - individual capacity validation happens on selection
                  const allPackages = cartContext?.cartItems
                    .filter(item => item.type === 'package') || [];
                  
                  if (allPackages.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No packages available for booking.</p>
                      </div>
                    );
                  }
                  
                  return allPackages.map((packageItem) => {
                    const currentBookings = Array.isArray(packageItem.bookingDetails) ? packageItem.bookingDetails : [];
                    // Use quantity field for validation (this is what gets updated in cart)
                    const packageQuantity = packageItem.quantity || packageItem.sessions || 1;
                    
                    // Check if package has capacity
                    const hasCapacity = currentBookings.length < packageQuantity;
                    
                    // If no schedule is selected yet, allow selection (user will select schedule after choosing package)
                    const canBookThisSlot = hasCapacity;
                    
                    console.log(`🔍 Modal - Package ${packageItem.name}:`, {
                      id: packageItem.id,
                      quantity: packageQuantity,
                      currentBookings: currentBookings.length,
                      hasCapacity,
                      canBookThisSlot,
                      selectedSchedule: selectedScheduleForPackage ? `${selectedScheduleForPackage.date} ${selectedScheduleForPackage.time}` : 'None selected'
                    });
                    
                    return (
                    <button
                      key={packageItem.id}
                      onClick={() => handlePackageSelectionForBooking(packageItem.id)}
                      className={`w-full p-4 border rounded-lg transition-colors text-left ${
                        canBookThisSlot 
                          ? 'border-gray-200 hover:border-primary hover:bg-primary/5' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-not-allowed opacity-75'
                      }`}
                      disabled={!canBookThisSlot}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{packageItem.name}</h4>
                          <p className="text-sm text-gray-600">
                            {packageItem.sessions || packageItem.quantity || 1} sessions • {packageItem.duration} min each
                          </p>
                            <p className="text-xs text-gray-500 mt-1">
                            {packageItem.bookingDetails?.length || 0} / {packageItem.quantity || packageItem.sessions || 1} classes booked
                            {canBookThisSlot ? (
                              <span className="text-green-600 font-medium"> • Available</span>
                            ) : (
                              <span className="text-red-500 font-medium"> • Full</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: packageItem.currency
                            }).format(packageItem.price)}
                          </p>
                        </div>
                      </div>
                    </button>
                    );
                  });
                })()}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    console.log('🔍 Cancel button clicked - closing modal and resetting state');
                    setShowPackageSelection(false);
                    setSelectedScheduleForPackage(null);
                    
                    // Add a small delay to ensure state is properly reset
                    setTimeout(() => {
                      console.log('🔍 Modal cancel state reset completed');
                    }, 100);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
