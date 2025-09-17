'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Loader2, CreditCard, Shield, AlertCircle } from 'lucide-react';

interface IzipaySmartFormCorrectProps {
  publicKey: string;
  formToken: string;
  amountInCents: number;
  currency: string;
  javascriptUrl?: string;
  customerName?: string;
  onSuccess: (paymentResult: Record<string, unknown>) => void;
  onError: (errorMessage: string) => void;
  onCancel?: () => void;
}

export const IzipaySmartFormCorrect: React.FC<IzipaySmartFormCorrectProps> = ({
  publicKey,
  formToken,
  amountInCents,
  currency,
  javascriptUrl,
  customerName,
  onSuccess: _onSuccess,
  onError,
  onCancel: _onCancel,
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

  // Check for KR object availability
  useEffect(() => {
    if (isScriptLoaded) {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      const checkKR = () => {
        attempts++;
        
        if (typeof window !== 'undefined' && (window as any).KR) {
          console.log('✅ KR object is available:', (window as any).KR);
          console.log('🔧 KR methods:', Object.keys((window as any).KR));
          
          // Check if form container exists
          if (formContainerRef.current) {
            console.log('✅ Form container found:', formContainerRef.current);
            console.log('🔧 Form container attributes:', {
              className: formContainerRef.current.className,
              'kr-card-form-expanded': formContainerRef.current.getAttribute('kr-card-form-expanded'),
              'kr-form-token': formContainerRef.current.getAttribute('kr-form-token')
            });
          } else {
            console.log('❌ Form container not found');
          }
        } else if (attempts < maxAttempts) {
          console.log(`⏳ KR object not yet available, retrying... (${attempts}/${maxAttempts})`);
          setTimeout(checkKR, 100);
        } else {
          console.log('❌ KR object not available after maximum attempts');
        }
      };
      
      checkKR();
    }
  }, [isScriptLoaded]);

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
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Load Izipay JavaScript Library with public key */}
      <Script
        src={javascriptUrl || "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"}
        kr-public-key={publicKey}
        kr-post-url-success={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/izipay/success`}
        kr-post-url-refused={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/izipay/error`}
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
        href="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon-reset.min.css"
      />
      
      {/* Custom CSS to style the Izipay button to match the green primary color */}
      <style jsx>{`
        .kr-smart-form {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }
        .kr-smart-form .kr-embedded {
          width: 100% !important;
          max-width: 100% !important;
        }
        .kr-smart-form button[type="submit"],
        .kr-smart-form .kr-payment-button,
        .kr-smart-form .kr-submit,
        .kr-smart-form input[type="submit"] {
          background-color: #6ea058 !important;
          border-color: #6ea058 !important;
          color: white !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .kr-smart-form button[type="submit"]:hover,
        .kr-smart-form .kr-payment-button:hover,
        .kr-smart-form .kr-submit:hover,
        .kr-smart-form input[type="submit"]:hover {
          background-color: #5a8a47 !important;
          border-color: #5a8a47 !important;
        }
        .kr-smart-form button[type="submit"]:focus,
        .kr-smart-form .kr-payment-button:focus,
        .kr-smart-form .kr-submit:focus,
        .kr-smart-form input[type="submit"]:focus {
          box-shadow: 0 0 0 3px rgba(110, 160, 88, 0.3) !important;
        }
      `}</style>
      
      {/* Load Izipay Theme JavaScript */}
      <Script
        src="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.js"
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
      <div 
        ref={formContainerRef}
        className="kr-smart-form" 
        kr-card-form-expanded="true"
        kr-form-token={formToken}
      >
        {/* Required kr-embedded container */}
        <div className="kr-embedded">
          {/* Cardholder Name Field - Pre-filled if customer name is provided */}
          {customerName && (
            <div className="kr-card-holder-name" kr-label-card-holder-name="Nombre del titular">
              <input 
                type="text" 
                name="cardholder-name" 
                className="kr-theme" 
                placeholder="Nombre del titular" 
                value={customerName}
                required 
              />
            </div>
          )}
          
          {/* Error zone - Izipay will populate this */}
          <div className="kr-form-error"></div>
        </div>
      </div>

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

    </div>
  );
};

export default IzipaySmartFormCorrect;
