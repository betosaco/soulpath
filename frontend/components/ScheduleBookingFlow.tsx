'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  MapPin,
  CreditCard,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedSchedule } from './EnhancedSchedule';
import { usePackages, PackagePrice } from '@/hooks/usePackages';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { countries } from '@/lib/countries';
import { toast } from 'sonner';
// import { AppLayout } from '@/components/AppLayout';
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
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  countryCode: string;
  language: 'en' | 'es';
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

export function ScheduleBookingFlow({ 
  startDate, 
  endDate, 
  onSlotsChange,
  onStepChange
}: ScheduleBookingFlowProps = {}) {
  const { packages, loading: packagesLoading, error: packagesError } = usePackages('PEN');
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  // const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    selectedSchedule: null,
    selectedPackage: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    countryCode: '+51',
    language: 'en'
  });

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
    { id: 'package', title: getTranslation('bookingFlow.selectPackage', 'Select Package'), description: getTranslation('bookingFlow.selectPackageDesc', 'Choose the package that best fits your needs'), completed: false },
    { id: 'personal', title: getTranslation('bookingFlow.personalInfo', 'Personal Information'), description: getTranslation('bookingFlow.personalInfoDesc', 'Provide your contact details'), completed: false },
    { id: 'summary', title: 'Summary & Payment', description: 'Review your booking and complete payment', completed: false }
  ], [getTranslation]);

  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  // Close dropdown when clicking outside and prevent page scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.country-dropdown')) {
          setIsCountryDropdownOpen(false);
          setCountrySearchTerm('');
        }
      }
    };

    // Prevent page scroll when menu is open
    if (isCountryDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore scroll when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, [isCountryDropdownOpen]);

  const handleScheduleSelect = (slot: ScheduleSlot) => {
    setFormData(prev => ({ ...prev, selectedSchedule: slot }));
    setCurrentStep(1);
    onStepChange?.(1);
    toast.success('Schedule selected! Now choose your package.');
  };

  const handlePackageSelect = (pkg: PackagePrice) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg }));
    setCurrentStep(2);
    onStepChange?.(2);
    toast.success(getTranslation('bookingFlow.packageSelected', 'Package selected! Now provide your information.'));
  };

  const handleProceedToSummary = () => {
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      toast.error(getTranslation('bookingFlow.fillRequiredFields', 'Please fill in all required fields'));
      return;
    }

    // Validate email before proceeding
    if (formData.clientEmail) {
      const emailValidation = validateEmailWithMessage(formData.clientEmail);
      if (emailValidation) {
        setEmailError(emailValidation);
        toast.error('Please fix the email validation error before proceeding');
        return;
      }
    }

    // Go to summary step
    setCurrentStep(3);
    onStepChange?.(3);
  };

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
    toast.success('¡Pago exitoso! Tu reserva ha sido confirmada.');
    
    // Store payment result in sessionStorage for the success page
    sessionStorage.setItem('paymentResult', JSON.stringify({
      orderStatus: 'PAID',
      orderId: `SCH-${formData.selectedSchedule?.id}-${Date.now()}`,
      amount: (formData.selectedPackage?.price || 0) * 100, // Convert to cents
      currency: formData.selectedPackage?.currency || 'PEN',
      packageData: {
        ...formData.selectedPackage,
        name: formData.selectedPackage?.packageDefinition.name || '',
        description: formData.selectedPackage?.packageDefinition.description || '',
        sessionsCount: formData.selectedPackage?.packageDefinition.sessionsCount || 0,
        packageType: formData.selectedPackage?.packageDefinition.packageType || '',
        maxGroupSize: formData.selectedPackage?.packageDefinition.maxGroupSize || 0,
        sessionDuration: formData.selectedPackage?.packageDefinition.sessionDuration || 0
      },
      bookingData: formData.selectedSchedule ? {
        selectedDate: formData.selectedSchedule.date,
        selectedTime: formData.selectedSchedule.time,
        teacher: formData.selectedSchedule.teacher,
        dayOfWeek: formData.selectedSchedule.dayOfWeek,
        serviceType: formData.selectedSchedule.serviceType,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        countryCode: formData.countryCode
      } : null,
      paymentData: paymentData
    }));
    
    // Redirect to payment success page
    window.location.href = '/payment-success';
  };
  */

  // const handlePaymentError = (error: string) => {
  //   console.error('❌ Payment failed:', error);
  //   toast.error(`Payment failed: ${error}`);
  //   setPaymentProcessing(false);
  // };

  // const handlePaymentStart = () => {
  //   // Payment processing state management will be added when payment integration is implemented
  //   console.log('Payment processing started');
  // };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
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
                <h2 className="text-3xl font-bold text-primary mb-4">Select Your Schedule</h2>
                <p className="text-xl text-muted">Choose your preferred date and time for your session</p>
              </div>
              
              <EnhancedSchedule 
                onBookSlot={handleScheduleSelect}
                showBookingButton={false}
                className="max-w-full"
                startDate={startDate}
                endDate={endDate}
                onSlotsChange={onSlotsChange}
              />
            </motion.div>
          )}

          {/* Step 2: Package Selection */}
          {currentStep === 1 && (
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

          {/* Step 3: Personal Information */}
          {currentStep === 2 && (
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
                      <Label htmlFor="clientName" className="text-black text-lg font-medium mb-2 block">{getTranslation('bookingFlow.fullName', 'Full Name')} *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder={getTranslation('bookingFlow.fullNamePlaceholder', 'Enter your full name')}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail" className="text-black text-lg font-medium mb-2 block">{getTranslation('bookingFlow.email', 'Email')} *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({ ...prev, clientEmail: value }));
                          // Validate email when it changes
                          const emailValidation = validateEmailWithMessage(value);
                          setEmailError(emailValidation);
                        }}
                        className={`h-14 px-4 text-lg border-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 ${
                          emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder={getTranslation('bookingFlow.emailPlaceholder', 'Enter your email')}
                        required
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1">{emailError}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile-input-group">
                    <div className="md:col-span-2">
                      <Label htmlFor="clientPhone" className="text-black text-lg font-medium mb-2 block">{getTranslation('bookingFlow.phone', 'Phone Number')} *</Label>
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
                                
                                {/* No results message */}
                                {countries.filter(country => 
                                  country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                                  country.code.includes(countrySearchTerm)
                                ).length === 0 && (
                                  <div className="px-4 py-12 text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <p className="text-lg">No countries found</p>
                                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                                  </div>
                                )}
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
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 flex-1 mobile-phone-input"
                        placeholder={getTranslation('bookingFlow.phonePlaceholder', '987654321')}
                        required
                      />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="language" className="text-black text-lg font-medium mb-2 block">
                      {getTranslation('bookingFlow.preferredLanguage', 'Preferred Language')}
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value: 'en' | 'es') => setFormData(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="h-14">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{getTranslation('bookingFlow.languageEnglish', 'English')}</SelectItem>
                        <SelectItem value="es">{getTranslation('bookingFlow.languageSpanish', 'Español')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    onStepChange?.(1);
                  }}
                  className="px-8 py-4 text-lg font-medium text-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#6ea058] hover:text-white transition-all duration-200 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 text-[#6ea058]" />
                  {getTranslation('bookingFlow.backToPackages', 'Back to Packages')}
                </button>
                <button
                  onClick={handleProceedToSummary}
                  className="px-8 py-4 text-lg font-medium text-white bg-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#5a8a47] hover:border-[#5a8a47] transition-all duration-200 flex items-center"
                >
                  {getTranslation('bookingFlow.proceedToSummary', 'Proceed to Summary')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Summary & Payment */}
          {currentStep === 3 && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Review & Complete Payment</h2>
                <p className="text-xl text-muted">Review your booking details and complete your secure payment</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Schedule Details */}
                <Card className="card-base">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Session Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-lg">{formatDate(formData.selectedSchedule!.date)}</p>
                        <p className="text-muted">{formData.selectedSchedule!.dayOfWeek}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-lg">{formatTime(formData.selectedSchedule!.time)}</p>
                        <p className="text-muted">{formData.selectedSchedule!.duration} minutes</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">{formData.selectedSchedule!.teacher.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">{formData.selectedSchedule!.venue.name}</p>
                        <p className="text-sm text-muted">{formData.selectedSchedule!.venue.address}, {formData.selectedSchedule!.venue.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Package & Personal Info */}
                <Card className="card-base">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      Package & Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">Selected Package</h4>
                      <p className="text-muted mb-3">{formData.selectedPackage!.packageDefinition.name}</p>
                      <p className="text-lg font-semibold text-primary mb-3">
                        {formData.selectedPackage!.currency.symbol}{formData.selectedPackage!.price} {formData.selectedPackage!.currency.code}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          <span className="text-muted">{formData.selectedPackage!.packageDefinition.sessionsCount} Sessions</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          <span className="text-muted">{formData.selectedPackage!.packageDefinition.sessionDuration.duration_minutes} minutes each</span>
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
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">Personal Information</h4>
                      <p className="text-muted"><strong>Name:</strong> {formData.clientName}</p>
                      <p className="text-muted"><strong>Email:</strong> {formData.clientEmail}</p>
                      <p className="text-muted"><strong>Phone:</strong> {formData.countryCode}{formData.clientPhone}</p>
                      <p className="text-muted"><strong>Language:</strong> {formData.language === 'en' ? 'English' : 'Español'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Section */}
              <div className="mt-8">
                <Card className="card-base">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-2">
                      <CreditCard className="w-6 h-6" />
                      Complete Payment
                    </CardTitle>
                    <p className="text-muted">Secure payment processing</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Payment Summary */}
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-semibold">{formData.selectedPackage!.packageDefinition.name}</p>
                            <p className="text-muted">{formData.selectedPackage!.packageDefinition.sessionsCount} sessions</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {formData.selectedPackage!.currency.symbol}{formData.selectedPackage!.price}
                            </p>
                            <p className="text-sm text-muted">{formData.selectedPackage!.currency.code}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Integration Placeholder */}
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
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setCurrentStep(2);
                    onStepChange?.(2);
                  }}
                  className="px-8 py-4 text-lg font-medium text-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#6ea058] hover:text-white transition-all duration-200 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 text-[#6ea058]" />
                  {getTranslation('bookingFlow.backToPersonal', 'Back to Personal Info')}
                </button>
              </div>

              {/* Security Note */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">
                  Your payment is secure and encrypted. We use industry-standard security measures to protect your information.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
