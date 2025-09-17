'use client';

import React, { useState } from 'react';
import { IzipayForm } from './IzipayForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const IzipayTestForm: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSuccess = (paymentToken: string) => {
    console.log('✅ Payment successful:', paymentToken);
    alert(`Payment successful! Token: ${paymentToken}`);
  };

  const handleError = (errorMessage: string) => {
    console.error('❌ Payment error:', errorMessage);
    alert(`Payment error: ${errorMessage}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Izipay Payment Form Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>This is a test form to verify the Izipay integration works correctly.</p>
          <p>Click the button below to load the payment form.</p>
        </div>

        <Button
          onClick={() => setIsVisible(!isVisible)}
          className="w-full"
        >
          {isVisible ? 'Hide Payment Form' : 'Show Payment Form'}
        </Button>

        {isVisible && (
          <div className="border rounded-lg p-4">
            <IzipayForm
              publicKey="MOCK-PUBLIC-KEY" // This should be replaced with real key
              amountInCents={5000} // $50.00
              currency="PEN"
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p><strong>Test Amount:</strong> S/ 50.00</p>
          <p><strong>Currency:</strong> PEN (Peruvian Sol)</p>
          <p><strong>Public Key:</strong> MOCK-PUBLIC-KEY (for testing)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IzipayTestForm;
