'use client';

import { useState } from 'react';
import { IzipayForm } from '@/components/izipay/IzipayForm';
import { IzipayTestForm } from '@/components/izipay/IzipayTestForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestIzipayPage() {
  const [testType, setTestType] = useState<'simple' | 'advanced'>('simple');

  const handleSuccess = (result: unknown) => {
    console.log('✅ Payment successful:', result);
    alert(`Payment successful! Result: ${JSON.stringify(result)}`);
  };

  const handleError = (error: string) => {
    console.error('❌ Payment error:', error);
    alert(`Payment error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Izipay Integration Test</h1>
          <p className="text-gray-600 mb-6">
            Test the new Izipay integration implementation
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setTestType('simple')}
              variant={testType === 'simple' ? 'default' : 'outline'}
            >
              Simple Test
            </Button>
            <Button
              onClick={() => setTestType('advanced')}
              variant={testType === 'advanced' ? 'default' : 'outline'}
            >
              Advanced Test
            </Button>
          </div>
        </div>

        {testType === 'simple' ? (
          <Card>
            <CardHeader>
              <CardTitle>Simple Izipay Form Test</CardTitle>
            </CardHeader>
            <CardContent>
              <IzipayForm
                publicKey="88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSXx"
                amountInCents={5000} // S/ 50.00 (5000 cents)
                currency="PEN"
                customerEmail="test@example.com"
                customerName="María González"
                customerPhone="+51987654321"
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Advanced Izipay Test</CardTitle>
            </CardHeader>
            <CardContent>
              <IzipayTestForm />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Test Mode</h3>
                <p className="text-sm text-gray-600">
                  Using Izipay test credentials. Test payments will be processed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Test Amount</h3>
                <p className="text-sm text-gray-600">
                  S/ 50.00 (5000 cents)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Currency</h3>
                <p className="text-sm text-gray-600">
                  PEN (Peruvian Sol)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Public Key</h3>
                <p className="text-sm text-gray-600 font-mono">
                  88569105:testpublickey_...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
