'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Settings } from 'lucide-react';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sections: string[];
  currentSection: number;
  scrollToSection: (section: string) => void;
  language: string;
  setLanguage: (lang: 'en' | 'es') => void;
  t: Record<string, string | Record<string, string>>;
  user: User | null;
  isAdmin: boolean;
  onLoginClick: () => void;
  onAdminClick: () => void;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  sections, 
  currentSection, 
  scrollToSection, 
  language, 
  setLanguage, 
  t, 
  user, 
  isAdmin, 
  onLoginClick, 
  onAdminClick 
}: MobileMenuProps) {
  return (
    <div className="mobile-menu-container">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-[#191970]/98 to-[#0A0A23]/98 backdrop-blur-xl border-r border-[#C0C0C0]/30 z-[9999] mobile-menu shadow-2xl"
            >
              <div className="flex flex-col h-full p-4 sm:p-6 safe-padding">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <span className="font-heading text-lg sm:text-xl text-[#FFD700] font-semibold">MatMax</span>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg hover:bg-[#C0C0C0]/10 text-[#C0C0C0] hover:text-[#FFD700] transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="flex-1 space-y-1 sm:space-y-2">
                  {sections.map((section, index) => (
                    <motion.button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 flex items-center space-x-3 sm:space-x-4 touch-manipulation min-h-[48px] ${
                        currentSection === index
                          ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 shadow-lg shadow-[#FFD700]/15'
                          : 'text-[#C0C0C0] hover:text-[#EAEAEA] hover:bg-[#C0C0C0]/10 active:bg-[#C0C0C0]/15'
                      }`}
                    >
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${
                        currentSection === index ? 'bg-[#FFD700] shadow-sm' : 'bg-[#C0C0C0]/50'
                      }`} />
                      <span className="text-sm sm:text-base font-medium truncate">
                        {typeof t.nav === 'object' && t.nav ? t.nav[section as keyof typeof t.nav] || section : section}
                      </span>
                    </motion.button>
                  ))}
                </nav>
                
                <div className="border-t border-[#C0C0C0]/20 pt-4 sm:pt-6 mt-4 sm:mt-6">
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <motion.button 
                      onClick={() => setLanguage('en')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 touch-manipulation font-medium text-sm sm:text-base min-h-[40px] ${
                        language === 'en' ? 'text-[#FFD700] bg-[#FFD700]/15 border border-[#FFD700]/30' : 'text-[#C0C0C0] hover:text-[#FFD700] hover:bg-[#C0C0C0]/10'
                      }`}
                    >
                      English
                    </motion.button>
                    <motion.button 
                      onClick={() => setLanguage('es')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 touch-manipulation font-medium text-sm sm:text-base min-h-[40px] ${
                        language === 'es' ? 'text-[#FFD700] bg-[#FFD700]/15 border border-[#FFD700]/30' : 'text-[#C0C0C0] hover:text-[#FFD700] hover:bg-[#C0C0C0]/10'
                      }`}
                    >
                      Español
                    </motion.button>
                  </div>
                  
                  {/* Admin Login Button in Mobile Menu */}
                  {!user && (
                    <motion.button
                      onClick={() => {
                        onClose();
                        onLoginClick();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 sm:space-x-3 text-[#C0C0C0] hover:text-[#FFD700] transition-all duration-200 px-4 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-[#FFD700]/10 border border-[#C0C0C0]/20 hover:border-[#FFD700]/30 touch-manipulation font-medium min-h-[48px] text-sm sm:text-base"
                    >
                      <LogIn size={16} className="sm:w-5 sm:h-5" />
                      <span>{typeof t.nav === 'object' && t.nav?.login || 'Login'}</span>
                    </motion.button>
                  )}
                  
                  {user && isAdmin && (
                    <motion.button
                      onClick={() => {
                        onClose();
                        onAdminClick();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 sm:space-x-3 text-[#FFD700] bg-[#FFD700]/15 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-[#FFD700]/40 touch-manipulation font-medium shadow-lg shadow-[#FFD700]/10 min-h-[48px] text-sm sm:text-base"
                    >
                      <Settings size={16} className="sm:w-5 sm:h-5" />
                      <span>Dashboard</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
