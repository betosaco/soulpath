'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, CheckCircle, XCircle, RotateCcw, Calendar, User, CreditCard } from 'lucide-react';
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
  paymentData?: any;
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
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isSuccess ? (
            <div className="p-8">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-xl text-gray-600">
                  Su pago ha sido procesado correctamente. ¡Gracias por elegir MatMax Yoga Studio!
                </p>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold text-gray-900">Detalles del Pago</h3>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900 font-mono bg-white px-3 py-1 rounded">{paymentResult?.orderId}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Monto Total:</dt>
                      <dd className="text-lg text-gray-900 font-bold">
                        {typeof paymentResult?.currency === 'string' 
                          ? paymentResult.currency 
                          : paymentResult?.currency?.symbol || paymentResult?.currency?.code || 'PEN'
                        } {(paymentResult?.amount / 100).toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                      <dd className="text-sm text-green-600 font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Pagado
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Fecha:</dt>
                      <dd className="text-sm text-gray-900">{new Date().toLocaleDateString('es-PE')}</dd>
                    </div>
                  </dl>
                </div>

                {/* Package Details */}
                {paymentResult?.packageData && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold text-gray-900">Detalles del Paquete</h3>
                    </div>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-1">Paquete:</dt>
                        <dd className="text-lg font-semibold text-gray-900">{paymentResult.packageData.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-1">Descripción:</dt>
                        <dd className="text-sm text-gray-700">{paymentResult.packageData.description}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">Sesiones:</dt>
                        <dd className="text-sm text-gray-900 font-medium">{paymentResult.packageData.sessionsCount} sesión(es)</dd>
                      </div>
                      {paymentResult.packageData.sessionDuration && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Duración:</dt>
                          <dd className="text-sm text-gray-900 font-medium">{paymentResult.packageData.sessionDuration.duration_minutes} minutos</dd>
                        </div>
                      )}
                      {paymentResult.packageData.packageType && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Tipo:</dt>
                          <dd className="text-sm text-gray-900 font-medium capitalize">{paymentResult.packageData.packageType}</dd>
                        </div>
                      )}
                      {paymentResult.packageData.maxGroupSize && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Tamaño máximo del grupo:</dt>
                          <dd className="text-sm text-gray-900 font-medium">{paymentResult.packageData.maxGroupSize} persona(s)</dd>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">Precio:</dt>
                        <dd className="text-sm text-gray-900 font-medium">
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
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-semibold text-green-800">Detalles de la Reserva</h3>
                    </div>
                    <dl className="space-y-4">
                      {paymentResult.bookingData.teacher && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Profesor:</dt>
                          <dd className="text-sm text-green-800 font-medium">{paymentResult.bookingData.teacher.name}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.selectedDate && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Fecha:</dt>
                          <dd className="text-sm text-green-800">{new Date(paymentResult.bookingData.selectedDate).toLocaleDateString('es-PE')}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.dayOfWeek && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Día:</dt>
                          <dd className="text-sm text-green-800 capitalize">{paymentResult.bookingData.dayOfWeek}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.selectedTime && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Hora:</dt>
                          <dd className="text-sm text-green-800">{paymentResult.bookingData.selectedTime}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.serviceType && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Servicio:</dt>
                          <dd className="text-sm text-green-800">{paymentResult.bookingData.serviceType.name}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Customer Information */}
                {paymentResult?.bookingData && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold text-gray-900">Información del Cliente</h3>
                    </div>
                    <dl className="space-y-4">
                      {paymentResult.bookingData.clientName && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Nombre:</dt>
                          <dd className="text-sm text-gray-900">{paymentResult.bookingData.clientName}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.clientEmail && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Email:</dt>
                          <dd className="text-sm text-gray-900">{paymentResult.bookingData.clientEmail}</dd>
                        </div>
                      )}
                      {paymentResult.bookingData.clientPhone && (
                        <div className="flex justify-between items-center">
                          <dt className="text-sm font-medium text-gray-500">Teléfono:</dt>
                          <dd className="text-sm text-gray-900">{paymentResult.bookingData.clientPhone}</dd>
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
                  className="inline-flex items-center gap-3 py-4 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="h-6 w-6" />
                  Contactar por WhatsApp
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Envíanos un mensaje con los detalles de tu pago para confirmar tu reserva
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8">
              {/* Error Header */}
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Pago No Procesado
                </h1>
                <p className="text-xl text-gray-600">
                  Su pago no pudo ser procesado. Por favor, intente nuevamente o contáctenos para asistencia.
                </p>
              </div>

              {/* Error Details */}
              {paymentResult && (
                <div className="max-w-2xl mx-auto bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Detalles del Error</h3>
                  <dl className="space-y-4">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">ID de Orden:</dt>
                      <dd className="text-sm text-gray-900 font-mono bg-white px-3 py-1 rounded">{paymentResult.orderId}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                      <dd className="text-sm text-red-600 font-medium flex items-center gap-2">
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
                  className="inline-flex items-center gap-3 py-4 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="h-6 w-6" />
                  Contactar Soporte por WhatsApp
                </button>
                <p className="text-sm text-gray-500">
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
