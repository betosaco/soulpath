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
    optimizeCss: false, // Disable CSS optimization to prevent purging issues
  },
  // Enable CSS generation but prevent differences
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Note: swcMinify is deprecated in Next.js 15+, minification is handled by webpack config
  // Disable CSS optimization completely
  webpack: (config, { dev: _dev, isServer }) => {
    // Configure webpack to handle module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };

    // Configure CSS handling to prevent differences between localhost and production
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false, // Disable minification to prevent differences
        usedExports: false, // Disable tree shaking
        sideEffects: false, // Disable side effects detection
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            styles: {
              name: 'styles',
              test: /\.(css|scss|sass)$/,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };

      // Add performance hints to reduce preload warnings
      config.performance = {
        ...config.performance,
        hints: false, // Disable performance hints that can cause preload warnings
      };
      
      // Disable CSS optimization plugins that cause differences
      config.plugins = config.plugins.filter(plugin => {
        return !plugin.constructor.name.includes('CssMinimizer') && 
               !plugin.constructor.name.includes('OptimizeCssAssets');
      });
    }

    return config;
  },
  // Optimize bundle and prevent preload warnings
  // Disable webpack bundle analyzer warnings
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Content Security Policy and CORS configuration
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Base CSP directives
    const baseDirectives = [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      `connect-src 'self' ${isDevelopment ? 'http://localhost:* ws://localhost:* ' : ''}https://*.vercel.app https://matmax.world https://www.matmax.world https://api.stripe.com https://js.stripe.com https://static.micuentaweb.pe`,
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.vercel.app https://checkout.stripe.com",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    // Add script-src with payment providers and unsafe-eval for production
    const scriptSrc = isDevelopment
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://static.micuentaweb.pe"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://static.micuentaweb.pe";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [scriptSrc, ...baseDirectives].join('; ')
          },
          // CORS headers for all routes
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-User-Id, X-User-Email, X-User-Role'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
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
};

export default nextConfig;

