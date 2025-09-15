/**
 * Izipay Demo Page
 * Demonstrates the Izipay payment integration
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import IzipayPaymentButton from '@/components/izipay/IzipayPaymentButton';
import IzipayPaymentMethod from '@/components/izipay/IzipayPaymentMethod';

export default function IzipayDemoPage() {
  const [paymentData, setPaymentData] = useState({
    amount: 100.00,
    currency: 'PEN',
    customerEmail: 'test@example.com',
    customerName: 'Test Customer',
    description: 'Wellness Services Demo Payment',
  });

  const [paymentVariant, setPaymentVariant] = useState<'button' | 'inline' | 'card'>('card');

  const handleInputChange = (field: string, value: string | number) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    alert('¡Pago exitoso! Revisa la consola para más detalles.');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Error en el pago: ${error}`);
  };

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Izipay Payment Demo</h1>
        <p className="text-gray-600">
          Demonstración de la integración de pagos con Izipay para Perú
        </p>
        <Badge variant="outline" className="mt-2">
          Modo de Prueba
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Pago</CardTitle>
            <CardDescription>
              Configura los parámetros de tu pago de prueba
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={paymentData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <Select value={paymentData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="customerEmail">Email del Cliente</Label>
              <Input
                id="customerEmail"
                type="email"
                value={paymentData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="customerName">Nombre del Cliente</Label>
              <Input
                id="customerName"
                value={paymentData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={paymentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="variant">Tipo de Componente</Label>
              <Select value={paymentVariant} onValueChange={(value: any) => setPaymentVariant(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="button">Botón Simple</SelectItem>
                  <SelectItem value="card">Tarjeta Completa</SelectItem>
                  <SelectItem value="inline">Formulario Integrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total:</strong> {formatAmount(paymentData.amount, paymentData.currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Component Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Componente de Pago</CardTitle>
            <CardDescription>
              Vista previa del componente de pago seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paymentVariant === 'button' && (
              <IzipayPaymentButton
                amount={paymentData.amount}
                currency={paymentData.currency}
                customerEmail={paymentData.customerEmail}
                customerName={paymentData.customerName}
                description={paymentData.description}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}

            {paymentVariant === 'card' && (
              <IzipayPaymentMethod
                amount={paymentData.amount}
                currency={paymentData.currency}
                customerEmail={paymentData.customerEmail}
                customerName={paymentData.customerName}
                description={paymentData.description}
                variant="card"
                showFeatures={true}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}

            {paymentVariant === 'inline' && (
              <div className="text-center py-8 text-gray-500">
                <p>El formulario integrado requiere configuración adicional</p>
                <p className="text-sm">Ver IZIPAY_INTEGRATION.md para más detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔒 Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• 3D Secure authentication</li>
              <li>• Tokenización de tarjetas</li>
              <li>• Encriptación SSL/TLS</li>
              <li>• Verificación de webhooks</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💳 Tarjetas Aceptadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Visa</li>
              <li>• Mastercard</li>
              <li>• American Express</li>
              <li>• Diners Club</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🌎 Cobertura</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Específico para Perú</li>
              <li>• Moneda: Sol Peruano (PEN)</li>
              <li>• Regulaciones locales</li>
              <li>• Soporte en español</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Test Cards Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🧪 Tarjetas de Prueba</CardTitle>
          <CardDescription>
            Usa estas tarjetas en el entorno de sandbox para probar diferentes escenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">Pago Exitoso</p>
              <p className="text-sm text-green-600 font-mono">4970100000000003</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800">Pago Fallido</p>
              <p className="text-sm text-red-600 font-mono">4970100000000004</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">3D Secure</p>
              <p className="text-sm text-blue-600 font-mono">4970100000000005</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Usa cualquier CVV (3 dígitos) y fecha de expiración futura
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>
          Para más información, consulta la documentación en{' '}
          <code className="bg-gray-100 px-1 rounded">IZIPAY_INTEGRATION.md</code>
        </p>
      </div>
    </div>
  );
}
