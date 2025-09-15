'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Clock, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { IzipayPaymentMethod } from '@/components/izipay/IzipayPaymentMethod';
import { Header } from '@/components/Header';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
import { toast } from 'sonner';

interface PackagePrice {
  id: number;
  price: number;
  packageDefinition: {
    id: number;
    name: string;
    description: string;
    sessionsCount: number;
    isActive: boolean;
  };
  currency: {
    id: number;
    code: string;
    symbol: string;
    name: string;
  };
}

interface ScheduleSlot {
  id: number;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  isAvailable: boolean;
  scheduleTemplate: {
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
  language: 'en' | 'es';
  selectedPackage: PackagePrice | null;
  selectedScheduleSlot: ScheduleSlot | null;
  skipBooking: boolean;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackagePrice[]>([
    {
      id: 1,
      price: 50,
      packageDefinition: {
        id: 1,
        name: "24 MATPASS",
        description: "All classes are 60 minutes",
        sessionsCount: 24,
        isActive: true
      },
      currency: {
        id: 2,
        code: "PEN",
        symbol: "S/",
        name: "Peruvian Sol"
      }
    },
    {
      id: 2,
      price: 210,
      packageDefinition: {
        id: 2,
        name: "12 MATPASS",
        description: "All classes are 60 minutes",
        sessionsCount: 12,
        isActive: true
      },
      currency: {
        id: 2,
        code: "PEN",
        symbol: "S/",
        name: "Peruvian Sol"
      }
    },
    {
      id: 3,
      price: 400,
      packageDefinition: {
        id: 3,
        name: "08 MATPASS",
        description: "All classes are 60 minutes",
        sessionsCount: 8,
        isActive: true
      },
      currency: {
        id: 2,
        code: "PEN",
        symbol: "S/",
        name: "Peruvian Sol"
      }
    },
    {
      id: 4,
      price: 320,
      packageDefinition: {
        id: 4,
        name: "04 MATPASS",
        description: "All classes are 60 minutes",
        sessionsCount: 4,
        isActive: true
      },
      currency: {
        id: 2,
        code: "PEN",
        symbol: "S/",
        name: "Peruvian Sol"
      }
    },
    {
      id: 5,
      price: 900,
      packageDefinition: {
        id: 5,
        name: "01 MATPASS",
        description: "All classes are 60 minutes",
        sessionsCount: 1,
        isActive: true
      },
      currency: {
        id: 2,
        code: "PEN",
        symbol: "S/",
        name: "Peruvian Sol"
      }
    }
  ]);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();
  const translations = t as Record<string, string | Record<string, string>>;

  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    language: 'en',
    selectedPackage: null,
    selectedScheduleSlot: null,
    skipBooking: false
  });

  const steps = [
    { id: 0, name: 'Select Package', description: 'Choose your package' },
    { id: 1, name: 'Personal Info', description: 'Your details' },
    { id: 2, name: 'Booking', description: 'Schedule your session' },
    { id: 3, name: 'Payment', description: 'Complete purchase' }
  ];

  const handleLoginClick = () => {
    // Add login functionality here
    console.log('Login clicked');
  };

  const scrollToSection = (section: string) => {
    // Add scroll functionality here
    console.log('Scroll to section:', section);
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered');
    // Packages are now set in initial state
  }, []);

  const loadData = async () => {
    console.log('🔄 Starting loadData...');
    setLoading(true);
    
    try {
      // Load packages
      console.log('📦 Fetching packages...');
      const packagesResponse = await fetch('/api/packages?active=true&currency=PEN');
      const packagesData = await packagesResponse.json();
      console.log('📦 Packages response:', packagesData);
      
      if (packagesData.success && packagesData.data) {
        setPackages(packagesData.data);
        console.log('✅ Packages loaded:', packagesData.data.length);
      } else {
        console.error('❌ Packages API failed:', packagesData);
        setPackages([]);
      }
    } catch (error) {
      console.error('❌ Error loading packages:', error);
      setPackages([]);
    }
    
    try {
      // Load schedule slots
      console.log('📅 Fetching schedule slots...');
      const scheduleResponse = await fetch('/api/schedule-slots');
      const scheduleData = await scheduleResponse.json();
      console.log('📅 Schedule response:', scheduleData);
      
      if (scheduleData.success) {
        setScheduleSlots(scheduleData.slots || scheduleData.data || []);
        console.log('✅ Schedule slots loaded:', scheduleData.slots?.length || 0);
      } else {
        console.warn('⚠️ Schedule API failed:', scheduleData);
        setScheduleSlots([]);
      }
    } catch (error) {
      console.warn('⚠️ Error loading schedule slots:', error);
      setScheduleSlots([]);
    }
    
    console.log('✅ LoadData complete, setting loading to false');
    setLoading(false);
  };

  const handlePackageSelect = (pkg: PackagePrice) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg }));
    setCurrentStep(1);
  };

  const handleSkipBooking = () => {
    setFormData(prev => ({ ...prev, skipBooking: true }));
    setCurrentStep(3);
  };

  const handleScheduleSelect = (slot: ScheduleSlot) => {
    setFormData(prev => ({ ...prev, selectedScheduleSlot: slot }));
    setCurrentStep(3);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      setProcessing(true);
      
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
          clientPhone: formData.clientPhone,
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
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  // Debug logging
  console.log('🔍 Packages page render - loading:', loading, 'packages count:', packages.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header
          language={language}
          setLanguage={setLanguage}
          scrollToSection={scrollToSection}
          t={translations}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onLoginClick={handleLoginClick}
          user={null}
          isAdmin={false}
        />
        <div className="flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p 
              className="text-primary text-lg font-semibold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Loading packages...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        language={language}
        setLanguage={setLanguage}
        scrollToSection={scrollToSection}
        t={translations}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onLoginClick={handleLoginClick}
        user={null}
        isAdmin={false}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pt-24">
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
              {packages.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted text-lg">No packages available at the moment.</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="btn-primary mt-4"
                  >
                    Refresh Page
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
                        <span className="text-muted">60 minutes each</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName" className="text-black">Full Name *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="border-gray-300 text-black placeholder-gray-400"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail" className="text-black">Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="border-gray-300 text-black placeholder-gray-400"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientPhone" className="text-black">Phone *</Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="border-gray-300 text-black placeholder-gray-400"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      {/* Empty div to maintain grid layout */}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="btn-outline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn-primary"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
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
              className="max-w-4xl mx-auto"
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
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {scheduleSlots.slice(0, 6).map((slot) => (
                      <Card
                        key={slot.id}
                        className={`cursor-pointer transition-all duration-300 ${
                          slot.isAvailable && slot.bookedCount < slot.capacity
                            ? 'card-base card-hover border-primary'
                            : 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (slot.isAvailable && slot.bookedCount < slot.capacity) {
                            handleScheduleSelect(slot);
                          }
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-sm text-muted">
                            {new Date(slot.startTime).toLocaleDateString()}
                          </div>
                          <div 
                            className="font-semibold text-black"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-muted">
                            {slot.scheduleTemplate.sessionDuration.duration_minutes} min
                          </div>
                          <div className="text-xs text-muted">
                            {slot.bookedCount}/{slot.capacity} booked
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleSkipBooking}
                      className="btn-outline mr-4"
                    >
                      Skip for Now
                    </button>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn-outline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
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
              className="max-w-2xl mx-auto"
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
                <CardContent>
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
                            {new Date(formData.selectedScheduleSlot.startTime).toLocaleDateString()} at{' '}
                            {new Date(formData.selectedScheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    <IzipayPaymentMethod
                      amount={formData.selectedPackage.price}
                      currency="PEN"
                      customerEmail={formData.clientEmail}
                      customerName={formData.clientName}
                      description={`${formData.selectedPackage.packageDefinition.name} - ${formData.selectedPackage.packageDefinition.sessionsCount} sessions`}
                      packagePriceId={formData.selectedPackage.id}
                      quantity={1}
                      metadata={{
                        clientPhone: formData.clientPhone,
                        language: formData.language,
                        scheduleSlotId: formData.selectedScheduleSlot?.id
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onCancel={() => setCurrentStep(2)}
                    />
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn-outline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
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
