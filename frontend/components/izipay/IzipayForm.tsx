'use client';

import React, { useState, useCallback } from 'react';
import { IzipayPaymentFormCorrect } from './IzipayPaymentFormCorrect';

interface IzipayFormProps {
  publicKey: string;
  amountInCents: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess: (paymentToken: string) => void;
  onError: (errorMessage: string) => void;
}

export const IzipayForm: React.FC<IzipayFormProps> = ({
  publicKey,
  amountInCents,
  currency,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onError,
}) => {
  const [orderId] = useState(() => `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleSuccess = useCallback((paymentResult: Record<string, unknown>) => {
    console.log('✅ Payment successful:', paymentResult);
    
    // Extract the form token from the payment result
    let paymentToken = '';
    
    if (paymentResult.transaction && typeof paymentResult.transaction === 'object') {
      const transaction = paymentResult.transaction as Record<string, unknown>;
      paymentToken = transaction.uuid as string || transaction.transactionId as string || '';
    }
    
    if (!paymentToken) {
      console.warn('No payment token found in result, using order ID');
      paymentToken = orderId;
    }
    
    onSuccess(paymentToken);
  }, [onSuccess, orderId]);

  const handleError = useCallback((errorMessage: string) => {
    console.error('❌ Payment error:', errorMessage);
      onError(errorMessage);
  }, [onError]);

  return (
    <IzipayPaymentFormCorrect
      publicKey={publicKey}
      amountInCents={amountInCents}
      currency={currency}
      orderId={orderId}
      customerEmail={customerEmail || "customer@example.com"}
      customerName={customerName}
      customerPhone={customerPhone}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

export default IzipayForm;

