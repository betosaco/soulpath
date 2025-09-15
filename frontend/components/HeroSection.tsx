'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  t: Record<string, string | Record<string, string>>;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="h-full flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-6 lg:px-8 relative safe-padding">
      {/* Mobile-optimized spacing and layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-[#FFD700] rounded-full mb-4 sm:mb-6 md:mb-8 shadow-lg shadow-[#FFD700]/50 cosmic-glow"
        />
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading text-[#EAEAEA] mb-3 sm:mb-4 md:mb-6 max-w-6xl leading-[1.1] sm:leading-tight px-2 font-bold"
        >
          {(t.hero as Record<string, string>).title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-[#EAEAEA]/90 max-w-4xl mb-6 sm:mb-8 md:mb-12 leading-relaxed px-3 sm:px-4 font-light"
        >
          {(t.hero as Record<string, string>).subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center space-x-2 sm:space-x-3 text-[#C0C0C0] mt-2 sm:mt-4"
        >
          <span className="text-xs sm:text-sm md:text-base font-body">{(t.hero as Record<string, string>).scrollDown}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center"
          >
            <ChevronDown size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
