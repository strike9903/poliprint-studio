import { Metadata } from 'next';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'in stock' | 'out of stock' | 'preorder';
  locale?: string;
  alternateLocales?: string[];
  noIndex?: boolean;
  canonical?: string;
}

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  price,
  availability,
  locale = 'uk',
  alternateLocales = ['uk', 'ru'],
  noIndex = false,
  canonical
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.com.ua';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/images/og-default.jpg`;
  const siteName = 'Poliprint - Онлайн типографія';
  
  // Base metadata
  const metadata: Metadata = {
    title: {
      default: title,
      template: `%s | ${siteName}`
    },
    description,
    ...(keywords && { keywords }),
    ...(author && { 
      authors: [{ name: author, url: baseUrl }] 
    }),
    ...(canonical && { 
      alternates: { 
        canonical: canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`
      }
    }),
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    
    // Open Graph
    openGraph: {
      type: type === 'product' ? 'website' : type,
      title,
      description,
      url: fullUrl,
      siteName,
      locale,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      ...(alternateLocales && {
        alternateLocale: alternateLocales.filter(l => l !== locale)
      }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags && { tags })
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@poliprint',
      creator: '@poliprint',
      images: [fullImage],
    },
    
    // Additional meta tags
    other: {
      'application-name': siteName,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': siteName,
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-TileColor': '#2563eb',
      'msapplication-tap-highlight': 'no',
      'theme-color': '#2563eb',
      'DC.language': locale,
      'DC.creator': 'Poliprint',
      'DC.publisher': 'Poliprint',
      'DC.subject': keywords || 'типографія, друк, поліграфія',
      'geo.region': 'UA',
      'geo.placename': 'Ukraine',
      'ICBM': '50.4501, 30.5234', // Kyiv coordinates
      ...(price && {
        'product:price:amount': price.amount.toString(),
        'product:price:currency': price.currency,
        'product:availability': availability || 'in stock'
      })
    },
    
    // Verification tags (will be set via env)
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: {
        ...(process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION && {
          'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION
        }),
        ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION && {
          'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        }),
      }
    }
  };

  // Add product-specific meta tags
  if (type === 'product' && price) {
    // Filter out undefined values
    const currentOther = Object.fromEntries(
      Object.entries(metadata.other || {}).filter(([_, value]) => value !== undefined)
    );
    
    metadata.other = {
      ...currentOther,
      'product:retailer_item_id': url?.split('/').pop() || '',
      'product:price:amount': price.amount.toString(),
      'product:price:currency': price.currency,
      'product:availability': availability || 'in stock',
      'product:condition': 'new',
      'product:retailer': 'Poliprint',
      'product:brand': 'Poliprint'
    };
  }

  // Add article-specific meta tags
  if (type === 'article') {
    // Filter out undefined values
    const currentOther = Object.fromEntries(
      Object.entries(metadata.other || {}).filter(([_, value]) => value !== undefined)
    );
    
    metadata.other = {
      ...currentOther,
      'article:author': author || 'Poliprint',
      'article:publisher': baseUrl,
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      ...(section && { 'article:section': section }),
      ...(tags && { 'article:tag': tags.join(', ') })
    };
  }

  return metadata;
}

// Predefined metadata for common pages
export const defaultMetadata = {
  home: {
    title: 'Poliprint - Професійна онлайн типографія в Україні',
    description: 'Професійний друк візиток, листівок, холстів, наклейок та інших поліграфічних матеріалів. AI конфігуратор дизайну. Швидка доставка по всій Україні від 45₴.',
    keywords: 'типографія, друк, візитки, листівки, холст, наклейки, поліграфія, дизайн, AI конфігуратор, онлайн друк, доставка, Київ, Україна',
    image: '/images/og-home.jpg'
  },
  
  catalog: {
    title: 'Каталог поліграфічних послуг - Poliprint',
    description: 'Повний каталог поліграфічних послуг: друк візиток, листівок, наклейок, холстів, упаковки та багато іншого. Професійна якість за доступними цінами.',
    keywords: 'каталог, поліграфія, друк, візитки, листівки, наклейки, холст, упаковка, ціни',
    image: '/images/og-catalog.jpg'
  },
  
  configurator: {
    title: 'AI Конфігуратор дизайну - Створюйте дизайн з штучним інтелектом',
    description: 'Революційний AI конфігуратор для створення унікальних дизайнів. Аналіз зображень, розумні рекомендації, автоматична оптимізація під друк.',
    keywords: 'AI конфігуратор, штучний інтелект, дизайн, машинне навчання, автоматизація, TensorFlow',
    image: '/images/og-configurator.jpg'
  },
  
  checkout: {
    title: 'Оформлення замовлення - Poliprint',
    description: 'Оформіть замовлення швидко та безпечно. Зручні способи оплати, доставка Новою Поштою по всій Україні.',
    keywords: 'замовлення, оформлення, оплата, доставка, безпека',
    noIndex: true
  },
  
  profile: {
    title: 'Особистий кабінет - Poliprint',
    description: 'Керуйте своїми замовленнями, збереженими проектами та налаштуваннями в особистому кабінеті.',
    keywords: 'профіль, кабінет, замовлення, проекти',
    noIndex: true
  }
};

// Helper function to generate breadcrumb-based title
export function generateBreadcrumbTitle(segments: string[]): string {
  if (segments.length <= 1) return 'Poliprint';
  
  const titles = segments.map(segment => {
    const titleMap: Record<string, string> = {
      'catalog': 'Каталог',
      'canvas': 'Холст',
      'acrylic': 'Акрил',
      'business-cards': 'Візитки',
      'flyers': 'Листівки',
      'stickers': 'Наклейки',
      'packaging': 'Упаковка',
      'configurator': 'AI Конфігуратор',
      'templates': 'Шаблони',
      'blog': 'Блог',
      'help': 'Довідка',
      'profile': 'Профіль',
      'checkout': 'Оформлення замовлення'
    };
    
    return titleMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  });
  
  return titles.reverse().join(' • ');
}