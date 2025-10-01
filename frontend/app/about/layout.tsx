import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Our Story & Mission | MatMax Yoga Studio',
  description: 'Learn about MatMax Yoga Studio\'s story, mission, and values. Discover our evidence-based approach to yoga and wellness in Miraflores, Lima. Meet our certified instructors and learn about our personalized sessions.',
  keywords: [
    'about matmax yoga',
    'yoga studio story',
    'yoga mission lima',
    'certified yoga instructors',
    'evidence-based yoga',
    'personalized yoga sessions',
    'yoga values lima',
    'wellness approach',
    'yoga philosophy',
    'matmax team'
  ],
  openGraph: {
    title: 'About Us - Our Story & Mission | MatMax Yoga Studio',
    description: 'Learn about MatMax Yoga Studio\'s story, mission, and values. Discover our evidence-based approach to yoga and wellness in Miraflores, Lima.',
    type: 'website',
    url: 'https://matmax.world/about',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'About MatMax Yoga Studio - Our Story and Mission',
      },
    ],
  },
  twitter: {
    title: 'About Us - Our Story & Mission | MatMax Yoga Studio',
    description: 'Learn about MatMax Yoga Studio\'s story, mission, and values. Discover our evidence-based approach to yoga and wellness.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
