'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useTranslations';
import { Header } from './Header';

interface HeaderContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  scrollToSection: (section: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}

interface HeaderProviderProps {
  children: React.ReactNode;
  user?: { email: string } | null;
  isAdmin?: boolean;
  scrollToSection?: (section: string) => void;
}

export function HeaderProvider({ 
  children, 
  user = null, 
  isAdmin = false, 
  scrollToSection: customScrollToSection 
}: HeaderProviderProps) {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = customScrollToSection || ((section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  });

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
  }, [isMenuOpen]);

  const contextValue: HeaderContextType = {
    isMenuOpen,
    setIsMenuOpen,
    scrollToSection
  };

  return (
    <HeaderContext.Provider value={contextValue}>
      <Header
        language={language}
        setLanguage={setLanguage}
        scrollToSection={scrollToSection}
        t={{} as Record<string, string | Record<string, string>>}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        isAdmin={isAdmin}
      />
      {children}
    </HeaderContext.Provider>
  );
}
