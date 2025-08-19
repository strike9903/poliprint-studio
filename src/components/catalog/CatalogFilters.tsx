"use client";

import { ProductCategory } from "@/types";

interface CatalogFiltersProps {
  filters: {
    category?: ProductCategory;
    priceMin?: number;
    priceMax?: number;
    search?: string;
  };
  onFilterChange: (filters: Partial<CatalogFiltersProps["filters"]>) => void;
}

export function CatalogFilters({ filters, onFilterChange }: CatalogFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Category select placeholder */}
      <select
        value={filters.category || ""}
        onChange={(e) => onFilterChange({ category: e.target.value as ProductCategory })}
        className="w-full border rounded-md p-2"
      >
        <option value="">Всі категорії</option>
        <option value="canvas">Холсти</option>
        <option value="acrylic">Акрил</option>
        <option value="business-cards">Візитки</option>
      </select>
    </div>
  );
}
