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
  ShoppingCart
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
// Payment integration will be added here
import { countries } from '@/lib/countries';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  comparePrice?: number | null;
  images: string[];
  category: string;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  shortDescription?: string;
  isFeatured: boolean;
  isPopular: boolean;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags: string[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
}

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ProductCheckoutFlowProps {
  product: Product;
  cartItems: CartItem[];
  onStepChange?: (step: number) => void;
  onCheckoutComplete?: (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: CartItem[];
  }) => void;
}

export function ProductCheckoutFlow({
  product,
  cartItems,
  onStepChange
}: ProductCheckoutFlowProps) {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  
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
    // Additional fields
    notes: ''
  });

  // Get selected country
  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  // Helper function to safely access nested translation properties
  const getTranslation = useCallback((path: string, fallback: string = ''): string => {
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

  const steps: BookingStep[] = React.useMemo(() => [
    { id: 'personal', title: getTranslation('bookingFlow.personalInfo', 'Personal Information'), description: getTranslation('bookingFlow.personalInfoDesc', 'Provide your contact details'), completed: false },
    { id: 'address', title: 'Shipping Address', description: 'Enter your delivery information', completed: false },
    { id: 'summary', title: 'Order Summary', description: 'Review your order and complete payment', completed: false }
  ], [getTranslation]);

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

  const handleProceedToAddress = () => {
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      toast.error(getTranslation('bookingFlow.fillRequiredFields', 'Please fill in all required fields'));
      return;
    }

    if (emailError) {
      toast.error('Please fix the email validation error before proceeding');
      return;
    }

    setCurrentStep(1);
    onStepChange?.(1);
    toast.success('Personal information saved! Now enter your shipping address.');
  };

  const handleProceedToSummary = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast.error('Please fill in all required address fields');
      return;
    }

    setCurrentStep(2);
    onStepChange?.(2);
    toast.success('Address saved! Review your order and complete payment.');
  };

  // Payment success handler will be implemented when payment integration is added
  // Payment success handler will be implemented when payment integration is added
  /*
  const handlePaymentSuccess = (paymentData: {
    orderId: string;
    status: string;
    amount?: number;
    currency?: string;
    transactionId?: string;
  }) => {
    console.log('✅ Payment successful:', paymentData);
    toast.success('¡Pago exitoso! Tu pedido ha sido confirmado.');
    
    const orderData = {
      orderId: paymentData.orderId,
      status: paymentData.status,
      amount: paymentData.amount || Math.round(calculateTotal() * 100),
      currency: product.currency || 'PEN',
      items: cartItems
    };
    
    onCheckoutComplete?.(orderData);
  };
  */

  const calculateSubtotal = () => {
    // Validate that all cart items use the same currency as the product
    const invalidItems = cartItems.filter(item => item.currency !== product.currency);
    if (invalidItems.length > 0) {
      console.warn('Cart contains items with different currencies:', invalidItems);
      // For now, convert all items to product currency (assuming same value)
      // In a real app, you'd need proper currency conversion
    }

    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% IGV for Peru
  };

  const calculateShipping = () => {
    return 0; // Free shipping
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const formatCurrency = (amount: number, currency: string = product.currency) => {
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

  return (
    <AppLayout className="min-h-screen bg-gray-50">
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
          {/* Step 1: Personal Information */}
          {currentStep === 0 && (
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
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="Enter your full name"
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
                                      key={country.code}
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

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleProceedToAddress}
                      disabled={!formData.clientName || !formData.clientEmail || !formData.clientPhone || !!emailError}
                      className="px-8 py-4 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Continue to Address
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Shipping Address */}
          {currentStep === 1 && (
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
                        onStepChange?.(0);
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

          {/* Step 3: Order Summary & Payment */}
          {currentStep === 2 && (
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price * item.quantity, item.currency)}</p>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatCurrency(calculateShipping())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (IGV 18%):</span>
                        <span>{formatCurrency(calculateTax())}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-8 text-center">
                      <div className="mb-6">
                        <CreditCard className="w-16 h-16 text-muted mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-primary mb-2">Payment Integration</h3>
                        <p className="text-muted">
                          Payment processing will be integrated here. 
                          The form will be added when a new payment provider is selected.
                        </p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                          <strong>Note:</strong> Payment integration is currently being updated. 
                          Please contact support for assistance with payments.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(1);
                    onStepChange?.(1);
                  }}
                  className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5 text-primary" />
                  Back to Address
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
