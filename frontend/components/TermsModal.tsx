'use client';

import React from 'react';
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

  return (
    <AnimatePresence>
      {isTermsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/50 z-50"
            onClick={() => closeTerms()}
          />

          {/* Panel (mimics sidecart structure, centered on mobile/desktop) */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 md:inset-y-0 md:inset-x-auto md:right-0 md:top-0 md:h-full w-full md:max-w-xl bg-card shadow-xl z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-500)]">
                <h2 id="terms-modal-title" className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {title}
                </h2>
                <button
                  onClick={() => closeTerms()}
                  className="p-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
                  aria-label="Close terms and conditions"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[var(--color-text-secondary)]">
                {content || (
                  <div className="prose prose-sm max-w-none">
                    <p>
                      Please read these Terms and Conditions carefully before using our services. By continuing, you agree to
                      be bound by these terms.
                    </p>
                  </div>
                )}
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
                  I Agree
                </button>
                <button
                  className="w-full text-[var(--color-text-secondary)] py-2 px-4 rounded-lg font-medium hover:text-[var(--color-status-error)] transition-colors"
                  onClick={() => {
                    onDecline?.();
                    closeTerms();
                  }}
                >
                  Cancel
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


