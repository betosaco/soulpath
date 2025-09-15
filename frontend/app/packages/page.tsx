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
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
  specialRequests: string;
  language: 'en' | 'es';
  selectedPackage: PackagePrice | null;
  selectedScheduleSlot: ScheduleSlot | null;
  skipBooking: boolean;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    question: '',
    specialRequests: '',
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load packages
      const packagesResponse = await fetch('/api/client/packages');
      const packagesData = await packagesResponse.json();
      
      if (packagesData.success) {
        setPackages(packagesData.data);
      }

      // Load available schedule slots
      const scheduleResponse = await fetch('/api/schedule-slots');
      const scheduleData = await scheduleResponse.json();
      
      if (scheduleData.success) {
        setScheduleSlots(scheduleData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load packages and schedules');
    } finally {
      setLoading(false);
    }
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
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          question: formData.question,
          specialRequests: formData.specialRequests,
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
          birthDate: '',
          birthTime: '',
          birthPlace: '',
          question: '',
          specialRequests: '',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-lg font-semibold">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A23] via-[#1a1a2e] to-[#16213e] text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#FFD700]">
            Choose Your Package
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                      ? 'bg-[#FFD700] border-[#FFD700] text-[#0A0A23]' 
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
                      currentStep >= step.id ? 'text-[#FFD700]' : 'text-gray-400'
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
              {packages.map((pkg) => (
                <Card key={pkg.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-[#0A0A23]" />
                    </div>
                    <CardTitle className="text-2xl text-[#FFD700]">{pkg.packageDefinition.name}</CardTitle>
                    <div className="text-3xl font-bold text-white">
                      {pkg.currency.symbol}{pkg.price}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-6 text-center">
                      {pkg.packageDefinition.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-[#FFD700]" />
                        <span>{pkg.packageDefinition.sessionsCount} Sessions</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-[#FFD700]" />
                        <span>60 minutes each</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-2 text-[#FFD700]" />
                        <span>Personalized guidance</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePackageSelect(pkg)}
                      className="w-full bg-[#FFD700] text-[#0A0A23] hover:bg-[#FFD700]/90 font-semibold"
                    >
                      Select Package
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#FFD700] text-center">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName" className="text-white">Full Name *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="bg-white/20 border-white/30 text-white placeholder-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail" className="text-white">Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="bg-white/20 border-white/30 text-white placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientPhone" className="text-white">Phone</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="bg-white/20 border-white/30 text-white placeholder-gray-400"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate" className="text-white">Birth Date *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthTime" className="text-white">Birth Time</Label>
                      <Input
                        id="birthTime"
                        type="time"
                        value={formData.birthTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthPlace" className="text-white">Birth Place</Label>
                      <Input
                        id="birthPlace"
                        value={formData.birthPlace}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                        className="bg-white/20 border-white/30 text-white placeholder-gray-400"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question" className="text-white">Your Question or Focus</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                      className="bg-white/20 border-white/30 text-white placeholder-gray-400"
                      placeholder="What would you like guidance on?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialRequests" className="text-white">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      className="bg-white/20 border-white/30 text-white placeholder-gray-400"
                      placeholder="Any special requests or preferences"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(0)}
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-[#FFD700] text-[#0A0A23] hover:bg-[#FFD700]/90"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#FFD700] text-center">Schedule Your Session</CardTitle>
                  <p className="text-gray-300 text-center">
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
                            ? 'bg-white/20 hover:bg-white/30 border-[#FFD700]'
                            : 'bg-gray-600/20 border-gray-500 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (slot.isAvailable && slot.bookedCount < slot.capacity) {
                            handleScheduleSelect(slot);
                          }
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-sm text-gray-300">
                            {new Date(slot.startTime).toLocaleDateString()}
                          </div>
                          <div className="font-semibold text-white">
                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {slot.scheduleTemplate.sessionDuration.duration_minutes} min
                          </div>
                          <div className="text-xs text-gray-400">
                            {slot.bookedCount}/{slot.capacity} booked
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleSkipBooking}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 mr-4"
                    >
                      Skip for Now
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
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
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#FFD700] text-center">Complete Your Purchase</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Order Summary */}
                  <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Package:</span>
                        <span className="text-white">{formData.selectedPackage?.packageDefinition.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Sessions:</span>
                        <span className="text-white">{formData.selectedPackage?.packageDefinition.sessionsCount}</span>
                      </div>
                      {formData.selectedScheduleSlot && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">First Session:</span>
                          <span className="text-white">
                            {new Date(formData.selectedScheduleSlot.startTime).toLocaleDateString()} at{' '}
                            {new Date(formData.selectedScheduleSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold border-t border-white/20 pt-2">
                        <span className="text-[#FFD700]">Total:</span>
                        <span className="text-[#FFD700]">
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
                        birthDate: formData.birthDate,
                        birthTime: formData.birthTime,
                        birthPlace: formData.birthPlace,
                        question: formData.question,
                        specialRequests: formData.specialRequests,
                        language: formData.language,
                        scheduleSlotId: formData.selectedScheduleSlot?.id
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onCancel={() => setCurrentStep(2)}
                    />
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
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
