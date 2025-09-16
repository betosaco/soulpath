'use client';

import { useEffect, useCallback } from 'react';

interface MobileNavigationUtilsProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  enableEscapeKey?: boolean;
}

export function useMobileNavigationUtils({ isMenuOpen, setIsMenuOpen, enableEscapeKey = true }: MobileNavigationUtilsProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isMenuOpen]);

  // Handle escape key
  useEffect(() => {
    if (!enableEscapeKey) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, setIsMenuOpen, enableEscapeKey]);

  // Handle orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isMenuOpen) {
        // Close menu on orientation change to prevent layout issues
        setTimeout(() => setIsMenuOpen(false), 100);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [isMenuOpen, setIsMenuOpen]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, setIsMenuOpen]);

  // Smooth scroll utility
  const smoothScrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  // Touch gesture handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = moveTouch.clientX - startX;
      const deltaY = moveTouch.clientY - startY;
      
      // Swipe right to close menu
      if (deltaX > 50 && Math.abs(deltaY) < 100) {
        setIsMenuOpen(false);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  }, [setIsMenuOpen]);

  return {
    smoothScrollTo,
    handleTouchStart
  };
}

// Device detection utilities
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isSamsung = /Samsung/.test(userAgent);
  const isGooglePixel = /Pixel/.test(userAgent);
  const isOnePlus = /OnePlus/.test(userAgent);
  const isXiaomi = /Mi|Redmi|POCO/.test(userAgent);
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Detect device type based on viewport
  const isSmallPhone = viewportWidth <= 375;
  const isMediumPhone = viewportWidth > 375 && viewportWidth <= 414;
  const isLargePhone = viewportWidth > 414 && viewportWidth <= 480;
  const isTablet = viewportWidth > 480 && viewportWidth <= 768;
  
  return {
    isIOS,
    isAndroid,
    isSamsung,
    isGooglePixel,
    isOnePlus,
    isXiaomi,
    viewportWidth,
    viewportHeight,
    isSmallPhone,
    isMediumPhone,
    isLargePhone,
    isTablet,
    deviceType: isSmallPhone ? 'small-phone' : 
                isMediumPhone ? 'medium-phone' : 
                isLargePhone ? 'large-phone' : 
                isTablet ? 'tablet' : 'desktop'
  };
};

// Safe area utilities
export const getSafeAreaInsets = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0')
  };
};

// Viewport height utilities for mobile browsers
export const getViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  return vh;
};

// Initialize viewport height on load and resize
export const initializeViewportHeight = () => {
  const updateViewportHeight = () => {
    getViewportHeight();
  };
  
  updateViewportHeight();
  window.addEventListener('resize', updateViewportHeight);
  window.addEventListener('orientationchange', updateViewportHeight);
  
  return () => {
    window.removeEventListener('resize', updateViewportHeight);
    window.removeEventListener('orientationchange', updateViewportHeight);
  };
};
