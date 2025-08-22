import { StructuredData } from './StructuredData';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string | string[];
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  brand?: string;
  category?: string;
  sku?: string;
  gtin?: string;
  url: string;
  rating?: {
    value: number;
    count: number;
    bestRating?: number;
    worstRating?: number;
  };
  offers?: {
    price: number;
    currency: string;
    availability: string;
    validFrom?: string;
    validThrough?: string;
    priceValidUntil?: string;
  };
  manufacturer?: {
    name: string;
    url?: string;
  };
  additionalProperty?: Array<{
    name: string;
    value: string;
  }>;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'UAH',
  availability = 'InStock',
  condition = 'NewCondition',
  brand = 'Poliprint',
  category,
  sku,
  gtin,
  url,
  rating,
  offers,
  manufacturer,
  additionalProperty
}: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.com.ua';
  
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image.map(img => `${baseUrl}${img}`) : `${baseUrl}${image}`,
    url: `${baseUrl}${url}`,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    ...(category && { category }),
    ...(sku && { sku }),
    ...(gtin && { gtin }),
    condition: `https://schema.org/${condition}`,
    offers: offers || {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: `${baseUrl}${url}`,
      seller: {
        '@type': 'Organization',
        name: 'Poliprint',
        url: baseUrl
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    },
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.value.toString(),
        reviewCount: rating.count.toString(),
        bestRating: (rating.bestRating || 5).toString(),
        worstRating: (rating.worstRating || 1).toString()
      }
    }),
    ...(manufacturer && {
      manufacturer: {
        '@type': 'Organization',
        name: manufacturer.name,
        ...(manufacturer.url && { url: manufacturer.url })
      }
    }),
    ...(additionalProperty && {
      additionalProperty: additionalProperty.map(prop => ({
        '@type': 'PropertyValue',
        name: prop.name,
        value: prop.value
      }))
    }),
    // Additional properties for printing products
    isRelatedTo: {
      '@type': 'Service',
      name: 'Поліграфічні послуги',
      description: 'Професійний друк та дизайн'
    },
    serviceType: 'Printing Services',
    additionalType: 'https://schema.org/Product'
  };

  return <StructuredData data={productData} id="product-schema" />;
}