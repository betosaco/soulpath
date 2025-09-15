/**
 * Izipay Payment Button Component
 * Handles payment initiation with Izipay
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IzipayPaymentButtonProps {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName?: string;
  description?: string;
  packagePriceId?: number;
  quantity?: number;
  metadata?: Record<string, any>;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function IzipayPaymentButton({
  amount,
  currency = 'PEN',
  customerEmail,
  customerName,
  description,
  packagePriceId,
  quantity = 1,
  metadata = {},
  onSuccess,
  onError,
  disabled = false,
  className = '',
  children,
}: IzipayPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🚀 Initiating Izipay payment...');

      // Validate required fields
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!customerEmail) {
        throw new Error('Customer email is required');
      }

      // Prepare payment request
      const paymentRequest = {
        amount,
        currency: currency.toUpperCase(),
        customerEmail,
        customerName,
        description,
        packagePriceId,
        quantity,
        metadata,
      };

      console.log('📝 Payment request:', paymentRequest);

      // Create payment intent
      const response = await fetch('/api/izipay/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || 'Failed to create payment intent');
      }

      console.log('✅ Payment intent created:', result);

      // Redirect to Izipay payment page
      if (result.paymentUrl) {
        console.log('🔄 Redirecting to Izipay payment page...');
        window.location.href = result.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

    } catch (error) {
      console.error('❌ Izipay payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className={`w-full ${className}`}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {children || `Pagar ${formatAmount(amount, currency)} con Izipay`}
          </>
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>Pago seguro con Izipay</p>
        <p>Acepta Visa, Mastercard, American Express y Diners Club</p>
      </div>
    </div>
  );
}

export default IzipayPaymentButton;
