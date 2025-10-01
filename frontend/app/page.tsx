import type { Metadata } from 'next';
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { App } from '@/components/App';

export const metadata: Metadata = {
  title: 'MatMax Yoga Studio | Premium Yoga Classes in Miraflores, Lima',
  description: 'Transform your wellness journey with MatMax Yoga Studio in Miraflores, Lima. Expert yoga classes, personalized sessions, and evidence-based wellness programs. Book your session today!',
  keywords: [
    'yoga classes lima',
    'yoga miraflores',
    'yoga studio lima',
    'hatha yoga',
    'vinyasa yoga',
    'yoga classes peru',
    'wellness lima',
    'meditation classes',
    'yoga instructor lima',
    'personalized yoga',
    'yoga sessions',
    'mindfulness lima',
    'yoga packages',
    'yoga booking lima',
    'premium yoga studio',
    'evidence-based yoga',
    'wellness programs lima'
  ],
  openGraph: {
    title: 'MatMax Yoga Studio | Premium Yoga Classes in Miraflores, Lima',
    description: 'Transform your wellness journey with MatMax Yoga Studio in Miraflores, Lima. Expert yoga classes, personalized sessions, and evidence-based wellness programs.',
    type: 'website',
    url: 'https://matmax.world',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'MatMax Yoga Studio - Premium Yoga Classes in Miraflores, Lima',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    title: 'MatMax Yoga Studio | Premium Yoga Classes in Miraflores, Lima',
    description: 'Transform your wellness journey with MatMax Yoga Studio in Miraflores, Lima. Expert yoga classes, personalized sessions, and evidence-based wellness programs.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/',
  },
};

// ISR Configuration - This page will be statically generated and revalidated
export const revalidate = 3600; // Revalidate every hour

export default function HomePage() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
