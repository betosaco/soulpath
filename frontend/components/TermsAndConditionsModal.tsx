'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  allowClose?: boolean;
}

export function TermsAndConditionsModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline,
  allowClose = true
}: TermsAndConditionsModalProps) {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');

  const termsContent = {
    es: {
      title: 'Términos y Condiciones - MatMax Wellness Studio',
      lastUpdated: 'Última actualización: 31 de enero de 2025',
      sections: [
        {
          title: '1. Definiciones',
          content: [
            '● MATPASS: Pase de acceso a las instalaciones y servicios de MatMax Wellness Studio con una duración de 30 días naturales desde su activación.',
            '● Usuario: Persona física titular del MATPASS.',
            '● Establecimiento: Instalaciones de MatMax Wellness Studio donde se prestan los servicios.'
          ]
        },
        {
          title: '2. MATPASS - Condiciones Generales',
          subtitle: '2.1 Vigencia y Activación',
          content: [
            '● El MATPASS tiene una vigencia de 30 días naturales a partir de su fecha de activación.',
            '● La activación se realiza automáticamente al momento de realizar la primera reserva.',
            '● La fecha de activación no puede posponerse más allá de 30 días desde la fecha de compra.'
          ]
        },
        {
          title: '2.2 Características del MATPASS',
          content: [
            '● El pase es personal e intransferible.',
            '● No es reembolsable bajo ninguna circunstancia.',
            '● El usuario tiene la opción de extender su MATPASS por 7 días adicionales posteriores a la fecha de vencimiento original.'
          ]
        },
        {
          title: '3. Métodos de Pago',
          content: [
            '● Tarjetas de crédito y débito',
            '● Transferencia bancaria',
            '● Efectivo en establecimiento',
            '● Billeteras digitales'
          ]
        },
        {
          title: '4. Uso de Instalaciones',
          subtitle: '4.1 Reservas y Asistencia',
          content: [
            '● Las clases pueden reservarse a través de nuestra plataforma digital o directamente en el establecimiento al momento de asistir.',
            '● Las cancelaciones de reservas deben realizarse con un mínimo de 3 horas de anticipación.',
            '● Las cancelaciones con menos de 3 horas de anticipación serán consideradas como clase tomada.'
          ]
        },
        {
          title: '4.2 Normas de Uso',
          content: [
            '● Uso obligatorio de toalla personal.',
            '● Ropa adecuada para la práctica de yoga.',
            '● Respetar el silencio en las salas.',
            '● Se recomienda llegar 10 minutos antes del inicio de la clase.',
            '● Existe una tolerancia máxima de 10 minutos después de la hora de inicio, tras lo cual el profesor cerrará la puerta de acceso sin excepción.',
            '● MatMax proporciona el mat para la práctica.',
            '● El alumno puede optar por utilizar su mat personal si así lo prefiere.'
          ]
        },
        {
          title: '5. Salud y Seguridad',
          subtitle: '5.1 Requisitos Médicos',
          content: [
            '● Informar sobre condiciones médicas preexistentes.'
          ]
        },
        {
          title: '5.2 Protocolos de Higiene',
          content: [
            '● Seguir protocolos de limpieza establecidos.',
            '● Respetar aforo máximo de cada sala.'
          ]
        },
        {
          title: '6. Modificaciones de Servicio',
          subtitle: '6.1 Cambios en la Programación',
          content: [
            '● MatMax Wellness Studio se reserva el derecho de modificar horarios y profesores.',
            '● El profesor podrá cancelar una clase con un mínimo de 2 horas de aviso por causas justificadas.',
            '● Los días festivos pueden tener horarios especiales o no tener clases.'
          ]
        },
        {
          title: '7. Política de Privacidad',
          content: [
            'La información detallada sobre el tratamiento de datos personales se encuentra en nuestro documento específico de Política de Privacidad, disponible en el establecimiento y en nuestra plataforma digital.'
          ]
        },
        {
          title: '8. Causas de Suspensión o Cancelación',
          content: [
            '● Incumplimiento de las normas establecidas.',
            '● Comportamiento inadecuado.',
            '● Falta de pago.',
            '● Uso fraudulento del MATPASS.'
          ]
        },
        {
          title: '9. Responsabilidades',
          subtitle: '9.1 Del Usuario',
          content: [
            '● Cuidar las instalaciones y equipos.',
            '● Seguir las instrucciones de los profesores.',
            '● Respetar a otros usuarios.',
            '● Mantener actualizados sus datos de contacto.'
          ]
        },
        {
          title: '9.2 De MatMax Wellness Studio',
          content: [
            '● Mantener las instalaciones en óptimas condiciones.',
            '● Contar con personal calificado.',
            '● Proporcionar servicios de calidad.',
            '● Mantener vigentes los seguros correspondientes.'
          ]
        },
        {
          title: '10. Contacto',
          content: [
            'Para cualquier duda, aclaración o solicitud relacionada con estos términos y condiciones, contactar a:',
            '● Correo electrónico: info@matmax.store',
            '● Teléfono: +51916172368',
            '● Dirección: Calle Alcanfores 425, Miraflores Piso 2'
          ]
        },
        {
          title: '11. Jurisdicción',
          content: [
            'Cualquier controversia derivada de estos términos y condiciones se resolverá conforme a las leyes vigentes en Lima, Perú.'
          ]
        }
      ]
    },
    en: {
      title: 'Terms and Conditions - MatMax Wellness Studio',
      lastUpdated: 'Last updated: January 31, 2025',
      sections: [
        {
          title: '1. Definitions',
          content: [
            '● MATPASS: Access pass to MatMax Wellness Studio facilities and services with a duration of 30 natural days from its activation.',
            '● User: Physical person holder of the MATPASS.',
            '● Establishment: MatMax Wellness Studio facilities where services are provided.'
          ]
        },
        {
          title: '2. MATPASS - General Conditions',
          subtitle: '2.1 Validity and Activation',
          content: [
            '● The MATPASS is valid for 30 natural days from its activation date.',
            '● Activation occurs automatically when making the first reservation.',
            '● The activation date cannot be postponed beyond 30 days from the purchase date.'
          ]
        },
        {
          title: '2.2 MATPASS Characteristics',
          content: [
            '● The pass is personal and non-transferable.',
            '● It is non-refundable under any circumstances.',
            '● The user has the option to extend their MATPASS for 7 additional days after the original expiration date.'
          ]
        },
        {
          title: '3. Payment Methods',
          content: [
            '● Credit and debit cards',
            '● Bank transfer',
            '● Cash at establishment',
            '● Digital wallets'
          ]
        },
        {
          title: '4. Use of Facilities',
          subtitle: '4.1 Reservations and Attendance',
          content: [
            '● Classes can be reserved through our digital platform or directly at the establishment upon arrival.',
            '● Reservation cancellations must be made with a minimum of 3 hours notice.',
            '● Cancellations with less than 3 hours notice will be considered as a taken class.'
          ]
        },
        {
          title: '4.2 Usage Rules',
          content: [
            '● Mandatory use of personal towel.',
            '● Appropriate clothing for yoga practice.',
            '● Respect silence in the rooms.',
            '● It is recommended to arrive 10 minutes before class start.',
            '● There is a maximum tolerance of 10 minutes after the start time, after which the teacher will close the access door without exception.',
            '● MatMax provides the mat for practice.',
            '● The student may choose to use their personal mat if they prefer.'
          ]
        },
        {
          title: '5. Health and Safety',
          subtitle: '5.1 Medical Requirements',
          content: [
            '● Inform about pre-existing medical conditions.'
          ]
        },
        {
          title: '5.2 Hygiene Protocols',
          content: [
            '● Follow established cleaning protocols.',
            '● Respect maximum capacity of each room.'
          ]
        },
        {
          title: '6. Service Modifications',
          subtitle: '6.1 Schedule Changes',
          content: [
            '● MatMax Wellness Studio reserves the right to modify schedules and teachers.',
            '● The teacher may cancel a class with a minimum of 2 hours notice for justified reasons.',
            '● Holidays may have special schedules or no classes.'
          ]
        },
        {
          title: '7. Privacy Policy',
          content: [
            'Detailed information about personal data processing is found in our specific Privacy Policy document, available at the establishment and on our digital platform.'
          ]
        },
        {
          title: '8. Causes of Suspension or Cancellation',
          content: [
            '● Non-compliance with established rules.',
            '● Inappropriate behavior.',
            '● Non-payment.',
            '● Fraudulent use of the MATPASS.'
          ]
        },
        {
          title: '9. Responsibilities',
          subtitle: '9.1 User Responsibilities',
          content: [
            '● Take care of facilities and equipment.',
            '● Follow teacher instructions.',
            '● Respect other users.',
            '● Keep contact information updated.'
          ]
        },
        {
          title: '9.2 MatMax Wellness Studio Responsibilities',
          content: [
            '● Maintain facilities in optimal conditions.',
            '● Have qualified personnel.',
            '● Provide quality services.',
            '● Maintain valid corresponding insurance.'
          ]
        },
        {
          title: '10. Contact',
          content: [
            'For any questions, clarifications or requests related to these terms and conditions, contact:',
            '● Email: info@matmax.store',
            '● Phone: +51916172368',
            '● Address: Calle Alcanfores 425, Miraflores Floor 2'
          ]
        },
        {
          title: '11. Jurisdiction',
          content: [
            'Any controversy arising from these terms and conditions will be resolved according to the laws in force in Lima, Peru.'
          ]
        }
      ]
    }
  };

  const currentContent = termsContent[activeTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col mx-2 sm:mx-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {currentContent.title}
                </h2>
                <span className="text-xs sm:text-sm text-gray-500">
                  {currentContent.lastUpdated}
                </span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Language Toggle */}
                <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('es')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === 'es'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => setActiveTab('en')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    EN
                  </button>
                </div>
                {allowClose && (
                  <button
                    onClick={onClose}
                    className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {currentContent.sections.map((section, index) => (
                  <div key={index} className="space-y-2 sm:space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    {section.subtitle && (
                      <h4 className="text-sm sm:text-md font-medium text-gray-800">
                        {section.subtitle}
                      </h4>
                    )}
                    <ul className="space-y-1 sm:space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Accept/Decline buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                {activeTab === 'es' 
                  ? 'Al continuar, acepta estos términos y condiciones.'
                  : 'By continuing, you accept these terms and conditions.'
                }
              </div>
              <div className="flex space-x-2 sm:space-x-3">
                <Button
                  variant="outline"
                  onClick={onDecline}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 text-red-600 border-red-300 hover:bg-red-50 text-xs sm:text-sm touch-manipulation min-h-[44px] flex-1 sm:flex-none"
                >
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{activeTab === 'es' ? 'Rechazar' : 'Decline'}</span>
                  <span className="sm:hidden">{activeTab === 'es' ? 'No' : 'No'}</span>
                </Button>
                <Button
                  onClick={onAccept}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm touch-manipulation min-h-[44px] flex-1 sm:flex-none"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{activeTab === 'es' ? 'Aceptar' : 'Accept'}</span>
                  <span className="sm:hidden">{activeTab === 'es' ? 'Sí' : 'Yes'}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
