"use client";

import { useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogSort } from "./CatalogSort";
import { Skeleton } from "@/components/ui/skeleton";

// Расширенные данные продуктов с дополнительными атрибутами
const mockProducts = [
  { 
    id: 1, slug: 'canvas-30x40', title: 'Холст 30x40 см з галерейною кромкою', 
    priceFrom: 450, category: 'canvas', popular: true, rating: 4.8,
    material: 'canvas', size: '30x40', finish: 'gallery-wrap', urgency: 'standard',
    printType: 'wide-format', description: 'Професійний фотодрук на художньому холсті',
    deliveryDays: 3, inStock: true
  },
  { 
    id: 2, slug: 'canvas-40x60', title: 'Холст 40x60 см преміум якість', 
    priceFrom: 650, category: 'canvas', rating: 4.9,
    material: 'canvas', size: '40x60', finish: 'gallery-wrap', urgency: 'standard',
    printType: 'wide-format', description: 'Преміум якість друку на холсті',
    deliveryDays: 2, inStock: true
  },
  { 
    id: 3, slug: 'canvas-60x90', title: 'Холст 60x90 см для великих фото', 
    priceFrom: 850, category: 'canvas', new: true, rating: 4.7,
    material: 'canvas', size: '60x90', finish: 'gallery-wrap', urgency: 'express',
    printType: 'wide-format', description: 'Великоформатний друк на холсті',
    deliveryDays: 1, inStock: true
  },
  { 
    id: 4, slug: 'acrylic-30x30', title: 'Акрил 30x30 см з підсвіткою', 
    priceFrom: 350, category: 'acrylic', popular: true, rating: 4.9,
    material: 'acrylic', size: '30x30', finish: 'none', urgency: 'standard',
    printType: 'digital', description: 'Сучасний друк на акриловому склі',
    deliveryDays: 3, inStock: true
  },
  { 
    id: 5, slug: 'acrylic-40x40', title: 'Акрил 40x40 см face-mount', 
    priceFrom: 450, category: 'acrylic', rating: 4.6,
    material: 'acrylic', size: '40x40', finish: 'face-mount', urgency: 'fast',
    printType: 'digital', description: 'Face-mount технологія для акрилу',
    deliveryDays: 2, inStock: true
  },
  { 
    id: 6, slug: 'acrylic-50x70', title: 'Акрил 50x70 см товщина 8мм', 
    priceFrom: 680, category: 'acrylic', rating: 4.8,
    material: 'acrylic', size: '50x70', finish: 'none', urgency: 'standard',
    printType: 'digital', description: 'Товстий акрил для преміум проектів',
    deliveryDays: 4, inStock: false
  },
  { 
    id: 7, slug: 'biz-card-classic', title: 'Візитки класичні (100 шт)', 
    priceFrom: 120, category: 'business-cards', popular: true, rating: 4.7,
    material: 'paper', size: '90x50', finish: 'none', urgency: 'express',
    printType: 'digital', description: 'Класичні візитки на якісному картоні',
    deliveryDays: 1, inStock: true
  },
  { 
    id: 8, slug: 'biz-card-premium', title: 'Візитки преміум з ламінацією (100 шт)', 
    priceFrom: 220, category: 'business-cards', rating: 4.8,
    material: 'paper', size: '90x50', finish: 'lamination', urgency: 'fast',
    printType: 'digital', description: 'Преміум візитки з матовою ламінацією',
    deliveryDays: 2, inStock: true
  },
  { 
    id: 9, slug: 'biz-card-foil', title: 'Візитки з фольгуванням (100 шт)', 
    priceFrom: 320, category: 'business-cards', new: true, rating: 4.9,
    material: 'paper', size: '90x50', finish: 'foil', urgency: 'standard',
    printType: 'offset', description: 'Ексклюзивні візитки з золотим фольгуванням',
    deliveryDays: 5, inStock: true
  },
  { 
    id: 10, slug: 'brochure-a4', title: 'Брошура А4 на скобі (100 шт)', 
    priceFrom: 300, category: 'brochures', rating: 4.5,
    material: 'paper', size: 'A4', finish: 'none', urgency: 'standard',
    printType: 'offset', description: 'Багатосторінкові брошури зі скріпленням',
    deliveryDays: 3, inStock: true
  },
  { 
    id: 11, slug: 'brochure-a5', title: 'Брошура А5 на клею (200 шт)', 
    priceFrom: 250, category: 'brochures', rating: 4.6,
    material: 'paper', size: 'A5', finish: 'glue', urgency: 'fast',
    printType: 'digital', description: 'Компактні брошури на клейовому з\'єднанні',
    deliveryDays: 2, inStock: true
  },
  { 
    id: 12, slug: 'sticker-vinyl', title: 'Наліпки вініл (100 шт)', 
    priceFrom: 150, category: 'stickers', rating: 4.7,
    material: 'vinyl', size: 'custom', finish: 'none', urgency: 'express',
    printType: 'digital', description: 'Водостійкі вінілові наклейки',
    deliveryDays: 1, inStock: true
  },
  { 
    id: 13, slug: 'sticker-paper', title: 'Наліпки папір глянець (500 шт)', 
    priceFrom: 200, category: 'stickers', rating: 4.4,
    material: 'paper', size: 'custom', finish: 'gloss', urgency: 'standard',
    printType: 'digital', description: 'Глянцеві паперові наклейки',
    deliveryDays: 2, inStock: true
  },
  { 
    id: 14, slug: 'poster-a1', title: 'Постер А1 на фотопапері', 
    priceFrom: 180, category: 'posters', rating: 4.6,
    material: 'photo-paper', size: 'A1', finish: 'gloss', urgency: 'fast',
    printType: 'wide-format', description: 'Якісні постери на фотопапері',
    deliveryDays: 1, inStock: true
  },
  { 
    id: 15, slug: 'poster-a0', title: 'Постер А0 широкоформатний', 
    priceFrom: 280, category: 'posters', rating: 4.8,
    material: 'paper', size: 'A0', finish: 'none', urgency: 'standard',
    printType: 'wide-format', description: 'Великоформатні постери для реклами',
    deliveryDays: 2, inStock: true
  },
  {
    id: 16, slug: 'tshirt-dtf-white', title: 'DTF друк на білій футболці',
    priceFrom: 150, category: 'apparel', new: true, rating: 4.9,
    material: 'cotton', size: 'S-3XL', finish: 'dtf', urgency: 'express',
    printType: 'dtf', description: 'Якісний DTF друк на 100% бавовні',
    deliveryDays: 1, inStock: true
  },
  {
    id: 17, slug: 'package-box-custom', title: 'Коробка під замовлення',
    priceFrom: 45, category: 'packaging', popular: true, rating: 4.7,
    material: 'cardboard', size: 'custom', finish: 'lamination', urgency: 'standard',
    printType: 'offset', description: 'Індивідуальна упаковка з вашим дизайном',
    deliveryDays: 7, inStock: true
  },
  {
    id: 18, slug: 'flyer-a5-premium', title: 'Листівки А5 преміум (1000 шт)',
    priceFrom: 200, category: 'flyers', rating: 4.6,
    material: 'paper', size: 'A5', finish: 'lamination', urgency: 'fast',
    printType: 'offset', description: 'Промо-листівки з матовою ламінацією',
    deliveryDays: 2, inStock: true
  }
];

