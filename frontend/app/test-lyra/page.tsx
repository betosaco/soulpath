'use client';

import React, { useState, useEffect } from 'react';
import LyraPaymentForm from '@/components/LyraPaymentForm';

export default function TestLyraPage() {
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Generate order ID only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setOrderId(`test-order-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    setPaymentResult(paymentData);
    setIsPaymentStarted(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Error: ${error}`);
    setIsPaymentStarted(false);
  };

  const startPayment = () => {
    setIsPaymentStarted(true);
    setPaymentResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Test de Integración Lyra
            </h1>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Información de Prueba
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Monto:</strong> S/ 5.00 (500 centavos)</p>
                <p><strong>Moneda:</strong> PEN (Soles Peruanos)</p>
                <p><strong>Email:</strong> test@example.com</p>
                <p><strong>ID de Orden:</strong> {isClient ? orderId : 'Generando...'}</p>
              </div>
            </div>

            {!isClient ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-3 text-gray-600">Cargando...</p>
              </div>
            ) : !isPaymentStarted ? (
              <div className="text-center">
                <button
                  onClick={startPayment}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Iniciar Pago de Prueba
                </button>
              </div>
            ) : (
              <LyraPaymentForm
                amount={500} // S/ 5.00 in cents
                currency="PEN"
                orderId={orderId}
                customer={{
                  email: "test@example.com",
                  name: "Usuario de Prueba",
                  phone: "+51987654321"
                }}
                metadata={{
                  test: "true",
                  source: "test-page"
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full"
              />
            )}

            {paymentResult && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Resultado del Pago
                </h3>
                <pre className="text-sm text-green-700 overflow-auto">
                  {JSON.stringify(paymentResult, null, 2)}
                </pre>
                <button
                  onClick={() => {
                    setPaymentResult(null);
                    setIsPaymentStarted(false);
                  }}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Realizar Otro Pago
                </button>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">
                ⚠️ Información Importante
              </h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>
                  Esta es una página de prueba para la integración de Lyra. 
                  Los pagos realizados aquí son <strong>simulados</strong> y no se procesarán realmente.
                </p>
                <p>
                  Para usar en producción, asegúrate de:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Configurar las variables de entorno correctas</li>
                  <li>Usar credenciales de producción</li>
                  <li>Implementar validación de pagos en el servidor</li>
                  <li>Manejar errores y casos edge apropiadamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
