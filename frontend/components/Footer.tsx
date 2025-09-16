'use client';

import React from 'react';

export function Footer() {
  return (
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
              Stay Connected
            </h4>
            <p 
              className="text-gray-600 mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Get updates on new classes and special offers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p 
            className="text-center text-gray-600"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            © 2024 Matmax Yoga Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
