import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MatMax Yoga Studio',
  description: 'Learn how MatMax Yoga Studio protects your privacy and personal data. Our comprehensive privacy policy covers data collection, usage, and protection for yoga classes and services in Lima.',
  keywords: [
    'yoga studio privacy policy',
    'data protection yoga',
    'privacy policy lima',
    'wellness studio privacy',
    'yoga class data protection',
    'personal information yoga',
    'data security yoga studio',
    'privacy rights yoga'
  ],
  openGraph: {
    title: 'Privacy Policy | MatMax Yoga Studio',
    description: 'Learn how MatMax Yoga Studio protects your privacy and personal data. Our comprehensive privacy policy covers data collection, usage, and protection.',
    type: 'website',
    url: 'https://matmax.world/privacy',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy - MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Privacy Policy | MatMax Yoga Studio',
    description: 'Learn how MatMax Yoga Studio protects your privacy and personal data. Our comprehensive privacy policy covers data collection, usage, and protection.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
