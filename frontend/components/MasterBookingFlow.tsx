'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  FileText,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';
import { validateEmailWithMessage } from '@/lib/email-validation';
import { useCart, useCartUI } from '@/store/appStore';
import { usePackages, PackagePrice } from '@/hooks/usePackagesQuery';
import { EnhancedSchedule } from './EnhancedSchedule';
import { StripeInlineForm } from './stripe/StripeInlineForm';
import { PaymentErrorBoundary } from './PaymentErrorBoundary';
import { Result } from './Result';
import { countries } from '@/lib/countries';

// Types
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

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ComponentType<any>;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
  specialRequests: string;
  language: 'en' | 'es';
}

interface ShippingFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface MasterBookingFlowProps {
  onCheckoutComplete?: (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: CartItem[];
  }) => void;
}

/**
 * MasterBookingFlow - Unified booking and checkout experience
 * 
 * This component consolidates all booking flows into a single, coherent process:
 * 1. Package & Product Selection
 * 2. Scheduling (conditional for packages)
 * 3. Customer Information & Shipping (conditional)
 * 4. Payment
 * 5. Confirmation
 * 
 * Features:
 * - Mobile-first responsive design
 * - Unified cart management
 * - Conditional step rendering based on cart contents
 * - Integrated payment processing
 * - Comprehensive form validation
 */
