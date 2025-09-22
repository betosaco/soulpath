'use client';

import React from 'react';
import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation'; // Will be used when payment integration is added
import { 
  CreditCard, 
  Lock, 
  Shield,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Payment integration will be added here
// import { toast } from 'sonner'; // Will be used when payment integration is added

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
  onPaymentSuccess: (paymentData: {
    orderId: string;
    status: string;
    amount?: number;
    currency?: string;
    transactionId?: string;
  }) => void;
  onBack: () => void;
  isLoading?: boolean;
  layout?: 'default' | 'compact' | 'wide' | 'inline';
  debugMode?: boolean;
}

export function PaymentForm({
  packageData,
  personalInfo,
  bookingData = null,
  onBack,
}: PaymentFormProps) {
  // const router = useRouter(); // Will be used when payment integration is added
  // const [processing, setProcessing] = useState(false); // Will be used when payment integration is added

  // Order ID will be generated when payment integration is implemented

  // Function to get currency display symbol
  const getCurrencySymbol = (currencyCode: string) => {
    const code = currencyCode.toUpperCase();
    switch (code) {
      case 'PEN':
        return 'S/.';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return code; // Fallback to code if symbol not found
    }
  };

  // Customer data will be handled when payment integration is implemented


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
        description: `${packageData.sessions} session(s) of ${packageData.duration === 60 ? '1 hour' : `${packageData.duration} minutes`} each`,
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

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment error:', error);
    setProcessing(false);
    toast.error(`Error en el procesamiento del pago: ${error}`);
  };
  */



  // Amount calculation will be handled when payment integration is implemented
  const totalAmount = packageData.price; // Price already includes IGV tax
  
  // Calculate IGV breakdown (18% tax included in price)
  const basePrice = totalAmount / 1.18; // Price without tax
  const igvAmount = totalAmount - basePrice; // IGV amount

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto mobile-step-content"
    >
      {/* Payment Processing Overlay */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl border-2 border-primary">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-primary mb-3">Procesando Pago</h3>
            <p className="text-gray-700 mb-6 text-lg">Por favor, no cierres esta ventana mientras procesamos tu pago...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-primary">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Esto puede tomar unos segundos...
            </div>
          </div>
        </div>
      )}

      {/* Header - Same pattern as packages */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Complete Your Payment</h2>
        <p className="text-xl text-muted">Secure payment processing</p>
      </div>

      {/* Main Content - Mobile-first: Order Summary first, then Payment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Order Summary - First on mobile, right on desktop */}
        <div className="space-y-6 order-1 lg:order-2">
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
                  <span className="font-medium">{getCurrencySymbol(packageData.currency)}{basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">IGV (18%):</span>
                  <span className="font-medium">{getCurrencySymbol(packageData.currency)}{igvAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total a Pagar:</span>
                    <span>{getCurrencySymbol(packageData.currency)}{totalAmount.toFixed(2)}</span>
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
                      Your payment is processed securely. We never store your card details.
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

        {/* Payment Form - Second on mobile, left on desktop */}
        <div className="space-y-6 order-2 lg:order-1">
          <Card className="card-base h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
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
      </div>
    </motion.div>
  );
}