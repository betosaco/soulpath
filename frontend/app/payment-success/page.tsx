'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle, XCircle, Calendar, User, CreditCard, Package } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

interface PaymentResult {
  orderStatus: string;
  orderId: string;
  amount: number;
  currency: string | { id: number; code: string; symbol: string; name: string };
  packageData?: {
    id: number;
    name: string;
    description: string;
    sessionsCount: number;
    price: number;
    currency: string | { id: number; code: string; symbol: string; name: string };
    packageType?: string;
    maxGroupSize?: number;
    sessionDuration?: {
      id: number;
      name: string;
      duration_minutes: number;
      description: string;
    };
  };
  bookingData?: {
    selectedDate?: string;
    selectedTime?: string;
    teacher?: {
      id: number;
      name: string;
    };
    dayOfWeek?: string;
    serviceType?: {
      name: string;
    };
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
  };
  paymentData?: {
    method: string;
    transactionId?: string;
    amount?: number;
    currency?: string;
  };
  [key: string]: unknown;
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
        
        // Email sending is handled by webhooks to prevent duplicates
        console.log('📧 Payment result data:', parsedResult);
        console.log('ℹ️ Email sending is handled by webhooks to prevent duplicates');
        // Note: Email sending is disabled here to prevent duplicates
        // Email notifications are handled by payment webhooks
        
        // Clear the session storage
        sessionStorage.removeItem('paymentResult');
      } catch (error) {
        console.error('Error parsing payment result:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Email sending is now handled by webhooks to prevent duplicates
  // The triggerConfirmationEmail function has been removed

  const handleWhatsAppContact = () => {
    const phoneNumber = '51916172368'; // +51 916 172 368
    const orderId = paymentResult?.orderId || 'N/A';
    const amount = paymentResult?.amount ? (paymentResult.amount / 100).toFixed(2) : 'N/A';
    const currency = typeof paymentResult?.currency === 'string' 
      ? paymentResult.currency 
      : paymentResult?.currency?.symbol || paymentResult?.currency?.code || 'PEN';
    
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
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-400"></div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">Cargando resultado del pago...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isSuccess = paymentResult?.orderStatus === 'PAID';

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden border dark:border-gray-700">
          {isSuccess ? (
            <div className="p-8">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Su pago ha sido procesado correctamente. ¡Gracias por elegir MatMax Yoga Studio!
                </p>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Payment Details */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border dark:border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="h-6 w-6 text-primary dark:text-primary/80" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detalles del Pago</h3>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-white dark:bg-gray-600 px-3 py-1 rounded border dark:border-gray-500">{paymentResult?.orderId}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Monto Total:</dt>
                      <dd className="text-lg text-gray-900 dark:text-white font-bold">
                        {typeof paymentResult?.currency === 'string' 
                          ? paymentResult.currency 
                          : paymentResult?.currency?.symbol || paymentResult?.currency?.code || 'PEN'
                        } {(paymentResult?.amount / 100).toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</dt>
                      <dd className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Pagado
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha:</dt>
                      <dd className="text-sm text-gray-900 dark:text-gray-100">{new Date().toLocaleDateString('es-PE')}</dd>
                    </div>
                  </dl>
                </div>

                {/* Package Details */}
                {paymentResult?.packageData && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border dark:border-gray-600">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="h-6 w-6 text-primary dark:text-primary/80" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detalles del Paquete</h3>
                    </div>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Paquete:</dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">{paymentResult.packageData.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descripción:</dt>
                        <dd className="text-sm text-gray-700 dark:text-gray-300">{paymentResult.packageData.description}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sesiones:</dt>
                        <dd className="text-sm text-gray-900 dark:text-gray-100 font-medium">{paymentResult.packageData.sessionsCount} sesión(es)</dd>
                      </div>
                      {paymentResult.packageData.sessionDuration && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Duración:</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100 font-medium">{paymentResult.packageData.sessionDuration.duration_minutes} minutos</dd>
                        </div>
                      )}
                      {paymentResult.packageData.packageType && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo:</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100 font-medium capitalize">{paymentResult.packageData.packageType}</dd>
                        </div>
                      )}
                      {paymentResult.packageData.maxGroupSize && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tamaño máximo del grupo:</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100 font-medium">{paymentResult.packageData.maxGroupSize} persona(s)</dd>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Precio:</dt>
                        <dd className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                          {typeof paymentResult.packageData.currency === 'string' 
                            ? paymentResult.packageData.currency 
                            : paymentResult.packageData.currency?.symbol || paymentResult.packageData.currency?.code || 'PEN'
                          } {paymentResult.packageData.price.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}

                {/* Booking Details */}
                {paymentResult?.bookingData && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Detalles de la Reserva</h3>
                    </div>
                    <dl className="space-y-4">
                      {paymentResult.bookingData.teacher && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Profesor:</dt>
                          <dd className="text-sm text-green-800 dark:text-green-300 font-medium">{paymentResult.bookingData.teacher.name}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.selectedDate && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha:</dt>
                          <dd className="text-sm text-green-800 dark:text-green-300">{new Date(paymentResult.bookingData.selectedDate).toLocaleDateString('es-PE')}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.dayOfWeek && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Día:</dt>
                          <dd className="text-sm text-green-800 dark:text-green-300 capitalize">{paymentResult.bookingData.dayOfWeek}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.selectedTime && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Hora:</dt>
                          <dd className="text-sm text-green-800 dark:text-green-300">{paymentResult.bookingData.selectedTime}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.serviceType && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Servicio:</dt>
                          <dd className="text-sm text-green-800 dark:text-green-300">{paymentResult.bookingData.serviceType.name}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Customer Information */}
                {paymentResult?.bookingData && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border dark:border-gray-600">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="h-6 w-6 text-primary dark:text-primary/80" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Información del Cliente</h3>
                    </div>
                    <dl className="space-y-4">
                      {paymentResult.bookingData.clientName && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre:</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{paymentResult.bookingData.clientName}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.clientEmail && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{paymentResult.bookingData.clientEmail}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.clientPhone && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono:</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{paymentResult.bookingData.clientPhone}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>

              {/* WhatsApp Contact Button */}
              <div className="text-center">
                <button
                  onClick={handleWhatsAppContact}
                  className="inline-flex items-center gap-3 py-4 px-8 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl dark:shadow-green-500/25"
                >
                  <MessageCircle className="h-6 w-6" />
                  Contactar por WhatsApp
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Puedes contactarnos respecto a esta orden en este número de WhatsApp
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8">
              {/* Error Header */}
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Pago No Procesado
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Su pago no pudo ser procesado. Por favor, intente nuevamente o contáctenos para asistencia.
                </p>
              </div>

              {/* Error Details */}
              {paymentResult && (
                <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8 border dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">Detalles del Error</h3>
                  <dl className="space-y-4">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-white dark:bg-gray-600 px-3 py-1 rounded border dark:border-gray-500">{paymentResult.orderId}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</dt>
                      <dd className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        {paymentResult.orderStatus}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="inline-flex items-center gap-3 py-4 px-8 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl dark:shadow-green-500/25"
                >
                  <MessageCircle className="h-6 w-6" />
                  Contactar Soporte por WhatsApp
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contáctanos para recibir asistencia con tu pago
                </p>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
