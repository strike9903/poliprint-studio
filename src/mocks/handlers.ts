import { http, HttpResponse } from 'msw';
import type { 
  Product, 
  CartItem, 
  Order, 
  PricingRequest, 
  PricingResponse,
  NovaPoshtaCity,
  NovaPoshtaWarehouse,
  Template,
  BlogPost,
  User
} from '@/types';

// Mock data
const products: Product[] = [
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
    configSchema: {
      type: 'canvas',
      fields: [
        {
          id: 'size',
          type: 'select',
          label: { ua: 'Розмір', ru: 'Размер' },
          required: true,
          options: [
            { value: '30x40', label: { ua: '30×40 см', ru: '30×40 см' } },
            { value: '40x60', label: { ua: '40×60 см', ru: '40×60 см' } },
            { value: '60x90', label: { ua: '60×90 см', ru: '60×90 см' } },
            { value: 'custom', label: { ua: 'Довільний', ru: 'Произвольный' } }
          ],
          defaultValue: '40x60'
        },
        {
          id: 'edge',
          type: 'radio',
          label: { ua: 'Обробка країв', ru: 'Обработка краев' },
          required: true,
          options: [
            { value: 'gallery', label: { ua: 'Галерейна', ru: 'Галерейная' } },
            { value: 'mirror', label: { ua: 'Дзеркальна', ru: 'Зеркальная' } },
            { value: 'solid', label: { ua: 'Суцільний колір', ru: 'Сплошной цвет' } }
          ],
          defaultValue: 'gallery'
        }
      ]
    },
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
    configSchema: {
      type: 'acrylic',
      fields: [
        {
          id: 'thickness',
          type: 'select',
          label: { ua: 'Товщина', ru: 'Толщина' },
          required: true,
          options: [
            { value: '3mm', label: { ua: '3 мм', ru: '3 мм' } },
            { value: '5mm', label: { ua: '5 мм', ru: '5 мм' } },
            { value: '8mm', label: { ua: '8 мм', ru: '8 мм' } },
            { value: '10mm', label: { ua: '10 мм', ru: '10 мм' } }
          ],
          defaultValue: '5mm'
        }
      ]
    },
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
    configSchema: {
      type: 'business-cards',
      fields: [
        {
          id: 'quantity',
          type: 'select',
          label: { ua: 'Тираж', ru: 'Тираж' },
          required: true,
          options: [
            { value: '100', label: { ua: '100 шт', ru: '100 шт' } },
            { value: '250', label: { ua: '250 шт', ru: '250 шт' } },
            { value: '500', label: { ua: '500 шт', ru: '500 шт' } },
            { value: '1000', label: { ua: '1000 шт', ru: '1000 шт' } }
          ],
          defaultValue: '250'
        }
      ]
    },
    techSpecs: {},
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const cities: NovaPoshtaCity[] = [
  {
    ref: '8d5a980d-391c-11dd-90d9-001a92567626',
    description: 'Київ',
    area: 'Київська',
    areaDescription: 'Київська область'
  },
  {
    ref: 'db5c88e0-391c-11dd-90d9-001a92567626',
    description: 'Харків',
    area: 'Харківська',
    areaDescription: 'Харківська область'
  },
  {
    ref: 'db5c88f0-391c-11dd-90d9-001a92567626',
    description: 'Одеса',
    area: 'Одеська',
    areaDescription: 'Одеська область'
  }
];

const warehouses: NovaPoshtaWarehouse[] = [
  {
    ref: '1ec09d88-e1c2-11e3-8c4a-0050568002cf',
    description: 'Відділення №1: вул. Хрещатик, 22',
    shortAddress: 'Хрещатик, 22',
    number: '1',
    cityRef: '8d5a980d-391c-11dd-90d9-001a92567626'
  },
  {
    ref: '6a6bbfed-f95f-11e4-a77c-005056887b8d',
    description: 'Відділення №2: вул. Антоновича, 45',
    shortAddress: 'Антоновича, 45',
    number: '2',
    cityRef: '8d5a980d-391c-11dd-90d9-001a92567626'
  }
];

const templates: Template[] = [
  {
    id: 'template-1',
    title: {
      ua: 'Класичні візитки',
      ru: 'Классические визитки'
    },
    description: {
      ua: 'Елегантний дизайн для бізнесу',
      ru: 'Элегантный дизайн для бизнеса'
    },
    category: 'business-cards',
    tags: ['business', 'elegant', 'classic'],
    previewUrl: '/api/placeholder/400/240',
    isPremium: false,
    downloads: 1250,
    rating: 4.8,
    createdAt: '2024-01-01'
  }
];

const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'how-to-prepare-design-for-print',
    title: {
      ua: 'Як підготувати макет до друку',
      ru: 'Как подготовить макет к печати'
    },
    excerpt: {
      ua: 'Повний гайд по підготовці макетів',
      ru: 'Полный гайд по подготовке макетов'
    },
    content: {
      ua: 'Детальна стаття про підготовку макетів...',
      ru: 'Подробная статья о подготовке макетов...'
    },
    coverImage: '/api/placeholder/800/400',
    author: 'Команда Poliprint',
    tags: ['design', 'tutorial', 'print'],
    publishedAt: '2024-01-15',
    isPublished: true
  }
];

