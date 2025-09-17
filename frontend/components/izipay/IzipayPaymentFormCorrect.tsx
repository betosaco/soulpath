'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IzipaySmartFormCorrect } from './IzipaySmartFormCorrect';
import { Loader2, AlertCircle } from 'lucide-react';

interface IzipayPaymentFormCorrectProps {
  publicKey: string;
  amountInCents: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess: (paymentResult: Record<string, unknown>) => void;
  onError: (errorMessage: string) => void;
  onCancel?: () => void;
}

export const IzipayPaymentFormCorrect: React.FC<IzipayPaymentFormCorrectProps> = ({
  publicKey,
  amountInCents,
  currency,
  orderId,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [formToken, setFormToken] = useState<string | null>(null);
  const [javascriptUrl, setJavascriptUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form token
  const createFormToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🎫 Creating Izipay form token...');

      const response = await fetch('/api/izipay/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInCents,
          currency: currency.toUpperCase(),
          orderId,
          customer: {
            email: customerEmail,
            ...(customerName && { firstName: customerName.split(' ')[0] }),
            ...(customerName && customerName.split(' ').length > 1 && { 
              lastName: customerName.split(' ').slice(1).join(' ') 
            }),
            ...(customerPhone && { phone: customerPhone })
          }
        })
      });

      const data = await response.json();
      console.log('🎫 Form token response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to create form token');
      }

      if (!data.formToken) {
        throw new Error('No form token received');
      }

      setFormToken(data.formToken);
      setJavascriptUrl(data.javascriptUrl);
      console.log('✅ Form token created successfully');

    } catch (err) {
      console.error('❌ Error creating form token:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el token de pago';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [amountInCents, currency, orderId, customerEmail, customerName, customerPhone, onError]);

  useEffect(() => {
    createFormToken();
  }, [createFormToken]);

  const handleSuccess = useCallback((paymentResult: Record<string, unknown>) => {
    console.log('✅ Payment successful:', paymentResult);
    onSuccess(paymentResult);
  }, [onSuccess]);

  const handleError = useCallback((errorMessage: string) => {
    console.error('❌ Payment error:', errorMessage);
    setError(errorMessage);
    onError(errorMessage);
  }, [onError]);

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Preparando formulario de pago
          </h3>
          <p className="text-sm text-gray-600">
            Creando token de pago seguro...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar el formulario
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={createFormToken}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!formToken) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-sm text-gray-600">
            Cargando formulario de pago...
          </p>
        </div>
      </div>
    );
  }

  return (
    <IzipaySmartFormCorrect
      publicKey={publicKey}
      formToken={formToken}
      amountInCents={amountInCents}
      currency={currency}
      javascriptUrl={javascriptUrl || undefined}
      customerName={customerName}
      onSuccess={handleSuccess}
      onError={handleError}
      onCancel={onCancel}
    />
  );
};

export default IzipayPaymentFormCorrect;
