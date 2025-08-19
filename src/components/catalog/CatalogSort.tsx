"use client";

interface CatalogSortProps {
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'newest';
  onSortChange: (value: CatalogSortProps['sortBy']) => void;
}

export function CatalogSort({ sortBy, onSortChange }: CatalogSortProps) {
  return (
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value as CatalogSortProps['sortBy'])}
      className="border rounded-md p-2"
    >
      <option value="popular">За популярністю</option>
      <option value="price-asc">Ціна ↑</option>
      <option value="price-desc">Ціна ↓</option>
      <option value="newest">Нові надходження</option>
    </select>
  );
}
