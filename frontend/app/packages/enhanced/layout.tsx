import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enhanced Yoga Packages | Premium Classes & Sessions',
  description: 'Explore our enhanced yoga packages with flexible scheduling, personalized sessions, and premium wellness programs. Book your yoga classes in Miraflores, Lima with 30-day validity.',
  keywords: [
    'enhanced yoga packages',
    'premium yoga classes',
    'yoga sessions lima',
    'flexible yoga scheduling',
    'personalized yoga programs',
    'yoga packages miraflores',
    'yoga booking system',
    'yoga class packages',
    'wellness packages lima',
    'yoga membership lima',
    'matpass enhanced',
    'yoga session booking'
  ],
  openGraph: {
    title: 'Enhanced Yoga Packages | Premium Classes & Sessions',
    description: 'Explore our enhanced yoga packages with flexible scheduling, personalized sessions, and premium wellness programs.',
    type: 'website',
    url: 'https://matmax.world/packages/enhanced',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Enhanced Yoga Packages at MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Enhanced Yoga Packages | Premium Classes & Sessions',
    description: 'Explore our enhanced yoga packages with flexible scheduling, personalized sessions, and premium wellness programs.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/packages/enhanced',
  },
};

export default function EnhancedPackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
