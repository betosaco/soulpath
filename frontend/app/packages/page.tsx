'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, ArrowRight, ArrowLeft, Clock, Users, Star, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IzipayForm } from '@/components/izipay/IzipayForm';
import { Header } from '@/components/Header';
import { EnhancedSchedule } from '@/components/EnhancedSchedule';
import '@/components/ui/mobile-booking.css';
import '@/components/EnhancedSchedule.css';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
import { usePackages, PackagePrice } from '@/hooks/usePackages';
import { toast } from 'sonner';

// PackagePrice interface is now imported from usePackages hook


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
  // Additional properties for internal use
  startTime?: string;
  endTime?: string;
  instructorName?: string;
  scheduleTemplate?: {
    dayOfWeek: string;
    sessionDuration: {
      name: string;
      duration_minutes: number;
    };
  };
}

interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  countryCode: string;
  language: 'en' | 'es';
  selectedPackage: PackagePrice | null;
  selectedScheduleSlot: ScheduleSlot | null;
  skipBooking: boolean;
  specialRequests?: string;
}

export default function PackagesPage() {
  // Fetch packages from database
  const { packages, loading, error, refetch } = usePackages('PEN');
  const [currentStep, setCurrentStep] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  
  const { language, setLanguage } = useLanguage();

  const countries = [
    { code: '+51', flag: '🇵🇪', name: 'Peru', country: 'PE' },
    { code: '+1', flag: '🇺🇸', name: 'United States', country: 'US' },
    { code: '+1', flag: '🇨🇦', name: 'Canada', country: 'CA' },
    { code: '+52', flag: '🇲🇽', name: 'Mexico', country: 'MX' },
    { code: '+54', flag: '🇦🇷', name: 'Argentina', country: 'AR' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil', country: 'BR' },
    { code: '+56', flag: '🇨🇱', name: 'Chile', country: 'CL' },
    { code: '+57', flag: '🇨🇴', name: 'Colombia', country: 'CO' },
    { code: '+58', flag: '🇻🇪', name: 'Venezuela', country: 'VE' },
    { code: '+34', flag: '🇪🇸', name: 'Spain', country: 'ES' },
    { code: '+33', flag: '🇫🇷', name: 'France', country: 'FR' },
    { code: '+49', flag: '🇩🇪', name: 'Germany', country: 'DE' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom', country: 'GB' },
    { code: '+39', flag: '🇮🇹', name: 'Italy', country: 'IT' },
    { code: '+86', flag: '🇨🇳', name: 'China', country: 'CN' },
    { code: '+81', flag: '🇯🇵', name: 'Japan', country: 'JP' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea', country: 'KR' },
    { code: '+91', flag: '🇮🇳', name: 'India', country: 'IN' },
    { code: '+61', flag: '🇦🇺', name: 'Australia', country: 'AU' }
  ];

  const { t } = useTranslations();
  const translations = t as Record<string, string | Record<string, string>>;

  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    countryCode: '+51',
    language: 'en',
    selectedPackage: null,
    selectedScheduleSlot: null,
    skipBooking: false
  });

  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  const steps = [
    { id: 0, name: 'Select Package', description: 'Choose your package' },
    { id: 1, name: 'Personal Info', description: 'Your details' },
    { id: 2, name: 'Booking', description: 'Schedule your session' },
    { id: 3, name: 'Payment', description: 'Complete purchase' }
  ];


  const scrollToSection = (section: string) => {
    // Add scroll functionality here
    console.log('Scroll to section:', section);
  };

  // Note: Schedule loading is now handled by the EnhancedSchedule component

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

  // Ensure scrolling works on payment step
  useEffect(() => {
    if (currentStep === 3) {
      // Force enable scrolling on payment step
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [currentStep]);


  const handlePackageSelect = (pkg: PackagePrice) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg }));
    setCurrentStep(1);
  };

  const handleSlotSelect = (slot: ScheduleSlot) => {
    // Add additional properties for internal use
    const transformedSlot: ScheduleSlot = {
      ...slot,
      startTime: new Date(`${slot.date}T${slot.time}`).toISOString(),
      endTime: new Date(new Date(`${slot.date}T${slot.time}`).getTime() + (slot.duration * 60000)).toISOString(),
      instructorName: slot.teacher.name,
      scheduleTemplate: {
        dayOfWeek: slot.dayOfWeek,
        sessionDuration: {
          name: slot.serviceType.name,
          duration_minutes: slot.duration
        }
      }
    };
    
    setFormData(prev => ({ ...prev, selectedScheduleSlot: transformedSlot, skipBooking: false }));
  };


  const handlePaymentSuccess = async (paymentData: { orderId: string; amount: number; currency: string; status: string }) => {
    try {
      
      // Create the purchase
      const purchaseResponse = await fetch('/api/client/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packagePriceId: formData.selectedPackage?.id,
          quantity: 1,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: `${formData.countryCode}${formData.clientPhone}`,
          language: formData.language,
          paymentMethod: 'izipay',
          paymentData: paymentData
        })
      });

      const purchaseResult = await purchaseResponse.json();

      if (purchaseResult.success) {
        // If booking was selected, create the booking
        if (!formData.skipBooking && formData.selectedScheduleSlot) {
          const bookingResponse = await fetch('/api/client/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userPackageId: purchaseResult.data.userPackageId,
              scheduleSlotId: formData.selectedScheduleSlot.id,
              sessionType: formData.selectedPackage?.packageDefinition.name || 'Standard Reading',
              notes: formData.specialRequests
            })
          });

          const bookingResult = await bookingResponse.json();
          
          if (bookingResult.success) {
            toast.success('Purchase and booking completed successfully!');
          } else {
            toast.success('Purchase completed! You can book your session later.');
          }
        } else {
          toast.success('Purchase completed! You can book your session later.');
        }

        // Reset form
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          countryCode: '+51',
          language: 'en',
          selectedPackage: null,
          selectedScheduleSlot: null,
          skipBooking: false
        });
        setCurrentStep(0);
      } else {
        throw new Error(purchaseResult.message || 'Purchase failed');
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
      toast.error('Failed to complete purchase');
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  // Debug logging
  console.log('🔍 Packages page render - loading:', loading, 'packages count:', packages.length, 'error:', error);
  console.log('📦 Packages data:', packages);

  return (
    <div className="min-h-screen bg-white packages-page inner-page mobile-scrollable mobile-content">
      <Header
        language={language}
        setLanguage={setLanguage}
        scrollToSection={scrollToSection}
        t={translations}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={null}
        isAdmin={false}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pt-24 mobile-scrollable">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Choose Your Package
          </h1>
          <p 
            className="text-xl text-muted max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Select the perfect package for your spiritual journey and book your session
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-400 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step.id + 1}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`font-semibold ${
                      currentStep >= step.id ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="packages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted text-lg">Loading packages...</p>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                  <p className="text-red-600 text-lg mb-4">Error loading packages: {error}</p>
                  <button 
                    onClick={refetch} 
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                </div>
              ) : packages.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Package className="w-8 h-8 mx-auto mb-4 text-muted" />
                  <p className="text-muted text-lg">No packages available at the moment.</p>
                  <button 
                    onClick={refetch} 
                    className="btn-primary mt-4"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                packages.map((pkg) => (
                <Card key={pkg.id} className="card-base card-hover hover-scale">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle 
                      className="text-2xl text-primary"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {pkg.packageDefinition.name}
                    </CardTitle>
                    <div 
                      className="text-3xl font-bold text-black"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {pkg.currency.symbol}{pkg.price}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p 
                      className="text-muted mb-6 text-center"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
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
                        <Star className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-muted">Personalized guidance</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePackageSelect(pkg)}
                      className="btn-primary w-full"
                    >
                      Select Package
                    </button>
                  </CardContent>
                </Card>
                ))
              )}
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="personal-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="clientName" className="text-black text-lg font-medium mb-2 block">Full Name *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                        placeholder="Enter your full name"
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
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="clientPhone" className="text-black text-lg font-medium mb-2 block">Phone *</Label>
                      <div className="flex gap-2">
                        {/* Country Code Dropdown */}
                        <div className="relative">
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
                          
                          {/* Lateral Right Side Menu */}
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
                                      country.code.includes(countrySearchTerm) ||
                                      country.country.toLowerCase().includes(countrySearchTerm.toLowerCase())
                                    )
                                    .map((country, index) => (
                                      <button
                                        key={country.country}
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
                                    country.code.includes(countrySearchTerm) ||
                                    country.country.toLowerCase().includes(countrySearchTerm.toLowerCase())
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
                          className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 flex-1"
                          placeholder="987654321"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 flex items-center"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto"
            >
              <Card className="card-base">
                <CardHeader>
                  <CardTitle 
                    className="text-2xl text-primary text-center"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Schedule Your Session
                  </CardTitle>
                  <p 
                    className="text-muted text-center"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Choose a time that works for you, or skip to book later
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Skip Booking Option */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, skipBooking: true, selectedScheduleSlot: null }));
                        setCurrentStep(3); // Go directly to payment step
                      }}
                      className={`w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 font-medium text-lg ${
                        formData.skipBooking 
                          ? 'bg-white text-primary border-primary shadow-lg' 
                          : 'bg-white text-primary border-primary hover:bg-gray-50'
                      }`}
                    >
                      {formData.skipBooking ? '✓ Skip booking for now - I\'ll book later from my account' : 'Skip booking for now - I\'ll book later from my account'}
                    </button>
                  </div>

                  {/* Enhanced Schedule Component */}
                  {!formData.skipBooking && (
                    <div className="mb-6">
                      <EnhancedSchedule 
                        onBookSlot={handleSlotSelect}
                        showBookingButton={false}
                        className="max-w-full"
                      />
                    </div>
                  )}

                  {/* Selected Slot Display */}
                  {formData.selectedScheduleSlot && !formData.skipBooking && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg">
                      <h4 className="text-lg font-semibold text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Selected Session
                      </h4>
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">
                          {formData.selectedScheduleSlot.startTime ? new Date(formData.selectedScheduleSlot.startTime).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          }) : 'No time selected'} at {formData.selectedScheduleSlot.startTime ? new Date(formData.selectedScheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time selected'}
                        </div>
                        <div className="text-gray-600">
                          {formData.selectedScheduleSlot.scheduleTemplate?.sessionDuration?.name || 'Session'} • {formData.selectedScheduleSlot.scheduleTemplate?.sessionDuration?.duration_minutes || 60} minutes
                        </div>
                        <div className="text-gray-600">
                          Instructor: {formData.selectedScheduleSlot.instructorName || 'Available'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!formData.skipBooking && !formData.selectedScheduleSlot}
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto payment-step"
              style={{ overflow: 'visible' }}
            >
              <Card className="card-base">
                <CardHeader>
                  <CardTitle 
                    className="text-2xl text-primary text-center"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Complete Your Purchase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-light rounded-lg p-4 mb-6">
                    <h3 
                      className="text-lg font-semibold text-black mb-3"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Package:</span>
                        <span className="text-black">{formData.selectedPackage?.packageDefinition.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Sessions:</span>
                        <span className="text-black">{formData.selectedPackage?.packageDefinition.sessionsCount}</span>
                      </div>
                      {formData.selectedScheduleSlot && (
                        <div className="flex justify-between">
                          <span className="text-muted">First Session:</span>
                          <span className="text-black">
                            {formData.selectedScheduleSlot.startTime ? new Date(formData.selectedScheduleSlot.startTime).toLocaleDateString() : 'No date'} at{' '}
                            {formData.selectedScheduleSlot.startTime ? new Date(formData.selectedScheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                        <span className="text-primary">Total:</span>
                        <span className="text-primary">
                          {formData.selectedPackage?.currency.symbol}{formData.selectedPackage?.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {formData.selectedPackage && (
                    <IzipayForm
                      publicKey="69876357:testpublickey_DEMOPUBLICKEY95me92597fd28tGD4r5"
                      amountInCents={Math.round(formData.selectedPackage.price * 100)}
                      currency="PEN"
                      onSuccess={(token) => handlePaymentSuccess({ 
                        orderId: token, 
                        amount: formData.selectedPackage?.price || 0, 
                        currency: 'PEN', 
                        status: 'completed' 
                      })}
                      onError={handlePaymentError}
                    />
                  )}

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-4 text-lg font-medium text-primary border-2 border-primary rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
