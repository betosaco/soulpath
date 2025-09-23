'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UnifiedCheckoutFlow from '@/components/UnifiedCheckoutFlow';
import { useCart } from '@/store/appStore';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { } = useCart();

  // Check if this is a direct checkout (coming from cart with all sessions booked)
  const isDirectCheckout = searchParams.get('directCheckout') === 'true';

  const handleCheckoutComplete = (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: { name: string; quantity: number; price: number; }[];
  }) => {
    console.log('Order completed:', orderData);
    // Redirect to confirmation page
    router.push('/order-confirmation');
  };

  return (
    <UnifiedCheckoutFlow
      onCheckoutComplete={handleCheckoutComplete}
      isDirectCheckout={isDirectCheckout}
    />
  );
}