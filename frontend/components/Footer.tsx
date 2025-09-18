'use client';

import React from 'react';
import { Mail, Phone, MapPin, Instagram, Heart } from 'lucide-react';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';

export function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  
  // Clean i18n access
  const footer = (t && typeof t === 'object' && 'footer' in t) ? t.footer as Record<string, string> : {};
  
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
              {footer.studioTitle || 'Matmax Yoga Studio'}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              {footer.studioDescription || 'Your sanctuary for wellness, growth, and transformation.'}
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com/matmaxyoga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="mailto:info@matmax.world" 
                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="tel:+51916172368" 
                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
              {footer.quickLinksTitle || 'Quick Links'}
            </h4>
            <nav className="space-y-2">
              <a href="/" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                {footer.home || 'Home'}
              </a>
              <a href="/about" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                {footer.about || 'About'}
              </a>
              <a href="/packages" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                {footer.packages || 'Packages'}
              </a>
              <a href="/schedule" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                {footer.schedule || 'Schedule'}
              </a>
              <a href="/account/book" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                {footer.bookSession || 'Book Session'}
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
              {footer.contactTitle || 'Contact'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Calle Alcanfores 425, Miraflores, Lima</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <a href="tel:+51916172368" className="hover:text-purple-600 transition-colors">
                  +51 916 172 368
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <a href="mailto:info@matmax.world" className="hover:text-purple-600 transition-colors">
                  info@matmax.world
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
              {footer.copyright || '© 2024 Matmax Yoga Studio. All rights reserved.'}
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500" />
              <span>in Lima, Peru</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}