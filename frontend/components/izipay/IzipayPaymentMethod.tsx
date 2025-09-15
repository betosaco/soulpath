/**
 * Izipay Payment Method Component
 * Provides Izipay as a payment option in payment method selection
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, Clock } from 'lucide-react';
import IzipayPaymentButton from './IzipayPaymentButton';
import IzipayInlineForm from './IzipayInlineForm';

interface IzipayPaymentMethodProps {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName?: string;
  description?: string;
  packagePriceId?: number;
  quantity?: number;
  metadata?: Record<string, unknown>;
  onSuccess?: (result: Record<string, unknown>) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  variant?: 'button' | 'inline' | 'card';
  showFeatures?: boolean;
  className?: string;
}

export function IzipayPaymentMethod({
  amount,
  currency = 'PEN',
  customerEmail,
  customerName,
  description,
  packagePriceId,
  quantity = 1,
  metadata = {},
  onSuccess,
  onError,
  onCancel,
  variant = 'card',
  showFeatures = true,
  className = '',
}: IzipayPaymentMethodProps) {
  const [selectedPaymentType, setSelectedPaymentType] = useState<'redirect' | 'inline'>('redirect');

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  const features = [
    {
      icon: Shield,
      title: 'Pago Seguro',
      description: 'Protección 3D Secure y tokenización',
    },
    {
      icon: CreditCard,
      title: 'Múltiples Tarjetas',
      description: 'Visa, Mastercard, American Express, Diners',
    },
    {
      icon: Clock,
      title: 'Procesamiento Rápido',
      description: 'Confirmación inmediata del pago',
    },
  ];

  // Button variant - simple payment button
  if (variant === 'button') {
    return (
      <div className={className}>
        <IzipayPaymentButton
          amount={amount}
          currency={currency}
          customerEmail={customerEmail}
          customerName={customerName}
          description={description}
          packagePriceId={packagePriceId}
          quantity={quantity}
          metadata={metadata}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={onCancel}
        />
      </div>
    );
  }

  // Inline variant - embedded form
  if (variant === 'inline') {
    return (
      <div className={className}>
        <IzipayInlineForm
          amount={amount}
          currency={currency}
          customerEmail={customerEmail}
          customerName={customerName}
          description={description}
          packagePriceId={packagePriceId}
          quantity={quantity}
          metadata={metadata}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={onCancel}
        />
      </div>
    );
  }

  // Card variant - full payment method card with options
  return (
    <Card className={`${className} border-2 hover:border-blue-200 transition-colors`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Izipay</h3>
              <p className="text-sm text-gray-600">Pago con tarjeta de crédito/débito</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Perú
          </Badge>
        </div>

        {/* Amount Display */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total a pagar:</span>
            <span className="font-bold text-lg">{formatAmount(amount, currency)}</span>
          </div>
        </div>

        {/* Features */}
        {showFeatures && (
          <div className="mb-6 space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <feature.icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Type Selection */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Tipo de pago:</p>
          <div className="flex space-x-2">
            <Button
              variant={selectedPaymentType === 'redirect' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPaymentType('redirect')}
              className="flex-1"
            >
              Página de Pago
            </Button>
            <Button
              variant={selectedPaymentType === 'inline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPaymentType('inline')}
              className="flex-1"
            >
              Formulario Integrado
            </Button>
          </div>
        </div>

        {/* Payment Component */}
        {selectedPaymentType === 'redirect' ? (
          <IzipayPaymentButton
            amount={amount}
            currency={currency}
            customerEmail={customerEmail}
            customerName={customerName}
            description={description}
            packagePriceId={packagePriceId}
            quantity={quantity}
            metadata={metadata}
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
            className="w-full"
          />
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">
              El formulario de pago se mostrará aquí para completar la transacción.
            </p>
            <Button
              onClick={() => {
                // This would initialize the inline form
                console.log('Initialize inline form');
              }}
              className="w-full"
              variant="outline"
            >
              Cargar Formulario de Pago
            </Button>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Powered by Izipay</span>
            <span>Procesamiento seguro</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default IzipayPaymentMethod;
