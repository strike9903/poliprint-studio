import { http, HttpResponse } from 'msw';
import { Product, ApiResponse } from '@/types';

const mockProducts: Product[] = [
  {
    id: 1,
    slug: 'canvas-30x40',
    title: 'Холст 30x40 см',
    description: 'Високоякісний холст для друку з чудовою кольоропередачею',
    basePrice: 450,
    currency: 'UAH',
    category: 'canvas',
    images: ['/placeholder-canvas.jpg'],
    tags: ['popular'],
    rating: 4.8,
    isPopular: true,
    inStock: true,
    deliveryDays: 2,
    material: 'Холст',
    configSchema: {
      type: 'canvas',
      version: '1.0',
      fields: []
    },
    options: [],
    metadata: {}
  },
  {
    id: 2,
    slug: 'acrylic-20x30',
    title: 'Акрил 20x30 см',
    description: 'Преміум друк на акрилі з глибокими кольорами',
    basePrice: 550,
    currency: 'UAH',
    category: 'acrylic',
    images: ['/placeholder-acrylic.jpg'],
    tags: ['premium'],
    rating: 4.9,
    isPopular: true,
    inStock: true,
    deliveryDays: 3,
    material: 'Акрил',
    configSchema: {
      type: 'acrylic',
      version: '1.0',
      fields: []
    },
    options: [],
    metadata: {}
  }
];

export const handlers = [
  // Products API
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let filteredProducts = mockProducts;
    
    if (category) {
      filteredProducts = mockProducts.filter(product => product.category === category);
    }
    
    const response: ApiResponse<Product[]> = {
      success: true,
      data: filteredProducts
    };
    
    return HttpResponse.json(response);
  }),

  http.get('/api/products/:slug', ({ params }) => {
    const { slug } = params;
    const product = mockProducts.find(p => p.slug === slug);
    
    if (!product) {
      return HttpResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<Product> = {
      success: true,
      data: product
    };
    
    return HttpResponse.json(response);
  }),

  // Auth API
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    // Mock authentication
    if (email === 'admin@poliprint.ua' && password === 'admin123') {
      return HttpResponse.json({
        success: true,
        user: {
          id: '1',
          email: 'admin@poliprint.ua',
          name: 'Admin User',
          role: 'admin'
        },
        token: 'mock-jwt-token'
      });
    }
    
    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  })
];