'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface IzipayPaymentProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  className?: string;
}

declare global {
  interface Window {
    KR: any;
  }
}

export default function IzipayPayment({
  amount,
  orderId,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onError,
  onCancel,
  className = ''
}: IzipayPaymentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formToken, setFormToken] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const paymentContainerRef = useRef<HTMLDivElement>(null);

  // Load Izipay script
  useEffect(() => {
    const loadScript = () => {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src*="krypton-client"]');
      if (existingScript) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        setError('Failed to load payment script');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    if (!window.KR) {
      loadScript();
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // Create form token
  useEffect(() => {
    const createFormToken = async () => {
      try {
        const response = await fetch('/api/izipay/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: 'PEN',
            orderId,
            customer: {
              email: customerEmail,
              ...(customerName && { firstName: customerName.split(' ')[0] }),
              ...(customerName && customerName.split(' ').length > 1 && { lastName: customerName.split(' ').slice(1).join(' ') }),
              ...(customerPhone && { phone: customerPhone })
            }
          })
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to create payment token');
        }

        console.log('🎫 Received form token:', data.formToken ? 'Present' : 'Missing');
        console.log('🔑 Received public key:', data.publicKey ? 'Present' : 'Missing');
        setFormToken(data.formToken);
        setPublicKey(data.publicKey);
      } catch (err) {
        console.error('Error creating form token:', err);
        setError(err instanceof Error ? err.message : 'Failed to create payment token');
        setIsLoading(false);
      }
    };

    if (isScriptLoaded) {
      createFormToken();
    }
  }, [isScriptLoaded, amount, orderId, customerEmail, customerName, customerPhone]);

  // Initialize payment form
  useEffect(() => {
    if (isScriptLoaded && formToken && publicKey && paymentContainerRef.current && window.KR) {
      try {
        // Clear previous form
        paymentContainerRef.current.innerHTML = '';

        // Set up KR configuration FIRST
        console.log('🔑 Setting KR config with public key:', publicKey);
        window.KR.setFormConfig({
          'kr-public-key': publicKey,
          'kr-form-token': formToken,
          'kr-post-url-success': window.location.origin + '/api/izipay/payment-success',
          'kr-post-url-refused': window.location.origin + '/api/izipay/payment-error',
          'kr-post-url-cancelled': window.location.origin + '/api/izipay/payment-cancelled'
        });

        // Set up event handlers
        window.KR.onSubmit(() => {
          console.log('Payment form submitted');
        });

        window.KR.onError((error: any) => {
          console.error('Payment error:', error);
          onError(error.message || 'Payment failed');
        });

        window.KR.onTransactionCreated((result: any) => {
          console.log('Transaction created:', result);
          onSuccess(result);
        });

        // Create embedded form
        const formDiv = document.createElement('div');
        formDiv.id = 'izipay-payment-form';
        formDiv.className = 'kr-embedded';
        formDiv.setAttribute('kr-form-token', formToken);
        paymentContainerRef.current.appendChild(formDiv);

        // Wait a bit for the DOM to be ready, then add and show form
        setTimeout(() => {
          try {
            // Add form to KR
            window.KR.addForm('#izipay-payment-form');
            window.KR.showForm('#izipay-payment-form');
            setIsLoading(false);
          } catch (formError) {
            console.error('Error adding/showing form:', formError);
            setError('Failed to display payment form');
            setIsLoading(false);
          }
        }, 200);
      } catch (err) {
        console.error('Error initializing payment form:', err);
        setError('Failed to initialize payment form');
        setIsLoading(false);
      }
    }
  }, [isScriptLoaded, formToken, publicKey, onSuccess, onError]);

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Payment Error</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`p-6 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-gray-600">Loading payment form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Payment</h3>
        <p className="text-gray-600">
          Amount: <span className="font-medium">S/ {amount.toFixed(2)}</span>
        </p>
      </div>
      
      <div 
        id="izipay-payment-form" 
        ref={paymentContainerRef}
        className="min-h-[400px] border border-gray-200 rounded-lg p-4"
      />
      
      <div className="mt-4 text-center">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
}
