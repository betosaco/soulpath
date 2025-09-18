'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Checkout component with SSR turned off
const CheckoutComponent = dynamic(() => import('../../components/Checkout'), {
  ssr: false,
});

export default function CheckoutPage() {
  return <CheckoutComponent />;
}
