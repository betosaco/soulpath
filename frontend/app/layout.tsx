import type { Metadata } from 'next';
import { poppins, roboto } from './fonts';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'MatMax Yoga Studio',
  description: 'Strategic astrological counsel to navigate your life\'s most pivotal moments.',
  keywords: ['astrology', 'counseling', 'spiritual guidance'],
  openGraph: {
    title: 'MatMax Yoga Studio',
    description: 'Strategic astrological counsel to navigate your life\'s most pivotal moments.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MatMax Yoga Studio',
    description: 'Strategic astrological counsel to navigate your life\'s most pivotal moments.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0A0A23',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <head>
      </head>
      <body className={cn(
        "antialiased",
        poppins.variable,
        roboto.variable
      )}>
        <ThemeProvider initialTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}