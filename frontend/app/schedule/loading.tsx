'use client';

import { useLanguage } from '@/hooks/useTranslations';
import { defaultTranslations } from '@/lib/data/translations';

export default function Loading() {
  const { language } = useLanguage();
  const schedule = defaultTranslations[language]?.schedule || defaultTranslations.en.schedule;
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--color-surface-primary)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-text-tertiary)] mx-auto mb-4"></div>
        <p className="text-[var(--color-text-secondary)] text-lg">{schedule.loadingSchedule || 'Loading schedule...'}</p>
      </div>
    </div>
  );
}


