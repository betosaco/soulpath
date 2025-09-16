'use client';

import React, { useEffect } from 'react';
import { Menu, X, LogIn, Settings, User, Package, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/unified-component-styles.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useLogo } from '../hooks/useLogo';

interface HeaderProps {
  language: "en" | "es";
  setLanguage: (language: "en" | "es") => void;
  scrollToSection: (section: string) => void;
  t: Record<string, string | Record<string, string>>;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: { email: string } | null;
  isAdmin: boolean;
}

export function Header({ 
  language, 
  setLanguage, 
  scrollToSection, 
  t, 
  isMenuOpen, 
  setIsMenuOpen, 
  user,
  isAdmin
}: HeaderProps) {
  const { logoSettings, isLoading } = useLogo();
  const router = useRouter();
  
  // Handle touch gestures for closing menu
  useEffect(() => {
    if (!isMenuOpen) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Swipe right to close (with minimum distance and prevent vertical scrolling conflicts)
      if (deltaX > 100 && deltaY < 50 && touchStartX < 50) {
        setIsMenuOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, setIsMenuOpen]);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-[9997] bg-white shadow-sm border-b border-gray-200 safe-padding">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-0 flex items-center justify-between header-container h-10">
        <motion.div 
          className="flex items-center space-x-2 cursor-pointer touch-manipulation min-h-[24px] min-w-[24px] flex items-center justify-center"
          onClick={() => scrollToSection('invitation')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <div className="h-16 sm:h-20 md:h-24 lg:h-28 w-20 bg-gray-300 animate-pulse rounded"></div>
          ) : logoSettings.isActive ? (
            logoSettings.type === 'text' ? (
              <span className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-semibold">
                {logoSettings.text || 'MatMax'}
              </span>
            ) : logoSettings.imageUrl ? (
              <Image 
                src={logoSettings.imageUrl} 
                alt="MatMax Yoga Studio Logo" 
                width={120}
                height={120}
                className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain"
              />
            ) : (
              <span className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-semibold">MatMax</span>
            )
          ) : (
            <span className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-semibold">MatMax</span>
          )}
        </motion.div>
        
        <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4 lg:space-x-6 flex-1 sm:flex-none">
          {/* Mobile Language Selector - Centered */}
          <div className="flex sm:hidden items-center space-x-1">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center ${
                language === 'en' 
                  ? 'bg-[#6ea058] text-white shadow-sm' 
                  : 'text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10'
              }`}
            >
              EN
            </button>
            <span className="text-gray-400 text-xs">|</span>
            <button 
              onClick={() => setLanguage('es')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center ${
                language === 'es' 
                  ? 'bg-[#6ea058] text-white shadow-sm' 
                  : 'text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10'
              }`}
            >
              ES
            </button>
          </div>

          {/* Desktop Language Selector */}
          <div className="hidden sm:flex items-center space-x-2">
            <button 
              onClick={() => setLanguage('en')}
              className={`touch-manipulation px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 min-h-[36px] min-w-[36px] flex items-center justify-center ${
                language === 'en' ? 'header-button-language-active' : 'header-button-language-inactive'
              }`}
            >
              EN
            </button>
            <span className="text-gray-400">|</span>
            <button 
              onClick={() => setLanguage('es')}
              className={`touch-manipulation px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 min-h-[36px] min-w-[36px] flex items-center justify-center ${
                language === 'es' ? 'header-button-language-active' : 'header-button-language-inactive'
              }`}
            >
              ES
            </button>
          </div>
          
          {/* Schedule Link */}
          <Link href="/account/book">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center space-x-1 header-button-account"
            >
              <Calendar size={14} />
              <span>Schedule</span>
            </motion.button>
          </Link>

          {/* Packages Link */}
          <Link href="/packages">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center space-x-1 header-button-account"
            >
              <Package size={14} />
              <span>Packages</span>
            </motion.button>
          </Link>

          {/* User Account Access */}
          {user && !isAdmin && (
            <Link href="/account">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-1 header-button-account"
              >
                <User size={14} />
                <span>Account</span>
              </motion.button>
            </Link>
          )}
          
          {/* Admin Login Button */}
          {user && isAdmin ? (
            <motion.button
              onClick={() => router.push('/admin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center space-x-1 header-button-account"
            >
              <Settings size={14} />
              <span>Dashboard</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => router.push('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center space-x-1 header-button-language-inactive"
            >
              <LogIn size={14} />
              <span>{(t.nav as Record<string, string>).login || 'Login'}</span>
            </motion.button>
          )}
          
          <motion.button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center rounded-lg header-button-menu touch-manipulation focus-visible px-4 py-2 sm:px-3 sm:py-2 min-h-[44px] min-w-[44px] relative overflow-hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {/* Mobile: Show "Menu" text with icon */}
            <div className="flex sm:hidden items-center space-x-2">
              <span className="text-sm font-medium">
                {isMenuOpen ? 'Close' : 'Menu'}
              </span>
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.div>
            </div>
            
            {/* Desktop: Show hamburger icon */}
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:block"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>

            {/* Ripple effect for mobile */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-xl z-[9999] mobile-menu mobile-scrollable"
            >
              <div className="flex flex-col h-full p-4 sm:p-6 safe-padding">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <span className="font-heading text-lg sm:text-xl text-black font-semibold">MatMax</span>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 hover:text-black transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="flex-1 space-y-2 sm:space-y-3">
                  <Link href="/account/book">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-center px-4 sm:px-6 py-4 sm:py-5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 sm:space-x-4 touch-manipulation min-h-[52px] text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10 active:bg-[#6ea058]/15 border border-gray-200 hover:border-[#6ea058]/30 mobile-touch-feedback"
                    >
                      <Calendar size={18} />
                      <span className="text-base sm:text-lg font-medium">Schedule</span>
                    </motion.button>
                  </Link>

                  <Link href="/packages">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-center px-4 sm:px-6 py-4 sm:py-5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 sm:space-x-4 touch-manipulation min-h-[52px] text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10 active:bg-[#6ea058]/15 border border-gray-200 hover:border-[#6ea058]/30 mobile-touch-feedback"
                    >
                      <Package size={18} />
                      <span className="text-base sm:text-lg font-medium">Packages</span>
                    </motion.button>
                  </Link>

                  {user && !isAdmin && (
                    <Link href="/account">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-center px-4 sm:px-6 py-4 sm:py-5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 sm:space-x-4 touch-manipulation min-h-[52px] text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10 active:bg-[#6ea058]/15 border border-gray-200 hover:border-[#6ea058]/30"
                      >
                        <User size={18} />
                        <span className="text-base sm:text-lg font-medium">Account</span>
                      </motion.button>
                    </Link>
                  )}

                  <motion.button
                    onClick={() => {
                      if (user && isAdmin) {
                        router.push('/admin');
                      } else {
                        router.push('/login');
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-center px-4 sm:px-6 py-4 sm:py-5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 sm:space-x-4 touch-manipulation min-h-[52px] text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10 active:bg-[#6ea058]/15 border border-gray-200 hover:border-[#6ea058]/30"
                  >
                    <LogIn size={18} />
                    <span className="text-base sm:text-lg font-medium">
                      {user && isAdmin ? 'Dashboard' : (t.nav as Record<string, string>).login || 'Login'}
                    </span>
                  </motion.button>
                </nav>

                {/* Language Selector */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-3">
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center ${
                        language === 'en' 
                          ? 'bg-[#6ea058] text-white shadow-sm' 
                          : 'text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10 border border-gray-200'
                      }`}
                    >
                      EN
                    </button>
                    <span className="text-gray-400">|</span>
                    <button 
                      onClick={() => setLanguage('es')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center ${
                        language === 'es' 
                          ? 'bg-[#6ea058] text-white shadow-sm' 
                          : 'text-black hover:text-[#6ea058] hover:bg-[#6ea058]/10 border border-gray-200'
                      }`}
                    >
                      ES
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
