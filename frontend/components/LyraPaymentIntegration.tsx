'use client';

import React, { useState } from 'react';
import LyraPaymentForm from './LyraPaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BaseButton } from './ui/BaseButton';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface LyraPaymentIntegrationProps {
  amount: number; // Amount in cents
  currency: string;
  orderId: string;
  customer: {
    email: string;
    name?: string;
    phone?: string;
  };
  metadata?: Record<string, string>;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  className?: string;
}

export function LyraPaymentIntegration({
  amount,
  currency,
  orderId,
  customer,
  metadata,
  onSuccess,
  onError,
  className = ''
}: LyraPaymentIntegrationProps) {
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Lyra payment successful:', paymentData);
    setPaymentStatus('success');
    onSuccess(paymentData);
  };

  const handlePaymentError = (error: string) => {
    console.error('Lyra payment error:', error);
    setPaymentStatus('error');
    onError(error);
  };

  const startPayment = () => {
    setIsPaymentStarted(true);
    setPaymentStatus('processing');
  };

  const resetPayment = () => {
    setIsPaymentStarted(false);
    setPaymentStatus('idle');
  };

  // Convert amount to Peruvian Soles if needed
  const amountInSoles = currency === 'USD' ? Math.round(amount * 3.7) : amount; // Approximate conversion
  const displayAmount = (amountInSoles / 100).toFixed(2);

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="bg-[#1a1a2e] border-[#16213e]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard size={20} className="mr-2 text-[#ffd700]" />
            Pago con Lyra (Perú)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Summary */}
          <div className="bg-[#16213e] rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Total a Pagar</p>
                <p className="text-sm text-gray-400">Procesado de forma segura</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#ffd700]">
                  S/ {displayAmount}
                </p>
                <p className="text-sm text-gray-400">Soles Peruanos</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-400 mr-3" />
                <div>
                  <p className="text-green-400 font-medium">Pago Exitoso</p>
                  <p className="text-green-300 text-sm">Su pago ha sido procesado correctamente</p>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-400 mr-3" />
                <div>
                  <p className="text-red-400 font-medium">Error en el Pago</p>
                  <p className="text-red-300 text-sm">Hubo un problema procesando su pago</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form or Start Button */}
          {!isPaymentStarted ? (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Información de Pago</h4>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Aceptamos tarjetas Visa, Mastercard y American Express</li>
                  <li>• Procesamiento seguro con Lyra (MiCuentaWeb)</li>
                  <li>• Confirmación inmediata del pago</li>
                  <li>• Soporte para el mercado peruano</li>
                </ul>
              </div>

              <BaseButton
                onClick={startPayment}
                className="w-full dashboard-button-primary"
                disabled={paymentStatus === 'processing'}
              >
                <CreditCard size={16} className="mr-2" />
                Iniciar Pago con Lyra
              </BaseButton>
            </div>
          ) : (
            <div className="space-y-4">
              <LyraPaymentForm
                amount={amountInSoles}
                currency="PEN"
                orderId={orderId}
                customer={customer}
                metadata={{
                  ...metadata,
                  original_currency: currency,
                  original_amount: amount.toString(),
                  payment_provider: 'lyra'
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full"
              />

              <BaseButton
                onClick={resetPayment}
                variant="outline"
                className="w-full border-[#2a2a4a] text-gray-400 hover:bg-[#2a2a4a] hover:text-white"
              >
                Cancelar Pago
              </BaseButton>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
            <p className="text-xs text-gray-400 text-center">
              🔒 Sus datos de pago están protegidos con encriptación SSL de 256 bits
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
