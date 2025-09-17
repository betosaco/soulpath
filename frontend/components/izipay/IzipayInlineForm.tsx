/**
 * Izipay Inline Payment Form Component
 * Embeds Izipay payment form directly in the page
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IzipayInlineFormProps {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName?: string;
  description?: string;
  packagePriceId?: number;
  quantity?: number;
  metadata?: Record<string, unknown>;
  onSuccess?: (result: Record<string, unknown>) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
}

// Use the existing Window.KR type from IzipayForm.tsx

export function IzipayInlineForm({
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
  onCancel,
  className = '',
}: IzipayInlineFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Token is used immediately to initialize the form; no need to store it in state
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'valid' | 'invalid' | 'completed' | 'failed'>('idle');
  const formRef = useRef<HTMLDivElement>(null);

  // Load Izipay JavaScript SDK
  useEffect(() => {
    const loadIzipaySDK = () => {
      if (window.KR) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://api.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadIzipaySDK().catch(() => {
      setError('Failed to load payment form');
    });
  }, []);

  const initializePaymentForm = useCallback((token: string) => {
    if (!window.KR || !formRef.current) {
      console.error('Izipay SDK not loaded or form container not available');
      return;
    }

    try {
      // Initialize Izipay payment form
      (window.KR as any).setFormConfig({
        'kr-public-key': process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY,
        'kr-form-token': token,
      });

      // Create the payment form
      (window.KR as any).addForm('#izipay-payment-form');
      console.log('✅ Izipay form initialized');
      
      // Handle form events
      (window.KR as any).on('kr-error', (event: Record<string, unknown>) => {
        console.error('❌ Izipay form error:', event);
        setPaymentStatus('error');
        const errorMessage = (event?.error as Record<string, unknown>)?.message || 'Payment form error';
        setError(String(errorMessage));
        if (onError) {
          onError(String(errorMessage));
        }
      });

      (window.KR as any).on('kr-form-valid', () => {
        console.log('✅ Izipay form is valid');
        setPaymentStatus('valid');
      });

      (window.KR as any).on('kr-form-invalid', () => {
        console.log('❌ Izipay form is invalid');
        setPaymentStatus('invalid');
      });

      (window.KR as any).on('kr-payment-completed', (event: Record<string, unknown>) => {
        console.log('✅ Payment completed:', event);
        setPaymentStatus('completed');
        if (onSuccess) {
          onSuccess(event);
        }
      });

      (window.KR as any).on('kr-payment-failed', (event: Record<string, unknown>) => {
        console.error('❌ Payment failed:', event);
        setPaymentStatus('failed');
        const errorMessage = (event?.error as Record<string, unknown>)?.message || 'Payment failed';
        setError(String(errorMessage));
        if (onError) {
          onError(String(errorMessage));
        }
      });

    } catch (error) {
      console.error('❌ Error initializing Izipay form:', error);
      setError('Failed to initialize payment form');
      if (onError) {
        onError('Failed to initialize payment form');
      }
    }
  }, [onError, onSuccess]);

  const createFormToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

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

      const response = await fetch('/api/izipay/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || 'Failed to create payment form');
      }

      // Store token is unnecessary; initialize form directly
      
      // Initialize the payment form once token is available
      setTimeout(() => {
        initializePaymentForm(result.transactionId);
      }, 100);

    } catch (error) {
      console.error('❌ Error creating form token:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment form';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [customerEmail, amount, currency, customerName, description, initializePaymentForm, metadata, onError, packagePriceId, quantity]);

  // Create form token when component mounts
  useEffect(() => {
    if (customerEmail && amount > 0) {
      createFormToken();
    }
  }, [customerEmail, amount, currency, createFormToken]);

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p>Cargando formulario de pago...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={createFormToken} 
            className="w-full mt-4"
            variant="outline"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-700">¡Pago Exitoso!</h3>
            <p className="text-gray-600">Tu pago ha sido procesado correctamente.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Pago con Izipay
        </CardTitle>
        <CardDescription>
          Total a pagar: <span className="font-semibold">{formatAmount(amount, currency)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentStatus === 'processing' && (
          <div className="mb-4">
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Procesando tu pago...</AlertDescription>
            </Alert>
          </div>
        )}

        <div 
          ref={formRef}
          id="izipay-payment-form"
          className="min-h-[400px]"
        >
          {/* Izipay form will be injected here */}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Pago seguro con Izipay</p>
          <p>Acepta Visa, Mastercard, American Express y Diners Club</p>
        </div>

        {onCancel && (
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="w-full mt-4"
          >
            Cancelar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default IzipayInlineForm;
