'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { AppLayout } from '@/components/AppLayout';
import { LoadingState } from '@/components/LoadingState';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingState message="Processing your order..." />;
  }

  return (
    <AppLayout className="min-h-screen bg-gray-50">
      <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-mono">#12345</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">$97.19</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              A confirmation email has been sent to your email address with all the details.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/products')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={() => router.push('/account')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Order History
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
