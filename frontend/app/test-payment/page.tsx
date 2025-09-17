'use client';

import { useState } from 'react';
import { IzipayForm } from '@/components/izipay/IzipayForm';

export default function TestPaymentPage() {
  const [showPayment, setShowPayment] = useState(false);

  const handleSuccess = (result: unknown) => {
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <IzipayForm
              publicKey="88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSXx"
              amountInCents={10000} // S/ 100.00 in cents
              currency="PEN"
              onSuccess={(token) => handleSuccess({ token })}
              onError={handleError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
