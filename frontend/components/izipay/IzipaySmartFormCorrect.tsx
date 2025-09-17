'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Loader2, CreditCard, Shield, AlertCircle } from 'lucide-react';

interface IzipaySmartFormCorrectProps {
  publicKey: string;
  formToken: string;
  amountInCents: number;
  currency: string;
  onSuccess: (paymentResult: Record<string, unknown>) => void;
  onError: (errorMessage: string) => void;
  onCancel?: () => void;
}

export const IzipaySmartFormCorrect: React.FC<IzipaySmartFormCorrectProps> = ({
  publicKey,
  formToken,
  amountInCents,
  currency,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Check if both script and theme are loaded
  const isReady = isScriptLoaded && isThemeLoaded;

  useEffect(() => {
    if (isReady && formToken && publicKey) {
      console.log('✅ All resources loaded, form should be ready');
      setIsFormReady(true);
    }
  }, [isReady, formToken, publicKey]);

  const formatAmount = (amountInCents: number, currency: string) => {
    const amount = amountInCents / 100;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleScriptError = () => {
    console.error('❌ Failed to load Izipay script');
    setError('Error al cargar el procesador de pagos');
    onError('Error al cargar el procesador de pagos');
  };

  const handleThemeError = () => {
    console.error('❌ Failed to load Izipay theme');
    setError('Error al cargar el tema del formulario');
    onError('Error al cargar el tema del formulario');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Load Izipay JavaScript Library with public key */}
      <Script
        src="https://static.lyra.com/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
        kr-public-key={publicKey}
        kr-post-url-success={`${window.location.origin}/api/izipay/success`}
        kr-post-url-refused={`${window.location.origin}/api/izipay/error`}
        kr-get-url-success={`${window.location.origin}/api/izipay/success`}
        kr-get-url-refused={`${window.location.origin}/api/izipay/error`}
        kr-language="es-PE"
        onLoad={() => {
          console.log('✅ Izipay script loaded');
          setIsScriptLoaded(true);
        }}
        onError={handleScriptError}
      />

      {/* Load Izipay CSS Theme */}
      <link
        rel="stylesheet"
        href="https://static.lyra.com/static/js/krypton-client/V4.0/ext/neon-reset.min.css"
      />
      
      {/* Load Izipay Theme JavaScript */}
      <Script
        src="https://static.lyra.com/static/js/krypton-client/V4.0/ext/neon.js"
        onLoad={() => {
          console.log('✅ Izipay theme loaded');
          setIsThemeLoaded(true);
        }}
        onError={handleThemeError}
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

      {/* Error Display */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Izipay SmartForm - List mode with embedded card */}
      {publicKey === 'MOCK-PUBLIC-KEY' ? (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mock Payment Form</h3>
            <p className="text-gray-600">This is a development mock - no real payment will be processed</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="123" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="John Doe" />
            </div>
            <div className="pt-4">
              <button 
                onClick={() => onSuccess({ transaction: { uuid: 'mock-transaction-' + Date.now() } })}
                className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Pay {formatAmount(amountInCents, currency)}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          ref={formContainerRef}
          className="kr-smart-form" 
          kr-card-form-expanded 
          kr-form-token={formToken}
        >
          {/* Error zone - Izipay will populate this */}
          <div className="kr-form-error"></div>
        </div>
      )}

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
      {!isFormReady && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">
            {!isScriptLoaded ? 'Cargando procesador de pagos...' : 
             !isThemeLoaded ? 'Cargando tema del formulario...' : 
             'Inicializando formulario...'}
          </p>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
        <p>Script: {isScriptLoaded ? '✅' : '⏳'}</p>
        <p>Theme: {isThemeLoaded ? '✅' : '⏳'}</p>
        <p>Form Token: {formToken ? '✅' : '❌'}</p>
        <p>Public Key: {publicKey ? '✅' : '❌'}</p>
      </div>
    </div>
  );
};

export default IzipaySmartFormCorrect;
