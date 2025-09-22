'use client';

import React, { useState } from 'react';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
import { AppLayout } from '@/components/AppLayout';

export default function PrivacyPage() {
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
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-12 mobile-container mobile-scrollable">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language Toggle */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveTab('es')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'es'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Español
              </button>
              <button
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'en'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentContent.title}
              </h1>
              <p className="text-gray-600 text-sm">
                {currentContent.lastUpdated}
              </p>
            </div>

            <div className="space-y-8">
              {currentContent.sections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <h3 className="text-lg font-medium text-gray-800">
                      {section.subtitle}
                    </h3>
                  )}
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700 leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
