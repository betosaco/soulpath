'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { BaseButton } from '@/components/ui/BaseButton';
import { BaseCard } from '@/components/ui/BaseCard';
import { CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';
import { useTermsUI } from '@/store/appStore';

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string;
  description: string;
  customerEmail?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  onSuccess?: (sessionId: string) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  amount,
  currency,
  description,
  customerEmail,
  customerId,
  metadata,
  onSuccess,
  // onCancel,
  onError,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<import('@stripe/stripe-js').Stripe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { openTerms } = useTermsUI();

  useEffect(() => {
    // Load Stripe
    const loadStripeClient = async () => {
      try {
        const stripeClient = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        setStripe(stripeClient);
      } catch {
        setError('Failed to load Stripe');
        onError?.('Failed to load Stripe');
      }
    };

    loadStripeClient();
  }, [onError]);

  const handleCheckout = async () => {
    if (!stripe) {
      setError('Stripe not loaded');
      onError?.('Stripe not loaded');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          customerEmail,
          customerId,
          metadata,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: result.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      onSuccess?.(result.sessionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <BaseCard className={`max-w-md mx-auto ${className}`}>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'color-mix(in srgb, var(--color-status-success) 12%, transparent)' }}>
            <CreditCard className="w-8 h-8" style={{ color: 'var(--color-status-success)' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Secure Checkout</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
        </div>

        <div className="rounded-lg p-4 mb-6" style={{ background: 'var(--color-surface-secondary)' }}>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--color-text-secondary)' }}>Total Amount:</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {formatAmount(amount, currency)}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <Shield className="w-4 h-4 mr-2" style={{ color: 'var(--color-status-success)' }} />
            <span>256-bit SSL encryption</span>
          </div>
          <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <Lock className="w-4 h-4 mr-2" style={{ color: 'var(--color-status-success)' }} />
            <span>PCI DSS compliant</span>
          </div>
          <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <CheckCircle className="w-4 h-4 mr-2" style={{ color: 'var(--color-status-success)' }} />
            <span>Secure payment processing</span>
          </div>
        </div>

        {error && (
          <div className="rounded-lg p-3 mb-4" style={{ background: 'color-mix(in srgb, var(--color-status-error) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-error) 25%, transparent)' }}>
            <p className="text-sm" style={{ color: 'var(--color-status-error)' }}>{error}</p>
          </div>
        )}

        <BaseButton
          onClick={handleCheckout}
          disabled={loading || !stripe}
          loading={loading}
          className="w-full"
          variant="primary"
        >
          {loading ? 'Processing...' : `Pay ${formatAmount(amount, currency)}`}
        </BaseButton>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
          By clicking &ldquo;Pay&rdquo;, you agree to our{' '}
          <button type="button" onClick={() => openTerms()} className="underline" style={{ color: 'var(--color-accent-500)' }}>
            Terms & Conditions
          </button>
          {' '}and Privacy Policy.
        </p>
      </div>
    </BaseCard>
  );
};

export default StripeCheckout;
