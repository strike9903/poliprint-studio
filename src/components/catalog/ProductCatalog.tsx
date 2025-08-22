"use client";

import { useState, useEffect } from 'react';
import { ProductGrid } from './ProductGrid';
import { CatalogFilters } from './CatalogFilters';
import { CatalogSort } from './CatalogSort';
import { Product, CatalogFilters as CatalogFiltersType } from '@/types';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface ProductCatalogProps {
  locale: string;
}

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
  },
  {
    id: 3,
    slug: 'business-cards-100',
    title: 'Візитки (100 шт)',
    description: 'Класичні візитки з ламінацією',
    basePrice: 120,
    currency: 'UAH',
    category: 'business-cards',
    images: ['/placeholder-cards.jpg'],
    tags: ['fast'],
    rating: 4.7,
    isPopular: true,
    inStock: true,
    deliveryDays: 1,
    material: 'Картон',
    configSchema: {
      type: 'business-cards',
      version: '1.0',
      fields: []
    },
    options: [],
    metadata: {}
  }
];

const mockFilterData = {
  categories: [
    { id: 'canvas', label: 'Холсти', count: 12 },
    { id: 'acrylic', label: 'Акрил', count: 8 },
    { id: 'business-cards', label: 'Візитки', count: 15 },
    { id: 'flyers', label: 'Листівки', count: 20 }
  ],
  materials: [
    { id: 'canvas', label: 'Холст', count: 12 },
    { id: 'acrylic', label: 'Акрил', count: 8 },
    { id: 'paper', label: 'Папір', count: 35 }
  ],
  formats: [
    { id: 'a4', label: 'A4', count: 25 },
    { id: 'a3', label: 'A3', count: 18 },
    { id: 'custom', label: 'Власний розмір', count: 40 }
  ]
};

export function ProductCatalog({ locale }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<CatalogFiltersType>({});
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.categories?.length) {
      filtered = filtered.filter(product => 
        filters.categories!.includes(product.category)
      );
    }

    if (filters.search) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        // Sort by isNew flag first, then by id (assuming higher id = newer)
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.id - a.id;
        });
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters, sortBy]);

  const handleFilterChange = (newFilters: Partial<CatalogFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            Фільтри
          </Button>
        </div>

        {/* Sidebar Filters */}
        <div className={`w-full lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <CatalogFilters
            categories={mockFilterData.categories}
            materials={mockFilterData.materials}
            formats={mockFilterData.formats}
            activeFilters={filters}
            onFiltersChange={handleFilterChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Controls */}
          <CatalogSort
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Products Grid */}
          <ProductGrid 
            products={filteredProducts} 
            isLoading={isLoading}
          />

          {/* Results Count */}
          {!isLoading && (
            <div className="mt-8 text-center text-muted-foreground">
              Знайдено {filteredProducts.length} з {products.length} товарів
            </div>
          )}
        </div>
      </div>
    </div>
  );
}