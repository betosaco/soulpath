"use client";

import { useState } from 'react';
import LyraPaymentForm from '@/components/LyraPaymentForm';

export default function Test1SolPage() {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('✅ Payment successful:', paymentData);
    setPaymentResult({
      success: true,
      data: paymentData,
      message: '¡Pago exitoso! S/. 1.00 procesado correctamente.'
    });
    setIsLoading(false);
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    setPaymentResult({
      success: false,
      error: error,
      message: 'Error en el procesamiento del pago.'
    });
    setIsLoading(false);
  };

  const handlePaymentStart = () => {
    setIsLoading(true);
    setPaymentResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💳 Test de Pago - S/. 1.00
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Prueba de integración Lyra con pago de 1 Sol Peruano
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🧪 Modo de Prueba - Ambiente de Desarrollo
          </div>
        </div>

        {/* Payment Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  S/. 1.00
                </div>
                <div className="text-sm text-gray-500">
                  Pago de prueba con Lyra
                </div>
              </div>

              <LyraPaymentForm
                amount={100} // 100 centavos = S/. 1.00
                currency="PEN"
                orderId={`TEST-1SOL-${Date.now()}`}
                customer={{
                  email: "test@example.com",
                  name: "Usuario de Prueba",
                  phone: "+51987654321"
                }}
                metadata={{
                  test: 'true',
                  amount: "1.00",
                  description: "Pago de prueba de 1 Sol"
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onPaymentStart={handlePaymentStart}
                className="w-full"
              />
            </div>

            {/* Test Information */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                📋 Información de Prueba
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div><strong>Monto:</strong> S/. 1.00 (100 centavos)</div>
                <div><strong>Moneda:</strong> PEN (Sol Peruano)</div>
                <div><strong>Ambiente:</strong> Producción Lyra</div>
                <div><strong>Validación:</strong> HMAC-SHA-256</div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                  <div className="text-yellow-800 font-medium">
                    Procesando pago...
                  </div>
                </div>
              </div>
            )}


            {/* Test Instructions */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🧪 Instrucciones de Prueba
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <strong>1. Datos de Prueba:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Usa tarjetas de prueba de Lyra</li>
                    <li>• Fecha de vencimiento: cualquier fecha futura</li>
                    <li>• CVV: cualquier código de 3 dígitos</li>
                  </ul>
                </div>
                <div>
                  <strong>2. Validación:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Se valida la firma HMAC-SHA-256</li>
                    <li>• Se verifica el estado del pago</li>
                    <li>• Se procesa el webhook</li>
                  </ul>
                </div>
                <div>
                  <strong>3. Resultado:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Verás el resultado en tiempo real</li>
                    <li>• Los datos se muestran en formato JSON</li>
                    <li>• Se registra en la consola del navegador</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Environment Info */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                ⚙️ Configuración del Ambiente
              </h3>
              <div className="space-y-2 text-sm text-purple-800">
                <div><strong>API Endpoint:</strong> api.micuentaweb.pe</div>
                <div><strong>JavaScript Library:</strong> static.micuentaweb.pe</div>
                <div><strong>HMAC Key:</strong> Producción (L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw)</div>
                <div><strong>Validación:</strong> HMAC-SHA-256</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="text-sm text-gray-500">
            💡 Esta es una página de prueba para validar la integración de Lyra
          </div>
          <div className="text-xs text-gray-400 mt-1">
            No se procesarán pagos reales en este ambiente de desarrollo
          </div>
        </div>
      </div>
    </div>
  );
}

