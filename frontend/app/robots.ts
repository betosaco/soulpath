import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/account/',
        '/dashboard/',
        '/_next/',
        '/booking/customer-info',
        '/booking/shipping',
        '/booking/payment',
        '/booking/confirmation',
        '/order-confirmation',
        '/communications/',
        '/ecommerce/',
        '/test-*',
        '/payment-demo',
        '/result',
        '/set-password',
        '/purchase/',
        '/payment/',
      ],
    },
    sitemap: 'https://matmax.world/sitemap.xml',
  }
}
