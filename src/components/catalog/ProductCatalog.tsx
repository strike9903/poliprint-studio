"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "./ProductGrid";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogSort } from "./CatalogSort";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductCategory } from "@/types";

interface CatalogFilters {
  category?: ProductCategory;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

interface ProductCatalogProps {
  category?: ProductCategory;
}

export function ProductCatalog({ category }: ProductCatalogProps) {
  const [filters, setFilters] = useState<CatalogFilters>({ category });
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', filters, sortBy],
    queryFn: () => fetchProducts(filters),
  });

  const handleFilterChange = (newFilters: Partial<CatalogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Помилка завантаження продукції. Спробуйте оновити сторінку.
        </AlertDescription>
      </Alert>
    );
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
              `Знайдено ${products?.length || 0} товарів`
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
          <ProductGrid products={products || []} />
        )}
      </div>
    </div>
  );
}