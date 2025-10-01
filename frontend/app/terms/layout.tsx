import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | MatMax Yoga Studio',
  description: 'Read MatMax Yoga Studio\'s terms and conditions for yoga classes, MATPASS usage, bookings, and services in Miraflores, Lima. Updated January 2025.',
  keywords: [
    'yoga studio terms',
    'yoga class conditions',
    'matpass terms',
    'yoga booking terms',
    'wellness studio conditions',
    'yoga service agreement',
    'lima yoga terms',
    'yoga studio policies'
  ],
  openGraph: {
    title: 'Terms and Conditions | MatMax Yoga Studio',
    description: 'Read MatMax Yoga Studio\'s terms and conditions for yoga classes, MATPASS usage, bookings, and services in Miraflores, Lima.',
    type: 'website',
    url: 'https://matmax.world/terms',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Terms and Conditions - MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Terms and Conditions | MatMax Yoga Studio',
    description: 'Read MatMax Yoga Studio\'s terms and conditions for yoga classes, MATPASS usage, bookings, and services.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
