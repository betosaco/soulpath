'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  ArrowRight,
  ArrowLeft
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
  onPaymentSuccess: (paymentData: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function PaymentForm({ 
  packageData, 
  personalInfo, 
  onPaymentSuccess, 
  onBack, 
  isLoading = false 
}: PaymentFormProps) {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('✅ Payment successful:', paymentData);
    setPaymentResult({
      success: true,
      data: paymentData,
      message: `¡Pago exitoso! ${packageData.currency} ${(packageData.price / 100).toFixed(2)} procesado correctamente.`
    });
    setProcessing(false);
    onPaymentSuccess(paymentData);
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
  const totalAmount = packageData.price;
  const taxAmount = totalAmount * 0.18; // 18% tax
  const finalAmount = totalAmount + taxAmount;

  return (
    <div className="max-w-4xl mx-auto">
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

            {/* Payment Status */}
            {processing && (
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                  <div className="text-yellow-800 font-medium">
                    Procesando pago...
                  </div>
                </div>
              </div>
            )}

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

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted">Package Price:</span>
                    <span className="font-semibold">{packageData.currency}{packageData.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted">Tax (18%):</span>
                    <span className="font-semibold">{packageData.currency}{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl font-bold text-primary">
                      <span>Total:</span>
                      <span>{packageData.currency}{finalAmount.toFixed(2)}</span>
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
