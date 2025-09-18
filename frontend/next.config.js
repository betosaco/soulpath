import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Enable experimental features if needed
  },
  // Content Security Policy configuration
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Base CSP directives
    const baseDirectives = [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://static.micuentaweb.pe https://static.lyra.com",
      "font-src 'self' https://fonts.gstatic.com https://static.micuentaweb.pe https://static.lyra.com",
      "img-src 'self' data: https: blob:",
      `connect-src 'self' ${isDevelopment ? 'http://localhost:* ws://localhost:* ' : ''}https://*.vercel.app https://matmax.world https://www.matmax.world https://static.micuentaweb.pe https://static.lyra.com https://secure.lyra.com https://secure.micuentaweb.pe https://h.online-metrix.net https://h64.online-metrix.net`,
      "frame-src 'self' https://static.micuentaweb.pe https://static.lyra.com https://secure.lyra.com https://h.online-metrix.net https://h64.online-metrix.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    // Add script-src with or without unsafe-eval based on environment
    const scriptSrc = isDevelopment 
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.micuentaweb.pe https://static.lyra.com https://secure.lyra.com https://secure.micuentaweb.pe https://h.online-metrix.net https://h64.online-metrix.net"
      : "script-src 'self' 'unsafe-inline' https://static.micuentaweb.pe https://static.lyra.com https://secure.lyra.com https://secure.micuentaweb.pe https://h.online-metrix.net https://h64.online-metrix.net";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [scriptSrc, ...baseDirectives].join('; ')
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    // Configure webpack to handle module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;

