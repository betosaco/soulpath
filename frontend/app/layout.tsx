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
  title: {
    default: 'MatMax Yoga Studio | Premium Yoga Classes in Miraflores, Lima',
    template: '%s | MatMax Yoga Studio'
  },
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
    'yoga booking lima'
  ],
  authors: [{ name: 'MatMax Yoga Studio' }],
  creator: 'MatMax Yoga Studio',
  publisher: 'MatMax Yoga Studio',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://matmax.world'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'es': '/?lang=es',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.png',
        color: '#0A0A23',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_PE'],
    url: 'https://matmax.world',
    siteName: 'MatMax Yoga Studio',
    title: 'MatMax Yoga Studio | Premium Yoga Classes in Miraflores, Lima',
    description: 'Transform your wellness journey with MatMax Yoga Studio in Miraflores, Lima. Expert yoga classes, personalized sessions, and evidence-based wellness programs.',
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
    card: 'summary_large_image',
    site: '@matmaxyoga',
    creator: '@matmaxyoga',
    title: 'MatMax Yoga Studio | Premium Yoga Classes in Miraflores, Lima',
    description: 'Transform your wellness journey with MatMax Yoga Studio in Miraflores, Lima. Expert yoga classes and personalized sessions.',
    images: ['/matpass-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  category: 'wellness',
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
        
        {/* Favicon and Desktop Save Image */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="mask-icon" href="/favicon.png" color="#0A0A23" />
        <meta name="msapplication-TileImage" content="/favicon.png" />
        <meta name="msapplication-TileColor" content="#0A0A23" />
        
        {/* Web App Manifest for Desktop Save */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0A0A23" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MatMax Yoga" />
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