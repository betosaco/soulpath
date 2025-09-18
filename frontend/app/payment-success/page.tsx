'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/link';
import Link from 'next/link';

interface PaymentResult {
  orderStatus: string;
  orderId: string;
  amount: number;
  currency: string;
  [key: string]: any;
}

export default function PaymentSuccessPage() {
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get payment result from sessionStorage
    const result = sessionStorage.getItem('paymentResult');
    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        setPaymentResult(parsedResult);
        // Clear the session storage
        sessionStorage.removeItem('paymentResult');
      } catch (error) {
        console.error('Error parsing payment result:', error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-gray-600">Cargando resultado del pago...</p>
        </div>
      </div>
    );
  }

  const isSuccess = paymentResult?.orderStatus === 'PAID';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSuccess ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                ¡Pago Exitoso!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Su pago ha sido procesado correctamente.
              </p>
              
              {paymentResult && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Detalles del Pago</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900">{paymentResult.orderId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Monto:</dt>
                      <dd className="text-sm text-gray-900">
                        {paymentResult.currency} {(paymentResult.amount / 100).toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                      <dd className="text-sm text-green-600 font-medium">Pagado</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Pago No Procesado
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Su pago no pudo ser procesado. Por favor, intente nuevamente.
              </p>
              
              {paymentResult && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Detalles del Pago</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900">{paymentResult.orderId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                      <dd className="text-sm text-red-600 font-medium">{paymentResult.orderStatus}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 space-y-3">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al Inicio
            </Link>
            
            {!isSuccess && (
              <Link
                href="/checkout"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Intentar Nuevamente
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
