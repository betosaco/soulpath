'use client';

import { useState } from 'react';
import IzipayPayment from '@/components/IzipayPayment';

export default function TestPaymentPage() {
  const [showPayment, setShowPayment] = useState(false);

  const handleSuccess = (result: any) => {
    console.log('Payment successful:', result);
    alert('Payment successful!');
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
    alert('Payment error: ' + error);
  };

  const handleCancel = () => {
    console.log('Payment cancelled');
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Izipay Payment</h1>
        
        {!showPayment ? (
          <div className="text-center">
            <button
              onClick={() => setShowPayment(true)}
              className="px-8 py-4 bg-primary text-white rounded-lg text-lg font-medium hover:opacity-90 transition-all duration-200"
            >
              Test Payment (S/ 100.00)
            </button>
          </div>
        ) : (
          <IzipayPayment
            amount={100}
            orderId={`test-${Date.now()}`}
            customerEmail="test@example.com"
            customerName="Test User"
            customerPhone="+51999999999"
            onSuccess={handleSuccess}
            onError={handleError}
            onCancel={handleCancel}
            className="bg-white p-6 rounded-lg shadow-lg"
          />
        )}
      </div>
    </div>
  );
}
