'use client';

/**
 * @deprecated This component is deprecated. Use MasterBookingFlow instead.
 * 
 * The BookingSection component has been consolidated into MasterBookingFlow.tsx
 * which provides a unified booking and checkout experience.
 * 
 * Migration: Replace usage with MasterBookingFlow component
 */

import React from 'react';
import { CalendlyBookingFlow } from './CalendlyBookingFlow';

interface BookingSectionProps {
  t: Record<string, string | Record<string, string>>;
  language: string;
}

export function BookingSection({ t, language }: BookingSectionProps) {
  // Go straight to the Calendly flow (package selection)
  return <CalendlyBookingFlow t={t} language={language} />;
}