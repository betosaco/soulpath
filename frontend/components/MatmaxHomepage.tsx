'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, X, Users, Heart, Star } from 'lucide-react';
import { Header } from './Header';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';

export function MatmaxHomepage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();
  const translations = t as Record<string, string | Record<string, string>>;

  const handleLoginClick = () => {
    // Add login functionality here
    console.log('Login clicked');
  };

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
        onLoginClick={handleLoginClick}
        user={null}
        isAdmin={false}
      />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Find Your Flow, Strengthen Your Soul
          </h1>
          <p 
            className="text-xl mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Daily Vinyasa, Hatha, and Restorative Yoga for all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/account/book"
              className="btn-primary"
            >
              Class Schedule
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

      {/* Introduction / Why Matmax Section */}
      <section id="about" className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 
                className="text-4xl font-bold text-primary mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                A Space to Breathe and Grow
              </h2>
              <p 
                className="text-lg text-muted leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                At Matmax Yoga Studio, we believe that yoga is more than just physical exercise—it&apos;s a journey of self-discovery, healing, and transformation. Our welcoming community provides a safe space for practitioners of all levels to explore their practice, build strength, and find inner peace.
              </p>
            </div>

            {/* Image */}
            <div className="card-base card-hover hover-lift">
              <Image 
                src="https://images.unsplash.com/photo-1506905925346-14b5e4d4a4b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Yoga studio interior"
                width={1000}
                height={400}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Class Offerings Section */}
      <section id="classes" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold text-black mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Classes
            </h2>
            <p 
              className="text-lg text-muted"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Choose from our variety of yoga classes designed for every level and need
            </p>
          </div>

          <div className="product-grid">
            {/* Vinyasa Flow */}
            <div className="card-base card-hover hover-scale">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 
                  className="text-2xl font-bold text-black mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Vinyasa Flow
                </h3>
                <p 
                  className="text-gray-600 mb-6"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Dynamic, flowing sequences that connect breath with movement for a powerful, energizing practice.
                </p>
                <button className="btn-outline">Learn More</button>
              </div>
            </div>

            {/* Hatha Yoga */}
            <div className="card-base card-hover hover-scale">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <h3 
                  className="text-2xl font-bold text-black mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Hatha Yoga
                </h3>
                <p 
                  className="text-gray-600 mb-6"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Gentle, slower-paced practice focusing on basic postures and breathing techniques.
                </p>
                <button className="btn-outline">Learn More</button>
              </div>
            </div>

            {/* Restorative Yin */}
            <div className="card-base card-hover hover-scale">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h3 
                  className="text-2xl font-bold text-black mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Restorative Yin
                </h3>
                <p 
                  className="text-gray-600 mb-6"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Deep relaxation through long-held poses that target connective tissues and promote healing.
                </p>
                <button className="btn-outline">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MatPass Feature Section */}
      <section className="py-24 gradient-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="matpass-card">
            <h2 
              className="text-4xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Unlock Unlimited Yoga with MatPass
            </h2>
            <p 
              className="text-lg text-white mb-8"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Get unlimited access to all our classes, workshops, and special events. Join our community and transform your practice with MatPass.
            </p>
            <button className="btn-secondary">Get Your MatPass</button>
          </div>
        </div>
      </section>

      {/* Class Schedule Section */}
      <section id="schedule" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold text-black mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Class Schedule
            </h2>
            <p 
              className="text-lg text-muted"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Find the perfect time for your practice
            </p>
          </div>

          <div className="schedule-grid">
            {/* Header Row */}
            <div className="schedule-cell font-semibold bg-gray-100">Time</div>
            <div className="schedule-cell font-semibold bg-gray-100">Monday</div>
            <div className="schedule-cell font-semibold bg-gray-100">Tuesday</div>
            <div className="schedule-cell font-semibold bg-gray-100">Wednesday</div>
            <div className="schedule-cell font-semibold bg-gray-100">Thursday</div>
            <div className="schedule-cell font-semibold bg-gray-100">Friday</div>
            <div className="schedule-cell font-semibold bg-gray-100">Saturday</div>
            <div className="schedule-cell font-semibold bg-gray-100">Sunday</div>

            {/* Schedule Rows */}
            <div className="schedule-cell font-medium">6:00 AM</div>
            <div className="schedule-cell">Vinyasa Flow</div>
            <div className="schedule-cell">Hatha Yoga</div>
            <div className="schedule-cell">Vinyasa Flow</div>
            <div className="schedule-cell">Hatha Yoga</div>
            <div className="schedule-cell">Vinyasa Flow</div>
            <div className="schedule-cell">Morning Flow</div>
            <div className="schedule-cell">Restorative</div>

            <div className="schedule-cell font-medium">9:00 AM</div>
            <div className="schedule-cell">Hatha Yoga</div>
            <div className="schedule-cell">Vinyasa Flow</div>
            <div className="schedule-cell">Hatha Yoga</div>
            <div className="schedule-cell">Vinyasa Flow</div>
            <div className="schedule-cell">Hatha Yoga</div>
            <div className="schedule-cell">Family Yoga</div>
            <div className="schedule-cell">Meditation</div>

            <div className="schedule-cell font-medium">6:00 PM</div>
            <div className="schedule-cell">Power Vinyasa</div>
            <div className="schedule-cell">Restorative Yin</div>
            <div className="schedule-cell">Power Vinyasa</div>
            <div className="schedule-cell">Restorative Yin</div>
            <div className="schedule-cell">Power Vinyasa</div>
            <div className="schedule-cell">Evening Flow</div>
            <div className="schedule-cell">Yin Yoga</div>
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
                <li><a href="#schedule" className="nav-link" style={{ color: 'var(--matmax-gray-600)' }}>Schedule</a></li>
                <li><a href="#contact" className="nav-link" style={{ color: 'var(--matmax-gray-600)' }}>Contact</a></li>
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
