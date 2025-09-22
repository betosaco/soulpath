import type { Metadata } from 'next';
import { poppins, roboto } from './fonts';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: 'MatMax Yoga Studio',
  description: 'Yoga classes for all levels. Build strength, flexibility, and inner peace with MatMax Yoga Studio.',
  keywords: ['yoga', 'yoga classes', 'wellness', 'meditation', 'flexibility', 'strength', 'balance', 'mindfulness'],
  openGraph: {
    title: 'MatMax Yoga Studio',
    description: 'Yoga classes for all levels. Build strength, flexibility, and inner peace with MatMax Yoga Studio.',
    type: 'website',
    url: 'https://matmax.store',
    siteName: 'MatMax Yoga Studio',
    images: [
      {
        url: '/matmaxstudio.png',
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
    images: ['/matmaxstudio.png'],
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
        <script src="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.js" async></script>
      </head>
      <body className={cn(
        "antialiased",
        poppins.variable,
        roboto.variable
      )}>
        <ThemeProvider initialTheme="light">
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}