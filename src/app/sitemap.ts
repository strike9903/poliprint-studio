import { MetadataRoute } from 'next'

// Define all static pages and their properties
const staticPages = [
  { path: '', priority: 1.0, changeFreq: 'weekly' as const },
  { path: '/catalog', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/configurator', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/blog', priority: 0.7, changeFreq: 'weekly' as const },
  { path: '/templates', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/contacts', priority: 0.6, changeFreq: 'yearly' as const },
  { path: '/help/tech-requirements', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/help/delivery', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/help/payment', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/help/faq', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/track', priority: 0.4, changeFreq: 'daily' as const },
  { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
]

// Define catalog categories
const catalogCategories = [
  'canvas',
  'acrylic', 
  'business-cards',
  'flyers',
  'stickers',
  'packaging',
  'apparel/tshirts'
]

// Define locales
const locales = ['uk', 'ru']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.ua'
  const currentDate = new Date()
  
  const urls: MetadataRoute.Sitemap = []
  
  // Add static pages for each locale
  staticPages.forEach(page => {
    locales.forEach((locale, index) => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFreq,
        priority: index === 0 ? page.priority : page.priority * 0.9, // Lower priority for secondary locale
      })
    })
  })
  
  // Add catalog category pages
  catalogCategories.forEach(category => {
    locales.forEach((locale, index) => {
      urls.push({
        url: `${baseUrl}/${locale}/catalog/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: index === 0 ? 0.7 : 0.6,
      })
    })
  })
  
  // Add mock product pages (in real app, fetch from database)
  const mockProducts = [
    { category: 'canvas', slugs: ['canvas-30x40', 'canvas-40x50', 'canvas-50x70'] },
    { category: 'acrylic', slugs: ['acrylic-30x30', 'acrylic-40x40', 'acrylic-50x50'] },
    { category: 'business-cards', slugs: ['standard-cards', 'premium-cards', 'luxury-cards'] },
    { category: 'stickers', slugs: ['vinyl-stickers', 'paper-stickers', 'transparent-stickers'] }
  ]
  
  mockProducts.forEach(productGroup => {
    productGroup.slugs.forEach(slug => {
      locales.forEach((locale, index) => {
        urls.push({
          url: `${baseUrl}/${locale}/product/${slug}`,
          lastModified: currentDate,
          changeFrequency: 'monthly',
          priority: index === 0 ? 0.6 : 0.5,
        })
      })
    })
  })
  
  // Sort by priority and URL
  return urls.sort((a, b) => {
    if (b.priority !== a.priority) {
      return (b.priority || 0) - (a.priority || 0)
    }
    return a.url.localeCompare(b.url)
  })
}
