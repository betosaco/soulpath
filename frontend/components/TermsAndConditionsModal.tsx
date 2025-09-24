'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Globe } from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  language?: 'en' | 'es';
}

export function TermsAndConditionsModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  language = 'en' 
}: TermsAndConditionsModalProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es'>(language);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setHasScrolledToBottom(isAtBottom);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentLanguage === 'en' ? 'Terms and Conditions' : 'Términos y Condiciones'}
                </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentLanguage('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentLanguage === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                EN
              </button>
                  <button
                onClick={() => setCurrentLanguage('es')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentLanguage === 'es'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ES
                  </button>
            </div>
                </div>
                  <button
                    onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
            <X className="w-6 h-6 text-gray-500" />
                  </button>
            </div>

            {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6"
          onScroll={handleScroll}
        >
          <div className="prose prose-sm max-w-none text-gray-700">
            {currentLanguage === 'en' ? (
              <>
                <h3 className="font-semibold text-lg mb-4">Wellness Studio Terms and Conditions</h3>
                <h4 className="font-semibold mb-2">1. Booking and Payment</h4>
                <p className="mb-4">All bookings are subject to availability. Payment is required to confirm your reservation. We accept various payment methods including credit cards and bank transfers.</p>
                <h4 className="font-semibold mb-2">2. Cancellation Policy</h4>
                <p className="mb-4">Cancellations made 24 hours or more before the scheduled session will receive a full refund. Cancellations made less than 24 hours before the session will be charged 50% of the session fee.</p>
                <h4 className="font-semibold mb-2">3. Package Validity</h4>
                <p className="mb-4">All wellness packages are valid for 6 months from the date of purchase. Unused sessions will expire after this period.</p>
                <h4 className="font-semibold mb-2">4. Health and Safety</h4>
                <p className="mb-4">Participants must inform instructors of any health conditions or injuries before participating in sessions. The studio is not responsible for injuries that occur during sessions.</p>
                <h4 className="font-semibold mb-2">5. Personal Belongings</h4>
                <p className="mb-4">The studio is not responsible for lost or stolen personal belongings. Please keep valuables secure during your visit.</p>
                <h4 className="font-semibold mb-2">6. Privacy Policy</h4>
                <p className="mb-4">We respect your privacy and will only use your personal information in accordance with our privacy policy. Your data will not be shared with third parties without your consent.</p>
                <h4 className="font-semibold mb-2">7. Changes to Terms</h4>
                <p className="mb-4">We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our website.</p>
                <h4 className="font-semibold mb-2">8. Contact Information</h4>
                <p className="mb-4">For questions about these terms, please contact us at info@wellnessstudio.com or call +1 (555) 123-4567.</p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg mb-4">Términos y Condiciones del Estudio de Bienestar</h3>
                <h4 className="font-semibold mb-2">1. Reservas y Pagos</h4>
                <p className="mb-4">Todas las reservas están sujetas a disponibilidad. Se requiere pago para confirmar su reservación. Aceptamos varios métodos de pago incluyendo tarjetas de crédito y transferencias bancarias.</p>
                <h4 className="font-semibold mb-2">2. Política de Cancelación</h4>
                <p className="mb-4">Las cancelaciones realizadas con 24 horas o más de anticipación recibirán un reembolso completo. Las cancelaciones realizadas con menos de 24 horas de anticipación serán cobradas al 50% del costo de la sesión.</p>
                <h4 className="font-semibold mb-2">3. Validez de Paquetes</h4>
                <p className="mb-4">Todos los paquetes de bienestar son válidos por 6 meses desde la fecha de compra. Las sesiones no utilizadas expirarán después de este período.</p>
                <h4 className="font-semibold mb-2">4. Salud y Seguridad</h4>
                <p className="mb-4">Los participantes deben informar a los instructores sobre cualquier condición de salud o lesión antes de participar en las sesiones. El estudio no es responsable de lesiones que ocurran durante las sesiones.</p>
                <h4 className="font-semibold mb-2">5. Pertenencias Personales</h4>
                <p className="mb-4">El estudio no es responsable de pertenencias personales perdidas o robadas. Por favor mantenga sus objetos de valor seguros durante su visita.</p>
                <h4 className="font-semibold mb-2">6. Política de Privacidad</h4>
                <p className="mb-4">Respetamos su privacidad y solo usaremos su información personal de acuerdo con nuestra política de privacidad. Sus datos no serán compartidos con terceros sin su consentimiento.</p>
                <h4 className="font-semibold mb-2">7. Cambios en los Términos</h4>
                <p className="mb-4">Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios serán efectivos inmediatamente al publicarlos en nuestro sitio web.</p>
                <h4 className="font-semibold mb-2">8. Información de Contacto</h4>
                <p className="mb-4">Para preguntas sobre estos términos, por favor contáctenos en info@wellnessstudio.com o llame al +1 (555) 123-4567.</p>
              </>
            )}
                  </div>
          <div className="mt-6 text-sm text-gray-500 text-center">
            {currentLanguage === 'en' ? 'Last updated: January 2024' : 'Última actualización: Enero 2024'}
              </div>
            </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>Available in English and Spanish</span>
              </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                  onClick={onAccept}
                disabled={!hasScrolledToBottom}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  hasScrolledToBottom
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {currentLanguage === 'en' 
                    ? 'I Accept the Terms and Conditions' 
                    : 'Acepto los Términos y Condiciones'
                  }
                </span>
              </button>
            </div>
              </div>
          {!hasScrolledToBottom && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Please scroll to the bottom to accept the terms
            </div>
          )}
        </div>
      </div>
    </div>
  );
}