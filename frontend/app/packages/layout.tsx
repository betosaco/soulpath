import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yoga Packages & Classes | MatMax Yoga Studio',
  description: 'Choose from our premium yoga packages in Miraflores, Lima. Individual sessions, group classes, and personalized yoga programs. Book your yoga package today with flexible scheduling.',
  keywords: [
    'yoga packages lima',
    'yoga classes miraflores',
    'yoga sessions lima',
    'individual yoga classes',
    'group yoga classes',
    'yoga packages peru',
    'yoga booking lima',
    'yoga pricing lima',
    'yoga membership',
    'yoga passes lima',
    'matpass yoga',
    'yoga packages booking'
  ],
  openGraph: {
    title: 'Yoga Packages & Classes | MatMax Yoga Studio',
    description: 'Choose from our premium yoga packages in Miraflores, Lima. Individual sessions, group classes, and personalized yoga programs.',
    type: 'website',
    url: 'https://matmax.world/packages',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Yoga Packages and Classes at MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Yoga Packages & Classes | MatMax Yoga Studio',
    description: 'Choose from our premium yoga packages in Miraflores, Lima. Individual sessions, group classes, and personalized yoga programs.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/packages',
  },
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
