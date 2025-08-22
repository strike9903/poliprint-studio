import { NextRequest } from 'next/server';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  // Filter products by category if provided
  const products = category 
    ? mockProducts.filter(product => product.category === category)
    : mockProducts;

  return Response.json({ data: products, success: true });
}