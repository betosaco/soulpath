import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply to Teach Yoga | Join Our Team | MatMax Yoga Studio',
  description: 'Join MatMax Yoga Studio as a certified yoga instructor in Miraflores, Lima. Apply now to teach Hatha, Vinyasa, and other yoga styles. Flexible schedule and competitive rates.',
  keywords: [
    'yoga instructor jobs lima',
    'yoga teacher application',
    'yoga instructor positions',
    'teach yoga lima',
    'yoga instructor opportunities',
    'yoga teacher jobs peru',
    'certified yoga instructor',
    'yoga studio employment',
    'yoga teaching positions',
    'wellness instructor jobs'
  ],
  openGraph: {
    title: 'Apply to Teach Yoga | Join Our Team | MatMax Yoga Studio',
    description: 'Join MatMax Yoga Studio as a certified yoga instructor in Miraflores, Lima. Apply now to teach Hatha, Vinyasa, and other yoga styles.',
    type: 'website',
    url: 'https://matmax.world/apply-teacher',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Apply to Teach Yoga at MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Apply to Teach Yoga | Join Our Team | MatMax Yoga Studio',
    description: 'Join MatMax Yoga Studio as a certified yoga instructor in Miraflores, Lima. Apply now to teach Hatha, Vinyasa, and other yoga styles.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/apply-teacher',
  },
};

export default function ApplyTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
