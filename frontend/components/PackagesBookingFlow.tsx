'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Package, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  MessageCircle,
  Users,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedSchedule } from './EnhancedSchedule';
import { PaymentForm } from './PaymentForm';
import { usePackages, PackagePrice } from '@/hooks/usePackages';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { countries } from '@/lib/countries';
import { toast } from 'sonner';

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
  selectedPackage: PackagePrice | null;
  selectedSchedule: ScheduleSlot | null;
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

export function PackagesBookingFlow() {
  const { packages, loading: packagesLoading, error: packagesError } = usePackages('PEN');
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const [currentStep, setCurrentStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  
  const [formData, setFormData] = useState<BookingFormData>({
    selectedPackage: null,
    selectedSchedule: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    countryCode: '+51',
    language: 'en'
  });

  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  // Helper function to safely access nested translation properties
  const getTranslation = (path: string, fallback: string = ''): string => {
    const keys = path.split('.');
    let current: any = (t && typeof t === 'object') ? t : {};

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }

    return typeof current === 'string' ? current : fallback;
  };

  const steps: BookingStep[] = [
    { id: 'package', title: getTranslation('bookingFlow.selectPackage', 'Select Package'), description: getTranslation('bookingFlow.selectPackageDesc', 'Choose the package that best fits your needs'), completed: false },
    { id: 'personal', title: getTranslation('bookingFlow.personalInfo', 'Personal Information'), description: getTranslation('bookingFlow.personalInfoDesc', 'Provide your contact details'), completed: false },
    { id: 'booking', title: getTranslation('bookingFlow.selectSchedule', 'Select Schedule'), description: getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time'), completed: false },
    { id: 'summary', title: getTranslation('bookingFlow.reviewConfirm', 'Review & Confirm'), description: getTranslation('bookingFlow.reviewConfirmDesc', 'Review your booking details'), completed: false },
    { id: 'payment', title: getTranslation('bookingFlow.payment', 'Payment'), description: getTranslation('bookingFlow.paymentDesc', 'Complete your payment securely'), completed: false }
  ];

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

  const handlePackageSelect = (pkg: PackagePrice) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg }));
    setCurrentStep(1);
    toast.success(getTranslation('bookingFlow.packageSelected', 'Package selected! Now provide your information.'));
  };

  const handleScheduleSelect = (slot: ScheduleSlot) => {
    setFormData(prev => ({ ...prev, selectedSchedule: slot }));
    setCurrentStep(3);
    toast.success(getTranslation('bookingFlow.scheduleSelected', 'Schedule selected! Now review your booking.'));
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('✅ Payment successful:', paymentData);
    toast.success('¡Pago exitoso! Tu paquete ha sido activado.');
    // Here you would typically redirect to a success page or dashboard
    // For now, we'll just show a success message
  };

  const handleProceedToBooking = () => {
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      toast.error(getTranslation('bookingFlow.fillRequiredFields', 'Please fill in all required fields'));
      return;
    }
    setCurrentStep(2);
  };



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
          {/* Step 1: Package Selection */}
          {currentStep === 0 && (
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
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted text-lg">Loading packages...</p>
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
                            <Star className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-muted">Personalized guidance</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePackageSelect(pkg)}
                          className="w-full bg-[#6ea058] hover:bg-[#5a8a47] text-white"
                        >
                          Select Package
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 1 && (
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
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder={getTranslation('bookingFlow.fullNamePlaceholder', 'Enter your full name')}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail" className="text-black text-lg font-medium mb-2 block">Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder={getTranslation('bookingFlow.emailPlaceholder', 'Enter your email')}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile-input-group">
                    <div className="md:col-span-2">
                      <Label htmlFor="clientPhone" className="text-black text-lg font-medium mb-2 block">Phone *</Label>
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
                        placeholder="987654321"
                        required
                      />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="language" className="text-black text-lg font-medium mb-2 block">
                      Preferred Language
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value: 'en' | 'es') => setFormData(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="h-14">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-8 py-4 text-lg font-medium text-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#6ea058] hover:text-white transition-all duration-200 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Packages
                </button>
                <button
                  onClick={handleProceedToBooking}
                  className="px-8 py-4 text-lg font-medium text-white bg-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#5a8a47] hover:border-[#5a8a47] transition-all duration-200 flex items-center"
                >
                  Continue to Booking
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Schedule Selection */}
          {currentStep === 2 && (
            <motion.div
              key="booking"
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
              />

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-4 text-lg font-medium text-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#6ea058] hover:text-white transition-all duration-200 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Personal Info
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Summary & Review */}
          {currentStep === 3 && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Review Your Booking</h2>
                <p className="text-xl text-muted">Please review your information before proceeding to payment</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Package Details */}
                <Card className="card-base">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      Selected Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold text-lg text-primary mb-2">{formData.selectedPackage!.packageDefinition.name}</h4>
                      <div className="text-2xl font-bold text-primary">
                        {formData.selectedPackage!.currency.symbol}{formData.selectedPackage!.price}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted">Sessions:</span>
                        <span className="font-semibold ml-2">{formData.selectedPackage!.packageDefinition.sessionsCount}</span>
                      </div>
                      <div>
                        <span className="text-muted">Duration:</span>
                        <span className="font-semibold ml-2">{formData.selectedPackage!.packageDefinition.sessionDuration.duration_minutes} min each</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info & Schedule */}
                <Card className="card-base">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-2">
                      <User className="w-6 h-6" />
                      Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">Personal Details</h4>
                      <p className="text-muted"><strong>Name:</strong> {formData.clientName}</p>
                      <p className="text-muted"><strong>Email:</strong> {formData.clientEmail}</p>
                      <p className="text-muted"><strong>Phone:</strong> {formData.countryCode}{formData.clientPhone}</p>
                      <p className="text-muted"><strong>Language:</strong> {formData.language === 'en' ? 'English' : 'Español'}</p>
                    </div>

                    {formData.selectedSchedule && (
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">Selected Schedule</h4>
                        <p className="text-muted"><strong>Date:</strong> {formatDate(formData.selectedSchedule.date)}</p>
                        <p className="text-muted"><strong>Time:</strong> {formatTime(formData.selectedSchedule.time)}</p>
                        <p className="text-muted"><strong>Instructor:</strong> {formData.selectedSchedule.teacher.name}</p>
                        <p className="text-muted"><strong>Service:</strong> {formData.selectedSchedule.serviceType.name}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-4 text-lg font-medium text-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#6ea058] hover:text-white transition-all duration-200 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Schedule
                </button>
                
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-4 text-lg font-medium text-white bg-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#5a8a47] hover:border-[#5a8a47] transition-all duration-200 flex items-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>

              {/* Payment Notice */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">
                  Secure payment processing with Lyra. Your payment information is encrypted and secure.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 4 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mobile-step-content"
            >
              <PaymentForm
                packageData={{
                  id: formData.selectedPackage!.id,
                  name: formData.selectedPackage!.packageDefinition.name,
                  price: formData.selectedPackage!.price,
                  currency: formData.selectedPackage!.currency.symbol,
                  sessions: formData.selectedPackage!.packageDefinition.sessionsCount,
                  duration: formData.selectedPackage!.packageDefinition.sessionDuration.duration_minutes
                }}
                personalInfo={{
                  name: formData.clientName,
                  email: formData.clientEmail,
                  phone: formData.clientPhone,
                  countryCode: formData.countryCode
                }}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={() => setCurrentStep(3)}
                isLoading={sending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
