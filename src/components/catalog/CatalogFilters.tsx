"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface CatalogFiltersProps {
  categories: FilterOption[];
  materials: FilterOption[];
  formats: FilterOption[];
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

export function CatalogFilters({
  categories,
  materials,
  formats,
  onFiltersChange,
  activeFilters
}: CatalogFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const handleCategoryChange = (categoryId: string) => {
    const currentCategories = activeFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id: string) => id !== categoryId)
      : [...currentCategories, categoryId];
    
    onFiltersChange({
      ...activeFilters,
      categories: newCategories
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    setPriceRange([0, 5000]);
  };

  const activeFiltersCount = 
    (activeFilters.categories?.length || 0) +
    (activeFilters.materials?.length || 0) +
    (activeFilters.formats?.length || 0);

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Активні фільтри</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                Очистити все
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {activeFilters.categories?.map((categoryId: string) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Badge key={categoryId} variant="secondary" className="gap-1">
                    {category.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleCategoryChange(categoryId)}
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Категорії</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={activeFilters.categories?.includes(category.id) || false}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                >
                  {category.label}
                </label>
                {category.count && (
                  <span className="text-xs text-muted-foreground">
                    {category.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ціна</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={5000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{priceRange[0]} ₴</span>
              <span>{priceRange[1]} ₴</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}