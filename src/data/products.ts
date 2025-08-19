import type { Product } from "@/types";

// Minimal mock products dataset used for API stubs and tests
export const products: Product[] = [
  {
    id: 'canvas-classic',
    slug: 'canvas-classic',
    title: {
      ua: 'Класичний холст',
      ru: 'Классический холст'
    },
    description: {
      ua: 'Високоякісний друк на полотні з підрамником',
      ru: 'Высококачественная печать на холсте с подрамником'
    },
    category: 'canvas',
    basePrice: 350,
    currency: 'UAH',
    images: [
      {
        id: '1',
        url: '/api/placeholder/600/400',
        alt: { ua: 'Холст класичний', ru: 'Холст классический' },
        type: 'gallery',
        order: 1
      }
    ],
    configSchema: { type: 'canvas', fields: [] },
    techSpecs: {},
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'acrylic-premium',
    slug: 'acrylic-premium',
    title: {
      ua: 'Преміум акрил',
      ru: 'Премиум акрил'
    },
    description: {
      ua: 'Друк на акрилі з підсвічуванням',
      ru: 'Печать на акриле с подсветкой'
    },
    category: 'acrylic',
    basePrice: 580,
    currency: 'UAH',
    images: [
      {
        id: '2',
        url: '/api/placeholder/600/400',
        alt: { ua: 'Акрил преміум', ru: 'Акрил премиум' },
        type: 'gallery',
        order: 1
      }
    ],
    configSchema: { type: 'acrylic', fields: [] },
    techSpecs: {},
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'business-cards-premium',
    slug: 'business-cards-premium',
    title: {
      ua: 'Преміум візитки',
      ru: 'Премиум визитки'
    },
    description: {
      ua: 'Візитки на преміум папері з ламінуванням',
      ru: 'Визитки на премиум бумаге с ламинированием'
    },
    category: 'business-cards',
    basePrice: 120,
    currency: 'UAH',
    images: [
      {
        id: '3',
        url: '/api/placeholder/600/400',
        alt: { ua: 'Візитки преміум', ru: 'Визитки премиум' },
        type: 'gallery',
        order: 1
      }
    ],
    configSchema: { type: 'business-cards', fields: [] },
    techSpecs: {},
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];
