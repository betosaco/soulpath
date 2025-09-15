'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Shield, AlertCircle } from 'lucide-react';

interface IzipayFormProps {
  publicKey: string;
  amountInCents: number;
  currency: string;
  onSuccess: (paymentToken: string) => void;
  onError: (errorMessage: string) => void;
}

// Extend the global window object to include Izipay types
declare global {
  interface Window {
    KR: {
      init: (publicKey: string) => void;
      setFormConfig: (config: Record<string, unknown>) => void;
      createToken: () => Promise<{ 'kr-answer': string }>;
      addForm: (selector: string) => void;
      on: (event: string, callback: (event: Record<string, unknown>) => void) => void;
    };
  }
}

export const IzipayForm: React.FC<IzipayFormProps> = ({
  publicKey,
  amountInCents,
  currency,
  onSuccess,
  onError,
}) => {
  const [isIzipayReady, setIsIzipayReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize Izipay when script loads
  useEffect(() => {
    if (isIzipayReady && window.KR) {
      try {
        // Initialize Izipay with public key
        window.KR.init(publicKey);
        
        // Configure form behavior
        window.KR.setFormConfig({
          'kr-form-token': 'kr-form-token',
          'kr-form-class': 'kr-form',
          'kr-pan-class': 'kr-pan',
          'kr-expiry-class': 'kr-expiry',
          'kr-security-code-class': 'kr-security-code',
          'kr-error-class': 'kr-form-error',
          'kr-payment-button-class': 'kr-payment-button',
          'kr-placeholder-pan': 'Número de tarjeta',
          'kr-placeholder-expiry': 'MM/AA',
          'kr-placeholder-security-code': 'CVV',
          'kr-label-pan': 'Número de tarjeta',
          'kr-label-expiry': 'Fecha de vencimiento',
          'kr-label-security-code': 'Código de seguridad',
          'kr-label-submit': 'Pagar con Izipay',
          'kr-style': {
            'kr-form': {
              'background-color': 'transparent',
              'border': 'none',
              'padding': '0',
            },
            'kr-pan': {
              'border': '1px solid #d1d5db',
              'border-radius': '0.375rem',
              'padding': '0.75rem',
              'font-size': '1rem',
              'width': '100%',
              'height': '2.5rem',
            },
            'kr-expiry': {
              'border': '1px solid #d1d5db',
              'border-radius': '0.375rem',
              'padding': '0.75rem',
              'font-size': '1rem',
              'width': '100%',
              'height': '2.5rem',
            },
            'kr-security-code': {
              'border': '1px solid #d1d5db',
              'border-radius': '0.375rem',
              'padding': '0.75rem',
              'font-size': '1rem',
              'width': '100%',
              'height': '2.5rem',
            },
            'kr-payment-button': {
              'background-color': '#3b82f6',
              'color': 'white',
              'border': 'none',
              'border-radius': '0.375rem',
              'padding': '0.75rem 1.5rem',
              'font-size': '1rem',
              'font-weight': '600',
              'width': '100%',
              'height': '2.5rem',
              'cursor': 'pointer',
              'transition': 'all 0.2s',
            },
            'kr-payment-button:hover': {
              'background-color': '#2563eb',
            },
            'kr-payment-button:disabled': {
              'background-color': '#9ca3af',
              'cursor': 'not-allowed',
            },
            'kr-form-error': {
              'color': '#dc2626',
              'font-size': '0.875rem',
              'margin-top': '0.5rem',
            },
          },
        });
      } catch (error) {
        console.error('Error initializing Izipay:', error);
        onError('Error al inicializar el formulario de pago');
      }
    }
  }, [isIzipayReady, publicKey, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isIzipayReady || !window.KR) {
      onError('El formulario de pago no está listo');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Create payment token using Izipay
      const result = await window.KR.createToken();
      
      if (result && result['kr-answer']) {
        // Parse the kr-answer to get the formToken
        const krAnswer = JSON.parse(result['kr-answer']);
        
        if (krAnswer.formToken) {
          onSuccess(krAnswer.formToken);
        } else {
          throw new Error('No se pudo obtener el token de pago');
        }
      } else {
        throw new Error('Respuesta inválida del procesador de pagos');
      }
    } catch (error: unknown) {
      console.error('Error creating payment token:', error);
      
      let errorMessage = 'Error al procesar el pago';
      
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'errorMessage' in error) {
        errorMessage = String((error as Record<string, unknown>).errorMessage);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setFormError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (amountInCents: number, currency: string) => {
    const amount = amountInCents / 100;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Load Izipay JavaScript Library */}
      <Script
        src="https://js.izipay.pe/v4/izi.js"
        onLoad={() => setIsIzipayReady(true)}
        onError={() => {
          console.error('Failed to load Izipay script');
          onError('Error al cargar el procesador de pagos');
        }}
      />

      {/* Payment Form Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <CreditCard className="h-8 w-8 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Pago con Izipay</h3>
        </div>
        <p className="text-sm text-gray-600">
          Pago seguro con tarjeta de crédito o débito
        </p>
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-900">
            {formatAmount(amountInCents, currency)}
          </p>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center mb-4">
        <Shield className="h-4 w-4 text-green-600 mr-2" />
        <span className="text-sm text-green-600 font-medium">
          Transacción protegida con encriptación SSL
        </span>
      </div>

      {/* Izipay Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="kr-form">
          {/* Card Number Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de tarjeta
            </label>
            <div className="kr-pan"></div>
          </div>

          {/* Expiry and CVV Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de vencimiento
              </label>
              <div className="kr-expiry"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div className="kr-security-code"></div>
            </div>
          </div>

          {/* Error Container */}
          <div className="kr-form-error"></div>

          {/* Custom Error Display */}
          {formError && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-600">{formError}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="kr-payment-button w-full"
            disabled={!isIzipayReady || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar {formatAmount(amountInCents, currency)}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Payment Method Icons */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 mb-2">Tarjetas aceptadas:</p>
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
            V
          </div>
          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
            M
          </div>
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
            A
          </div>
          <div className="w-8 h-5 bg-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">
            D
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!isIzipayReady && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">Cargando formulario de pago...</p>
        </div>
      )}
    </div>
  );
};

export default IzipayForm;

