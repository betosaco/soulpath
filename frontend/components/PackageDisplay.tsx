'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Users, Calendar } from 'lucide-react';

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  sessionsCount: number;
  duration: number;
  isPopular?: boolean;
  packageType?: string;
  maxGroupSize?: number;
}

interface PackageDisplayProps {
  packages: Package[];
  onPackageSelect?: (selectedPackage: Package) => void;
  className?: string;
}

export function PackageDisplay({ packages, onPackageSelect, className = '' }: PackageDisplayProps) {
  if (!packages || packages.length === 0) {
    return (
      <div className={`p-4 text-center text-[var(--color-text-tertiary)] ${className}`}>
        <p>No hay paquetes disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="font-medium text-sm mb-3 px-2 sm:px-0" style={{ color: 'var(--color-accent-500)' }}>
        🌟 Paquetes de Astrología Disponibles
      </div>
      
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-lg p-3 sm:p-4 transition-colors duration-200 mobile-touch-target mobile-tap-highlight"
          style={{ backgroundColor: 'var(--color-surface-primary)', border: '1px solid var(--color-border-500)' }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <h3 className="font-medium text-sm sm:text-base truncate" style={{ color: 'var(--color-text-primary)' }}>
                {pkg.name}
              </h3>
              {pkg.isPopular && (
                <div className="flex items-center space-x-1 flex-shrink-0" style={{ color: 'var(--color-accent-500)' }}>
                  <Star size={12} />
                  <span className="text-xs">POPULAR</span>
                </div>
              )}
            </div>
            <div className="font-bold text-sm sm:text-base ml-2" style={{ color: 'var(--color-primary-500)' }}>
              {pkg.currency}{(typeof pkg.price === 'number' && !isNaN(pkg.price) ? pkg.price.toFixed(0) : 'Consultar precio')}
            </div>
          </div>
          
          <p className="text-xs sm:text-sm mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {pkg.description}
          </p>
          
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs flex-wrap gap-y-1" style={{ color: 'var(--color-text-tertiary)' }}>
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{pkg.sessionsCount} sesión{pkg.sessionsCount !== 1 ? 'es' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{pkg.duration} min</span>
            </div>
            {pkg.maxGroupSize && pkg.maxGroupSize > 1 && (
              <div className="flex items-center space-x-1">
                <Users size={12} />
                <span>Hasta {pkg.maxGroupSize}</span>
              </div>
            )}
          </div>
          
          {onPackageSelect && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPackageSelect(pkg)}
              className="w-full mt-3 py-3 px-3 rounded-md text-sm font-medium transition-colors duration-200 mobile-touch-target mobile-button"
              style={{ backgroundColor: 'var(--color-primary-500)', color: 'var(--primary-foreground)' }}
            >
              Seleccionar Paquete
            </motion.button>
          )}
        </motion.div>
      ))}
      
      <div className="text-center text-xs sm:text-sm mt-4 px-2 sm:px-0" style={{ color: 'var(--color-text-tertiary)' }}>
        💫 ¿Listo para reservar? Solo dime qué paquete te interesa y te ayudo a comenzar.
      </div>
    </div>
  );
}

// Helper function to parse packages from text response
export function parsePackagesFromText(text: string): Package[] {
  const packages: Package[] = [];
  
  // Look for package patterns in the text
  const packageRegex = /\*\*(\d+)\.\s*([^*]+)\*\*([^*]*)\n\s*💰\s*Precio:\s*([^\n]+)\n\s*📅\s*Sesiones:\s*(\d+)\n\s*⏱️\s*Duración:\s*(\d+)\s*minutos?\s*cada\s*una?\n\s*📝\s*([^\n]+)/g;
  
  let match;
  while ((match = packageRegex.exec(text)) !== null) {
    const [, index, name, popularBadge, priceText, sessions, duration, description] = match;
    
    // Extract price and currency
    const priceMatch = priceText.match(/([^\d]*)(\d+)/);
    const currency = priceMatch ? priceMatch[1].trim() : '$';
    const price = priceMatch ? parseFloat(priceMatch[2]) : 0;
    
    packages.push({
      id: parseInt(index),
      name: name.trim(),
      description: description.trim(),
      price: price,
      currency: currency,
      sessionsCount: parseInt(sessions),
      duration: parseInt(duration),
      isPopular: popularBadge.includes('⭐') || popularBadge.includes('POPULAR'),
      packageType: 'Standard',
      maxGroupSize: 1
    });
  }
  
  return packages;
}
