'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { BaseButton } from '@/components/ui/BaseButton';
import { BaseCard } from '@/components/ui/BaseCard';
import { CreditCard, Lock, Shield, CheckCircle, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useTermsUI } from '@/store/appStore';

interface StripeInlineFormProps {
  amount: number; // Amount in cents
  currency: string;
  description: string;
  customerEmail?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
  appearance?: {
    theme?: 'stripe' | 'night' | 'flat';
    variables?: Record<string, string>;
    rules?: Record<string, Record<string, string>>;
  };
}

// Card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

// Stripe Elements wrapper component
function StripeFormInner({
  amount,
  currency,
  description,
  customerEmail,
  customerId,
  metadata,
  onSuccess,
  onError,
  onCancel
}: Omit<StripeInlineFormProps, 'className' | 'appearance'>) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // Terms and Conditions state
  const [termsAccepted, setTermsAccepted] = useState(true);
  const { openTerms } = useTermsUI();
  const [email, setEmail] = useState(customerEmail || '');

  // Create payment intent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            description,
            customerEmail: email || customerEmail,
            customerId,
            metadata,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to create payment intent');
        }

        setClientSecret(result.clientSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (stripe && elements) {
      createPaymentIntent();
    }
  }, [stripe, elements, amount, currency, description, customerEmail, customerId, metadata, email, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if terms are accepted first
    if (!termsAccepted) {
      openTerms();
      return;
    }

    // Process payment if terms are accepted
    await processPayment();
  };

  const processPayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email || customerEmail,
          },
        },
        return_url: window.location.origin + '/payment/success',
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess?.(paymentIntent.id);
      } else if (paymentIntent?.status === 'requires_action') {
        // Handle 3D Secure or other authentication
        const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
        if (actionError) {
          throw new Error(actionError.message || 'Authentication failed');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount display */}
      <div className="rounded-lg p-4" style={{ background: 'var(--color-surface-secondary)' }}>
        <div className="flex justify-between items-center">
          <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Amount:</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {formatAmount(amount, currency)}
          </span>
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      </div>

      {/* Email field (if not provided) */}
      {!customerEmail && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ borderColor: 'var(--color-border-300)' }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary-500)`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            placeholder="your@email.com"
            required
          />
        </div>
      )}

      {/* Card element */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Card Information
        </label>
        <div className="border rounded-md p-3 focus-within:ring-2 focus-within:border-transparent" style={{ borderColor: 'var(--color-border-300)' }}>
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Stripe Link notice */}
      <div className="rounded-lg p-3" style={{ background: 'color-mix(in srgb, var(--color-status-info) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-info) 25%, transparent)' }}>
        <div className="flex items-center">
          <LinkIcon className="w-5 h-5" style={{ color: 'var(--color-status-info)' }} />
          <span className="text-sm" style={{ color: 'var(--color-status-info)' }}>
            <strong>Fast checkout:</strong> If you&apos;ve used Stripe Link before, your saved card will appear here automatically.
          </span>
        </div>
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center space-x-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-1" style={{ color: 'var(--color-status-success)' }} />
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center">
          <Lock className="w-4 h-4 mr-1" style={{ color: 'var(--color-status-success)' }} />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" style={{ color: 'var(--color-status-success)' }} />
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg p-3" style={{ background: 'color-mix(in srgb, var(--color-status-error) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-error) 25%, transparent)' }}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-status-error)' }} />
            <span className="text-sm" style={{ color: 'var(--color-status-error)' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Terms acceptance */}
      <div className="mb-1">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => {
              if (e.target.checked) {
                openTerms();
              } else {
                setTermsAccepted(false);
              }
            }}
            required
            aria-required="true"
            className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            I agree to the{' '}
            <button
              type="button"
              onClick={() => openTerms()}
              className="underline"
              style={{ color: 'var(--color-accent-500)' }}
            >
              Terms and Conditions
            </button>
          </span>
        </label>
      </div>

      {/* Submit button */}
      <BaseButton
        type="submit"
        disabled={!stripe || !elements || isLoading || !clientSecret || !termsAccepted}
        loading={isLoading}
        className="w-full"
        variant="primary"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay {formatAmount(amount, currency)}
          </>
        )}
      </BaseButton>

      {/* Cancel button */}
      {onCancel && (
        <BaseButton
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          variant="outline"
          className="w-full mt-2"
        >
          Cancel
        </BaseButton>
      )}

      {/* Terms */}
      <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
        By clicking &ldquo;Pay&rdquo;, you agree to our terms of service and privacy policy.
      </p>
    </form>

    {/* Terms modal is mounted globally in AppShell */}
  </>
  );
}

// Main component with Stripe Elements provider
export function StripeInlineForm({
  amount,
  currency,
  description,
  customerEmail,
  customerId,
  metadata,
  onSuccess,
  onError,
  onCancel,
  className = '',
  appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0066cc',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '6px',
    },
  }
}: StripeInlineFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log('🔍 Initializing Stripe...');
        console.log('🔍 Publishable key available:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          throw new Error('Stripe publishable key is not configured. Please contact support.');
        }

        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
          throw new Error('Failed to initialize Stripe');
        }
        console.log('✅ Stripe initialized successfully');
        setStripePromise(Promise.resolve(stripe));
      } catch (err) {
        console.error('❌ Stripe initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Stripe';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    initializeStripe();
  }, [onError]);

  if (error) {
    return (
      <BaseCard className={`max-w-md mx-auto ${className}`}>
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment System Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <BaseButton onClick={() => window.location.reload()} variant="outline">
            Retry
          </BaseButton>
        </div>
      </BaseCard>
    );
  }

  if (!stripePromise) {
    return (
      <BaseCard className={`max-w-md mx-auto ${className}`}>
        <div className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-[var(--color-text-secondary)]">Loading payment system...</p>
        </div>
      </BaseCard>
    );
  }

  const options = {
    mode: 'payment' as const,
    amount,
    currency: currency.toLowerCase(),
    appearance,
  };

  return (
    <BaseCard className={`max-w-md mx-auto ${className}`}>
      <div className="p-6">
        <Elements stripe={stripePromise} options={options}>
          <StripeFormInner
            amount={amount}
            currency={currency}
            description={description}
            customerEmail={customerEmail}
            customerId={customerId}
            metadata={metadata}
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
          />
        </Elements>
      </div>
    </BaseCard>
  );
}

export default StripeInlineForm;
