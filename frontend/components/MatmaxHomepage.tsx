'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CentralizedHeader } from './CentralizedHeader';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';

export function MatmaxHomepage() {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const translations = t as Record<string, string | Record<string, string>>;
  
  // Mobile detection
  const [_isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <CentralizedHeader />
      
      {/* Hero Section - Full Width, Outside AppShell Container */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden w-full" style={{ height: '100svh' }}>
        {/* Video Background with Image Fallback */}
        <div className="absolute inset-0">
          {/* Video Background - All Devices */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            poster="/matmaxstudio.png"
            aria-label="Background video of yoga studio"
            style={{
              minHeight: '100%',
              minWidth: '100%',
              width: 'auto',
              height: 'auto',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            webkit-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            onError={(e) => {
              // Fallback to image if video fails to load
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
              const fallbackDiv = target.nextElementSibling as HTMLElement;
              if (fallbackDiv) {
                fallbackDiv.style.display = 'block';
              }
            }}
            onLoadStart={(e) => {
              // Ensure video starts playing when loaded
              const target = e.target as HTMLVideoElement;
              target.play().catch(() => {
                // If autoplay fails, show fallback image
                target.style.display = 'none';
                const fallbackDiv = target.nextElementSibling as HTMLElement;
                if (fallbackDiv) {
                  fallbackDiv.style.display = 'block';
                }
              });
            }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Image Background - Fallback Only */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden"
            style={{
              backgroundImage: 'url("/matmaxstudio.png")',
              minHeight: '100%',
              minWidth: '100%',
            }}
          >
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-full">
          {/* Logo */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
            <Image
              src="/logo_matmax.png"
              alt="MatMax Yoga Studio Logo"
              width={200}
              height={200}
              className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 object-contain drop-shadow-2xl brightness-0 invert"
              priority
            />
          </div>
          
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {typeof translations?.hero === 'object' && translations.hero?.title || 'Find Your Flow, Transform Your Body & Mind'}
          </h1>
          <p 
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed px-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {typeof translations?.hero === 'object' && (translations.hero?.description || translations.hero?.subtitle) || 'Daily Vinyasa and Hatha Yoga for all levels.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-none">
            <a 
              href="/schedule"
              className="btn-primary w-full sm:w-auto px-6 py-3 text-center"
            >
              {typeof translations?.nav === 'object' && (translations.nav?.schedule || translations.nav?.session) || 'View Schedule'}
            </a>
            <a 
              href="/packages"
              className="btn-secondary w-full sm:w-auto px-6 py-3 text-center"
            >
              {typeof translations?.nav === 'object' && translations.nav?.packages || 'View Packages'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

