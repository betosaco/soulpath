'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ShoppingCart,
  Package,
  Truck,
  User,
  Calendar,
  MapPin,
  Clock as ClockIcon,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';
import { validateEmailWithMessage } from '@/lib/email-validation';
import { AppLayout } from '@/components/AppLayout';
import { countries } from '@/lib/countries';
import { CartBookingDetails } from '@/components/CartBookingDetails';
import { useCart, CartItem } from '@/lib/cart-context';
import { EnhancedSchedule } from './EnhancedSchedule';

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

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
}

interface UnifiedCheckoutFlowProps {
  onCheckoutComplete?: (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: CartItem[];
  }) => void;
}


// Stripe will be initialized in the component

function UnifiedCheckoutFlowContent({
  onCheckoutComplete
}: UnifiedCheckoutFlowProps) {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const cartContext = useCart();
  
  // Safety checks to prevent undefined errors
  if (!cartContext) {
    return <div>Loading...</div>;
  }
  
  const { cartItems, requiresAddress, clearCart, addToCart, updateQuantity, removeFromCart } = cartContext;
  const [currentStep, setCurrentStep] = useState(0);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isEditingCustomerInfo, setIsEditingCustomerInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingBillingDocument, setIsEditingBillingDocument] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  
  // State for conflict resolution
  const [showConflictResolution, setShowConflictResolution] = useState(false);
  const [conflictingBookings, setConflictingBookings] = useState<any[]>([]);
  const [originalConflictingBookings, setOriginalConflictingBookings] = useState<any[]>([]);
  
  // Currency configuration
  const currencyCode = 'PEN'; // Default to Peruvian Soles
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    countryCode: '+51', // Default to Peru
    // Address fields
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Peru',
    // Billing document fields
    billingDocumentType: 'boleta_simple', // Default to boleta simple
    dni: '',
    ruc: '',
    companyName: '',
    // Additional fields
    notes: '',
    editingMemberId: ''
  });

  // Schedule data from enhanced packages flow
  const [scheduleData, setScheduleData] = useState<ScheduleSlot | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<any>(null);
  
  // Group booking state
  const [isGroupBooking, setIsGroupBooking] = useState<boolean | null>(null);
  const [groupMembers, setGroupMembers] = useState<Array<{
    id: string;
    packageId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
  }>>([]);

  // Load schedule and package data from sessionStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSchedule = sessionStorage.getItem('selectedSchedule');
      const isDirectCheckoutFlag = sessionStorage.getItem('isDirectCheckout') === 'true';
      
      // Set direct checkout flag
      setIsDirectCheckout(isDirectCheckoutFlag);
      
      if (savedSchedule) {
        try {
          setScheduleData(JSON.parse(savedSchedule));
        } catch (error) {
          console.error('Error parsing schedule data:', error);
        }
      }
      
      const savedPackage = sessionStorage.getItem('selectedPackageForBooking');
      if (savedPackage) {
        try {
          setSelectedPackageForBooking(JSON.parse(savedPackage));
        } catch (error) {
          console.error('Error parsing package data:', error);
        }
      }
      
      // Determine the correct starting step based on cart contents and saved data
      const packageCount = cartItems.filter(item => item.type === 'package').length;
      
      if (isDirectCheckoutFlag) {
        // Direct checkout: always go to personal info step
        setCurrentStep(2);
      } else if (savedSchedule) {
        // If we have schedule data from packages flow, determine the correct starting step
        if (packageCount > 1 && !savedPackage) {
          // Multiple packages but no package selected: go to package selection step
          setCurrentStep(1);
        } else {
          // Single package or package already selected: go to personal info step
          setCurrentStep(2);
        }
      } else if (packageCount > 0) {
        // If there are packages but no schedule data, start with schedule selection
        setCurrentStep(0);
      } else {
        // No packages, start with personal info step
        setCurrentStep(2);
      }
      
      // Cart loading is complete
      setIsCartLoading(false);
    }
  }, []); // Only run once on mount, not on every cart change

  // Handle URL step parameter for returning from schedule selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      
      if (stepParam) {
        const step = parseInt(stepParam);
        if (!isNaN(step) && step >= 0 && step <= 4) {
          console.log('🔍 Setting step from URL parameter:', step);
          
          // If user has already decided on group booking and we're trying to go to step 2 (group booking),
          // skip to step 3 (personal info) instead
          if (step === 2 && isGroupBooking !== null) {
            console.log('🔍 Skipping group booking step, going to personal info (step 3)');
            setCurrentStep(3);
          } else {
            setCurrentStep(step);
          }
        }
      }
    }
  }, [isGroupBooking]);

  // Handle cart loading state
  useEffect(() => {
    // Set cart loading to false after a short delay to ensure cart is loaded
    const timer = setTimeout(() => {
      setIsCartLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Check if conflicts are resolved and proceed to next step
  React.useEffect(() => {
    if (conflictingBookings.length === 0 && showConflictResolution) {
      // All conflicts resolved, proceed to personal info step
      setShowConflictResolution(false);
      setCurrentStep(2);
      toast.success('All conflicts resolved! Proceeding to personal information.');
    }
  }, [conflictingBookings, showConflictResolution]);

  // Monitor cart changes and update conflicting bookings when schedules are removed
  React.useEffect(() => {
    if (showConflictResolution && conflictingBookings.length > 0) {
      // Check if any of the conflicting bookings still exist in the cart
      const updatedConflictingBookings = conflictingBookings.filter(booking => {
        const cartItem = cartItems.find(item => item.id === booking.packageId);
        if (!cartItem) return false; // Package was removed entirely
        
        if (booking.bookingIndex !== undefined) {
          // Check if the specific booking still exists
          const bookings = Array.isArray(cartItem.bookingDetails) ? cartItem.bookingDetails : [];
          return bookings[booking.bookingIndex] && 
                 bookings[booking.bookingIndex].selectedDate === booking.selectedDate &&
                 bookings[booking.bookingIndex].selectedTime === booking.selectedTime;
        }
        
        return true; // Keep if we can't determine the specific booking
      });
      
      // Update conflicting bookings if any were removed
      if (updatedConflictingBookings.length !== conflictingBookings.length) {
        setConflictingBookings(updatedConflictingBookings);
        console.log('🔄 Updated conflicting bookings after cart change:', updatedConflictingBookings.length);
      }
    }
  }, [cartItems, showConflictResolution, conflictingBookings]);

  // Function to check for duplicate schedules across packages
  const checkForExistingDuplicateSchedules = useCallback(() => {
    try {
      const packageItems = cartItems.filter(item => item.type === 'package');
      if (packageItems.length <= 1) {
        return { hasDuplicates: false, conflictingBookings: [] };
      }

      // Collect all bookings from all packages
      const allBookings: any[] = [];
      packageItems.forEach((packageItem: any) => {
        if (packageItem.bookingDetails && Array.isArray(packageItem.bookingDetails)) {
          packageItem.bookingDetails.forEach((booking: any, bookingIndex: number) => {
            const bookingWithPackage = {
              ...booking,
              packageId: packageItem.id,
              packageName: packageItem.name,
              packageType: packageItem.packageType,
              bookingIndex: bookingIndex
            };
            allBookings.push(bookingWithPackage);
          });
        }
      });

      // Group bookings by date and time
      const scheduleGroups: { [key: string]: any[] } = {};
      allBookings.forEach(booking => {
        const key = `${booking.selectedDate}-${booking.selectedTime}`;
        if (!scheduleGroups[key]) {
          scheduleGroups[key] = [];
        }
        scheduleGroups[key].push(booking);
      });

      // Find groups with more than one booking (duplicates)
      const duplicateGroups = Object.values(scheduleGroups).filter(group => group.length > 1);
      
      if (duplicateGroups.length > 0) {
        return {
          hasDuplicates: true,
          conflictingBookings: duplicateGroups.flat()
        };
      }
      
      return { hasDuplicates: false, conflictingBookings: [] };
    } catch (error) {
      console.error('Error checking for duplicate schedules:', error);
      return { hasDuplicates: false, conflictingBookings: [] };
    }
  }, [cartItems]);

  // Update cart items with booking details when schedule data is available
  useEffect(() => {
    if (scheduleData && cartItems.length > 0) {
      // Find package items that don't have booking details yet
      const packageItems = cartItems.filter(item => item.type === 'package' && !item.bookingDetails);
      
      if (packageItems.length > 0) {
        // Note: We can't directly modify cartItems here as it's managed by the cart context
        // Instead, we'll rely on the display logic to show booking details from scheduleData
        console.log('Schedule data available for booking details:', scheduleData);
      }
    }
  }, [scheduleData, cartItems]);

  // Get selected country
  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  // Helper function to safely access nested translation properties
  const getTranslation = useCallback((path: string, fallback: string = ''): string => {
    if (!t || typeof t !== 'object') {
      return fallback;
    }
    
    const keys = path.split('.');
    let value: unknown = t;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'string' ? value : fallback;
  }, [t]);

  const steps: BookingStep[] = React.useMemo(() => {
    const baseSteps = [];
    
    // Check if there are packages in the cart
    const hasPackages = cartItems.some(item => item.type === 'package');
    const packageCount = cartItems.filter(item => item.type === 'package').length;
    
    // If there are packages and no schedule data yet, add schedule selection step
    if (hasPackages && !scheduleData) {
      baseSteps.push({ 
        id: 'schedule', 
        title: getTranslation('bookingFlow.selectSchedule', 'Select Schedule'), 
        description: getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time'), 
        completed: false 
      });
    }
    
    // If there are multiple packages and no package selected yet, add package selection step
    if (packageCount > 1 && !selectedPackageForBooking) {
      baseSteps.push({ 
        id: 'package-selection', 
        title: getTranslation('bookingFlow.selectPackageForBooking', 'Choose Package for Booking'), 
        description: getTranslation('bookingFlow.selectPackageForBookingDesc', 'Select which package to use for this booking'), 
        completed: false 
      });
    }
    
    // If there are multiple packages OR a single package with quantity > 1, add group booking step
    const totalPackageQuantity = cartItems
      .filter(item => item.type === 'package')
      .reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    if (packageCount > 1 || totalPackageQuantity > 1) {
      baseSteps.push({ 
        id: 'group-booking', 
        title: 'Group Booking', 
        description: 'Is this a group booking? Each person will need their own information', 
        completed: false 
      });
    }
    
    // Always add personal information step
    baseSteps.push({ 
      id: 'personal', 
      title: getTranslation('bookingFlow.personalInfo', 'Personal Information'), 
      description: getTranslation('bookingFlow.personalInfoDesc', 'Provide your contact details'), 
      completed: false 
    });
    
    // Add address step if required
    if (requiresAddress()) {
      baseSteps.push({ 
        id: 'address', 
        title: 'Shipping Address', 
        description: 'Enter your delivery information', 
        completed: false 
      });
    }
    
    // Always add order summary step
    baseSteps.push({ 
      id: 'summary', 
      title: 'Order Summary', 
      description: 'Review your order and complete payment', 
      completed: false 
    });
    
    return baseSteps;
  }, [getTranslation, requiresAddress, cartItems, scheduleData, selectedPackageForBooking]);

  // Close dropdown when clicking outside and prevent page scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.country-dropdown')) {
          setIsCountryDropdownOpen(false);
        }
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isCountryDropdownOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'clientEmail') {
      setEmailError('');
    }
  };

  const handleEmailBlur = async () => {
    if (formData.clientEmail) {
      const error = await validateEmailWithMessage(formData.clientEmail);
      setEmailError(error);
    }
  };

  const handleScheduleSelect = (slot: ScheduleSlot) => {
    setScheduleData(slot);
    // Store in sessionStorage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedSchedule', JSON.stringify({
        selectedDate: slot.date,
        selectedTime: slot.time,
        teacher: slot.teacher,
        serviceType: slot.serviceType,
        venue: slot.venue
      }));
    }
    
    // If user is editing schedule from order summary, go straight back to order summary
    if (isEditingSchedule) {
      setIsEditingSchedule(false);
      setCurrentStep(requiresAddress() ? 4 : 3); // Go back to order summary
      toast.success('Schedule updated! Review your order and complete payment.');
      return;
    }
    
    // Check if there are multiple package quantities (different types OR multiple quantities of same type)
    const packageItems = cartItems.filter(item => item.type === 'package');
    const totalPackageQuantity = packageItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalPackageQuantity > 1) {
      // If multiple package quantities, go to package selection step
      setCurrentStep(1);
      toast.success('Schedule selected! Now choose which package to use for this booking.');
    } else if (totalPackageQuantity === 1) {
      // If only one package quantity, auto-select it and go to personal info
      const packageItem = packageItems[0];
      if (packageItem) {
        setSelectedPackageForBooking(packageItem);
        // Store in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('selectedPackageForBooking', JSON.stringify(packageItem));
        }
      }
      setCurrentStep(2); // Go to personal info (step 2)
      toast.success('Schedule selected! Now provide your personal information.');
    } else {
      // No packages, go to personal info
      setCurrentStep(2);
      toast.success('Schedule selected! Now provide your personal information.');
    }
  };

  const handlePackageSelectionForBooking = (packageInstance: any) => {
    setSelectedPackageForBooking(packageInstance);
    // Store in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedPackageForBooking', JSON.stringify(packageInstance));
    }
    
    // Go to personal information step
    setCurrentStep(2);
    toast.success(`Package ${packageInstance.instanceNumber} selected! Now provide your personal information.`);
  };

  const handleProceedToAddress = () => {
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      toast.error(getTranslation('bookingFlow.fillRequiredFields', 'Please fill in all required fields'));
      return;
    }

    if (emailError) {
      toast.error('Please fix the email validation error before proceeding');
      return;
    }

    // If user is editing customer info from order summary, go straight back to order summary
    if (isEditingCustomerInfo) {
      setIsEditingCustomerInfo(false);
      setCurrentStep(requiresAddress() ? 4 : 3); // Go back to order summary
      toast.success('Personal information updated! Review your order and complete payment.');
      return;
    }

    // If user is editing billing document from order summary, go straight back to order summary
    if (isEditingBillingDocument) {
      setIsEditingBillingDocument(false);
      setCurrentStep(requiresAddress() ? 4 : 3); // Go back to order summary
      toast.success('Billing document updated! Review your order and complete payment.');
      return;
    }

    if (requiresAddress()) {
      setCurrentStep(3);
      toast.success('Personal information saved! Now enter your shipping address.');
    } else {
      // Skip address step and go directly to summary
      setCurrentStep(3);
      toast.success('Personal information saved! Review your order and complete payment.');
    }
  };

  const handleProceedToSummary = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast.error('Please fill in all required address fields');
      return;
    }

    // If user is editing address from order summary, go straight back to order summary
    if (isEditingAddress) {
      setIsEditingAddress(false);
      setCurrentStep(4); // Go back to order summary
      toast.success('Shipping address updated! Review your order and complete payment.');
      return;
    }

    setCurrentStep(4);
    toast.success('Address saved! Review your order and complete payment.');
  };

  const calculateSubtotal = () => {
    // Subtotal should be the base price before IGV
    return cartItems.reduce((total, item) => {
      const itemBasePrice = (item.price * item.quantity) / 1.18; // Remove IGV from price
      return total + itemBasePrice;
    }, 0);
  };

  const calculateTax = () => {
    return calculateTotalTax(); // Use the correct IGV calculation
  };

  const calculateShipping = () => {
    return 0; // Free shipping
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  // Calculate total IGV amount
  const calculateTotalTax = () => {
    return cartItems.reduce((total, item) => {
      const itemBasePrice = (item.price * item.quantity) / 1.18; // Remove IGV from price
      const itemTax = (item.price * item.quantity) - itemBasePrice;
      return total + itemTax;
    }, 0);
  };

  const formatCurrency = (amount: number, currency: string = 'PEN') => {
    const currencyCode = currency.toUpperCase();

    // Special handling for Peruvian Soles - display as S/.
    if (currencyCode === 'PEN') {
      return `S/. ${amount.toFixed(2)}`;
    }

    // For other currencies, use standard Intl formatting
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    }).format(amount);
  };


  const handlePayLater = async () => {
    setIsProcessing(true);
    
    try {
      // Extract schedule details from cart items (handle multiple bookings)
      let scheduleDetails = null;
      const packageWithBooking = cartItems.find(item => 
        item.type === 'package' && item.bookingDetails && Array.isArray(item.bookingDetails) && item.bookingDetails.length > 0
      );
      
      if (packageWithBooking && packageWithBooking.bookingDetails && packageWithBooking.bookingDetails.length > 0) {
        // Pass all booking details to the API
        scheduleDetails = packageWithBooking.bookingDetails.map(booking => ({
          selectedDate: booking.selectedDate,
          selectedTime: booking.selectedTime,
          teacher: booking.teacher,
          serviceType: booking.serviceType,
          venue: booking.venue,
          dayOfWeek: booking.dayOfWeek,
          scheduleSlotId: booking.scheduleSlotId
        }));
      }

      // Create unified order without payment
      const orderData = {
        customerInfo: {
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          countryCode: formData.countryCode,
          language: 'en', // Add required language field
          billingDocumentType: formData.billingDocumentType,
          dni: formData.dni,
          ruc: formData.ruc,
          companyName: formData.companyName
        },
        shippingAddress: requiresAddress() ? {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        } : null,
        items: cartItems,
        totalAmount: calculateTotal(),
        currency: currencyCode,
        paymentIntentId: undefined, // No payment for pay later - API will set status to PENDING
        notes: formData.notes,
        scheduleDetails: scheduleDetails
      };

      // Log order data for debugging
      console.log('Order data being sent:', orderData);
      console.log('Cart items:', cartItems);
      console.log('Calculated total:', calculateTotal());

      const response = await fetch('/api/orders/create-unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      // Log response details before parsing
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      let result;
      try {
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        if (!responseText || responseText.trim() === '') {
          console.error('Empty response from API');
          throw new Error('Empty response from server');
        }
        
        result = JSON.parse(responseText);
        console.log('Order creation response:', result);
        console.log('Response type:', typeof result);
        console.log('Response keys:', Object.keys(result));
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        console.log('Response text:', await response.text());
        throw new Error('Invalid response format from server');
      }

      // Check if result is valid and has success property
      if (!result || typeof result !== 'object') {
        console.error('Invalid result object:', result);
        throw new Error('Invalid response from server');
      }

      if (result.success === true) {
        // Validate that we have the required fields for successful order creation
        if (!result.orderId) {
          console.error('Order created but missing orderId:', result);
          throw new Error('Order created but missing order ID');
        }
        
        toast.success('Order created successfully! You can pay later.');
        
        const orderResult = {
          orderId: result.orderId,
          status: 'pending_payment',
          amount: result.totalAmount || calculateTotal(),
          currency: result.currency || currencyCode,
          items: cartItems
        };

        // Set redirecting state to prevent showing empty cart message
        setIsRedirecting(true);

        // Clear cart
        clearCart();
        
        // Call completion handler
        onCheckoutComplete?.(orderResult);
        
        // Redirect to order confirmation immediately
        window.location.href = `/order-confirmation?orderId=${result.orderId}&paymentStatus=pending`;
      } else {
        console.error('Order creation failed:', result);
        const errorMessage = result.error || result.details || 'Failed to create order';
        console.error('Error details:', {
          success: result.success,
          error: result.error,
          details: result.details,
          fullResult: result
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Pay later processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state while cart is being loaded
  if (isCartLoading) {
    return (
      <AppLayout className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Redirect to products if cart is empty (but not when redirecting after order completion)
  // Also check if we have schedule data in sessionStorage to avoid showing empty cart during schedule selection
  const hasScheduleData = typeof window !== 'undefined' && sessionStorage.getItem('selectedSchedule');
  if (cartItems.length === 0 && !isRedirecting && !hasScheduleData) {
    return (
      <AppLayout className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-4">Add some items to your cart to proceed with checkout.</p>
            <Button
              onClick={() => window.location.href = '/products'}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show loading state when redirecting after order completion
  if (isRedirecting) {
  return (
      <AppLayout className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing your order...</h1>
            <p className="text-gray-600">Please wait while we redirect you to your order confirmation.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout className="min-h-screen bg-white">
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
          {/* Step 1: Schedule Selection (only if packages in cart, no schedule data, and not direct checkout, OR when editing schedule) */}
          {(() => {
            const shouldShowSchedule = currentStep === 0 && cartItems.some(item => item.type === 'package') && (isEditingSchedule || !scheduleData) && !isDirectCheckout;
            return shouldShowSchedule;
          })() && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {getTranslation('bookingFlow.selectSchedule', 'Select Your Schedule')}
                </h2>
                <p className="text-xl text-muted">
                  {getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time for your package')}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <EnhancedSchedule
                  onBookSlot={handleScheduleSelect}
                  showBookingButton={false}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Package Selection (only if multiple package quantities in cart) */}
          {currentStep === 1 && cartItems.filter(item => item.type === 'package').reduce((sum, item) => sum + item.quantity, 0) > 1 && (
            <motion.div
              key="package-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {getTranslation('bookingFlow.selectPackageForBooking', 'Choose Package for Booking')}
                </h2>
                <p className="text-xl text-muted">
                  {getTranslation('bookingFlow.selectPackageForBookingDesc', 'Select which package to use for this booking')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cartItems
                  .filter(item => item.type === 'package')
                  .map((packageItem) => {
                    // Create individual package instances for selection
                    const packageInstances = Array.from({ length: packageItem.quantity }, (_, index) => ({
                      ...packageItem,
                      instanceId: `${packageItem.id}-${index}`,
                      instanceNumber: index + 1
                    }));
                    
                    return packageInstances.map((instance) => (
                      <Card
                        key={instance.instanceId}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedPackageForBooking?.instanceId === instance.instanceId
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handlePackageSelectionForBooking(instance)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-primary">
                              {instance.name}
                              {instance.quantity > 1 && (
                                <span className="ml-2 text-sm text-gray-500">
                                  (Instance {instance.instanceNumber} of {instance.quantity})
                                </span>
                              )}
                            </h3>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {new Intl.NumberFormat('es-PE', {
                                  style: 'currency',
                                  currency: 'PEN'
                                }).format(instance.price)}
                              </p>
                              <p className="text-sm text-muted">
                                Package {instance.instanceNumber}
                              </p>
                            </div>
                          </div>
                          
                          {(instance as any).description && (
                            <p className="text-muted mb-4 line-clamp-3">
                              {(instance as any).description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" />
                              <span className="text-sm text-muted">
                                {(instance as any).sessionsCount || 'Multiple'} sessions
                              </span>
                            </div>
                            
                            {selectedPackageForBooking?.instanceId === instance.instanceId && (
                              <div className="flex items-center gap-2 text-primary">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Selected</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ));
                  }).flat()}
              </div>
            </motion.div>
          )}

          {/* Group Booking Question */}
          {currentStep === 2 && (() => {
            const packageCount = cartItems.filter(item => item.type === 'package').length;
            const totalPackageQuantity = cartItems
              .filter(item => item.type === 'package')
              .reduce((sum, item) => sum + (item.quantity || 1), 0);
            return packageCount > 1 || totalPackageQuantity > 1;
          })() && (
            <motion.div
              key="group-booking"
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
                    Group Booking
                  </CardTitle>
                  <p className="text-center text-gray-600 mt-2">
                    Is this a group booking? Each person will need their own information.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => {
                        setIsGroupBooking(true);
                        // Initialize group members for each package and quantity
                        const packageItems = cartItems.filter(item => item.type === 'package');
                        const members: Array<{
                          id: string;
                          packageId: string;
                          firstName: string;
                          lastName: string;
                          email: string;
                          phone: string;
                          countryCode: string;
                        }> = [];
                        packageItems.forEach((item, packageIndex) => {
                          const quantity = item.quantity || 1;
                          for (let i = 0; i < quantity; i++) {
                            members.push({
                              id: `member-${packageIndex}-${i}`,
                              packageId: item.id,
                              firstName: '',
                              lastName: '',
                              email: '',
                              phone: '',
                              countryCode: 'PE' // Default to Peru
                            });
                          }
                        });
                        setGroupMembers(members);
                        setCurrentStep(3);
                      }}
                      className={`px-8 py-3 text-lg ${
                        isGroupBooking === true 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsGroupBooking(false);
                        setGroupMembers([]);
                        
                        // Check for schedule conflicts when choosing individual booking
                        const duplicateCheck = checkForExistingDuplicateSchedules();
                        if (duplicateCheck.hasDuplicates) {
                          console.log('🔍 Duplicates found in checkout, showing conflict resolution UI');
                          setConflictingBookings(duplicateCheck.conflictingBookings);
                          setOriginalConflictingBookings(duplicateCheck.conflictingBookings);
                          setShowConflictResolution(true);
                        } else {
                          console.log('🔍 No duplicates found, proceeding to personal info');
                          setCurrentStep(3);
                        }
                      }}
                      className={`px-8 py-3 text-lg ${
                        isGroupBooking === false 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      No
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Personal Information - Single Package or Non-Group */}
          {currentStep === 2 && (() => {
            const packageCount = cartItems.filter(item => item.type === 'package').length;
            const totalPackageQuantity = cartItems
              .filter(item => item.type === 'package')
              .reduce((sum, item) => sum + (item.quantity || 1), 0);
            return packageCount <= 1 && totalPackageQuantity <= 1;
          })() && (
            <motion.div
              key="personal"
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
                    {isEditingBillingDocument ? 'Change Billing Document' : 'Personal Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditingBillingDocument ? (
                    // Special billing document selection form
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600 text-lg">Choose your billing document type</p>
                      </div>
                      
                      {/* Billing Document Type Selection */}
                      <div className="space-y-4">
                        <Label className="text-black text-lg font-medium mb-2 block">Billing Document Type *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, billingDocumentType: 'boleta', dni: '', ruc: '', companyName: '' }))}
                            className={`p-6 border-2 rounded-lg text-center transition-all duration-200 hover:scale-105 ${
                              formData.billingDocumentType === 'boleta'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-300 hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium text-lg">Boleta</div>
                            <div className="text-sm text-gray-600">With DNI</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, billingDocumentType: 'boleta_simple', dni: '', ruc: '', companyName: '' }))}
                            className={`p-6 border-2 rounded-lg text-center transition-all duration-200 hover:scale-105 ${
                              formData.billingDocumentType === 'boleta_simple'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-300 hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium text-lg">Boleta</div>
                            <div className="text-sm text-gray-600">Simple</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, billingDocumentType: 'factura', dni: '', ruc: '', companyName: '' }))}
                            className={`p-6 border-2 rounded-lg text-center transition-all duration-200 hover:scale-105 ${
                              formData.billingDocumentType === 'factura'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-300 hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium text-lg">Factura</div>
                            <div className="text-sm text-gray-600">With RUC</div>
                          </button>
                        </div>

                        {/* DNI Field for Boleta */}
                        {formData.billingDocumentType === 'boleta' && (
                          <div className="mt-6">
                            <Label htmlFor="dni" className="text-black text-lg font-medium mb-2 block">DNI Number *</Label>
                            <Input
                              id="dni"
                              type="text"
                              value={formData.dni}
                              onChange={(e) => handleInputChange('dni', e.target.value)}
                              className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                              placeholder="Enter your DNI number"
                              required
                            />
                          </div>
                        )}

                        {/* RUC and Company Name for Factura */}
                        {formData.billingDocumentType === 'factura' && (
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="ruc" className="text-black text-lg font-medium mb-2 block">RUC Number *</Label>
                              <Input
                                id="ruc"
                                type="text"
                                value={formData.ruc}
                                onChange={(e) => handleInputChange('ruc', e.target.value)}
                                className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                                placeholder="Enter RUC number"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="companyName" className="text-black text-lg font-medium mb-2 block">Company Name *</Label>
                              <Input
                                id="companyName"
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                                placeholder="Enter company name"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditingBillingDocument(false);
                            // Go back to summary step
                            setCurrentStep(requiresAddress() ? 4 : 3);
                          }}
                          className="flex-1 h-12 text-lg"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setIsEditingBillingDocument(false);
                            // Go back to summary step
                            setCurrentStep(requiresAddress() ? 4 : 3);
                            toast.success('Billing document updated successfully');
                          }}
                          className="flex-1 h-12 text-lg bg-primary hover:bg-primary/90"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Regular personal information form
                    <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile-input-group">
                    <div>
                      <Label htmlFor="clientName" className="text-black text-lg font-medium mb-2 block">Full Name *</Label>
                      <Input
                        id="clientName"
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
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
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        onBlur={handleEmailBlur}
                        className={`h-14 px-4 text-lg border-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 ${
                          emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder="your.email@example.com"
                        required
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {emailError}
                        </p>
                      )}
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
                        
                        {/* Right Side Mobile Menu */}
                        {isCountryDropdownOpen && (
                          <>
                            {/* Minimal Backdrop - No Page Movement */}
                            <div 
                              className="fixed inset-0 bg-black bg-opacity-20 z-40 animate-[fadeIn_0.2s_ease-out_forwards]"
                              onClick={() => {
                                setIsCountryDropdownOpen(false);
                                setCountrySearchTerm('');
                              }}
                            />
                            
                            {/* Side Menu - Smooth Slide */}
                            <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform translate-x-full animate-[slideInRight_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] flex flex-col">
                              {/* Header */}
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
                              
                              {/* Search Bar */}
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
                              
                              {/* Countries List - Scrollable Area */}
                              <div className="flex-1 overflow-y-auto overscroll-contain country-menu-scroll">
                                {countries
                                  .filter(country => 
                                    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                                    country.code.includes(countrySearchTerm)
                                  )
                                  .map((country, index) => (
                                    <button
                                      key={`${country.code}-${country.name}-${country.country}`}
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
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        className="flex-1 h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="999 999 999"
                        required
                      />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleProceedToAddress}
                      disabled={!formData.clientName || !formData.clientEmail || !formData.clientPhone || !!emailError}
                      className="px-8 py-4 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {requiresAddress() ? 'Continue to Address' : 'Continue to Summary'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                  </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Shipping Address */}
          {/* Group Member Information */}
          {currentStep === 3 && isGroupBooking && (() => {
            const packageCount = cartItems.filter(item => item.type === 'package').length;
            const totalPackageQuantity = cartItems
              .filter(item => item.type === 'package')
              .reduce((sum, item) => sum + (item.quantity || 1), 0);
            return packageCount > 1 || totalPackageQuantity > 1;
          })() && (
            <motion.div
              key="group-members"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto mobile-step-content mobile-form-container"
            >
              <Card className="card-base">
                <CardHeader>
                  <CardTitle 
                    className="text-2xl text-primary text-center"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Group Member Information
                  </CardTitle>
                  <p className="text-center text-gray-600 mt-2">
                    Please provide information for each person using a package.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {groupMembers.map((member, index) => {
                    const packageItem = cartItems.find(item => item.id === member.packageId);
                    const selectedCountry = countries.find(c => c.code === member.countryCode) || countries[0];
                    
                    return (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-primary mb-6">
                          Person {index + 1} - {packageItem?.name || 'Package'}
                        </h3>
                        
                        {/* Personal Information */}
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`firstName-${member.id}`} className="text-black text-lg font-medium mb-2 block">First Name *</Label>
                              <Input
                                id={`firstName-${member.id}`}
                                value={member.firstName}
                                onChange={(e) => {
                                  const updatedMembers = groupMembers.map(m => 
                                    m.id === member.id ? { ...m, firstName: e.target.value } : m
                                  );
                                  setGroupMembers(updatedMembers);
                                }}
                                placeholder="Enter first name"
                                className="h-14 text-lg mobile-touch-target"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`lastName-${member.id}`} className="text-black text-lg font-medium mb-2 block">Last Name *</Label>
                              <Input
                                id={`lastName-${member.id}`}
                                value={member.lastName}
                                onChange={(e) => {
                                  const updatedMembers = groupMembers.map(m => 
                                    m.id === member.id ? { ...m, lastName: e.target.value } : m
                                  );
                                  setGroupMembers(updatedMembers);
                                }}
                                placeholder="Enter last name"
                                className="h-14 text-lg mobile-touch-target"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor={`email-${member.id}`} className="text-black text-lg font-medium mb-2 block">Email Address *</Label>
                            <Input
                              id={`email-${member.id}`}
                              type="email"
                              value={member.email}
                              onChange={(e) => {
                                const updatedMembers = groupMembers.map(m => 
                                  m.id === member.id ? { ...m, email: e.target.value } : m
                                );
                                setGroupMembers(updatedMembers);
                              }}
                              placeholder="Enter your email address"
                              className="h-14 text-lg mobile-touch-target"
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor={`phone-${member.id}`} className="text-black text-lg font-medium mb-2 block">Phone Number *</Label>
                            <div className="flex gap-2 mobile-input-group">
                              {/* Country Code Dropdown */}
                              <div className="relative country-dropdown mobile-country-dropdown">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Close other dropdowns and open this one
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearchTerm('');
                                    // Set a flag to indicate which member's dropdown is open
                                    setFormData(prev => ({ ...prev, editingMemberId: member.id }));
                                    setIsCountryDropdownOpen(true);
                                  }}
                                  className="h-14 w-36 px-3 flex items-center space-x-2 border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mobile-touch-target rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                  <span className="text-lg">{selectedCountry.flag}</span>
                                  <span className="text-sm text-gray-700 font-medium">{selectedCountry.code}</span>
                                  <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCountryDropdownOpen && formData.editingMemberId === member.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {/* Country Dropdown Menu */}
                                {isCountryDropdownOpen && formData.editingMemberId === member.id && (
                                  <>
                                    {/* Backdrop */}
                                    <div 
                                      className="fixed inset-0 bg-black bg-opacity-20 z-40 animate-[fadeIn_0.2s_ease-out_forwards]"
                                      onClick={() => {
                                        setIsCountryDropdownOpen(false);
                                        setCountrySearchTerm('');
                                        setFormData(prev => ({ ...prev, editingMemberId: '' }));
                                      }}
                                    />
                                    
                                    {/* Side Menu */}
                                    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform translate-x-full animate-[slideInRight_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] flex flex-col">
                                      {/* Header */}
                                      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                                        <h3 className="text-lg font-semibold text-gray-900">Select Country</h3>
                                        <button
                                          onClick={() => {
                                            setIsCountryDropdownOpen(false);
                                            setCountrySearchTerm('');
                                            setFormData(prev => ({ ...prev, editingMemberId: '' }));
                                          }}
                                          className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-150"
                                        >
                                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                      
                                      {/* Search Bar */}
                                      <div className="p-4 border-b border-gray-200 flex-shrink-0">
                                        <div className="relative">
                                          <input
                                            type="text"
                                            placeholder="Search countries..."
                                            value={countrySearchTerm}
                                            onChange={(e) => setCountrySearchTerm(e.target.value)}
                                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                          />
                                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                          </svg>
                                        </div>
                                      </div>
                                      
                                      {/* Country List */}
                                      <div className="flex-1 overflow-y-auto">
                                        <div className="p-2">
                                          {countries
                                            .filter(country => 
                                              country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                                              country.code.includes(countrySearchTerm)
                                            )
                                            .map((country) => (
                                              <button
                                                key={`${country.code}-${country.name}-${country.country}`}
                                                type="button"
                                                onClick={() => {
                                                  const updatedMembers = groupMembers.map(m => 
                                                    m.id === member.id ? { ...m, countryCode: country.code } : m
                                                  );
                                                  setGroupMembers(updatedMembers);
                                                  setIsCountryDropdownOpen(false);
                                                  setCountrySearchTerm('');
                                                  setFormData(prev => ({ ...prev, editingMemberId: '' }));
                                                }}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg transition-colors duration-150 ${
                                                  member.countryCode === country.code ? 'bg-primary/10 text-primary' : 'text-gray-700'
                                                }`}
                                              >
                                                <span className="text-xl">{country.flag}</span>
                                                <div className="flex-1">
                                                  <div className="font-medium">{country.name}</div>
                                                  <div className="text-sm text-gray-500">{country.code}</div>
                                                </div>
                                                {member.countryCode === country.code && (
                                                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                  </svg>
                                                )}
                                              </button>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              <Input
                                id={`phone-${member.id}`}
                                value={member.phone}
                                onChange={(e) => {
                                  const updatedMembers = groupMembers.map(m => 
                                    m.id === member.id ? { ...m, phone: e.target.value } : m
                                  );
                                  setGroupMembers(updatedMembers);
                                }}
                                placeholder="Enter phone number"
                                className="flex-1 h-14 text-lg mobile-touch-target"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => {
                        // Validate all group members
                        const isValid = groupMembers.every(member => 
                          member.firstName && member.lastName && member.email && member.phone && member.countryCode
                        );
                        
                        if (!isValid) {
                          toast.error('Please fill in all required fields for each group member.');
                          return;
                        }
                        
                        // Move to next step
                        if (requiresAddress()) {
                          setCurrentStep(4);
                        } else {
                          setCurrentStep(5);
                        }
                      }}
                      className="px-8 py-3 text-lg"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Personal Information - Group Booking (No) */}
          {currentStep === 3 && !isGroupBooking && (() => {
            const packageCount = cartItems.filter(item => item.type === 'package').length;
            const totalPackageQuantity = cartItems
              .filter(item => item.type === 'package')
              .reduce((sum, item) => sum + (item.quantity || 1), 0);
            return packageCount > 1 || totalPackageQuantity > 1;
          })() && (
            <motion.div
              key="personal-group"
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
                  <p className="text-center text-gray-600 mt-2">
                    Provide your contact details for all packages.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Same personal information form as single package */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.clientName.split(' ')[0] || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          clientName: e.target.value + ' ' + (prev.clientName.split(' ').slice(1).join(' ') || '')
                        }))}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.clientName.split(' ').slice(1).join(' ') || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          clientName: (prev.clientName.split(' ')[0] || '') + ' ' + e.target.value
                        }))}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => {
                        // Validate form
                        if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
                          toast.error('Please fill in all required fields.');
                          return;
                        }
                        
                        // Move to next step
                        if (requiresAddress()) {
                          setCurrentStep(4);
                        } else {
                          setCurrentStep(5);
                        }
                      }}
                      className="px-8 py-3 text-lg"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && requiresAddress() && (
            <motion.div
              key="address"
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
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address" className="text-black text-lg font-medium mb-2 block">Street Address *</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                      placeholder="Av. Principal 123, Urbanización Los Olivos"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile-input-group">
                    <div>
                      <Label htmlFor="city" className="text-black text-lg font-medium mb-2 block">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="Lima"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-black text-lg font-medium mb-2 block">State/Province *</Label>
                      <Input
                        id="state"
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="Lima"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile-input-group">
                    <div>
                      <Label htmlFor="zipCode" className="text-black text-lg font-medium mb-2 block">Postal Code *</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="15001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-black text-lg font-medium mb-2 block">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger className="h-14 px-4 text-lg border-2 border-gray-300 text-black focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Peru">Peru</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                  <div>
                    <Label htmlFor="notes" className="text-black text-lg font-medium mb-2 block">Order Notes (Optional)</Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      className="w-full h-24 px-4 py-3 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep(0);
                      }}
                      className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                      <ArrowLeft className="w-5 h-5 text-primary" />
                      Back to Personal Info
                    </Button>
                    <Button
                      onClick={handleProceedToSummary}
                      disabled={!formData.address || !formData.city || !formData.state || !formData.zipCode}
                      className="px-8 py-4 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Continue to Summary
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Order Summary & Payment */}
          {currentStep === (() => {
            const packageCount = cartItems.filter(item => item.type === 'package').length;
            const totalPackageQuantity = cartItems
              .filter(item => item.type === 'package')
              .reduce((sum, item) => sum + (item.quantity || 1), 0);
            
            if (packageCount > 1 || totalPackageQuantity > 1) {
              // Group booking flow: group question (2) -> personal/group members (3) -> address (4) -> summary (5)
              return requiresAddress() ? 5 : 4;
            } else {
              // Single package flow: personal (2) -> address (3) -> summary (4)
              return requiresAddress() ? 4 : 3;
            }
          })() && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h2>
                <p className="text-gray-600">Review your order and complete your payment securely.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Set editing flag and go back to personal information step
                          setIsEditingCustomerInfo(true);
                          setCurrentStep(2); // Go to personal information step
                          toast.info('You can now change your personal information');
                        }}
                        className="text-primary border-primary hover:bg-primary hover:text-white"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{formData.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium">{formData.clientEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{formData.countryCode} {formData.clientPhone}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Billing Document</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Set editing flag and go back to personal information step
                            setIsEditingBillingDocument(true);
                            setCurrentStep(2); // Go to personal information step
                            toast.info('You can now change your billing document');
                          }}
                          className="text-primary border-primary hover:bg-primary hover:text-white"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Change Document
                        </Button>
                      </div>
                      <p className="font-medium">
                        {formData.billingDocumentType === 'boleta' && `Boleta (DNI: ${formData.dni})`}
                        {formData.billingDocumentType === 'boleta_simple' && 'Boleta Simple'}
                        {formData.billingDocumentType === 'factura' && `Factura (RUC: ${formData.ruc} - ${formData.companyName})`}
                      </p>
                    </div>
                    {requiresAddress() && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Shipping Address</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Set editing flag and go back to address step
                              setIsEditingAddress(true);
                              setCurrentStep(3); // Go to address step
                              toast.info('You can now change your shipping address');
                            }}
                            className="text-primary border-primary hover:bg-primary hover:text-white"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Change
                          </Button>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{formData.address}</p>
                          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                          <p>{formData.country}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Schedule Information */}
                {scheduleData && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Booking Schedule
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Set editing flag and go back to schedule selection step
                            console.log('Edit Schedule clicked, setting isEditingSchedule to true');
                            setIsEditingSchedule(true);
                            setCurrentStep(0);
                            toast.info('You can now select a different schedule');
                          }}
                          className="text-primary border-primary hover:bg-primary hover:text-white"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Change Schedule
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{(scheduleData as any).selectedDate || scheduleData.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-medium">{(scheduleData as any).selectedTime || scheduleData.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Teacher</p>
                        <p className="font-medium">{scheduleData.teacher?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="font-medium">{scheduleData.serviceType?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Venue</p>
                        <p className="font-medium">{scheduleData.venue?.name || 'N/A'}</p>
                      </div>
                      {selectedPackageForBooking && (
                        <div>
                          <p className="text-sm text-gray-600">Package for Booking</p>
                          <p className="font-medium">{selectedPackageForBooking.name}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Order Items
                    </CardTitle>
                      <div className="text-sm text-gray-500">
                        Click +/- to adjust quantities
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="space-y-3">
                        <div className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">{item.name}</h3>
                            {item.type === 'package' && (
                              <Package className="w-3 h-3 text-primary flex-shrink-0" />
                            )}
                            {item.type === 'product' && (
                              <Truck className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <span>Qty:</span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(item.id, item.quantity - 1);
                                      toast.success('Quantity updated');
                                    } else {
                                      removeFromCart(item.id);
                                      toast.success('Item removed from cart');
                                    }
                                  }}
                                  className="h-6 w-6 p-0 text-xs"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
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
                                    toast.success('Quantity updated');
                                    }
                                  }}
                                  className="h-6 w-6 p-0 text-xs"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            {item.type === 'package' && item.sessions && (
                              <p>{item.sessions} sessions</p>
                            )}
                            {item.type === 'package' && item.duration && (
                              <p>{item.duration} min each</p>
                            )}
                            {item.type === 'package' && item.packageType && (
                              <p className="capitalize">{item.packageType.toLowerCase()}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity, item.currency)}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.price, item.currency)} each</p>
                        </div>
                        </div>
                        
                        {/* Show booking details for packages */}
                        {item.type === 'package' && item.bookingDetails && item.bookingDetails.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <CartBookingDetails
                              bookingDetails={item.bookingDetails}
                              packageSessions={item.sessions}
                              packageId={item.id}
                              showActions={false}
                            />
                          </div>
                        )}
                        
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Order Summary & Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Summary */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''}):</span>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>IGV (18%):</span>
                        <span>{formatCurrency(calculateTax())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>{formatCurrency(calculateShipping())}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-center mb-6">
                        <p className="text-lg text-gray-700 mb-2">Complete your order and pay later</p>
                        <p className="text-sm text-gray-500">You'll receive payment instructions after order confirmation</p>
                      </div>
                      <Button
                        onClick={handlePayLater}
                        disabled={isProcessing}
                        className="w-full py-4 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <ClockIcon className="w-5 h-5" />
                        {isProcessing ? 'Processing...' : 'Complete Order - Pay Later'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (requiresAddress()) {
                      setCurrentStep(3);
                    } else {
                      setCurrentStep(2);
                    }
                  }}
                  className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5 text-primary" />
                  {requiresAddress() ? 'Back to Address' : 'Back to Personal Info'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conflict Resolution Modal */}
      {showConflictResolution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Schedule Conflict Detected
              </h3>
              <p className="text-gray-600 mb-6">
                You have multiple packages booked for the same schedule. For individual bookings, 
                each package must have a different schedule. Please choose an action for each conflicting booking:
              </p>
              
              <div className="space-y-4">
                {conflictingBookings.map((booking, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{booking.packageName}</h4>
                        <p className="text-sm text-gray-600">
                          {booking.selectedDate} at {booking.selectedTime}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.serviceType} • {booking.teacher} • {booking.venue}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            // Close modal and navigate to schedule page to edit this specific booking
                            console.log('🔧 CONFLICT RESOLUTION - Change Schedule clicked');
                            console.log('🔧 CONFLICT RESOLUTION - booking object:', booking);
                            console.log('🔧 CONFLICT RESOLUTION - booking.packageId:', booking.packageId);
                            console.log('🔧 CONFLICT RESOLUTION - booking.bookingIndex:', booking.bookingIndex);
                            
                            setShowConflictResolution(false);
                            setConflictingBookings([]);
                            
                            if (typeof window !== 'undefined') {
                              console.log('🔧 CONFLICT RESOLUTION - Setting session storage...');
                              sessionStorage.setItem('isEditingSchedule', 'true');
                              sessionStorage.setItem('editingPackageId', booking.packageId);
                              sessionStorage.setItem('editingBookingIndex', booking.bookingIndex?.toString() || '0');
                              // Store conflicting schedule to mark as unavailable
                              sessionStorage.setItem('conflictingSchedule', JSON.stringify({
                                date: booking.selectedDate,
                                time: booking.selectedTime,
                                reason: 'conflict'
                              }));
                              // Set flag to return to checkout after schedule selection
                              sessionStorage.setItem('returnToCheckout', 'true');
                              sessionStorage.setItem('checkoutStep', '3'); // User info step
                              
                              console.log('🔧 CONFLICT RESOLUTION - Session storage set, redirecting...');
                              console.log('🔧 CONFLICT RESOLUTION - Final session storage check:');
                              console.log('  isEditingSchedule:', sessionStorage.getItem('isEditingSchedule'));
                              console.log('  editingPackageId:', sessionStorage.getItem('editingPackageId'));
                              console.log('  editingBookingIndex:', sessionStorage.getItem('editingBookingIndex'));
                              console.log('  returnToCheckout:', sessionStorage.getItem('returnToCheckout'));
                              console.log('  checkoutStep:', sessionStorage.getItem('checkoutStep'));
                              
                              window.location.href = '/schedule';
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Change Schedule
                        </button>
                        <button
                          onClick={() => {
                            // Remove this booking
                            if (cartContext && booking.packageId) {
                              if (booking.bookingIndex !== undefined) {
                                cartContext.removeBookingFromPackage(booking.packageId, booking.bookingIndex);
                              } else {
                                cartContext.removeBookingDetails(booking.packageId);
                              }
                              
                              // Remove from conflicting bookings list
                              const newConflicts = conflictingBookings.filter((_, i) => i !== index);
                              setConflictingBookings(newConflicts);
                              
                              // If no more conflicts, close modal and proceed to user info step
                              if (newConflicts.length === 0) {
                                setShowConflictResolution(false);
                                setConflictingBookings([]);
                                setOriginalConflictingBookings([]);
                                setCurrentStep(3); // Go to user info step
                                toast.success('All conflicts resolved! Proceeding to user information.');
                              } else {
                                toast.success('Booking removed successfully');
                              }
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowConflictResolution(false);
                    setConflictingBookings([]);
                    setOriginalConflictingBookings([]);
                    // Change to group booking
                    setIsGroupBooking(true);
                    setCurrentStep(3);
                    toast.success('Changed to group booking! You can now proceed with personal information.');
                  }}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Change to Group Booking
                </button>
                {/* Show Continue Checkout button only if items have been removed */}
                {conflictingBookings.length < originalConflictingBookings.length && (
                  <button
                    onClick={() => {
                      setShowConflictResolution(false);
                      setConflictingBookings([]);
                      setOriginalConflictingBookings([]);
                      // Continue with individual booking (resolve conflicts manually)
                      setCurrentStep(3);
                      toast.success('Continuing checkout! You can manage your bookings in the next step.');
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Continue Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// Main export
export function UnifiedCheckoutFlow(props: UnifiedCheckoutFlowProps) {
  return <UnifiedCheckoutFlowContent {...props} />;
}