export function MasterBookingFlow({ onCheckoutComplete }: MasterBookingFlowProps) {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const cartContext = useCart();
  const { data: packages, isLoading: packagesLoading } = usePackages('PEN');
  
  // State management - always call hooks at the top level
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  
  // Safety checks
  if (!cartContext) {
    return <div>Loading cart...</div>;
  }

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    hasMixedItems,
    requiresAddress
  } = cartContext;

  // Form data
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    question: '',
    specialRequests: '',
    language: language
  });

  const [shippingData, setShippingData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'PE'
  });

  // Validation state
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  // Define steps based on cart contents
  const steps: BookingStep[] = React.useMemo(() => {
    const baseSteps: BookingStep[] = [
      {
        id: 'packages',
        title: getTranslation('bookingFlow.selectPackages', 'Select Packages & Products'),
        description: getTranslation('bookingFlow.selectPackagesDesc', 'Add items to your cart'),
        completed: false,
        icon: ShoppingCart
      }
    ];

    // Add scheduling step if cart has packages
    const hasPackages = cartItems.some(item => item.type === 'package');
    if (hasPackages) {
      baseSteps.push({
        id: 'schedule',
        title: getTranslation('bookingFlow.selectSchedule', 'Select Schedule'),
        description: getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time'),
        completed: false,
        icon: Calendar
      });
    }

    // Add customer info step
    baseSteps.push({
      id: 'customer',
      title: getTranslation('bookingFlow.customerInfo', 'Customer Information'),
      description: getTranslation('bookingFlow.customerInfoDesc', 'Provide your details'),
      completed: false,
      icon: User
    });

    // Add shipping step if required
    if (requiresAddress()) {
      baseSteps.push({
        id: 'shipping',
        title: getTranslation('bookingFlow.shipping', 'Shipping Address'),
        description: getTranslation('bookingFlow.shippingDesc', 'Provide shipping details'),
        completed: false,
        icon: Truck
      });
    }

    // Add payment step
    baseSteps.push({
      id: 'payment',
      title: getTranslation('bookingFlow.payment', 'Payment'),
      description: getTranslation('bookingFlow.paymentDesc', 'Complete your purchase'),
      completed: false,
      icon: CreditCard
    });

    // Add confirmation step
    baseSteps.push({
      id: 'confirmation',
      title: getTranslation('bookingFlow.confirmation', 'Confirmation'),
      description: getTranslation('bookingFlow.confirmationDesc', 'Order confirmed'),
      completed: false,
      icon: CheckCircle
    });

    return baseSteps;
  }, [cartItems, requiresAddress, getTranslation]);

  // Update step completion status
  const updateStepCompletion = useCallback(() => {
    const updatedSteps = steps.map((step, index) => {
      let completed = false;
      
      switch (step.id) {
        case 'packages':
          completed = cartItems.length > 0;
          break;
        case 'schedule':
          completed = !cartItems.some(item => item.type === 'package') || 
                     cartItems.every(item => 
                       item.type !== 'package' || 
                       (item.bookingDetails && item.bookingDetails.length > 0)
                     );
          break;
        case 'customer':
          completed = customerData.name && customerData.email && customerData.birthDate && customerData.birthPlace;
          break;
        case 'shipping':
          completed = !requiresAddress() || 
                     (shippingData.firstName && shippingData.lastName && shippingData.address && shippingData.city);
          break;
        case 'payment':
          completed = paymentStatus === 'success';
          break;
        case 'confirmation':
          completed = paymentStatus === 'success' && orderData;
          break;
      }
      
      return { ...step, completed };
    });
    
    return updatedSteps;
  }, [steps, cartItems, customerData, shippingData, requiresAddress, paymentStatus, orderData]);

  const completedSteps = updateStepCompletion();

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation functions
  const validateEmail = async (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    const result = await validateEmailWithMessage(email);
    if (!result.isValid) {
      setEmailError(result.message);
      return false;
    }
    
    setEmailError(null);
    return true;
  };

  const validateCurrentStep = async () => {
    const currentStepData = steps[currentStep];
    let isValid = true;
    const errors: Record<string, string> = {};

    switch (currentStepData.id) {
      case 'packages':
        if (cartItems.length === 0) {
          toast.error('Please add at least one item to your cart');
          isValid = false;
        }
        break;
        
      case 'customer':
        if (!customerData.name) errors.name = 'Name is required';
        if (!customerData.email) errors.email = 'Email is required';
        if (!customerData.birthDate) errors.birthDate = 'Birth date is required';
        if (!customerData.birthPlace) errors.birthPlace = 'Birth place is required';
        
        if (customerData.email) {
          const emailValid = await validateEmail(customerData.email);
          if (!emailValid) isValid = false;
        }
        
        if (Object.keys(errors).length > 0) isValid = false;
        break;
        
      case 'shipping':
        if (requiresAddress()) {
          if (!shippingData.firstName) errors.firstName = 'First name is required';
          if (!shippingData.lastName) errors.lastName = 'Last name is required';
          if (!shippingData.address) errors.address = 'Address is required';
          if (!shippingData.city) errors.city = 'City is required';
          
          if (Object.keys(errors).length > 0) isValid = false;
        }
        break;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle step navigation
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      nextStep();
    }
  };

  // Handle package selection
  const handleAddPackage = (pkg: PackagePrice) => {
    addToCart({
      id: pkg.id.toString(),
      name: pkg.name,
      price: pkg.price,
      quantity: 1,
      image: pkg.image || '/placeholder-package.jpg',
      currency: 'PEN',
      type: 'package',
      sessions: pkg.sessions,
      duration: pkg.duration,
      packageType: pkg.packageType,
      maxGroupSize: pkg.maxGroupSize
    });
    toast.success(`${pkg.name} added to cart`);
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentStatus('success');
    setOrderData(paymentData);
    setCurrentStep(steps.length - 1); // Go to confirmation step
    
    if (onCheckoutComplete) {
      onCheckoutComplete({
        orderId: paymentData.id,
        status: 'completed',
        amount: getTotalPrice(),
        currency: 'PEN',
        items: cartItems
      });
    }
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    setPaymentStatus('error');
    toast.error('Payment failed. Please try again.');
  };

  // Render step content
  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.id) {
      case 'packages':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getTranslation('bookingFlow.selectPackages', 'Select Packages & Products')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('bookingFlow.selectPackagesDesc', 'Add items to your cart')}
              </p>
            </div>

            {/* Packages Grid */}
            {packagesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className="unified-card">
                    <CardHeader>
                      <CardTitle className="unified-card__title">{pkg.name}</CardTitle>
                      <p className="unified-card__subtitle">{pkg.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">
                            S/ {pkg.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {pkg.sessions} sessions
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
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
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
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getTranslation('bookingFlow.selectSchedule', 'Select Schedule')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time')}
              </p>
            </div>
            <EnhancedSchedule
              onBookSlot={(slot) => {
                // Handle slot booking for packages in cart
                const packageItems = cartItems.filter(item => item.type === 'package');
                if (packageItems.length > 0) {
                  // Add booking details to the first package
                  const firstPackage = packageItems[0];
                  // This would need to be implemented in the cart context
                  toast.success(`Scheduled for ${slot.date} at ${slot.time}`);
                }
              }}
              showFilters={true}
            />
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getTranslation('bookingFlow.customerInfo', 'Customer Information')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('bookingFlow.customerInfoDesc', 'Provide your details')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="unified-form-group">
                <Label htmlFor="name" className="unified-form-label">
                  {getTranslation('forms.name', 'Full Name')} *
                </Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm">{formErrors.name}</p>
                )}
              </div>

              <div className="unified-form-group">
                <Label htmlFor="email" className="unified-form-label">
                  {getTranslation('forms.email', 'Email')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your email"
                />
                {emailError && (
                  <p className="text-red-500 text-sm">{emailError}</p>
                )}
              </div>

              <div className="unified-form-group">
                <Label htmlFor="phone" className="unified-form-label">
                  {getTranslation('forms.phone', 'Phone')}
                </Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="birthDate" className="unified-form-label">
                  {getTranslation('forms.birthDate', 'Birth Date')} *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={customerData.birthDate}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="unified-form-input"
                />
                {formErrors.birthDate && (
                  <p className="text-red-500 text-sm">{formErrors.birthDate}</p>
                )}
              </div>

              <div className="unified-form-group">
                <Label htmlFor="birthTime" className="unified-form-label">
                  {getTranslation('forms.birthTime', 'Birth Time')}
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={customerData.birthTime}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, birthTime: e.target.value }))}
                  className="unified-form-input"
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="birthPlace" className="unified-form-label">
                  {getTranslation('forms.birthPlace', 'Birth Place')} *
                </Label>
                <Input
                  id="birthPlace"
                  value={customerData.birthPlace}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, birthPlace: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your birth place"
                />
                {formErrors.birthPlace && (
                  <p className="text-red-500 text-sm">{formErrors.birthPlace}</p>
                )}
              </div>
            </div>

            <div className="unified-form-group">
              <Label htmlFor="question" className="unified-form-label">
                {getTranslation('forms.question', 'Question/Focus Areas')}
              </Label>
              <textarea
                id="question"
                value={customerData.question}
                onChange={(e) => setCustomerData(prev => ({ ...prev, question: e.target.value }))}
                className="unified-form-textarea"
                rows={3}
                placeholder="What would you like to focus on during your session?"
              />
            </div>

            <div className="unified-form-group">
              <Label htmlFor="specialRequests" className="unified-form-label">
                {getTranslation('forms.specialRequests', 'Special Requests')}
              </Label>
              <textarea
                id="specialRequests"
                value={customerData.specialRequests}
                onChange={(e) => setCustomerData(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="unified-form-textarea"
                rows={3}
                placeholder="Any special requests or notes?"
              />
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getTranslation('bookingFlow.shipping', 'Shipping Address')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('bookingFlow.shippingDesc', 'Provide shipping details')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="unified-form-group">
                <Label htmlFor="firstName" className="unified-form-label">
                  {getTranslation('forms.firstName', 'First Name')} *
                </Label>
                <Input
                  id="firstName"
                  value={shippingData.firstName}
                  onChange={(e) => setShippingData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your first name"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                )}
              </div>

              <div className="unified-form-group">
                <Label htmlFor="lastName" className="unified-form-label">
                  {getTranslation('forms.lastName', 'Last Name')} *
                </Label>
                <Input
                  id="lastName"
                  value={shippingData.lastName}
                  onChange={(e) => setShippingData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your last name"
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                )}
              </div>

              <div className="unified-form-group md:col-span-2">
                <Label htmlFor="address" className="unified-form-label">
                  {getTranslation('forms.address', 'Address')} *
                </Label>
                <Input
                  id="address"
                  value={shippingData.address}
                  onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your address"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm">{formErrors.address}</p>
                )}
              </div>

              <div className="unified-form-group">
                <Label htmlFor="city" className="unified-form-label">
                  {getTranslation('forms.city', 'City')} *
                </Label>
                <Input
                  id="city"
                  value={shippingData.city}
                  onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your city"
                />
                {formErrors.city && (
                  <p className="text-red-500 text-sm">{formErrors.city}</p>
                )}
              </div>

              <div className="unified-form-group">
                <Label htmlFor="state" className="unified-form-label">
                  {getTranslation('forms.state', 'State/Province')}
                </Label>
                <Input
                  id="state"
                  value={shippingData.state}
                  onChange={(e) => setShippingData(prev => ({ ...prev, state: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your state"
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="postalCode" className="unified-form-label">
                  {getTranslation('forms.postalCode', 'Postal Code')}
                </Label>
                <Input
                  id="postalCode"
                  value={shippingData.postalCode}
                  onChange={(e) => setShippingData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="unified-form-input"
                  placeholder="Enter your postal code"
                />
              </div>

              <div className="unified-form-group">
                <Label htmlFor="country" className="unified-form-label">
                  {getTranslation('forms.country', 'Country')}
                </Label>
                <Select
                  value={shippingData.country}
                  onValueChange={(value) => setShippingData(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger className="unified-form-select">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
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
                {getTranslation('bookingFlow.payment', 'Payment')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('bookingFlow.paymentDesc', 'Complete your purchase')}
              </p>
            </div>

            {/* Order Summary */}
            <Card className="unified-card">
              <CardHeader>
                <CardTitle className="unified-card__title">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <PaymentErrorBoundary>
              <StripeInlineForm
                amount={getTotalPrice() * 100} // Convert to cents
                currency="pen"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerData={customerData}
                shippingData={requiresAddress() ? shippingData : undefined}
                cartItems={cartItems}
              />
            </PaymentErrorBoundary>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getTranslation('bookingFlow.confirmation', 'Order Confirmed!')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('bookingFlow.confirmationDesc', 'Your order has been successfully processed')}
              </p>
            </div>

            {orderData && (
              <Card className="unified-card">
                <CardHeader>
                  <CardTitle className="unified-card__title">Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">{orderData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-600 font-semibold">Completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              <Button
                onClick={() => {
                  clearCart();
                  window.location.href = '/';
                }}
                className="btn-primary"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  // Don't render if cart is empty and we're not on the first step
  if (cartItems.length === 0 && currentStep > 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cart is Empty</h3>
        <p className="text-gray-600 mb-4">Please add items to your cart to continue</p>
        <Button onClick={() => setCurrentStep(0)} className="btn-primary">
          Browse Packages
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8">
        {completedSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
              index <= currentStep 
                ? 'border-green-600 bg-green-600 text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle size={16} className="sm:w-5 sm:h-5" />
              ) : (
                <step.icon size={16} className="sm:w-5 sm:h-5" />
              )}
            </div>
            {index < completedSteps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
                index < currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {currentStep < steps.length - 1 && (
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isProcessing}
            className="btn-primary"
          >
            {currentStep === steps.length - 2 ? 'Complete Order' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
