import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.ua'
  
  return {
    rules: [
      // Main rules for search engines
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/checkout',
          '/profile',
          '/order-success',
          '/*?*utm_*',  // Block UTM parameters
          '/*?*fbclid*', // Block Facebook click IDs
          '/*?*gclid*',  // Block Google click IDs
          '/*/search?*', // Block search result pages
        ],
        crawlDelay: 1
      },
      // Specific rules for Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/checkout',
          '/profile',
          '/order-success'
        ],
      },
      // Rules for Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/checkout',
          '/profile'
        ],
        crawlDelay: 2
      },
      // Rules for Yandex (popular in Ukraine)
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/checkout',
          '/profile'
        ],
        crawlDelay: 1
      },
      // Block specific bots
      {
        userAgent: 'MJ12bot',
        disallow: '/'
      },
      {
        userAgent: 'AhrefsBot',
        disallow: '/'
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/'
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`
    ],
    host: baseUrl
  }
}
