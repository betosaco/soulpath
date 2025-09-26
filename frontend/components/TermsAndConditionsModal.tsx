'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop covering the whole page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[999998]"
            onClick={onClose}
          />

          {/* Right-side drawer (match sidecart coverage), adjusted for header on mobile */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.3 }}
            className="fixed right-0 top-0 h-[100svh] w-full max-w-none bg-card shadow-xl z-[999999] sm:max-w-md"
          >
            <div className="flex flex-col h-full">
              {/* Spacer to ensure drawer content is below header on mobile */}
              <div className="block sm:hidden" style={{ height: 'var(--page-top-offset-mobile)' }} />
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--color-border-500)]">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h2 className="text-lg sm:text-2xl font-bold text-[var(--color-text-primary)]">
              {currentLanguage === 'en' ? 'Terms and Conditions' : 'Términos y Condiciones'}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentLanguage('en')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentLanguage === 'en'
                    ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setCurrentLanguage('es')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentLanguage === 'es'
                    ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)]'
                }`}
              >
                ES
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface-secondary)] rounded-full transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-text-tertiary)]" />
          </button>
              </div>

              {/* Content */}
              <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6"
                onScroll={handleScroll}
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)' }}
              >
          <div className="prose prose-sm max-w-none text-[var(--color-text-primary)]">
            {currentLanguage === 'en' ? (
              <>
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Terms and Conditions - MatMax Wellness Studio</h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] mb-4 sm:mb-6">Last updated: January 31, 2025</p>
                
                <h4 className="font-semibold text-sm sm:text-base mb-2">1. Definitions</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• MATPASS: Access pass to MatMax Wellness Studio facilities and services with a duration of 30 natural days from its activation.</li>
                  <li>• User: Physical person holder of the MATPASS.</li>
                  <li>• Establishment: MatMax Wellness Studio facilities where services are provided.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">2. MATPASS - General Conditions</h4>
                <h5 className="font-medium text-xs sm:text-sm mb-2">2.1 Validity and Activation</h5>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• The MATPASS is valid for 30 natural days from its activation date.</li>
                  <li>• Activation occurs automatically when making the first reservation.</li>
                  <li>• The activation date cannot be postponed beyond 30 days from the purchase date.</li>
                </ul>

                <h5 className="font-medium text-xs sm:text-sm mb-2">2.2 MATPASS Characteristics</h5>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• The pass is personal and non-transferable.</li>
                  <li>• It is non-refundable under any circumstances.</li>
                  <li>• The user has the option to extend their MATPASS for 7 additional days after the original expiration date.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">3. Payment Methods</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Credit and debit cards</li>
                  <li>• Bank transfer</li>
                  <li>• Cash at establishment</li>
                  <li>• Digital wallets</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">4. Facility Usage</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Users must present their MATPASS for access to facilities.</li>
                  <li>• Respectful behavior is required at all times.</li>
                  <li>• Follow all safety and hygiene protocols.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">5. Cancellation and Refund Policy</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• MATPASS purchases are non-refundable.</li>
                  <li>• Session cancellations must be made at least 2 hours in advance.</li>
                  <li>• No-shows will be charged as used sessions.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">6. Health and Safety</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Users must inform instructors of any health conditions.</li>
                  <li>• The studio is not responsible for injuries during sessions.</li>
                  <li>• Follow all safety instructions provided by staff.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">7. Personal Belongings</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">The studio is not responsible for lost or stolen personal belongings. Please keep valuables secure during your visit.</p>

                <h4 className="font-semibold text-sm sm:text-base mb-2">8. Privacy Policy</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">We respect your privacy and will only use your personal information in accordance with our privacy policy. Your data will not be shared with third parties without your consent.</p>

                <h4 className="font-semibold text-sm sm:text-base mb-2">9. Changes to Terms</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our website.</p>

                <h4 className="font-semibold text-sm sm:text-base mb-2">10. Contact</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">For any questions, clarifications, or requests related to these terms and conditions, contact:</p>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Email: info@matmax.store</li>
                  <li>• Phone: +51916172368</li>
                  <li>• Address: Calle Alcanfores 425, Miraflores Piso 2</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">11. Jurisdiction</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">Any controversy arising from these terms and conditions will be resolved in accordance with the laws in force in Lima, Peru.</p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Términos y Condiciones - MatMax Wellness Studio</h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] mb-4 sm:mb-6">Última actualización: 31 de enero de 2025</p>
                
                <h4 className="font-semibold text-sm sm:text-base mb-2">1. Definiciones</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• MATPASS: Pase de acceso a las instalaciones y servicios de MatMax Wellness Studio con una duración de 30 días naturales desde su activación.</li>
                  <li>• Usuario: Persona física titular del MATPASS.</li>
                  <li>• Establecimiento: Instalaciones de MatMax Wellness Studio donde se prestan los servicios.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">2. MATPASS - Condiciones Generales</h4>
                <h5 className="font-medium text-xs sm:text-sm mb-2">2.1 Vigencia y Activación</h5>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• El MATPASS tiene una vigencia de 30 días naturales a partir de su fecha de activación.</li>
                  <li>• La activación se realiza automáticamente al momento de realizar la primera reserva.</li>
                  <li>• La fecha de activación no puede posponerse más allá de 30 días desde la fecha de compra.</li>
                </ul>

                <h5 className="font-medium text-xs sm:text-sm mb-2">2.2 Características del MATPASS</h5>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• El pase es personal e intransferible.</li>
                  <li>• No es reembolsable bajo ninguna circunstancia.</li>
                  <li>• El usuario tiene la opción de extender su MATPASS por 7 días adicionales posteriores a la fecha de vencimiento original.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">3. Métodos de Pago</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Tarjetas de crédito y débito</li>
                  <li>• Transferencia bancaria</li>
                  <li>• Efectivo en establecimiento</li>
                  <li>• Billeteras digitales</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">4. Uso de Instalaciones</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Los usuarios deben presentar su MATPASS para acceder a las instalaciones.</li>
                  <li>• Se requiere comportamiento respetuoso en todo momento.</li>
                  <li>• Seguir todos los protocolos de seguridad e higiene.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">5. Política de Cancelación y Reembolso</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Las compras de MATPASS no son reembolsables.</li>
                  <li>• Las cancelaciones de sesiones deben realizarse con al menos 2 horas de anticipación.</li>
                  <li>• Las inasistencias serán cobradas como sesiones utilizadas.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">6. Salud y Seguridad</h4>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Los usuarios deben informar a los instructores sobre cualquier condición de salud.</li>
                  <li>• El estudio no es responsable de lesiones durante las sesiones.</li>
                  <li>• Seguir todas las instrucciones de seguridad proporcionadas por el personal.</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">7. Pertenencias Personales</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">El estudio no es responsable de pertenencias personales perdidas o robadas. Por favor mantenga sus objetos de valor seguros durante su visita.</p>

                <h4 className="font-semibold text-sm sm:text-base mb-2">8. Política de Privacidad</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">Respetamos su privacidad y solo usaremos su información personal de acuerdo con nuestra política de privacidad. Sus datos no serán compartidos con terceros sin su consentimiento.</p>

                <h4 className="font-semibold text-sm sm:text-base mb-2">9. Cambios en los Términos</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios serán efectivos inmediatamente al publicarlos en nuestro sitio web.</p>

                <h4 className="font-semibold text-sm sm:text-base mb-2">10. Contacto</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">Para cualquier duda, aclaración o solicitud relacionada con estos términos y condiciones, contactar a:</p>
                <ul className="mb-3 sm:mb-4 space-y-1 text-xs sm:text-sm">
                  <li>• Correo electrónico: info@matmax.store</li>
                  <li>• Teléfono: +51916172368</li>
                  <li>• Dirección: Calle Alcanfores 425, Miraflores Piso 2</li>
                </ul>

                <h4 className="font-semibold text-sm sm:text-base mb-2">11. Jurisdicción</h4>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">Cualquier controversia derivada de estos términos y condiciones se resolverá conforme a las leyes vigentes en Lima, Perú.</p>
              </>
            )}
                  </div>
                  <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-[var(--color-text-tertiary)] text-center">
            {currentLanguage === 'en' ? 'Last updated: January 31, 2025' : 'Última actualización: 31 de enero de 2025'}
              </div>
            </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-[var(--color-border-500)] bg-[var(--color-surface-secondary)]" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-[var(--color-text-tertiary)]">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Available in English and Spanish</span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2.5 sm:py-2 border border-[var(--color-border-500)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={onAccept}
                disabled={!hasScrolledToBottom}
                className={`px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  hasScrolledToBottom
                    ? 'bg-[var(--color-status-success)] text-[var(--color-status-success-foreground)] hover:bg-[var(--color-status-success)]/90'
                    : 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
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
            <div className="mt-2 text-xs text-[var(--color-text-tertiary)] text-center">
              Please scroll to the bottom to accept the terms
            </div>
          )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}