interface CatalogFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  material?: string;
  size?: string;
  finish?: string;
  urgency?: string;
  printType?: string;
  inStock?: boolean;
  rating?: number;
}

interface ProductCatalogProps {
  locale: string;
}

export function ProductCatalog({ locale }: ProductCatalogProps) {
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'delivery' | 'in-stock'>('popular');
  const [isLoading] = useState(false);

  const handleFilterChange = (newFilters: Partial<CatalogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Расширенная фильтрация продуктов
  let filteredProducts = mockProducts;
  
  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => p.category === filters.category);
  }
  
  if (filters.search) {
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
      p.description.toLowerCase().includes(filters.search!.toLowerCase())
    );
  }
  
  if (filters.priceMin) {
    filteredProducts = filteredProducts.filter(p => p.priceFrom >= filters.priceMin!);
  }
  
  if (filters.priceMax) {
    filteredProducts = filteredProducts.filter(p => p.priceFrom <= filters.priceMax!);
  }
  
  if (filters.material) {
    filteredProducts = filteredProducts.filter(p => p.material === filters.material);
  }
  
  if (filters.size) {
    filteredProducts = filteredProducts.filter(p => p.size === filters.size);
  }
  
  if (filters.finish) {
    filteredProducts = filteredProducts.filter(p => p.finish === filters.finish);
  }
  
  if (filters.urgency) {
    filteredProducts = filteredProducts.filter(p => p.urgency === filters.urgency);
  }
  
  if (filters.printType) {
    filteredProducts = filteredProducts.filter(p => p.printType === filters.printType);
  }
  
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(p => p.inStock === true);
  }
  
  if (filters.rating) {
    filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
  }

  // Расширенная сортировка продуктов
  switch (sortBy) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.priceFrom - b.priceFrom);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.priceFrom - a.priceFrom);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'delivery':
      filteredProducts.sort((a, b) => a.deliveryDays - b.deliveryDays);
      break;
    case 'in-stock':
      filteredProducts.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
      break;
    case 'popular':
    default:
      filteredProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      break;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters sidebar */}
      <div className="lg:col-span-1">
        <CatalogFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      {/* Main content */}
      <div className="lg:col-span-3">
        {/* Sort and results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              `Знайдено ${filteredProducts.length} товарів`
            )}
          </p>
          
          <CatalogSort 
            sortBy={sortBy} 
            onSortChange={setSortBy}
          />
        </div>
        
        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={filteredProducts} locale={locale} />
        )}
      </div>
    </div>
  );
}