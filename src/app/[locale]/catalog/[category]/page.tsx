import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

// Mock data for products
const mockProducts = [
  { id: 1, slug: 'canvas-1', title: 'Холст 30x40 см', priceFrom: 450, category: 'canvas' },
  { id: 2, slug: 'canvas-2', title: 'Холст 40x50 см', priceFrom: 550, category: 'canvas' },
  { id: 3, slug: 'canvas-3', title: 'Холст 50x70 см', priceFrom: 750, category: 'canvas' },
  { id: 4, slug: 'acrylic-1', title: 'Акрил 30x30 см', priceFrom: 350, category: 'acrylic' },
  { id: 5, slug: 'acrylic-2', title: 'Акрил 40x40 см', priceFrom: 450, category: 'acrylic' },
  { id: 6, slug: 'biz-card-1', title: 'Візитки (100 шт)', priceFrom: 120, category: 'business-cards' },
  { id: 7, slug: 'biz-card-2', title: 'Візитки преміум (100 шт)', priceFrom: 220, category: 'business-cards' },
  { id: 8, slug: 'brochure-1', title: 'Брошура А4 (100 шт)', priceFrom: 300, category: 'brochures' },
  { id: 9, slug: 'sticker-1', title: 'Наліпки А4 (100 шт)', priceFrom: 150, category: 'stickers' },
  { id: 10, slug: 'poster-1', title: 'Постер А2', priceFrom: 200, category: 'posters' },
];

// Category metadata mapping
const categoryMetadata: Record<string, { title: string; description: string; keywords: string }> = {
  canvas: {
    title: 'Друк на холсті - Професійна печать на хлопковому холсті',
    description: 'Якісний друк на натуральному холсті від 450₴. Різні розміри та варіанти оформлення. Швидка доставка по Україні.',
    keywords: 'друк на холсті, холст, принт, печать на холсті, фото на холсті, картина на холсті'
  },
  acrylic: {
    title: 'Друк на акрилі - Яскраві принти на акрилічному склі',
    description: 'Преміальний друк на акрилічному склі від 350₴. Яскраві кольори, глянцева поверхня, сучасний стиль.',
    keywords: 'друк на акрилі, акрил, акрилічне скло, фото на акрилі, сучасний принт'
  },
  'business-cards': {
    title: 'Візитки - Професійний друк візиток на якісному папері',
    description: 'Елегантні візитки від 120₴ за 100 штук. Різні види паперу, ламінування, тиснення. Швидке виконання.',
    keywords: 'візитки, друк візиток, професійні візитки, бізнес картки, дизайн візиток'
  },
  stickers: {
    title: 'Наклейки - Самоклеючі етикетки та стікери',
    description: 'Якісні наклейки та етикетки від 150₴. Різні форми, розміри та матеріали. Водостійкі варіанти.',
    keywords: 'наклейки, стікери, етикетки, самоклеючі наклейки, друк наклейок'
  },
  flyers: {
    title: 'Листівки - Рекламні та інформаційні матеріали',
    description: 'Яскраві листівки та флаєри від 200₴. Професійний дизайн, якісний папір, швидке виготовлення.',
    keywords: 'листівки, флаєри, рекламні матеріали, поліграфія, друк листівок'
  },
  packaging: {
    title: 'Упаковка - Картонна упаковка та коробки',
    description: 'Картонна упаковка та коробки від 100₴. Різні розміри, дизайн під замовлення, еко-матеріали.',
    keywords: 'упаковка, коробки, картонна упаковка, дизайн упаковки, еко упаковка'
  }
};

interface CategoryPageProps {
  params: { locale: string; category: string };
}

// Generate metadata for category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = params;
  const categoryData = categoryMetadata[category];
  
  if (!categoryData) {
    return generateSEOMetadata({
      title: `${category} - Poliprint`,
      description: `Професійний друк ${category} - якість, швидкість, доступні ціни`,
      url: `/${locale}/catalog/${category}`,
      locale,
      alternateLocales: ['uk', 'ru'],
      type: 'website'
    });
  }
  
  return generateSEOMetadata({
    ...categoryData,
    url: `/${locale}/catalog/${category}`,
    locale,
    alternateLocales: ['uk', 'ru'],
    type: 'website',
    image: `/images/og-${category}.jpg`
  });
}

export default async function CategoryPage({ params: { locale, category } }: CategoryPageProps) {
  const t = await getTranslations('CategoryPage');
  
  // Filter products by category
  const products = mockProducts.filter(product => product.category === category);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold capitalize">{category}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id}
            href={`/${locale}/product/${product.slug}`}
            className="block p-6 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-muted-foreground">
              {t('priceFrom')} {product.priceFrom} ₴
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}