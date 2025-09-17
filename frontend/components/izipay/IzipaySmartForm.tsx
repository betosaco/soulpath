'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Shield, AlertCircle } from 'lucide-react';

interface IzipaySmartFormProps {
  publicKey: string;
  formToken: string;
  amountInCents: number;
  currency: string;
  onSuccess: (paymentResult: Record<string, unknown>) => void;
  onError: (errorMessage: string) => void;
  onCancel?: () => void;
}

// Extend the global window object to include Izipay SmartForm types
declare global {
  interface Window {
    KR: {
      setFormConfig: (config: Record<string, unknown>) => Promise<{ KR: unknown; result: unknown }>;
      validateForm: () => Promise<{ KR: unknown; result: unknown }>;
      onFormReady: (callback: () => void) => void;
      onError: (callback: (error: Record<string, unknown>) => void) => void;
      onFormValid: (callback: () => void) => void;
      onFormInvalid: (callback: () => void) => void;
      onSubmit: (callback: (event: Record<string, unknown>) => void) => void;
      onTransactionCreated: (callback: (event: Record<string, unknown>) => void) => void;
      onBrandChanged: (callback: (event: Record<string, unknown>) => void) => void;
      onFocus: (callback: (event: Record<string, unknown>) => void) => void;
      onBlur: (callback: (event: Record<string, unknown>) => void) => void;
      onInstallmentChanged: (callback: (event: Record<string, unknown>) => void) => void;
    };
  }
}