let orders: Order[] = [];
let cartItems: CartItem[] = [];

export const handlers = [
  // Products
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let filteredProducts = products;
    if (category) {
      filteredProducts = products.filter(p => p.category === category);
    }
    
    return HttpResponse.json({
      data: filteredProducts,
      success: true
    });
  }),

  http.get('/api/products/:slug', ({ params }) => {
    const product = products.find(p => p.slug === params.slug);
    if (!product) {
      return HttpResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: product,
      success: true
    });
  }),

  // Pricing
  http.post('/api/pricing/calc', async ({ request }) => {
    const body = await request.json() as PricingRequest;
    
    const response: PricingResponse = {
      items: body.items.map(item => ({
        productId: item.productId,
        unitPrice: 350, // Mock price calculation
        quantity: item.quantity || 1,
        totalPrice: 350 * (item.quantity || 1)
      })),
      subtotal: 350 * body.items.length,
      discount: 0,
      shipping: 50,
      total: 350 * body.items.length + 50,
      currency: 'UAH',
      breakdown: [
        {
          label: { ua: 'Матеріал', ru: 'Материал' },
          amount: 300,
          type: 'base'
        },
        {
          label: { ua: 'Опції', ru: 'Опции' },
          amount: 50,
          type: 'option'
        },
        {
          label: { ua: 'Доставка', ru: 'Доставка' },
          amount: 50,
          type: 'shipping'
        }
      ]
    };
    
    return HttpResponse.json(response);
  }),

  // Cart
  http.get('/api/cart', () => {
    return HttpResponse.json({
      data: cartItems,
      success: true
    });
  }),

  http.post('/api/cart', async ({ request }) => {
    const newItem = await request.json() as CartItem;
    cartItems.push(newItem);
    
    return HttpResponse.json({
      data: newItem,
      success: true
    });
  }),

  // Nova Poshta
  http.get('/api/np/cities', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    
    const filteredCities = cities.filter(city => 
      city.description.toLowerCase().includes(search.toLowerCase())
    );
    
    return HttpResponse.json({
      data: filteredCities,
      success: true
    });
  }),

  http.get('/api/np/warehouses', ({ request }) => {
    const url = new URL(request.url);
    const cityRef = url.searchParams.get('cityRef');
    
    const filteredWarehouses = warehouses.filter(w => w.cityRef === cityRef);
    
    return HttpResponse.json({
      data: filteredWarehouses,
      success: true
    });
  }),

  // Templates
  http.get('/api/templates', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let filteredTemplates = templates;
    if (category) {
      filteredTemplates = templates.filter(t => t.category === category);
    }
    
    return HttpResponse.json({
      data: filteredTemplates,
      success: true
    });
  }),

  // Blog
  http.get('/api/blog', () => {
    return HttpResponse.json({
      data: blogPosts,
      success: true
    });
  }),

  http.get('/api/blog/:slug', ({ params }) => {
    const post = blogPosts.find(p => p.slug === params.slug);
    if (!post) {
      return HttpResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: post,
      success: true
    });
  }),

  // Auth
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    // Mock authentication
    if (email === 'admin@poliprint.ua' && password === 'admin') {
      const user: User = {
        id: '1',
        email,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        addresses: [],
        preferences: {
          language: 'ua',
          currency: 'UAH',
          notifications: { email: true, sms: false }
        },
        createdAt: '2024-01-01'
      };
      
      return HttpResponse.json({
        user,
        token: 'mock-jwt-token',
        success: true
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Orders
  http.post('/api/orders', async ({ request }) => {
    const orderData = await request.json() as Partial<Order>;
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: `PL${Date.now()}`,
      status: 'pending',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shippingCost: orderData.shippingCost || 0,
      discount: orderData.discount || 0,
      total: orderData.total || 0,
      currency: 'UAH',
      customer: orderData.customer || { email: '', phone: '' },
      shippingInfo: orderData.shippingInfo || {
        method: 'novaposhta-branch',
        address: { city: '', area: '' },
        cost: 0,
        estimatedDays: 1
      },
      payment: orderData.payment || {
        method: 'liqpay',
        status: 'pending'
      },
      timeline: orderData.timeline || [],
      trackingNumber: orderData.trackingNumber,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    return HttpResponse.json({
      data: newOrder,
      success: true
    });
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const order = orders.find(o => o.id === params.id);
    if (!order) {
      return HttpResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: order,
      success: true
    });
  }),

  // File upload mock
  http.post('/api/upload/init', () => {
    return HttpResponse.json({
      uploadId: Math.random().toString(36).substr(2, 9),
      signedParts: []
    });
  }),

  // Preflight check mock
  http.post('/api/preflight/check', () => {
    return HttpResponse.json({
      ok: true,
      issues: [],
      dpi: 300,
      bleed: true,
      pages: 1
    });
  })
];