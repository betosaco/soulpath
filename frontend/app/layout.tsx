import type { Metadata } from 'next';
import { poppins, roboto } from './fonts';
import './globals.css';
import '@/styles/tailwind.css';
// Scoped feature CSS moved to segment layouts to reduce unused CSS on non-client routes
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { Providers } from '@/lib/providers';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'MatMax Yoga Studio',
  description: 'Yoga classes for all levels. Build strength, flexibility, and inner peace with MatMax Yoga Studio.',
  keywords: ['yoga', 'yoga classes', 'wellness', 'meditation', 'flexibility', 'strength', 'balance', 'mindfulness'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  openGraph: {
    title: 'MatMax Yoga Studio',
    description: 'Yoga classes for all levels. Build strength, flexibility, and inner peace with MatMax Yoga Studio.',
    type: 'website',
    url: 'https://matmax.store',
    siteName: 'MatMax Yoga Studio',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MatMax Yoga Studio',
    description: 'Yoga classes for all levels. Build strength, flexibility, and inner peace with MatMax Yoga Studio.',
    images: ['/matpass-logo.png'],
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
        <link rel="preconnect" href="https://www.matmax.world" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://matmax.world" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.stripe.com" crossOrigin="anonymous" />
      </head>
      <body className={cn(
        "antialiased",
        poppins.variable,
        roboto.variable
      , 'frontpage-theme')}>
        <Providers>
          <ThemeProvider initialTheme="light">
            {children}
          </ThemeProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}