'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Loader2, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Lyra Embedded Payment Form Component
 * 
 * Integrates Lyra/Izipay SmartForm for secure payment processing
 * Documentation: https://docs.lyra.com/en/rest/V4.0/javascript/guide/display/presentation.html
 */

interface LyraEmbeddedFormProps {
  amount: number;
  currency?: string;
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  customerFirstName?: string;
  customerLastName?: string;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: any) => void;
  displayMode?: 'list' | 'popin' | 'embedded';
}

declare global {
  interface Window {
    KR?: any;
  }
}

export function LyraEmbeddedForm({
  amount,
  currency = 'PEN',
  orderId,
  customerEmail,
  customerPhone,
  customerFirstName,
  customerLastName,
  onSuccess,
  onError,
  displayMode = 'embedded',
}: LyraEmbeddedFormProps) {
  const [formToken, setFormToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Get environment variables
  const LYRA_PUBLIC_KEY = process.env.NEXT_PUBLIC_LYRA_PUBLIC_KEY || '';
  const LYRA_JS_URL = process.env.NEXT_PUBLIC_LYRA_JS_LIBRARY_URL || 'https://static.lyra.com/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';

  /**
   * Generate formToken from backend
   */
  const generateFormToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/lyra/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          orderId,
          customer: {
            email: customerEmail,
            phone: customerPhone,
            firstName: customerFirstName,
            lastName: customerLastName,
          },
        }),
      });

      const data = await response.json();

      if (!data.success || !data.formToken) {
        throw new Error(data.error || 'Failed to generate payment token');
      }

      setFormToken(data.formToken);
      setLoading(false);
      
    } catch (err) {
      console.error('❌ Error generating formToken:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      setLoading(false);
      onError?.(err);
    }
  };

  /**
   * Initialize Lyra SmartForm when script is loaded
   */
  useEffect(() => {
    if (scriptLoaded && formToken && window.KR) {
      try {
        console.log('🔄 Initializing Lyra SmartForm');

        // Set up payment success callback
        window.KR.onSubmit((paymentData: any) => {
          setPaymentProcessing(true);
          console.log('💳 Payment submitted:', paymentData);
          return true;
        });

        // Handle payment success
        window.KR.onFormReady(() => {
          console.log('✅ Lyra form ready');
        });

        // Handle errors
        window.KR.onError((error: any) => {
          console.error('❌ Lyra form error:', error);
          setPaymentProcessing(false);
          setError(error.message || 'Payment failed');
          onError?.(error);
        });

      } catch (err) {
        console.error('❌ Error initializing Lyra form:', err);
        setError('Failed to initialize payment form');
      }
    }
  }, [scriptLoaded, formToken]);

  /**
   * Generate formToken on component mount
   */
  useEffect(() => {
    generateFormToken();
  }, [amount, orderId, customerEmail]);

  /**
   * Render form based on display mode
   */
  const getFormClassName = () => {
    switch (displayMode) {
      case 'popin':
        return 'kr-smart-form kr-popin';
      case 'embedded':
        return 'kr-smart-form kr-card-form-expanded';
      case 'list':
      default:
        return 'kr-smart-form';
    }
  };

  return (
    <div className="lyra-payment-container">
      {/* Load Lyra JavaScript Library */}
      <Script
        src={LYRA_JS_URL}
        strategy="lazyOnload"
        onLoad={() => {
          console.log('✅ Lyra script loaded');
          setScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('❌ Failed to load Lyra script:', e);
          setError('Failed to load payment form');
        }}
        data-kr-public-key={LYRA_PUBLIC_KEY}
        data-kr-post-url-success={`${window.location.origin}/booking/confirmation`}
        data-kr-language="es-ES"
      />

      {/* Load Neon Theme */}
      <link
        rel="stylesheet"
        href="https://static.lyra.com/static/js/krypton-client/V4.0/ext/neon-reset.min.css"
      />
      <Script
        src="https://static.lyra.com/static/js/krypton-client/V4.0/ext/neon.js"
        strategy="lazyOnload"
      />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)] mb-4" />
          <p className="text-[var(--color-text-secondary)]">Initializing secure payment...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg p-6 mb-4" style={{ 
          background: 'color-mix(in srgb, var(--color-status-error) 8%, transparent)', 
          border: '1px solid color-mix(in srgb, var(--color-status-error) 25%, transparent)' 
        }}>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-[var(--color-status-error)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--color-status-error)] mb-1">
                Payment Error
              </h4>
              <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--color-status-error) 85%, black)' }}>
                {error}
              </p>
              <button
                onClick={generateFormToken}
                className="mt-3 text-sm font-medium text-[var(--color-status-error)] hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {paymentSuccess && (
        <div className="rounded-lg p-6 mb-4" style={{ 
          background: 'color-mix(in srgb, var(--color-status-success) 8%, transparent)', 
          border: '1px solid color-mix(in srgb, var(--color-status-success) 25%, transparent)' 
        }}>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-6 h-6 text-[var(--color-status-success)] flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-[var(--color-status-success)] mb-1">
                Payment Successful!
              </h4>
              <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--color-status-success) 85%, black)' }}>
                Your payment has been processed successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form */}
      {!loading && !error && formToken && (
        <div className="lyra-form-wrapper">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard className="w-6 h-6 text-[var(--color-primary-500)]" />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Secure Payment
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Enter your payment details securely. All transactions are encrypted and secure.
            </p>
          </div>

          {/* Lyra SmartForm Container */}
          <div
            ref={formRef}
            className={getFormClassName()}
            kr-form-token={formToken}
          >
            {/* Lyra will inject the payment form here */}
          </div>

          {/* Processing Overlay */}
          {paymentProcessing && (
            <div className="absolute inset-0 bg-[var(--color-background-primary)]/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)] mx-auto mb-3" />
                <p className="text-[var(--color-text-primary)] font-medium">Processing payment...</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Please do not close this window</p>
              </div>
            </div>
          )}

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-[var(--color-text-tertiary)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secured by Lyra/Izipay • PCI DSS Compliant</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .lyra-payment-container {
          position: relative;
          min-height: 300px;
        }

        .lyra-form-wrapper {
          position: relative;
        }

        /* Custom styling for Lyra form */
        :global(.kr-smart-form) {
          margin: 0 auto;
          max-width: 500px;
        }

        /* Ensure form fields are visible and styled */
        :global(.kr-smart-form .kr-payment-button) {
          background-color: var(--color-primary-500) !important;
          color: white !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          border-radius: 8px !important;
          transition: background-color 0.2s !important;
        }

        :global(.kr-smart-form .kr-payment-button:hover) {
          background-color: var(--color-primary-600) !important;
        }

        /* Style input fields to match your theme */
        :global(.kr-smart-form input) {
          border-color: var(--color-border-200) !important;
          background-color: var(--color-surface-primary) !important;
          color: var(--color-text-primary) !important;
        }

        :global(.kr-smart-form input:focus) {
          border-color: var(--color-primary-500) !important;
          outline: none !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-500) 10%, transparent) !important;
        }
      `}</style>
    </div>
  );
}
