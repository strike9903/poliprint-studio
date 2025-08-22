import { StructuredData } from './StructuredData';

interface WebSiteSchemaProps {
  name?: string;
  alternateName?: string;
  description?: string;
  url?: string;
  author?: string;
  publisher?: string;
  inLanguage?: string[];
  keywords?: string;
  potentialAction?: {
    searchUrl: string;
    queryInput: string;
  };
}

export function WebSiteSchema({
  name = 'Poliprint - Онлайн типографія',
  alternateName = 'Поліпринт',
  description = 'Професійна онлайн типографія в Україні. Друк візиток, листівок, холстів, наклейок. AI конфігуратор дизайну. Швидка доставка по всій Україні.',
  url,
  author = 'Poliprint Team',
  publisher = 'Poliprint',
  inLanguage = ['uk', 'ru'],
  keywords = 'типографія, друк, візитки, листівки, холст, наклейки, поліграфія, дизайн, AI конфігуратор, онлайн друк, Київ, Україна',
  potentialAction
}: WebSiteSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.com.ua';
  
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name,
    alternateName,
    description,
    url: url || baseUrl,
    inLanguage,
    keywords,
    
    // Author and publisher
    author: {
      '@type': 'Organization',
      name: author,
      url: baseUrl
    },
    
    publisher: {
      '@type': 'Organization',
      name: publisher,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    
    // Search functionality
    potentialAction: potentialAction || {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform'
        ]
      },
      'query-input': 'required name=search_term_string'
    },
    
    // Additional navigation actions
    mainEntity: {
      '@type': 'ItemList',
      name: 'Основні розділи',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Каталог',
          url: `${baseUrl}/catalog`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI Конфігуратор',
          url: `${baseUrl}/configurator`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Шаблони',
          url: `${baseUrl}/templates`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Блог',
          url: `${baseUrl}/blog`
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Контакти',
          url: `${baseUrl}/contacts`
        }
      ]
    },
    
    // Same as organization
    sameAs: [
      'https://www.facebook.com/poliprint',
      'https://www.instagram.com/poliprint',
      'https://t.me/poliprint',
      'https://www.linkedin.com/company/poliprint'
    ],
    
    // Accessibility and technical details
    accessibilityFeature: [
      'alternativeText',
      'keyboardNavigation',
      'readingOrder',
      'structuralNavigation'
    ],
    
    accessibilityHazard: 'none',
    accessibilityControl: ['fullKeyboardControl', 'fullMouseControl', 'fullTouchControl'],
    
    // Audience
    audience: [
      {
        '@type': 'Audience',
        audienceType: 'Business',
        geographicArea: {
          '@type': 'Country',
          name: 'Ukraine'
        }
      },
      {
        '@type': 'Audience',
        audienceType: 'Individual',
        geographicArea: {
          '@type': 'Country',
          name: 'Ukraine'
        }
      }
    ],
    
    // Site features
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Professional Certificate',
      name: 'Сертифікована типографія'
    },
    
    // Offers aggregate
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Поліграфічні послуги',
      itemListElement: [
        {
          '@type': 'Offer',
          category: 'Printing Services',
          name: 'Друк візиток',
          priceRange: '₴50-₴500'
        },
        {
          '@type': 'Offer',
          category: 'Printing Services', 
          name: 'Друк листівок',
          priceRange: '₴100-₴1000'
        },
        {
          '@type': 'Offer',
          category: 'Printing Services',
          name: 'Друк на холсті',
          priceRange: '₴200-₴2000'
        }
      ]
    }
  };

  return <StructuredData data={websiteData} id="website-schema" />;
}