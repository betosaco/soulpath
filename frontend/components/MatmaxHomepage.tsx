'use client';

import React from 'react';
import Image from 'next/image';
import { AppLayout } from './AppLayout';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';

export function MatmaxHomepage() {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const translations = t as Record<string, string | Record<string, string>>;

  return (
    <AppLayout className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/matmaxstudio.png")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo_matmax.png"
              alt="MatMax Yoga Studio Logo"
              width={200}
              height={200}
              className="h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 object-contain drop-shadow-2xl brightness-0 invert"
              priority
            />
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {typeof translations?.hero === 'object' && translations.hero?.title || 'Find Your Flow, Transform Your Body & Mind'}
          </h1>
          <p 
            className="text-xl mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {typeof translations?.hero === 'object' && (translations.hero?.description || translations.hero?.subtitle) || 'Daily Vinyasa and Hatha Yoga for all levels.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/schedule"
              className="btn-primary"
            >
              {typeof translations?.nav === 'object' && (translations.nav?.schedule || translations.nav?.session) || 'View Schedule'}
            </a>
            <a 
              href="/packages"
              className="btn-secondary"
            >
              {typeof translations?.nav === 'object' && translations.nav?.packages || 'View Packages'}
            </a>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

