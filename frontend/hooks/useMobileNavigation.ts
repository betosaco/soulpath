'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMobileNavigationUtils, getDeviceInfo, initializeViewportHeight } from '@/components/MobileNavigationUtils';

interface UseMobileNavigationOptions {
  enableSwipeToClose?: boolean;
  enableOrientationChange?: boolean;
  enableEscapeKey?: boolean;
  enableResizeClose?: boolean;
}

export function useMobileNavigation(options: UseMobileNavigationOptions = {}) {
  const {
    enableSwipeToClose = true,
    enableOrientationChange = true,
    enableEscapeKey = true,
    enableResizeClose = true
  } = options;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());

  // Initialize viewport height
  useEffect(() => {
    const cleanup = initializeViewportHeight();
    return cleanup;
  }, []);

  // Update device info on resize
  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    if (enableOrientationChange) {
      window.addEventListener('orientationchange', handleResize);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (enableOrientationChange) {
        window.removeEventListener('orientationchange', handleResize);
      }
    };
  }, [enableOrientationChange]);

  // Use mobile navigation utilities
  const { smoothScrollTo, handleTouchStart } = useMobileNavigationUtils({
    isMenuOpen,
    setIsMenuOpen: (open) => {
      if (enableResizeClose && window.innerWidth > 768 && open) {
        return; // Don't open on desktop
      }
      setIsMenuOpen(open);
    },
    enableEscapeKey
  });

  // Enhanced menu toggle with device-specific behavior
  const toggleMenu = useCallback(() => {
    if (deviceInfo.isTablet || deviceInfo.deviceType === 'desktop') {
      return; // Don't open on tablet/desktop
    }
    setIsMenuOpen(prev => !prev);
  }, [deviceInfo]);

  // Close menu
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Open menu
  const openMenu = useCallback(() => {
    if (deviceInfo.isTablet || deviceInfo.deviceType === 'desktop') {
      return; // Don't open on tablet/desktop
    }
    setIsMenuOpen(true);
  }, [deviceInfo]);

  // Get mobile-specific classes
  const getMobileClasses = useCallback(() => {
    const baseClasses = 'mobile-menu mobile-scrollable';
    
    if (deviceInfo.isSmallPhone) {
      return `${baseClasses} mobile-small-phone`;
    } else if (deviceInfo.isMediumPhone) {
      return `${baseClasses} mobile-medium-phone`;
    } else if (deviceInfo.isLargePhone) {
      return `${baseClasses} mobile-large-phone`;
    } else if (deviceInfo.isTablet) {
      return `${baseClasses} mobile-tablet`;
    }
    
    return baseClasses;
  }, [deviceInfo]);

  // Get touch feedback classes
  const getTouchFeedbackClasses = useCallback(() => {
    return 'touch-manipulation mobile-touch-feedback';
  }, []);

  // Get safe area classes
  const getSafeAreaClasses = useCallback(() => {
    return 'safe-padding mobile-nav-safe';
  }, []);

  // Enhanced touch start handler with swipe support
  const handleTouchStartWithSwipe = useCallback((e: React.TouchEvent) => {
    if (enableSwipeToClose) {
      handleTouchStart(e);
    }
  }, [enableSwipeToClose, handleTouchStart]);

  return {
    isMenuOpen,
    setIsMenuOpen,
    toggleMenu,
    closeMenu,
    openMenu,
    smoothScrollTo,
    handleTouchStart: handleTouchStartWithSwipe,
    deviceInfo,
    getMobileClasses,
    getTouchFeedbackClasses,
    getSafeAreaClasses
  };
}