export const IzipaySmartForm: React.FC<IzipaySmartFormProps> = ({
  publicKey,
  formToken,
  amountInCents,
  currency,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isIzipayReady, setIsIzipayReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Izipay SmartForm when script loads
  useEffect(() => {
    console.log('🔧 Form initialization useEffect triggered:', {
      isIzipayReady,
      hasKR: !!window.KR,
      hasFormToken: !!formToken,
      formToken: formToken ? 'Present' : 'Missing'
    });
    
    if (isIzipayReady && window.KR && formToken) {
      console.log('✅ All conditions met, initializing SmartForm...');
      initializeSmartForm();
    } else {
      console.log('⏳ Waiting for conditions:', {
        isIzipayReady,
        hasKR: !!window.KR,
        hasFormToken: !!formToken
      });
    }
  }, [isIzipayReady, formToken, initializeSmartForm]);

  const initializeSmartForm = useCallback(() => {
    if (!window.KR || !formContainerRef.current) {
      console.error('❌ Izipay SDK not loaded or form container not available');
      return;
    }

    // Check if KR has required methods
    const requiredMethods = ['setFormConfig', 'onFormReady', 'onError', 'onFormValid', 'onFormInvalid'];
    const missingMethods = requiredMethods.filter(method => typeof window.KR[method] !== 'function');
    
    if (missingMethods.length > 0) {
      console.error('❌ KR object missing required methods:', missingMethods);
      onError('El SDK de Izipay no está completamente cargado');
      return;
    }

    try {
      console.log('🔧 Initializing Izipay SmartForm...');
      console.log('📋 Configuration:', {
        publicKey: publicKey ? 'Present' : 'Missing',
        formToken: formToken ? 'Present' : 'Missing',
        container: formContainerRef.current ? 'Available' : 'Missing',
        krMethods: requiredMethods.map(method => `${method}: ${typeof window.KR[method]}`)
      });
      
      // Clear previous form
      formContainerRef.current.innerHTML = '';

      // First, set up event handlers
      setupEventHandlers();

      // Then configure the SmartForm
      const config = {
        'kr-public-key': publicKey,
        'kr-form-token': formToken,
        'kr-language': 'es-PE',
        'kr-post-url-success': window.location.origin + '/api/izipay/success',
        'kr-post-url-refused': window.location.origin + '/api/izipay/error',
        'kr-get-url-success': window.location.origin + '/api/izipay/success',
        'kr-get-url-refused': window.location.origin + '/api/izipay/error',
        'kr-clear-on-error': true,
        'kr-hide-debug-toolbar': process.env.NODE_ENV === 'production',
        'kr-spa-mode': true, // Important for SPA mode
      };

      console.log('⚙️ Setting form configuration:', config);

      // Use KR.onFormReady to ensure the form is ready before configuration
      window.KR.onFormReady(() => {
        console.log('✅ Form is ready, setting configuration...');
        
        window.KR.setFormConfig(config).then(({ KR, result }) => {
          console.log('✅ Form configuration set successfully:', result);
          
          // Create the SmartForm container after configuration
          createSmartFormContainer();
          
          // Add a small delay to ensure the form is rendered
          setTimeout(() => {
            console.log('🔍 Checking if form was rendered...');
            const smartFormElement = formContainerRef.current?.querySelector('.kr-smart-form');
            if (smartFormElement) {
              console.log('✅ SmartForm element found in DOM');
            } else {
              console.warn('⚠️ SmartForm element not found in DOM, retrying...');
              createSmartFormContainer();
            }
          }, 1000);
          
        }).catch((error) => {
          console.error('❌ Error setting form configuration:', error);
          onError('Error al configurar el formulario de pago');
        });
      });

      // Fallback: if onFormReady doesn't fire, try to initialize anyway
      setTimeout(() => {
        if (!formContainerRef.current?.querySelector('.kr-smart-form')) {
          console.log('🔄 Fallback initialization...');
          createSmartFormContainer();
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Error initializing SmartForm:', error);
      onError('Error al inicializar el formulario de pago');
    }
  }, [publicKey, formToken, onError]);

  const setupEventHandlers = useCallback(() => {
    if (!window.KR) return;

    // Form ready event
    window.KR.onFormReady(() => {
      console.log('✅ Izipay form is ready');
    });

    // Form validation events
    window.KR.onFormValid(() => {
      console.log('✅ Form is valid');
      setIsFormValid(true);
    });

    window.KR.onFormInvalid(() => {
      console.log('❌ Form is invalid');
      setIsFormValid(false);
    });

    // Error handling
    window.KR.onError((error) => {
      console.error('❌ Izipay form error:', error);
      setFormError(error.errorMessage || 'Error en el formulario de pago');
      onError(error.errorMessage || 'Error en el formulario de pago');
    });

    // Form submission
    window.KR.onSubmit((event) => {
      console.log('🚀 Form submitted:', event);
      setIsSubmitting(true);
      setFormError(null);
    });

    // Transaction created
    window.KR.onTransactionCreated((event) => {
      console.log('✅ Transaction created:', event);
      setIsSubmitting(false);
      
      if (event.transaction && event.transaction.status === 'SUCCESS') {
        onSuccess(event);
      } else {
        const errorMessage = event.transaction?.errorMessage || 'Error al procesar el pago';
        setFormError(errorMessage);
        onError(errorMessage);
      }
    });

    // Brand changed (card type detection)
    window.KR.onBrandChanged((event) => {
      console.log('💳 Card brand changed:', event);
    });

    // Focus events
    window.KR.onFocus((event) => {
      console.log('🎯 Field focused:', event);
    });

    window.KR.onBlur((event) => {
      console.log('👁️ Field blurred:', event);
    });

  }, [onSuccess, onError]);

  const createSmartFormContainer = useCallback(() => {
    if (!formContainerRef.current) return;

    console.log('🏗️ Creating SmartForm container...');

    // Create the SmartForm container with proper structure
    formContainerRef.current.innerHTML = `
      <div class="kr-smart-form" kr-card-form-expanded kr-form-token="${formToken}">
        <!-- Error zone -->
        <div class="kr-form-error"></div>
      </div>
    `;

    console.log('✅ SmartForm container created');
    console.log('📋 Container HTML:', formContainerRef.current.innerHTML);
  }, [formToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isIzipayReady || !window.KR) {
      onError('El formulario de pago no está listo');
      return;
    }

    if (!isFormValid) {
      onError('Por favor, complete todos los campos correctamente');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Validate form before submission
      const validationResult = await window.KR.validateForm();
      
      if (validationResult.result) {
        // Form is invalid, handle errors
        const errorMessage = validationResult.result.errorMessage || 'Datos del formulario inválidos';
        setFormError(errorMessage);
        onError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      // Form is valid, the transaction will be created automatically
      // The onTransactionCreated event will handle the result
      console.log('✅ Form validation passed, transaction will be created');
      
    } catch (error) {
      console.error('❌ Error validating form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al validar el formulario';
      setFormError(errorMessage);
      onError(errorMessage);
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
        src="https://static.lyra.com/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
        onLoad={() => setIsIzipayReady(true)}
        onError={() => {
          console.error('Failed to load Izipay script');
          onError('Error al cargar el procesador de pagos');
        }}
      />

      {/* Load Izipay CSS Theme */}
      <link
        rel="stylesheet"
        href="https://static.lyra.com/static/js/krypton-client/V4.0/ext/classic-reset.min.css"
      />
      <Script
        src="https://static.lyra.com/static/js/krypton-client/V4.0/ext/classic.js"
        onLoad={() => console.log('Izipay theme loaded')}
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

      {/* Izipay SmartForm Container */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div ref={formContainerRef} className="kr-smart-form-container">
          {/* The SmartForm will be rendered here by Izipay */}
        </div>

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
          className="w-full"
          disabled={!isIzipayReady || isSubmitting || !isFormValid}
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

export default IzipaySmartForm;
