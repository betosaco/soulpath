'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTermsUI } from '@/store/appStore';

interface TermsModalProps {
  title?: string;
  content?: React.ReactNode;
  onAccept?: () => void;
  onDecline?: () => void;
}

export function TermsModal({ title = 'Terms & Conditions', content, onAccept, onDecline }: TermsModalProps) {
  const { isTermsOpen, closeTerms } = useTermsUI();
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const update = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <AnimatePresence>
      {isTermsOpen && (
        <>
          {/* Backdrop (darker overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => closeTerms()}
          />

          {/* Panel (drawer below header). Mobile: bottom drawer; Desktop: right drawer */}
          <motion.div
            initial={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.3 }}
            className="fixed w-full md:max-w-xl bg-card shadow-xl z-50 inset-x-0 md:inset-x-auto md:right-0"
            style={{
              top: 'max(var(--page-top-offset-mobile), var(--header-height-desktop))',
              bottom: 0,
              right: 0,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-500)]">
                <div className="flex items-center gap-3">
                  <h2 id="terms-modal-title" className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {lang === 'en' ? 'Terms & Conditions' : 'Términos y Condiciones'}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLang('en')}
                      className={`px-2 py-1 rounded text-sm ${lang === 'en' ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]' : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'}`}
                      aria-pressed={lang === 'en'}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLang('es')}
                      className={`px-2 py-1 rounded text-sm ${lang === 'es' ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]' : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'}`}
                      aria-pressed={lang === 'es'}
                    >
                      ES
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => closeTerms()}
                  className="p-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
                  aria-label="Close terms and conditions"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content (independent scroll) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[var(--color-text-secondary)]">
                <div className="prose prose-sm max-w-none">
                  {lang === 'en' ? (
                    <>
                      <h3 className="font-semibold">Terms and Conditions - MatMax Wellness Studio</h3>
                      <p className="text-xs text-[var(--color-text-tertiary)]">Last updated: January 31, 2025</p>
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <h4 className="font-semibold">Definitions</h4>
                          <ul className="list-disc pl-5">
                            <li>MATPASS: Access pass valid for 30 calendar days from activation.</li>
                            <li>User: Natural person holder of the MATPASS.</li>
                            <li>Establishment: MatMax Wellness Studio facilities where services are provided.</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">MATPASS - General Conditions</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>
                              <h5 className="font-medium">Validity and Activation</h5>
                              <ul className="list-disc pl-5">
                                <li>The MATPASS is valid for 30 calendar days from activation.</li>
                                <li>Activation occurs automatically at the first reservation.</li>
                                <li>Activation cannot be postponed beyond 30 days from purchase.</li>
                              </ul>
                            </li>
                            <li>
                              <h5 className="font-medium">Characteristics</h5>
                              <ul className="list-disc pl-5">
                                <li>Personal and non-transferable.</li>
                                <li>Non-refundable.</li>
                                <li>Optional 7-day extension after original expiration.</li>
                              </ul>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Payment Methods</h4>
                          <ul className="list-disc pl-5">
                            <li>Credit/debit cards</li>
                            <li>Bank transfer</li>
                            <li>Cash at establishment</li>
                            <li>Digital wallets</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">Facility Use</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>
                              <h5 className="font-medium">Reservations and Attendance</h5>
                              <ul className="list-disc pl-5">
                                <li>Reserve via platform or on-site upon attendance.</li>
                                <li>Cancel at least 3 hours in advance.</li>
                                <li>Late cancellations count as taken class.</li>
                              </ul>
                            </li>
                            <li>
                              <h5 className="font-medium">Rules</h5>
                              <ul className="list-disc pl-5">
                                <li>Personal towel required; appropriate attire.</li>
                                <li>Respect silence; arrive 10 minutes early.</li>
                                <li>10-minute tolerance; door closes thereafter.</li>
                                <li>Mat provided or bring your own.</li>
                              </ul>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Health & Safety</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>Report pre-existing medical conditions.</li>
                            <li>Follow hygiene protocols and room capacity limits.</li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Service Modifications</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>Schedules/teachers may change.</li>
                            <li>Classes may be canceled with 2 hours notice.</li>
                            <li>Holidays may have special schedules.</li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Privacy Policy</h4>
                          <p>See Privacy Policy at the studio and on our platform.</p>
                        </li>
                        <li>
                          <h4 className="font-semibold">Suspension/Cancellation Causes</h4>
                          <ul className="list-disc pl-5">
                            <li>Rule violations; inappropriate behavior; non-payment; fraudulent use.</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">Responsibilities</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>
                              <h5 className="font-medium">User</h5>
                              <ul className="list-disc pl-5">
                                <li>Care for facilities; follow instructions; respect others; keep contact info updated.</li>
                              </ul>
                            </li>
                            <li>
                              <h5 className="font-medium">MatMax</h5>
                              <ul className="list-disc pl-5">
                                <li>Maintain facilities; qualified staff; quality services; valid insurance.</li>
                              </ul>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Contact</h4>
                          <ul className="list-disc pl-5">
                            <li>Email: info@matmax.store</li>
                            <li>Phone: +51916172368</li>
                            <li>Address: Calle Alcanfores 425, Miraflores Piso 2</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">Jurisdiction</h4>
                          <p>Disputes resolved under the laws of Lima, Peru.</p>
                        </li>
                      </ol>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold">Términos y Condiciones - MatMax Wellness Studio</h3>
                      <p className="text-xs text-[var(--color-text-tertiary)]">Última actualización: 31 de enero de 2025</p>
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <h4 className="font-semibold">Definiciones</h4>
                          <ul className="list-disc pl-5">
                            <li>MATPASS: Pase válido por 30 días naturales desde su activación.</li>
                            <li>Usuario: Persona titular del MATPASS.</li>
                            <li>Establecimiento: Instalaciones donde se prestan los servicios.</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">MATPASS - Condiciones Generales</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>
                              <h5 className="font-medium">Vigencia y Activación</h5>
                              <ul className="list-disc pl-5">
                                <li>Vigencia: 30 días desde activación.</li>
                                <li>Activación automática al realizar la primera reserva.</li>
                                <li>No posponer más de 30 días desde la compra.</li>
                              </ul>
                            </li>
                            <li>
                              <h5 className="font-medium">Características</h5>
                              <ul className="list-disc pl-5">
                                <li>Personal e intransferible.</li>
                                <li>No reembolsable.</li>
                                <li>Opción de extender por 7 días posteriores al vencimiento original.</li>
                              </ul>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Métodos de Pago</h4>
                          <ul className="list-disc pl-5">
                            <li>Tarjetas de crédito y débito</li>
                            <li>Transferencia bancaria</li>
                            <li>Efectivo en establecimiento</li>
                            <li>Billeteras digitales</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">Uso de Instalaciones</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>
                              <h5 className="font-medium">Reservas y Asistencia</h5>
                              <ul className="list-disc pl-5">
                                <li>Reserva por plataforma o en el establecimiento.</li>
                                <li>Cancelaciones con mínimo 3 horas de anticipación.</li>
                                <li>Cancelaciones tardías cuentan como clase tomada.</li>
                              </ul>
                            </li>
                            <li>
                              <h5 className="font-medium">Normas</h5>
                              <ul className="list-disc pl-5">
                                <li>Toalla personal obligatoria; ropa adecuada.</li>
                                <li>Respetar el silencio; llegar 10 minutos antes.</li>
                                <li>Tolerancia máxima 10 minutos; puerta se cierra.</li>
                                <li>Mat proporcionado o traer propio.</li>
                              </ul>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Salud y Seguridad</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>Informar condiciones médicas preexistentes.</li>
                            <li>Seguir protocolos de higiene y aforos.</li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Modificaciones de Servicio</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>Horarios y profesores pueden cambiar.</li>
                            <li>Cancelación con 2 horas de aviso por causas justificadas.</li>
                            <li>Feriados con horarios especiales.</li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Política de Privacidad</h4>
                          <p>Ver documento disponible en el establecimiento y plataforma.</p>
                        </li>
                        <li>
                          <h4 className="font-semibold">Causas de Suspensión o Cancelación</h4>
                          <ul className="list-disc pl-5">
                            <li>Incumplimiento de normas; comportamiento inadecuado; falta de pago; uso fraudulento.</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">Responsabilidades</h4>
                          <ol className="list-[lower-alpha] pl-5 space-y-2">
                            <li>
                              <h5 className="font-medium">Del Usuario</h5>
                              <ul className="list-disc pl-5">
                                <li>Cuidar instalaciones; seguir instrucciones; respetar; mantener datos actualizados.</li>
                              </ul>
                            </li>
                            <li>
                              <h5 className="font-medium">De MatMax</h5>
                              <ul className="list-disc pl-5">
                                <li>Mantener instalaciones; personal calificado; servicios de calidad; seguros vigentes.</li>
                              </ul>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h4 className="font-semibold">Contacto</h4>
                          <ul className="list-disc pl-5">
                            <li>Correo: info@matmax.store</li>
                            <li>Teléfono: +51916172368</li>
                            <li>Dirección: Calle Alcanfores 425, Miraflores Piso 2</li>
                          </ul>
                        </li>
                        <li>
                          <h4 className="font-semibold">Jurisdicción</h4>
                          <p>Las controversias se resuelven bajo las leyes de Lima, Perú.</p>
                        </li>
                      </ol>
                    </>
                  )}
                </div>
              </div>

              {/* Footer actions (mirrors sidecart bottom buttons) */}
              <div className="border-t border-[var(--color-border-500)] p-4 space-y-2">
                <button
                  className="w-full bg-[var(--color-primary-500)] text-[var(--primary-foreground)] py-2 px-4 rounded-lg font-medium hover:bg-[var(--color-primary-600)] transition-colors text-center"
                  onClick={() => {
                    onAccept?.();
                    closeTerms();
                  }}
                >
                  {lang === 'en' ? 'I Agree' : 'Acepto'}
                </button>
                <button
                  className="w-full text-[var(--color-text-secondary)] py-2 px-4 rounded-lg font-medium hover:text-[var(--color-status-error)] transition-colors"
                  onClick={() => {
                    onDecline?.();
                    closeTerms();
                  }}
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default TermsModal;


