// app/purchase/failed/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PurchaseFailedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment failed';

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="text-[var(--color-status-error)] text-6xl mb-6">❌</div>
          
          {/* Error Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Failed
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            We&apos;re sorry, but your payment could not be processed at this time.
          </p>

          {/* Error Details */}
          <div className="rounded-lg p-6 mb-8" style={{ background: 'color-mix(in srgb, var(--color-status-error) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-error) 25%, transparent)' }}>
            <h2 className="text-xl font-semibold text-[var(--color-status-error)] mb-2">Error Details</h2>
            <p className="text-[var(--color-status-error)]">{reason}</p>
          </div>

          {/* Common Solutions */}
          <div className="bg-secondary rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-foreground mb-4">What you can do:</h2>
            
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-[var(--color-accent-500)] mr-2">•</span>
                Check that your payment information is correct
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-accent-500)] mr-2">•</span>
                Ensure you have sufficient funds in your account
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-accent-500)] mr-2">•</span>
                Try using a different payment method
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-accent-500)] mr-2">•</span>
                Contact your bank if the issue persists
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/packages"
              className="block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </Link>
            
            <Link 
              href="/contact"
              className="block w-full bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
            >
              Contact Support
            </Link>
            
            <Link 
              href="/"
              className="block w-full text-[var(--color-accent-500)] hover:text-[var(--color-accent-600)] transition-colors"
            >
              Return to Home
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              If you continue to experience issues, please contact our support team 
              with the error message above for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
