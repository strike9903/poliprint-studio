import { StructuredData } from './StructuredData';

interface OrganizationSchemaProps {
  name?: string;
  alternateName?: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
    availableLanguage?: string[];
  };
  sameAs?: string[];
  foundingDate?: string;
  employees?: string;
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string[];
  openingHours?: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
}

export function OrganizationSchema({
  name = 'Poliprint',
  alternateName = 'Поліпринт',
  description = 'Професійна онлайн типографія в Україні. Друк візиток, листівок, холстів, наклейок та інших поліграфічних матеріалів. Високоякісний друк з доставкою по всій Україні.',
  url,
  logo,
  image,
  address,
  contactPoint,
  sameAs = [],
  foundingDate = '2020-01-01',
  employees = '10-50',
  priceRange = '₴₴',
  paymentAccepted = ['Cash', 'Credit Card', 'Bank Transfer', 'LiqPay'],
  currenciesAccepted = ['UAH'],
  openingHours = ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00'],
  geo
}: OrganizationSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.com.ua';
  
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#organization`,
    name,
    alternateName,
    description,
    url: url || baseUrl,
    logo: logo ? `${baseUrl}${logo}` : `${baseUrl}/images/logo.png`,
    image: image ? `${baseUrl}${image}` : `${baseUrl}/images/organization.jpg`,
    
    // Business category
    additionalType: ['https://schema.org/PrintingBusiness', 'https://schema.org/Store'],
    businessFunction: 'https://schema.org/Sell',
    
    // Contact information
    ...(contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: contactPoint.telephone,
        contactType: contactPoint.contactType,
        ...(contactPoint.email && { email: contactPoint.email }),
        availableLanguage: contactPoint.availableLanguage || ['uk', 'ru', 'en'],
        areaServed: {
          '@type': 'Country',
          name: 'Ukraine'
        }
      }
    }),
    
    // Address
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.streetAddress,
        addressLocality: address.addressLocality,
        addressRegion: address.addressRegion,
        postalCode: address.postalCode,
        addressCountry: address.addressCountry
      }
    }),
    
    // Geographic coordinates
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude
      }
    }),
    
    // Business details
    foundingDate,
    numberOfEmployees: employees,
    priceRange,
    paymentAccepted: paymentAccepted.map(payment => `https://schema.org/${payment.replace(' ', '')}`),
    currenciesAccepted,
    openingHours,
    
    // Social media and other links
    ...(sameAs.length > 0 && { sameAs }),
    
    // Services offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог поліграфічних послуг',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Друк візиток',
            description: 'Професійний друк візиток на різних матеріалах'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Друк листівок',
            description: 'Якісний друк рекламних листівок та флаєрів'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Друк на холсті',
            description: 'Художній друк фотографій на холсті'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Виготовлення наклейок',
            description: 'Друк наклейок на вінілі та папері'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Дизайн',
            description: 'Створення дизайну за допомогою штучного інтелекту'
          }
        }
      ]
    },
    
    // Area served
    areaServed: {
      '@type': 'Country',
      name: 'Ukraine',
      alternateName: 'Україна'
    },
    
    // Awards and certifications (if any)
    award: ['Якісний друк 2023', 'Клієнтський вибір 2024'],
    
    // Keywords for better discoverability
    keywords: 'типографія, друк, візитки, листівки, холст, наклейки, поліграфія, дизайн, AI, Київ, Україна',
    
    // Main entity of page
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': baseUrl
    }
  };

  return <StructuredData data={organizationData} id="organization-schema" />;
}