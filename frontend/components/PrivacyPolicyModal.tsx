'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  allowClose?: boolean;
}

export function PrivacyPolicyModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline,
  allowClose = true
}: PrivacyPolicyModalProps) {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');

  const privacyContent = {
    es: {
      title: 'Política de Privacidad - MatMax Wellness Studio',
      lastUpdated: 'Última actualización: 31 de enero de 2025',
      sections: [
        {
          title: '1. Información General',
          content: [
            'MatMax Wellness Studio ("nosotros", "nuestro" o "la empresa") se compromete a proteger la privacidad y seguridad de la información personal de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su información personal cuando utiliza nuestros servicios.',
            'Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política de privacidad.'
          ]
        },
        {
          title: '2. Información que Recopilamos',
          subtitle: '2.1 Información Personal',
          content: [
            'Recopilamos información personal que usted nos proporciona directamente, incluyendo:',
            '● Nombre completo y datos de contacto (correo electrónico, teléfono)',
            '● Información de facturación y dirección',
            '● Información de identificación (DNI, RUC)',
            '● Preferencias de servicios y clases',
            '● Información de salud relevante para la práctica de yoga',
            '● Comunicaciones que mantiene con nosotros'
          ]
        },
        {
          title: '2.2 Información Técnica',
          content: [
            'Recopilamos automáticamente cierta información técnica cuando utiliza nuestros servicios:',
            '● Dirección IP y ubicación geográfica general',
            '● Tipo de navegador y sistema operativo',
            '● Páginas visitadas y tiempo de permanencia',
            '● Cookies y tecnologías similares',
            '● Datos de uso de la plataforma'
          ]
        },
        {
          title: '3. Cómo Utilizamos su Información',
          content: [
            'Utilizamos su información personal para los siguientes propósitos:',
            '● Proporcionar y mejorar nuestros servicios de yoga y bienestar',
            '● Procesar reservas y pagos',
            '● Comunicarnos con usted sobre servicios, promociones y actualizaciones',
            '● Personalizar su experiencia en nuestra plataforma',
            '● Cumplir con obligaciones legales y regulatorias',
            '● Prevenir fraudes y garantizar la seguridad',
            '● Realizar análisis y mejoras en nuestros servicios'
          ]
        },
        {
          title: '4. Compartir Información',
          subtitle: '4.1 Terceros de Confianza',
          content: [
            'Podemos compartir su información con terceros de confianza en las siguientes circunstancias:',
            '● Proveedores de servicios de pago (Stripe, procesadores de tarjetas)',
            '● Servicios de comunicación (Brevo para emails)',
            '● Servicios de mensajería (Telegram para notificaciones)',
            '● Proveedores de hosting y almacenamiento de datos',
            '● Servicios de análisis y marketing (Google Analytics)',
            '● Autoridades legales cuando sea requerido por ley'
          ]
        },
        {
          title: '4.2 Transferencias Internacionales',
          content: [
            'Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Perú. En estos casos, nos aseguramos de que existan salvaguardas adecuadas para proteger su información personal.'
          ]
        },
        {
          title: '5. Seguridad de Datos',
          content: [
            'Implementamos medidas de seguridad técnicas y organizativas para proteger su información:',
            '● Cifrado de datos en tránsito y en reposo',
            '● Acceso restringido a información personal',
            '● Monitoreo regular de sistemas de seguridad',
            '● Capacitación del personal en privacidad de datos',
            '● Copias de seguridad seguras y regulares'
          ]
        },
        {
          title: '6. Retención de Datos',
          content: [
            'Conservamos su información personal durante el tiempo necesario para:',
            '● Cumplir con los propósitos para los cuales fue recopilada',
            '● Cumplir con obligaciones legales y regulatorias',
            '● Resolver disputas y hacer cumplir acuerdos',
            '● Generalmente, conservamos datos de clientes activos y datos de transacciones por un período de 7 años'
          ]
        },
        {
          title: '7. Sus Derechos',
          content: [
            'Usted tiene los siguientes derechos respecto a su información personal:',
            '● Acceso: Solicitar una copia de la información que tenemos sobre usted',
            '● Rectificación: Corregir información inexacta o incompleta',
            '● Eliminación: Solicitar la eliminación de su información personal',
            '● Portabilidad: Recibir su información en un formato estructurado',
            '● Oposición: Oponerse al procesamiento de su información',
            '● Restricción: Solicitar la limitación del procesamiento de su información'
          ]
        },
        {
          title: '8. Cookies y Tecnologías Similares',
          content: [
            'Utilizamos cookies y tecnologías similares para:',
            '● Mejorar la funcionalidad de nuestro sitio web',
            '● Recordar sus preferencias',
            '● Analizar el tráfico y uso del sitio',
            '● Personalizar contenido y anuncios',
            'Puede controlar el uso de cookies a través de la configuración de su navegador.'
          ]
        },
        {
          title: '9. Menores de Edad',
          content: [
            'Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información personal de menores de edad sin el consentimiento de sus padres o tutores legales.'
          ]
        },
        {
          title: '10. Cambios a esta Política',
          content: [
            'Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios significativos a través de:',
            '● Correo electrónico',
            '● Aviso en nuestro sitio web',
            '● Notificación en nuestros servicios',
            'Le recomendamos revisar esta política periódicamente para mantenerse informado sobre cómo protegemos su información.'
          ]
        },
        {
          title: '11. Contacto',
          content: [
            'Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede contactarnos:',
            '● Correo electrónico: info@matmax.store',
            '● Teléfono: +51916172368',
            '● Dirección: Calle Alcanfores 425, Miraflores Piso 2, Lima, Perú',
            '● Horario de atención: Lunes a Viernes de 9:00 AM a 6:00 PM'
          ]
        },
        {
          title: '12. Marco Legal',
          content: [
            'Esta Política de Privacidad se rige por las leyes de protección de datos de Perú, incluyendo la Ley de Protección de Datos Personales (Ley N° 29733) y su Reglamento (Decreto Supremo N° 003-2013-JUS).'
          ]
        }
      ]
    },
    en: {
      title: 'Privacy Policy - MatMax Wellness Studio',
      lastUpdated: 'Last updated: January 31, 2025',
      sections: [
        {
          title: '1. General Information',
          content: [
            'MatMax Wellness Studio ("we", "our" or "the company") is committed to protecting the privacy and security of our users\' personal information. This Privacy Policy describes how we collect, use, store and protect your personal information when you use our services.',
            'By using our services, you agree to the practices described in this privacy policy.'
          ]
        },
        {
          title: '2. Information We Collect',
          subtitle: '2.1 Personal Information',
          content: [
            'We collect personal information that you provide to us directly, including:',
            '● Full name and contact information (email, phone)',
            '● Billing information and address',
            '● Identification information (DNI, RUC)',
            '● Service and class preferences',
            '● Health information relevant to yoga practice',
            '● Communications you have with us'
          ]
        },
        {
          title: '2.2 Technical Information',
          content: [
            'We automatically collect certain technical information when you use our services:',
            '● IP address and general geographic location',
            '● Browser type and operating system',
            '● Pages visited and time spent',
            '● Cookies and similar technologies',
            '● Platform usage data'
          ]
        },
        {
          title: '3. How We Use Your Information',
          content: [
            'We use your personal information for the following purposes:',
            '● Provide and improve our yoga and wellness services',
            '● Process bookings and payments',
            '● Communicate with you about services, promotions and updates',
            '● Personalize your experience on our platform',
            '● Comply with legal and regulatory obligations',
            '● Prevent fraud and ensure security',
            '● Perform analysis and improvements to our services'
          ]
        },
        {
          title: '4. Sharing Information',
          subtitle: '4.1 Trusted Third Parties',
          content: [
            'We may share your information with trusted third parties in the following circumstances:',
            '● Payment service providers (Stripe, card processors)',
            '● Communication services (Brevo for emails)',
            '● Messaging services (Telegram for notifications)',
            '● Hosting and data storage providers',
            '● Analytics and marketing services (Google Analytics)',
            '● Legal authorities when required by law'
          ]
        },
        {
          title: '4.2 International Transfers',
          content: [
            'Some of our service providers may be located outside of Peru. In these cases, we ensure that adequate safeguards exist to protect your personal information.'
          ]
        },
        {
          title: '5. Data Security',
          content: [
            'We implement technical and organizational security measures to protect your information:',
            '● Data encryption in transit and at rest',
            '● Restricted access to personal information',
            '● Regular security system monitoring',
            '● Staff training on data privacy',
            '● Secure and regular backups'
          ]
        },
        {
          title: '6. Data Retention',
          content: [
            'We retain your personal information for as long as necessary to:',
            '● Fulfill the purposes for which it was collected',
            '● Comply with legal and regulatory obligations',
            '● Resolve disputes and enforce agreements',
            '● Generally, we retain active customer data and transaction data for a period of 7 years'
          ]
        },
        {
          title: '7. Your Rights',
          content: [
            'You have the following rights regarding your personal information:',
            '● Access: Request a copy of the information we have about you',
            '● Rectification: Correct inaccurate or incomplete information',
            '● Deletion: Request deletion of your personal information',
            '● Portability: Receive your information in a structured format',
            '● Opposition: Object to the processing of your information',
            '● Restriction: Request limitation of the processing of your information'
          ]
        },
        {
          title: '8. Cookies and Similar Technologies',
          content: [
            'We use cookies and similar technologies to:',
            '● Improve the functionality of our website',
            '● Remember your preferences',
            '● Analyze site traffic and usage',
            '● Personalize content and ads',
            'You can control cookie usage through your browser settings.'
          ]
        },
        {
          title: '9. Minors',
          content: [
            'Our services are directed to people over 18 years of age. We do not intentionally collect personal information from minors without the consent of their parents or legal guardians.'
          ]
        },
        {
          title: '10. Changes to this Policy',
          content: [
            'We may update this Privacy Policy occasionally. We will notify you of significant changes through:',
            '● Email',
            '● Notice on our website',
            '● Notification in our services',
            'We recommend reviewing this policy periodically to stay informed about how we protect your information.'
          ]
        },
        {
          title: '11. Contact',
          content: [
            'If you have questions about this Privacy Policy or wish to exercise your rights, you can contact us:',
            '● Email: info@matmax.store',
            '● Phone: +51916172368',
            '● Address: Calle Alcanfores 425, Miraflores Floor 2, Lima, Peru',
            '● Business hours: Monday to Friday from 9:00 AM to 6:00 PM'
          ]
        },
        {
          title: '12. Legal Framework',
          content: [
            'This Privacy Policy is governed by Peru\'s data protection laws, including the Personal Data Protection Law (Law No. 29733) and its Regulations (Supreme Decree No. 003-2013-JUS).'
          ]
        }
      ]
    }
  };

  const currentContent = privacyContent[activeTab];

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
                  ? 'Al continuar, acepta esta política de privacidad.'
                  : 'By continuing, you accept this privacy policy.'
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
