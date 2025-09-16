'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from './Header';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';

export function MatmaxHomepage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();
  const translations = t as Record<string, string | Record<string, string>>;


  const scrollToSection = (section: string) => {
    // Add scroll functionality here
    console.log('Scroll to section:', section);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        language={language}
        setLanguage={setLanguage}
        scrollToSection={scrollToSection}
        t={translations}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={null}
        isAdmin={false}
      />

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
            Find Your Flow, Transform Your Body & Mind
          </h1>
          <p 
            className="text-xl mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Daily Vinyasa and Hatha Yoga for all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/schedule"
              className="btn-primary"
            >
              View Schedule
            </a>
            <a 
              href="/packages"
              className="btn-secondary"
            >
              View Packages
            </a>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Studio Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 
                className="text-2xl font-bold text-black mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Matmax Yoga Studio
              </h3>
              <p 
                className="text-gray-600 mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Your sanctuary for wellness, growth, and transformation. Join our community and discover the power of yoga.
              </p>
              <div className="flex space-x-4">
                <a href="/account/book" className="btn-primary">Get Started</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 
                className="text-lg font-semibold text-black mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li><a href="#about" className="nav-link" style={{ color: 'var(--matmax-gray-600)' }}>About Us</a></li>
                <li><a href="#classes" className="nav-link" style={{ color: 'var(--matmax-gray-600)' }}>Classes</a></li>
                <li><a href="/schedule" className="nav-link" style={{ color: 'var(--matmax-gray-600)' }}>Schedule</a></li>
                <li><a href="/packages" className="nav-link" style={{ color: 'var(--matmax-gray-600)' }}>Packages</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 
                className="text-lg font-semibold text-black mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Newsletter
              </h4>
              <p 
                className="text-gray-600 mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Stay updated with our latest classes and events.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="btn-primary rounded-l-none">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                © 2024 Matmax Yoga Studio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

