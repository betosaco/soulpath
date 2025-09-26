'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/appStore';
import { Users, User, CheckCircle } from 'lucide-react';

/**
 * GroupBookingSelectionStep Component
 * 
 * This step asks the user if they want to make a group booking (multiple users)
 * or individual booking (single user for all packages).
 * 
 * Business Logic:
 * - If user selects "Group Booking": Navigate to multi-user forms
 * - If user selects "Individual Booking": Navigate to single user form
 * - Only shows when there are multiple packages in cart
 */
export function GroupBookingSelectionStep() {
  const router = useRouter();
  const { items: cartItems } = useCart();

  // Get package items from cart
  const packageItems = cartItems.filter(item => item.type === 'package');
  const packageCount = packageItems.length;

  const handleGroupBooking = () => {
    console.log('👥 User selected Group Booking');
    // Navigate to multi-user forms for each package
    router.push('/booking/group-customer-info');
  };

  const handleIndividualBooking = () => {
    console.log('👤 User selected Individual Booking');
    // Navigate directly to single user form
    router.push('/booking/customer-info?isDirectCheckout=true');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--unified-text-primary)' }}>
          Booking Type Selection
        </h1>
        <p className="text-lg" style={{ color: 'var(--unified-text-secondary)' }}>
          You have {packageCount} package{packageCount > 1 ? 's' : ''} in your cart. 
          Choose how to assign these packages to users.
        </p>
      </div>

      {/* Package Summary */}
      <div className="unified-card p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--unified-text-primary)' }}>Your Packages:</h3>
        <div className="space-y-3">
          {packageItems.map((pkg, index) => (
            <div
              key={`package-${index}`}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ background: 'var(--unified-bg-surface)', borderColor: 'var(--unified-border-light)' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-status-success) 12%, transparent)' }}>
                  <span className="font-semibold" style={{ color: 'var(--unified-success)' }}>{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: 'var(--unified-text-primary)' }}>{pkg.name}</h4>
                  <p className="text-sm" style={{ color: 'var(--unified-text-secondary)' }}>
                    {pkg.bookingDetails?.length || 0} / {pkg.sessions || 1} sessions booked
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold" style={{ color: 'var(--unified-text-primary)' }}>
                  {pkg.currency} {pkg.price?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Type Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Group Booking Option */}
        <button
          onClick={handleGroupBooking}
          className="group unified-card p-8 text-left"
          style={{ borderColor: 'var(--unified-border-light)' }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style={{ background: 'color-mix(in srgb, var(--color-status-success) 12%, transparent)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--unified-success)' }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--unified-text-primary)' }}>
              Group Booking
            </h3>
          </div>
          <p className="mb-4" style={{ color: 'var(--unified-text-secondary)' }}>
            Each package will be assigned to a different person. You&apos;ll provide contact information for each participant.
          </p>
          <div className="flex items-center font-medium" style={{ color: 'var(--unified-success)' }}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Perfect for families, friends, or teams
          </div>
        </button>

        {/* Individual Booking Option */}
        <button
          onClick={handleIndividualBooking}
          className="group unified-card p-8 text-left"
          style={{ borderColor: 'var(--unified-border-light)' }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style={{ background: 'color-mix(in srgb, var(--unified-accent) 12%, transparent)' }}>
              <User className="w-6 h-6" style={{ color: 'var(--unified-accent)' }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--unified-text-primary)' }}>
              Individual Booking
            </h3>
          </div>
          <p className="mb-4" style={{ color: 'var(--unified-text-secondary)' }}>
            All packages will be assigned to you. You&apos;ll provide your contact information once.
          </p>
          <div className="flex items-center font-medium" style={{ color: 'var(--unified-accent-dark)' }}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Perfect for personal use
          </div>
        </button>
      </div>

    </div>
  );
}
