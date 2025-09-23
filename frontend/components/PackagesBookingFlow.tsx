'use client';

/**
 * @deprecated This component is deprecated. Use MasterBookingFlow instead.
 * 
 * The PackagesBookingFlow component has been consolidated into MasterBookingFlow.tsx
 * which provides a unified booking and checkout experience.
 * 
 * Migration: Replace usage with MasterBookingFlow component
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Package,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedSchedule } from './EnhancedSchedule';
import { usePackages, PackagePrice } from '@/hooks/usePackages';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';
import { useCart } from '@/store/appStore';

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
  const { addItem: addToCart, items: cartItems, openCart: setIsCartOpen } = useCart();
  const [currentStep, setCurrentStep] = useState(0);

  // Icon diagnostic - remove after testing
  useEffect(() => {
    const checkIcons = () => {
      const icons = document.querySelectorAll('svg');
      console.log('📊 Icon Diagnostic:', {
        totalIcons: icons.length,
        visibleIcons: Array.from(icons).filter(icon => {
          const style = window.getComputedStyle(icon);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        }).length,
        lucideIcons: document.querySelectorAll('.lucide').length,
        firstIcon: icons[0] ? {
          tagName: icons[0].tagName,
          classList: Array.from(icons[0].classList),
          style: window.getComputedStyle(icons[0])
        } : null
      });
    };

    // Check icons after component mounts
    setTimeout(checkIcons, 1000);
  }, []);
  
  const [formData, setFormData] = useState<BookingFormData>({
    selectedPackage: null,
    selectedSchedule: null
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
    { id: 'package', title: getTranslation('bookingFlow.selectPackage', 'Select Package'), description: getTranslation('bookingFlow.selectPackageDesc', 'Choose the package that best fits your needs'), completed: false },
    { id: 'booking', title: getTranslation('bookingFlow.selectSchedule', 'Select Schedule'), description: getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time (optional)'), completed: false }
  ], [getTranslation]);


  const handlePackageSelect = (pkg: PackagePrice) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg }));
    
    // Always create new package item with unique ID (no merging)
    // This allows multiple packages of the same type to be treated separately
    const uniqueId = `${pkg.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add package to cart
    addToCart({
      id: uniqueId,
      name: pkg.packageDefinition.name,
      price: pkg.price,
      image: '/images/products/yoga-journal-1.jpg', // Default package image
      sku: `PKG-${pkg.id}`,
      currency: pkg.currency?.code || 'PEN',
      type: 'package',
      sessions: pkg.packageDefinition.sessionsCount,
      duration: pkg.packageDefinition.sessionDuration?.duration_minutes,
      packageType: pkg.packageDefinition.packageType,
      maxGroupSize: pkg.packageDefinition.maxGroupSize
    });
    
    toast.success(`${pkg.packageDefinition.name} added to cart`);
    
    // All packages should go to schedule page for class selection
    // Set up session storage for adding bookings to this package
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isAddingMoreBookings', 'true');
      // Check if there are already other packages in cart
      const existingPackages = cartItems.filter(item => item.type === 'package');
      if (existingPackages.length > 0) {
        // Multiple packages - don't set specific package ID, let schedule page show modal
        sessionStorage.removeItem('addingToPackageId');
      } else {
        // First package - set specific package ID
        sessionStorage.setItem('addingToPackageId', uniqueId);
      }
      localStorage.setItem('isCartOpen', 'true');
    }
    if (setIsCartOpen) {
      setIsCartOpen(true);
    }
    window.location.href = '/schedule';
  };

  const handleScheduleSelect = (slot: ScheduleSlot) => {
    setFormData(prev => ({ ...prev, selectedSchedule: slot }));
    
    // Check if package is selected
    if (!formData.selectedPackage) {
      toast.error('Please select a package first');
      setCurrentStep(0); // Go back to package selection
      return;
    }
    
    // Store schedule selection in sessionStorage for checkout
    sessionStorage.setItem('selectedSchedule', JSON.stringify({
      selectedDate: slot.date,
      selectedTime: slot.time,
      teacher: slot.teacher,
      dayOfWeek: slot.dayOfWeek,
      serviceType: slot.serviceType
    }));
    
    // Keep sidecart open and redirect to unified checkout
    if (typeof window !== 'undefined') {
      localStorage.setItem('isCartOpen', 'true');
    }
    if (setIsCartOpen) {
      setIsCartOpen(true);
    }
    window.location.href = '/checkout';
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
                            <span className="text-muted">{pkg.packageDefinition.sessionDuration.duration_minutes === 60 ? '1 hour' : `${pkg.packageDefinition.sessionDuration.duration_minutes} minutes`} each</span>
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

          {/* Step 2: Schedule Selection */}
          {currentStep === 1 && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto mobile-step-content"
            >

              {/* Skip Schedule Selection Button */}
              <div className="text-center mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Want to skip scheduling?</h3>
                  <p className="text-sm text-green-600 mb-4">
                    You can purchase the package now and book a specific time later, or use it flexibly
                  </p>
                  <button
                    onClick={() => {
                      // Skip schedule selection and go directly to payment
                      setCurrentStep(3);
                      toast.success('Package purchase without specific schedule selected');
                    }}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#6ea058] border border-[#6ea058] rounded-lg hover:bg-[#5a8a47] hover:border-[#5a8a47] transition-all duration-200 shadow-sm"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Skip Schedule - Buy Package Only
                  </button>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </div>
              
              <EnhancedSchedule 
                onBookSlot={handleScheduleSelect}
                showBookingButton={false}
                className="max-w-full"
              />

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-8 py-4 text-lg font-medium text-[#6ea058] border-2 border-[#6ea058] rounded-lg hover:bg-[#6ea058] hover:text-white transition-all duration-200 flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Packages
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
