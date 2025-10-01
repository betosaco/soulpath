import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yoga Class Schedule | Book Your Session | MatMax Yoga Studio',
  description: 'View and book yoga classes at MatMax Yoga Studio in Miraflores, Lima. Check our weekly schedule for Hatha, Vinyasa, and other yoga styles. Book your session today!',
  keywords: [
    'yoga class schedule lima',
    'yoga classes miraflores',
    'yoga booking schedule',
    'hatha yoga classes',
    'vinyasa yoga schedule',
    'yoga class times lima',
    'yoga studio schedule',
    'book yoga class lima',
    'yoga session booking',
    'wellness class schedule'
  ],
  openGraph: {
    title: 'Yoga Class Schedule | Book Your Session | MatMax Yoga Studio',
    description: 'View and book yoga classes at MatMax Yoga Studio in Miraflores, Lima. Check our weekly schedule for Hatha, Vinyasa, and other yoga styles.',
    type: 'website',
    url: 'https://matmax.world/schedule',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Yoga Class Schedule - MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Yoga Class Schedule | Book Your Session | MatMax Yoga Studio',
    description: 'View and book yoga classes at MatMax Yoga Studio in Miraflores, Lima. Check our weekly schedule for Hatha, Vinyasa, and other yoga styles.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/schedule',
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
