'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';

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

  const handleWhatsAppContact = () => {
    const phoneNumber = '51916172368'; // +51 916 172 368
    const orderId = paymentResult?.orderId || 'N/A';
    const amount = paymentResult?.amount ? (paymentResult.amount / 100).toFixed(2) : 'N/A';
    const currency = paymentResult?.currency || 'PEN';
    
    const message = `¡Hola! Acabo de completar mi pago exitosamente.

📋 *Detalles del Pago:*
• ID de Orden: ${orderId}
• Monto: ${currency} ${amount}
• Estado: Pagado ✅

¿Podrían confirmarme los detalles de mi reserva y próximos pasos?

¡Gracias! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

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
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                ¡Pago Exitoso!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Su pago ha sido procesado correctamente. ¡Gracias por elegir MatMax Yoga Studio!
              </p>
              
              {paymentResult && (
                <div className="mt-6 bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Pago</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900 font-mono">{paymentResult.orderId}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Monto:</dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {paymentResult.currency} {(paymentResult.amount / 100).toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                      <dd className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Pagado
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* WhatsApp Contact Button */}
              <div className="mb-6">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar por WhatsApp
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Envíanos un mensaje con los detalles de tu pago para confirmar tu reserva
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Pago No Procesado
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Su pago no pudo ser procesado. Por favor, intente nuevamente o contáctenos para asistencia.
              </p>
              
              {paymentResult && (
                <div className="mt-6 bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Pago</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900 font-mono">{paymentResult.orderId}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                      <dd className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {paymentResult.orderStatus}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* WhatsApp Support Button for Failed Payments */}
              <div className="mb-6">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar Soporte por WhatsApp
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Contáctanos para recibir asistencia con tu pago
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              Volver al Inicio
            </Link>
            
            {!isSuccess && (
              <Link
                href="/packages"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                Intentar Nuevamente
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
