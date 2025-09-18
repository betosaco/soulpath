'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CreditCard, ChevronDown, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BaseButton } from './ui/BaseButton';
import { StripeInlineForm } from './stripe/StripeInlineForm';
import { LyraPaymentIntegration } from './LyraPaymentIntegration';

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  description: string;
  icon: string;
  requiresConfirmation: boolean;
  autoAssignPackage: boolean;
  isActive: boolean;
  supportedCurrencies?: string[];
  region?: string;
}

interface BookingFormData {
  selectedPackage: any;
  selectedSchedule: any;
  selectedPaymentMethod: PaymentMethod | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  // ... other fields
}

interface EnhancedPaymentStepProps {
  formData: BookingFormData;
  paymentMethods: PaymentMethod[];
  showPaymentMethodDropdown: boolean;
  setShowPaymentMethodDropdown: (show: boolean) => void;
  handlePaymentMethodSelect: (method: PaymentMethod) => void;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  onBack: () => void;
  onContinue: () => void;
  processing: boolean;
}

export function EnhancedPaymentStep({
  formData,
  paymentMethods,
  showPaymentMethodDropdown,
  setShowPaymentMethodDropdown,
  handlePaymentMethodSelect,
  onPaymentSuccess,
  onPaymentError,
  onBack,
  onContinue,
  processing
}: EnhancedPaymentStepProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentStatus('success');
    onPaymentSuccess(paymentData);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    onPaymentError(error);
  };

  // Filter payment methods by region/currency support
  const stripeMethods = paymentMethods.filter(method => method.type === 'stripe');
  const lyraMethods = paymentMethods.filter(method => method.type === 'lyra');
  const otherMethods = paymentMethods.filter(method => 
    method.type !== 'stripe' && method.type !== 'lyra'
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Payment Method</h2>
          <p className="text-gray-400">Select how you&apos;d like to pay for your session</p>
        </div>

        {/* Payment Summary */}
        <Card className="bg-[#1a1a2e] border-[#16213e]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard size={20} className="mr-2 text-[#ffd700]" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[#16213e] rounded-lg">
              <div>
                <p className="text-white font-medium">{formData.selectedPackage?.name}</p>
                <p className="text-sm text-gray-400">
                  {formatDate(formData.selectedSchedule?.date)} at {formatTime(formData.selectedSchedule?.time)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#ffd700]">
                  ${(formData.selectedSchedule?.price / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">USD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
            <div className="relative payment-method-dropdown">
              <button
                onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                className="flex items-center space-x-2 px-3 py-2 bg-[#16213e] border border-[#2a2a4a] rounded-lg hover:border-[#ffd700]/50 transition-colors text-sm"
              >
                <span className="text-gray-300">Change Method</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    showPaymentMethodDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showPaymentMethodDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#16213e] border border-[#2a2a4a] rounded-lg shadow-xl z-10 min-w-[250px]">
                  {/* Stripe Methods */}
                  {stripeMethods.length > 0 && (
                    <div className="p-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">International</p>
                      {stripeMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => handlePaymentMethodSelect(method)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-[#2a2a4a] transition-colors rounded-lg"
                        >
                          <Image
                            src={method.icon}
                            alt={method.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium text-sm">{method.name}</p>
                            <p className="text-xs text-gray-400">{method.description}</p>
                          </div>
                          {formData.selectedPaymentMethod?.id === method.id && (
                            <Check size={16} className="text-[#ffd700]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Lyra Methods */}
                  {lyraMethods.length > 0 && (
                    <div className="p-2 border-t border-[#2a2a4a]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Perú</p>
                      {lyraMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => handlePaymentMethodSelect(method)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-[#2a2a4a] transition-colors rounded-lg"
                        >
                          <Image
                            src={method.icon}
                            alt={method.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium text-sm">{method.name}</p>
                            <p className="text-xs text-gray-400">{method.description}</p>
                          </div>
                          {formData.selectedPaymentMethod?.id === method.id && (
                            <Check size={16} className="text-[#ffd700]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Other Methods */}
                  {otherMethods.length > 0 && (
                    <div className="p-2 border-t border-[#2a2a4a]">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Other</p>
                      {otherMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => handlePaymentMethodSelect(method)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-[#2a2a4a] transition-colors rounded-lg"
                        >
                          <Image
                            src={method.icon}
                            alt={method.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium text-sm">{method.name}</p>
                            <p className="text-xs text-gray-400">{method.description}</p>
                          </div>
                          {formData.selectedPaymentMethod?.id === method.id && (
                            <Check size={16} className="text-[#ffd700]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment Form */}
          {formData.selectedPaymentMethod?.type === 'stripe' ? (
            <StripeInlineForm
              amount={formData.selectedSchedule?.price}
              currency="usd"
              description={`Booking: ${formData.selectedPackage?.name}`}
              customerEmail={formData.clientEmail}
              metadata={{
                booking_type: 'session',
                package_id: formData.selectedPackage?.id,
                package_name: formData.selectedPackage?.name,
                schedule_id: formData.selectedSchedule?.id,
                session_date: formData.selectedSchedule?.date,
                session_time: formData.selectedSchedule?.time,
                client_name: formData.clientName,
                client_email: formData.clientEmail
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              appearance={{
                theme: 'night',
                variables: {
                  colorPrimary: '#ffd700',
                  colorBackground: '#1a1a2e',
                  colorText: '#ffffff',
                  colorDanger: '#ef4444',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  spacingUnit: '2px',
                  borderRadius: '6px',
                },
              }}
            />
          ) : formData.selectedPaymentMethod?.type === 'lyra' ? (
            <LyraPaymentIntegration
              amount={formData.selectedSchedule?.price}
              currency="usd"
              orderId={`booking-${Date.now()}`}
              customer={{
                email: formData.clientEmail,
                name: formData.clientName,
                phone: formData.clientPhone
              }}
              metadata={{
                booking_type: 'session',
                package_id: formData.selectedPackage?.id,
                package_name: formData.selectedPackage?.name,
                schedule_id: formData.selectedSchedule?.id,
                session_date: formData.selectedSchedule?.date,
                session_time: formData.selectedSchedule?.time,
                client_name: formData.clientName,
                client_email: formData.clientEmail
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : formData.selectedPaymentMethod ? (
            <Card className="bg-[#1a1a2e] border-[#16213e]">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Image
                    src={formData.selectedPaymentMethod.icon}
                    alt={formData.selectedPaymentMethod.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain mx-auto"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Pay with {formData.selectedPaymentMethod.name}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {formData.selectedPaymentMethod.description}
                    </p>
                  </div>

                  {formData.selectedPaymentMethod.requiresConfirmation ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ This payment method requires manual confirmation.
                        You&apos;ll receive payment instructions after booking.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-400 text-sm">
                        ✅ Instant processing available for this payment method.
                      </p>
                    </div>
                  )}

                  <BaseButton
                    onClick={onContinue}
                    className="dashboard-button-primary"
                    disabled={processing}
                  >
                    Continue with {formData.selectedPaymentMethod.name}
                    <ArrowRight size={16} className="ml-2" />
                  </BaseButton>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#1a1a2e] border-[#16213e]">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-8 h-8 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400">Loading payment options...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <BaseButton
            variant="outline"
            onClick={onBack}
            className="border-[#2a2a4a] text-gray-400 hover:bg-[#2a2a4a] hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Details
          </BaseButton>

          {/* Show continue button for non-instant payment methods */}
          {formData.selectedPaymentMethod && 
           formData.selectedPaymentMethod.type !== 'stripe' && 
           formData.selectedPaymentMethod.type !== 'lyra' && (
            <BaseButton
              onClick={onContinue}
              className="dashboard-button-primary"
            >
              Continue to WhatsApp
              <ArrowRight size={16} className="ml-2" />
            </BaseButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}
