"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface CatalogSortProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function CatalogSort({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: CatalogSortProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Сортувати" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Популярні</SelectItem>
            <SelectItem value="price-asc">Ціна: від дешевих</SelectItem>
            <SelectItem value="price-desc">Ціна: від дорогих</SelectItem>
            <SelectItem value="newest">Нові</SelectItem>
            <SelectItem value="rating">Рейтинг</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}