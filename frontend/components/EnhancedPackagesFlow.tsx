'use client';

import React, { useState, useCallback } from 'react';
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
  Star,
  ShoppingCart,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedSchedule } from './EnhancedSchedule';
import { usePackages, PackagePrice } from '@/hooks/usePackagesQuery';

interface PackageInstance extends PackagePrice {
  instanceId: string;
  instanceNumber: number;
}
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
  selectedPackages: PackagePrice[];
  selectedSchedule: ScheduleSlot | null;
  selectedPackageForBooking: PackageInstance | null;
}

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export function EnhancedPackagesFlow() {
  const { data: packages, isLoading: packagesLoading, error: packagesError } = usePackages('PEN');
  
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const { addItem, items: cartItems, removeItem, updateQuantity } = useCart();
  const { openCart } = useCartUI();
  // Get packages from cart
  const cartPackages = cartItems.filter(item => item.type === 'package');

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<BookingFormData>({
    selectedPackages: [],
    selectedSchedule: null,
    selectedPackageForBooking: null
  });

  // Set initial step based on cart contents (only once on mount)
  React.useEffect(() => {
    // Always start at package selection step (step 0) to allow adding more packages
    setCurrentStep(0);
  }, []); // Empty dependency array - only run once on mount

  // Restore selected schedule from sessionStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSchedule = sessionStorage.getItem('selectedSchedule');
      if (savedSchedule) {
        try {
          const scheduleData = JSON.parse(savedSchedule);
          setFormData(prev => ({ ...prev, selectedSchedule: scheduleData }));
        } catch (error) {
          console.error('Error parsing saved schedule:', error);
        }
      }
    }
  }, []);

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

  const steps: BookingStep[] = React.useMemo(() => {
    const baseSteps = [
      { 
        id: 'packages', 
        title: getTranslation('bookingFlow.selectPackages', 'Select Packages'), 
        description: getTranslation('bookingFlow.selectPackagesDesc', 'Add packages to your cart'), 
        completed: false 
      }
    ];

    // Always show schedule step if there are packages in cart
    if (cartPackages.length > 0) {
      baseSteps.push({
        id: 'schedule', 
        title: getTranslation('bookingFlow.selectSchedule', 'Select Schedule'), 
        description: getTranslation('bookingFlow.selectScheduleDesc', 'Choose your preferred date and time'), 
        completed: false 
      });
    }

    // Only add package selection step if there are multiple packages
    if (cartPackages.length > 1) {
      baseSteps.push({
        id: 'package-selection', 
        title: getTranslation('bookingFlow.selectPackageForBooking', 'Choose Package for Booking'), 
        description: getTranslation('bookingFlow.selectPackageForBookingDesc', 'Select which package to use for this booking'), 
        completed: false 
      });
    }


    return baseSteps;
  }, [getTranslation, cartPackages.length]);

  const handleAddPackage = (pkg: PackagePrice) => {
    // Always create new package item with unique ID (no merging)
    // This allows multiple packages of the same type to be treated separately
    const uniqueId = `${pkg.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    addItem({
      id: uniqueId,
      name: pkg.packageDefinition.name,
      price: Number(pkg.price),
      image: '/images/products/yoga-journal-1.jpg',
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
      console.log('🔍 Adding new package - existing packages:', existingPackages.length);
      console.log('🔍 New package ID:', uniqueId);
      
      if (existingPackages.length > 0) {
        // Multiple packages - don't set specific package ID, let schedule page show modal
        console.log('✅ Multiple packages detected - removing addingToPackageId');
        sessionStorage.removeItem('addingToPackageId');
      } else {
        // First package - set specific package ID
        console.log('✅ First package - setting addingToPackageId:', uniqueId);
        sessionStorage.setItem('addingToPackageId', uniqueId);
      }
      localStorage.setItem('isCartOpen', 'true');
    }
    openCart();
    window.location.href = '/schedule';
  };

  const handleRemovePackage = (packageId: string) => {
    removeItem(packageId);
    toast.success('Package removed from cart');
  };

  const handleUpdateQuantity = (packageId: string, quantity: number) => {
    updateQuantity(packageId, quantity);
  };

  const handleScheduleSelect = (slot: ScheduleSlot) => {
    console.log('Schedule selected:', slot);
    setFormData(prev => ({ ...prev, selectedSchedule: slot }));
    
    // Store schedule in sessionStorage immediately to prevent loss on re-render
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
    
    // Calculate total package quantity (including multiple quantities of same package)
    const totalPackageQuantity = cartPackages.reduce((sum, item) => sum + item.quantity, 0);
    
    // If only one package quantity, auto-select it for booking and go to checkout
    if (totalPackageQuantity === 1) {
      const packageData = packages.find(pkg => pkg.id.toString() === cartPackages[0].id);
      if (packageData) {
        // Create package instance with instanceId for tracking
        const packageInstance: PackageInstance = {
          ...packageData,
          instanceId: `${packageData.id}-0`,
          instanceNumber: 1
        };
        setFormData(prev => ({ ...prev, selectedPackageForBooking: packageInstance }));
        // Store package data in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('selectedPackageForBooking', JSON.stringify(packageData));
        }
        // Keep sidecart open and go directly to checkout
        if (typeof window !== 'undefined') {
          localStorage.setItem('isCartOpen', 'true');
        }
        openCart();
        window.location.href = '/checkout';
        return;
      }
    }
    
    // If multiple package quantities, go to package selection step
    setCurrentStep(2);
  };

  const handlePackageSelectionForBooking = (instanceId: string) => {
    // Extract package ID from instance ID (format: "packageId-index")
    const packageId = instanceId.split('-')[0];
    const packageData = packages.find(pkg => pkg.id.toString() === packageId);
    if (packageData) {
      // Create package instance with instanceId for tracking
      const packageInstance = {
        ...packageData,
        instanceId: instanceId,
        instanceNumber: parseInt(instanceId.split('-')[1]) + 1
      };
      setFormData(prev => ({ ...prev, selectedPackageForBooking: packageInstance }));
      // Go directly to checkout
      handleProceedToCheckout();
    }
  };

  const handleProceedToCheckout = () => {
    // Store schedule data in sessionStorage for checkout
    if (formData.selectedSchedule) {
      sessionStorage.setItem('selectedSchedule', JSON.stringify({
        selectedDate: formData.selectedSchedule.date,
        selectedTime: formData.selectedSchedule.time,
        teacher: formData.selectedSchedule.teacher,
        dayOfWeek: formData.selectedSchedule.dayOfWeek,
        serviceType: formData.selectedSchedule.serviceType,
        venue: formData.selectedSchedule.venue
      }));
    }
    
    // Store selected package data in sessionStorage for checkout
    if (formData.selectedPackageForBooking) {
      sessionStorage.setItem('selectedPackageForBooking', JSON.stringify(formData.selectedPackageForBooking));
    }
    
    // Keep sidecart open and redirect to checkout
    if (typeof window !== 'undefined') {
      localStorage.setItem('isCartOpen', 'true');
    }
    openCart();
    window.location.href = '/checkout';
  };

  const canProceedToSchedule = cartPackages.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Steps */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto max-w-full">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className="flex items-center flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    // Allow navigation to previous steps or current step
                    if (index <= currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                >
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                    currentStep >= index 
                      ? 'bg-primary border-primary text-white hover:bg-primary/90' 
                      : 'border-gray-400 text-gray-400'
                  } ${index <= currentStep ? 'hover:scale-105' : ''}`}>
                    {currentStep > index ? (
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                    ) : (
                      <span className="font-semibold text-xs sm:text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-2 sm:ml-3 hidden sm:block">
                    <p className={`font-semibold text-sm transition-colors ${
                      currentStep >= index ? 'text-primary' : 'text-gray-400'
                    } ${index <= currentStep ? 'hover:text-primary' : ''}`}>
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
              key="packages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto mobile-step-content"
            >
              {/* Mobile: Show packages at top, then header */}
              <div className="block sm:hidden">
                {/* Packages will be shown here first on mobile */}
              </div>

              <div className="text-center mb-8 hidden sm:block">
                <h2 className="text-3xl font-bold text-primary mb-4">Select Your Packages</h2>
                <p className="text-xl text-muted">Add multiple packages to your cart</p>
              </div>

              {/* Mobile Header */}
              <div className="text-center mb-6 sm:hidden">
                <h2 className="text-2xl font-bold text-primary mb-2">Select Your Package</h2>
                <p className="text-lg text-muted">Choose the package that best fits your needs</p>
              </div>

              {/* Cart Summary */}
              {cartPackages.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">
                        {cartPackages.length} package(s) in cart
                      </span>
                    </div>
                    <Button
                      onClick={() => setCurrentStep(1)}
                      disabled={!canProceedToSchedule}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Proceed to Schedule
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}


              {/* Mobile: Show packages first, then loading/error states */}
              <div className="block sm:hidden">
                {packagesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-gray-600">Loading packages...</p>
                  </div>
                ) : packagesError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-6 h-6 mx-auto mb-3 text-red-500" />
                    <p className="text-red-600 text-sm mb-4">Error loading packages: {packagesError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 mobile-grid-responsive">
                    {packages.map((pkg) => {
                      const cartItem = cartPackages.find(item => item.id === pkg.id.toString());
                      const isInCart = !!cartItem;
                      
                      return (
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
                            <p className="text-muted mb-4 text-center">
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
                            
                            {isInCart ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRemovePackage(pkg.id.toString())}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-sm font-medium min-w-[2rem] text-center">
                                    {cartItem.quantity}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateQuantity(pkg.id.toString(), (cartItem.quantity || 1) + 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemovePackage(pkg.id.toString())}
                                  className="w-full text-xs"
                                >
                                  Remove from Cart
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleAddPackage(pkg)}
                                className="w-full bg-[#6ea058] hover:bg-[#5a8a47] text-white"
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
              </div>

              {/* Desktop: Show loading/error states first, then packages */}
              <div className="hidden sm:block">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => {
                    const cartItem = cartPackages.find(item => item.id === pkg.id.toString());
                    const isInCart = !!cartItem;
                    
                    return (
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
                          
                          {isInCart ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(pkg.id.toString(), cartItem.quantity - 1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-semibold">{cartItem.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(pkg.id.toString(), cartItem.quantity + 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <Button
                                onClick={() => handleRemovePackage(pkg.id.toString())}
                                variant="destructive"
                                className="w-full"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove from Cart
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleAddPackage(pkg)}
                              className="w-full bg-[#6ea058] hover:bg-[#5a8a47] text-white"
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
              </div>
            </motion.div>
          )}

          {/* Step 2: Schedule Selection */}
          {currentStep === 1 && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Select Your Schedule</h2>
                <p className="text-xl text-muted">Choose your preferred date and time for booking</p>
              </div>
              
              <EnhancedSchedule 
                onBookSlot={handleScheduleSelect}
                showBookingButton={false}
                className="max-w-full"
              />

              <div className="flex justify-center mt-8 space-x-4">
                <Button
                  onClick={() => setCurrentStep(0)}
                  variant="outline"
                  className="px-8 py-4 text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Packages
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Package Selection for Booking (only for multiple package quantities) */}
          {currentStep === 2 && cartPackages.reduce((sum, item) => sum + item.quantity, 0) > 1 && (
            <motion.div
              key="package-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto mobile-step-content"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Choose Package for Booking</h2>
                <p className="text-xl text-muted">Select which package you want to use for this booking</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cartPackages.map((cartItem) => {
                  const packageData = packages.find(pkg => pkg.id.toString() === cartItem.id);
                  if (!packageData) return null;

                  // Create individual package instances for selection
                  const packageInstances = Array.from({ length: cartItem.quantity }, (_, index) => ({
                    ...packageData,
                    instanceId: `${cartItem.id}-${index}`,
                    instanceNumber: index + 1
                  }));

                  return packageInstances.map((instance) => (
                    <Card 
                      key={instance.instanceId} 
                      className={`cursor-pointer transition-all ${
                        formData.selectedPackageForBooking?.instanceId === instance.instanceId
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => handlePackageSelectionForBooking(instance.instanceId)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Package className="w-6 h-6 text-primary mr-3" />
                            <h3 className="text-xl font-semibold">
                              {cartItem.name}
                              {cartItem.quantity > 1 && (
                                <span className="ml-2 text-sm text-gray-500">
                                  (Instance {instance.instanceNumber} of {cartItem.quantity})
                                </span>
                              )}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {packageData.currency.symbol}{packageData.price}
                            </div>
                            <div className="text-sm text-muted">
                              Package {instance.instanceNumber}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{packageData.packageDefinition.sessionsCount} Sessions</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{packageData.packageDefinition.sessionDuration.duration_minutes === 60 ? '1 hour' : `${packageData.packageDefinition.sessionDuration.duration_minutes} minutes`} each</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ));
                }).flat()}
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="px-8 py-4 text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Schedule
                </Button>
              </div>
            </motion.div>
          )}


        </AnimatePresence>
      </div>
    </div>
  );
}
