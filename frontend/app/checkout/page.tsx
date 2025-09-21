'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedCheckoutFlow } from '@/components/UnifiedCheckoutFlow';
import { useCart, CartItem } from '@/lib/cart-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { } = useCart();

  const handleCheckoutComplete = (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: CartItem[];
  }) => {
    console.log('Order completed:', orderData);
    // Redirect to confirmation page
    router.push('/order-confirmation');
  };

  return (
    <UnifiedCheckoutFlow
      onCheckoutComplete={handleCheckoutComplete}
    />
  );
}