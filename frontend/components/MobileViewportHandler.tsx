'use client';

import { useEffect } from 'react';

/**
 * MobileViewportHandler - Enhanced mobile viewport and touch handling
 * 
 * This component provides comprehensive mobile viewport management including:
 * - Dynamic viewport height calculation (svh support)
 * - Safe area inset handling for notched devices
 * - Touch device detection and optimization
 * - Orientation change handling
 * - Mobile-specific meta tag management
 */
export function MobileViewportHandler() {
  useEffect(() => {
    // Set up mobile viewport handling
    const setupMobileViewport = () => {
      // Calculate dynamic viewport height
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Also set svh fallback for browsers that don't support it
        document.documentElement.style.setProperty('--svh', `${vh}px`);
      };

      // Set initial values
      setVH();

      // Update on resize and orientation change
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);

      // Handle safe area insets for notched devices
      const setSafeAreaInsets = () => {
        const safeAreaTop = getComputedStyle(document.documentElement)
          .getPropertyValue('env(safe-area-inset-top)') || '0px';
        const safeAreaBottom = getComputedStyle(document.documentElement)
          .getPropertyValue('env(safe-area-inset-bottom)') || '0px';
        const safeAreaLeft = getComputedStyle(document.documentElement)
          .getPropertyValue('env(safe-area-inset-left)') || '0px';
        const safeAreaRight = getComputedStyle(document.documentElement)
          .getPropertyValue('env(safe-area-inset-right)') || '0px';

        document.documentElement.style.setProperty('--safe-area-top', safeAreaTop);
        document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom);
        document.documentElement.style.setProperty('--safe-area-left', safeAreaLeft);
        document.documentElement.style.setProperty('--safe-area-right', safeAreaRight);
      };

      setSafeAreaInsets();

      // Detect touch device and add appropriate classes
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        document.documentElement.classList.add('touch-device');
        document.documentElement.classList.remove('no-touch-device');
      } else {
        document.documentElement.classList.add('no-touch-device');
        document.documentElement.classList.remove('touch-device');
      }

      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        document.documentElement.classList.add('mobile-device');
        document.documentElement.classList.remove('desktop-device');
      } else {
        document.documentElement.classList.add('desktop-device');
        document.documentElement.classList.remove('mobile-device');
      }

      // Handle iOS specific viewport issues
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        document.documentElement.classList.add('ios-device');
        
        // Fix iOS viewport height issues
        const fixIOSViewport = () => {
          const viewportHeight = window.innerHeight;
          document.documentElement.style.setProperty('--ios-vh', `${viewportHeight}px`);
        };

        fixIOSViewport();
        window.addEventListener('resize', fixIOSViewport);
        window.addEventListener('orientationchange', () => {
          setTimeout(fixIOSViewport, 100);
        });
      }

      // Prevent zoom on input focus (iOS)
      const preventZoom = () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && isMobile) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          );
        }
      };

      preventZoom();

      // Cleanup function
      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    };

    // Set up mobile viewport handling
    const cleanup = setupMobileViewport();

    // Cleanup on unmount
    return cleanup;
  }, []);

  // Update meta tags for better mobile experience
  useEffect(() => {
    // Ensure proper viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }

    // Set mobile-optimized viewport
    viewportMeta.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );

    // Add theme color for mobile browsers
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute('content', '#6ea058'); // MatMax brand color

    // Add apple-mobile-web-app-capable for iOS
    let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMeta) {
      appleMeta = document.createElement('meta');
      appleMeta.setAttribute('name', 'apple-mobile-web-app-capable');
      document.head.appendChild(appleMeta);
    }
    appleMeta.setAttribute('content', 'yes');

    // Add apple-mobile-web-app-status-bar-style for iOS
    let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!statusBarMeta) {
      statusBarMeta = document.createElement('meta');
      statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(statusBarMeta);
    }
    statusBarMeta.setAttribute('content', 'default');
  }, []);

  return null;
}
