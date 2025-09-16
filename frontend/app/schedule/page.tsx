'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { EnhancedSchedule } from '@/components/EnhancedSchedule';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
import '@/components/EnhancedSchedule.css';

export default function SchedulePage() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations(undefined, language);
  
  // Ensure we have a valid translation object with proper structure
  const safeT: Record<string, string | Record<string, string>> = 
    (t && typeof t === 'object' && Object.keys(t).length > 0) 
      ? t as Record<string, string | Record<string, string>>
      : { common: { login: 'Login' } };

  const handleBookSlot = (slot: {
    id: number;
    teacher: { id: number };
    serviceType: { id: number };
    venue: { id: number };
    date: string;
    time: string;
  }) => {
    // Redirect to booking page with slot information
    const params = new URLSearchParams({
      slotId: slot.id.toString(),
      teacherId: slot.teacher.id.toString(),
      serviceTypeId: slot.serviceType.id.toString(),
      venueId: slot.venue.id.toString(),
      date: slot.date,
      time: slot.time
    });
    
    window.location.href = `/account/book?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        language={language}
        setLanguage={setLanguage}
        scrollToSection={() => {}}
        t={safeT}
        isMenuOpen={false}
        setIsMenuOpen={() => {}}
        user={null}
        isAdmin={false}
      />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <EnhancedSchedule 
            onBookSlot={handleBookSlot}
            showBookingButton={true}
            className="max-w-7xl mx-auto"
          />
        </div>
      </main>
    </div>
  );
}
