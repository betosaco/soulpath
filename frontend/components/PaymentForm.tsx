'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  ArrowRight,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LyraPaymentForm from '@/components/LyraPaymentForm';
import { toast } from 'sonner';

interface PaymentFormProps {
  packageData: {
    id: string;
    name: string;
    price: number;
    currency: string;
    sessions: number;
    duration: number;
  };
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
  };
  bookingData?: {
    selectedDate?: string;
    selectedTime?: string;
    teacher?: {
      id: number;
      name: string;
    };
    dayOfWeek?: string;
    serviceType?: {
      name: string;
    };
  } | null;
  onPaymentSuccess: (paymentData: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function PaymentForm({ 
  packageData, 
  personalInfo, 
  bookingData = null,
  onPaymentSuccess, 
  onBack, 
  isLoading = false 
}: PaymentFormProps) {
  const router = useRouter();
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('✅ Payment successful:', paymentData);
    setPaymentResult({
      success: true,
      data: paymentData,
      message: `¡Pago exitoso! ${packageData.currency} ${packageData.price.toFixed(2)} procesado correctamente.`
    });
    setProcessing(false);
    
    // Store payment result in sessionStorage for the success page
    sessionStorage.setItem('paymentResult', JSON.stringify({
      orderStatus: 'PAID',
      orderId: `PKG-${packageData.id}-${Date.now()}`,
      amount: packageData.price * 100, // Convert to cents
      currency: packageData.currency,
      packageData: {
        ...packageData,
        id: parseInt(packageData.id),
        description: `${packageData.sessions} session(s) of ${packageData.duration} minutes each`,
        sessionsCount: packageData.sessions,
        packageType: 'individual',
        maxGroupSize: 1,
        sessionDuration: {
          id: 1,
          name: `${packageData.duration} Minutes`,
          duration_minutes: packageData.duration,
          description: `Standard ${packageData.duration}-minute session`
        }
      },
      bookingData: bookingData,
      paymentData: paymentData
    }));
    
    // Call the parent callback
    onPaymentSuccess(paymentData);
    
    // Redirect to payment success page
    router.push('/payment-success');
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    setPaymentResult({
      success: false,
      error: error,
      message: 'Error en el procesamiento del pago.'
    });
    setProcessing(false);
    toast.error('Error en el procesamiento del pago. Por favor, intenta nuevamente.');
  };

  const handlePaymentStart = () => {
    setProcessing(true);
    setPaymentResult(null);
  };

  // Convert price to cents for Lyra (assuming packageData.price is in the main currency unit)
  const amountInCents = Math.round(packageData.price * 100);
  const totalAmount = packageData.price; // Price already includes IGV tax
  
  // Calculate IGV breakdown (18% tax included in price)
  const basePrice = totalAmount / 1.18; // Price without tax
  const igvAmount = totalAmount - basePrice; // IGV amount

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Payment Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Procesando Pago</h3>
            <p className="text-gray-600 mb-4">Por favor, no cierres esta ventana mientras procesamos tu pago...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Complete Your Payment</h2>
          <p className="text-xl text-muted">Secure payment processing with Lyra</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LyraPaymentForm
                  amount={amountInCents} // Amount in cents for Lyra
                  currency="PEN"
                  orderId={`PKG-${packageData.id}-${Date.now()}`}
                  customer={{
                    email: personalInfo.email,
                    name: personalInfo.name
                  }}
                  metadata={{
                    packageId: packageData.id,
                    packageName: packageData.name,
                    sessions: packageData.sessions.toString(),
                    duration: packageData.duration.toString(),
                    phone: personalInfo.phone,
                    countryCode: personalInfo.countryCode
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onPaymentStart={handlePaymentStart}
                  className="w-full"
                />
              </CardContent>
            </Card>


            {/* Payment Result */}
            {paymentResult && (
              <div className={`rounded-xl p-6 border ${
                paymentResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`text-2xl ${
                    paymentResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {paymentResult.success ? '✅' : '❌'}
                  </div>
                  <div className={`font-semibold ${
                    paymentResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {paymentResult.success ? 'Pago Exitoso' : 'Error en el Pago'}
                  </div>
                </div>
                
                <div className={`text-sm ${
                  paymentResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {paymentResult.message}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Package Details */}
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-lg text-primary mb-2">{packageData.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Sessions:</span>
                      <span className="font-medium">{packageData.sessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Duration:</span>
                      <span className="font-medium">{packageData.duration} min each</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Valid for:</span>
                      <span className="font-medium">30 days</span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                {bookingData && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-lg text-green-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Booking Schedule
                    </h4>
                    <div className="space-y-2 text-sm">
                      {bookingData.teacher && (
                        <div className="flex justify-between">
                          <span className="text-muted">Teacher:</span>
                          <span className="font-medium text-green-800">{bookingData.teacher.name}</span>
                        </div>
                      )}
                      {bookingData.selectedDate && (
                        <div className="flex justify-between">
                          <span className="text-muted">Date:</span>
                          <span className="font-medium text-green-800">{new Date(bookingData.selectedDate).toLocaleDateString('es-PE')}</span>
                        </div>
                      )}
                      {bookingData.dayOfWeek && (
                        <div className="flex justify-between">
                          <span className="text-muted">Day:</span>
                          <span className="font-medium text-green-800 capitalize">{bookingData.dayOfWeek}</span>
                        </div>
                      )}
                      {bookingData.selectedTime && (
                        <div className="flex justify-between">
                          <span className="text-muted">Time:</span>
                          <span className="font-medium text-green-800">{bookingData.selectedTime}</span>
                        </div>
                      )}
                      {bookingData.serviceType && (
                        <div className="flex justify-between">
                          <span className="text-muted">Service:</span>
                          <span className="font-medium text-green-800">{bookingData.serviceType.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal:</span>
                    <span className="font-medium">{packageData.currency}{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">IGV (18%):</span>
                    <span className="font-medium">{packageData.currency}{igvAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl font-bold text-primary">
                      <span>Total a Pagar:</span>
                      <span>{packageData.currency}{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm text-muted">
                    <div><strong>Name:</strong> {personalInfo.name}</div>
                    <div><strong>Email:</strong> {personalInfo.email}</div>
                    <div><strong>Phone:</strong> {personalInfo.countryCode}{personalInfo.phone}</div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-medium text-sm">Secure Payment</p>
                      <p className="text-green-700 text-xs mt-1">
                        Your payment is processed securely through Lyra. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full h-14 text-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Review
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
