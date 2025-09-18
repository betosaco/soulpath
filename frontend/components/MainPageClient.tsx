'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfileImage } from '@/hooks/useProfileImage';
import { useTranslations } from '@/hooks/useTranslations';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AppLayout } from '@/components/AppLayout';
import { themeClasses } from '@/lib/theme/theme-utils';



interface TranslationProps {
  t: Record<string, string | Record<string, string>>;
}



interface MainPageClientProps {
  content: Record<string, string>;
  initialContent: Record<string, unknown>;
  initialProfileImage: string | undefined;
}




// HeroSection Component
function HeroSection({ t }: TranslationProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen flex items-center justify-center text-center px-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`text-5xl sm:text-6xl md:text-7xl font-heading ${themeClasses.text.primary} mb-6 leading-tight`}
        >
          {typeof t?.hero === 'object' && t.hero?.title || 'MatMax Yoga Studio'}
        </motion.h1>
        
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`text-xl sm:text-2xl ${themeClasses.text.primary} mb-8 max-w-2xl mx-auto leading-relaxed`}
        >
          {typeof t?.hero === 'object' && t.hero?.subtitle || 'Tu camino al bienestar comienza aquí'}
        </motion.p>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className={`text-sm ${themeClasses.text.secondary}`}
        >
          {typeof t?.hero === 'object' && t.hero?.scrollHint || 'Scroll to explore'}
        </motion.div>
      </div>
    </motion.section>
  );
}




// ConstellationBackground Component
function ConstellationBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#191970]/20 via-transparent to-[#0A0A23]/20"></div>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#FFD700] rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

// Main Page Component
export default function MainPageClient({
  initialContent,
  initialProfileImage
}: MainPageClientProps) {
  const { t, isLoading: isLoadingTranslations } = useTranslations(initialContent || {});
  const translations = t as Record<string, string | Record<string, string>>;
  const { } = useProfileImage(initialProfileImage);

  const [showAdmin, setShowAdmin] = useState(false);



  if (showAdmin) {
    return (
      <AdminDashboard onClose={() => setShowAdmin(false)} />
    );
  }

  if (isLoadingTranslations) {
    return (
      <div className={`h-screen overflow-hidden ${themeClasses.background.primary} ${themeClasses.text.primary} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[var(--color-primary-main)] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <AppLayout 
      className={`min-h-screen ${themeClasses.background.primary} ${themeClasses.text.primary}`}
      showFooter={false}
    >
      <ConstellationBackground />
      <HeroSection t={translations} />
    </AppLayout>
  );
}
