'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface PaymentResult {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  mockPayment?: boolean;
}

interface IzipayPaymentProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess: (result: PaymentResult) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  className?: string;
}

// Use the existing Window.KR type from IzipayForm.tsx

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
  const [containerReady, setContainerReady] = useState(false);

  // Callback ref to detect when container is attached
  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Use a different approach to track the container
      setContainerReady(true);
      console.log('🔍 Container attached to DOM:', !!node);
    } else {
      setContainerReady(false);
      console.log('🔍 Container detached from DOM');
    }
  }, []);

  // Debug: Log when container ref changes
  useEffect(() => {
    console.log('🔍 Container ref changed:', !!paymentContainerRef.current, 'Container ready:', containerReady);
  }, [containerReady]);

  // Create form token first (this will set publicKey)
  useEffect(() => {
    const createFormToken = async () => {
      try {
        console.log('🎫 Creating form token...');
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
        console.log('🎫 API Response:', data);

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

    createFormToken();
  }, [amount, orderId, customerEmail, customerName, customerPhone]);

  // Load Izipay script and CSS theme
  useEffect(() => {
    const loadIzipayAssets = () => {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src*="krypton-client"]');
      if (existingScript) {
        setIsScriptLoaded(true);
        return;
      }

      // Only load script if we have both public key and form token
      if (!publicKey || !formToken) {
        console.log('⏳ Waiting for public key and form token before loading script...', {
          hasPublicKey: !!publicKey,
          hasFormToken: !!formToken
        });
        return;
      }

      // Check if this is a mock payment (mock public key)
      if (publicKey === 'MOCK-PUBLIC-KEY') {
        console.log('🎭 Mock payment detected - skipping Izipay script load');
        setIsScriptLoaded(true);
        return;
      }

      console.log('📜 Loading Izipay assets with public key:', publicKey);
      
      // Load CSS theme first (recommended by Izipay docs)
      const existingCSS = document.querySelector('link[href*="classic-reset"]');
      if (!existingCSS) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.min.css';
        document.head.appendChild(cssLink);
        console.log('📜 CSS theme loaded');
      }

      // Load JavaScript library
      const script = document.createElement('script');
      script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
      script.setAttribute('kr-public-key', publicKey);
      script.setAttribute('kr-post-url-success', window.location.origin + '/api/izipay/payment-success');
      script.setAttribute('kr-post-url-refused', window.location.origin + '/api/izipay/payment-error');
      script.setAttribute('kr-post-url-cancelled', window.location.origin + '/api/izipay/payment-cancelled');
      script.async = true;
      script.onload = () => {
        console.log('📜 Izipay script loaded successfully');
        console.log('📜 KR object available after script load:', !!window.KR);
        console.log('📜 KR methods available:', window.KR ? Object.keys(window.KR) : 'N/A');
        setIsScriptLoaded(true);
      };
      script.onerror = (error) => {
        console.error('❌ Failed to load Izipay script:', error);
        setError('Failed to load payment script. Please check your internet connection and try again.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    if (!window.KR) {
      console.log('📜 KR not available, loading script...');
      loadIzipayAssets();
    } else {
      console.log('📜 KR already available, skipping script load');
      setIsScriptLoaded(true);
    }
  }, [publicKey, formToken]);

  const initializeForm = useCallback(() => {
    if (!paymentContainerRef.current) {
      console.error('❌ Container still not available');
      return;
    }
    
    try {
      console.log('🔧 Starting form initialization...');
      
      // Clear previous form
      paymentContainerRef.current.innerHTML = '';

      // Check if this is a mock payment
      if (publicKey === 'MOCK-PUBLIC-KEY') {
        console.log('🎭 Creating mock payment form');
        const mockForm = document.createElement('div');
        mockForm.className = 'mock-payment-form p-6 bg-gray-50 border border-gray-200 rounded-lg';
        mockForm.innerHTML = `
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Mock Payment Form</h3>
            <p class="text-gray-600">This is a development mock - no real payment will be processed</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="1234 5678 9012 3456" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="MM/YY" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="123" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="John Doe" />
            </div>
            <div class="pt-4">
              <button 
                id="mock-pay-button"
                class="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Pay S/ ${amount.toFixed(2)}
              </button>
            </div>
          </div>
        `;
        paymentContainerRef.current.appendChild(mockForm);
        
        // Add click handler for mock payment
        const payButton = mockForm.querySelector('#mock-pay-button');
        payButton?.addEventListener('click', () => {
          console.log('🎭 Mock payment submitted');
          onSuccess({
            orderId: orderId,
            amount: amount,
            currency: 'PEN',
            status: 'PAID',
            mockPayment: true
          });
        });
        
        setIsLoading(false);
        return;
      }

      // Real Izipay form initialization
      if (!window.KR) {
        console.log('❌ KR object not available for real payment');
        setError('Payment system not available');
        setIsLoading(false);
        return;
      }

      console.log('🔧 Setting up KR event handlers...');
      
      // Set up event handlers BEFORE creating the form
      window.KR.onSubmit(() => {
        console.log('Payment form submitted');
      });

      window.KR.onError((error: { message?: string }) => {
        console.error('Payment error:', error);
        onError(error.message || 'Payment failed');
      });

      window.KR.onTransactionCreated((result: PaymentResult) => {
        console.log('Transaction created:', result);
        onSuccess(result);
      });

      // Use KR.onFormReady to ensure proper initialization timing
      (window.KR as unknown as { onFormReady: (callback: () => void) => void }).onFormReady(() => {
        console.log('🔧 KR.onFormReady callback triggered - form is ready');
        
        // Set additional configuration
        window.KR.setFormConfig({
          'kr-post-url-success': window.location.origin + '/api/izipay/payment-success',
          'kr-post-url-refused': window.location.origin + '/api/izipay/payment-error',
          'kr-post-url-cancelled': window.location.origin + '/api/izipay/payment-cancelled'
        });

        // Create the form container with proper attributes
        const formDiv = document.createElement('div');
        formDiv.id = 'izipay-payment-form';
        formDiv.className = 'kr-smart-form';
        formDiv.setAttribute('kr-card-form-expanded', ''); // Enable embedded card fields
        formDiv.setAttribute('kr-form-token', formToken || '');
        
        // Clear container and add form
        if (paymentContainerRef.current) {
          paymentContainerRef.current.innerHTML = '';
          paymentContainerRef.current.appendChild(formDiv);
        }
        
        console.log('🔧 Form container created with attributes:', {
          id: formDiv.id,
          className: formDiv.className,
          krFormToken: formDiv.getAttribute('kr-form-token'),
          parentElement: paymentContainerRef.current?.tagName
        });

        // Add the form using KR.addForm
        try {
          console.log('🔧 Calling KR.addForm...');
          window.KR.addForm('#izipay-payment-form');
          console.log('✅ KR.addForm successful');
          
          // The form should auto-render after addForm is called
          console.log('✅ Form should be auto-rendering');
          
          setIsLoading(false);
        } catch (addFormError) {
          console.error('❌ KR.addForm failed:', addFormError);
          setError('Failed to create payment form: ' + (addFormError instanceof Error ? addFormError.message : 'Unknown error'));
          setIsLoading(false);
        }
      });

      // Set the form token to trigger form creation
      console.log('🔧 Setting form token to trigger initialization...');
      (window.KR as unknown as { setFormToken: (token: string) => void }).setFormToken(formToken!);
      
    } catch (err) {
      console.error('Error initializing payment form:', err);
      setError('Failed to initialize payment form');
      setIsLoading(false);
    }
  }, [publicKey, formToken, onSuccess, onError, amount, orderId]);

  // Initialize payment form using proper Izipay pattern
  useEffect(() => {
    console.log('🔧 Form initialization useEffect triggered:', {
      isScriptLoaded,
      hasFormToken: !!formToken,
      hasPublicKey: !!publicKey,
      hasContainer: !!paymentContainerRef.current,
      containerReady
    });
    
    if (isScriptLoaded && formToken && publicKey && paymentContainerRef.current) {
      console.log('✅ All conditions met, initializing form...');
      initializeForm();
    }
  }, [isScriptLoaded, formToken, publicKey, containerReady, initializeForm]);

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
        ref={containerRefCallback}
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
