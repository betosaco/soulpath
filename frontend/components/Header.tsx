'use client';

import React, { useEffect } from 'react';
import { Menu, X, LogIn, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { useLogo } from '../hooks/useLogo';

interface HeaderProps {
  language: "en" | "es";
  setLanguage: (language: "en" | "es") => void;
  scrollToSection: (section: string) => void;
  t: Record<string, string | Record<string, string>>;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  onLoginClick: () => void;
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
  onLoginClick,
  user,
  isAdmin
}: HeaderProps) {
  const { logoSettings } = useLogo();
  
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
    <header className="fixed top-0 left-0 right-0 z-[9997] bg-black/30 backdrop-blur-lg border-b border-white/20 safe-padding">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex items-center justify-between header-container">
        <motion.div 
          className="flex items-center space-x-2 cursor-pointer touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => scrollToSection('invitation')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {logoSettings.isActive ? (
            logoSettings.type === 'text' ? (
              <span className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-[#FFD700] font-semibold">
                {logoSettings.text || 'MatMax'}
              </span>
            ) : logoSettings.imageUrl ? (
              <Image 
                src={logoSettings.imageUrl} 
                alt="MatMax Yoga Studio Logo" 
                width={40}
                height={40}
                className="h-7 sm:h-8 md:h-9 lg:h-10 object-contain"
              />
            ) : (
              <span className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-[#FFD700] font-semibold">MatMax</span>
            )
          ) : (
            <span className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-[#FFD700] font-semibold">MatMax</span>
          )}
        </motion.div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          {/* Mobile Language Selector */}
          <div className="flex sm:hidden items-center space-x-1">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center ${
                language === 'en' 
                  ? 'bg-[#FFD700] text-[#0A0A23] shadow-sm' 
                  : 'text-[#C0C0C0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
              }`}
            >
              EN
            </button>
            <span className="text-[#C0C0C0]/30 text-xs">|</span>
            <button 
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center ${
                language === 'es' 
                  ? 'bg-[#FFD700] text-[#0A0A23] shadow-sm' 
                  : 'text-[#C0C0C0] hover:text-[#FFD700] hover:bg-[#FFD700]/10'
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
            <span className="text-[#C0C0C0]/50">|</span>
            <button 
              onClick={() => setLanguage('es')}
              className={`touch-manipulation px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 min-h-[36px] min-w-[36px] flex items-center justify-center ${
                language === 'es' ? 'header-button-language-active' : 'header-button-language-inactive'
              }`}
            >
              ES
            </button>
          </div>
          
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
              onClick={onLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center space-x-1 header-button-account"
            >
              <Settings size={14} />
              <span>Dashboard</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={onLoginClick}
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
            className="flex items-center justify-center rounded-lg header-button-menu touch-manipulation focus-visible px-3 py-2 sm:px-3 sm:py-2 min-h-[44px] min-w-[44px] relative overflow-hidden"
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
    </header>
  );
}
