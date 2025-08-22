"use client";

import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, Clock, Star, Truck, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CatalogSortProps {
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'delivery' | 'in-stock';
  onSortChange: (value: CatalogSortProps['sortBy']) => void;
}

export function CatalogSort({ sortBy, onSortChange }: CatalogSortProps) {
  const sortOptions = [
    { 
      value: 'popular', 
      label: 'За популярністю', 
      icon: TrendingUp,
      description: 'Найбільш замовлювані товари'
    },
    { 
      value: 'price-asc', 
      label: 'Ціна: від дешевих', 
      icon: ArrowUp,
      description: 'Спочатку недорогі товари'
    },
    { 
      value: 'price-desc', 
      label: 'Ціна: від дорогих', 
      icon: ArrowDown,
      description: 'Спочатку дорогі товари'
    },
    { 
      value: 'newest', 
      label: 'Нові надходження', 
      icon: Clock,
      description: 'Останні додані товари'
    },
    { 
      value: 'rating', 
      label: 'За рейтингом', 
      icon: Star,
      description: 'Найвищі оцінки клієнтів'
    },
    { 
      value: 'delivery', 
      label: 'За швидкістю виконання', 
      icon: Truck,
      description: 'Найшвидше виготовлення'
    },
    { 
      value: 'in-stock', 
      label: 'Наявні в наявності', 
      icon: CheckCircle,
      description: 'Готові до відправки'
    },
  ];

  const currentOption = sortOptions.find(option => option.value === sortBy);

  return (
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-[240px] h-10">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <SelectValue placeholder="Оберіть сортування" />
        </div>
      </SelectTrigger>
      <SelectContent className="w-[300px]">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value} className="py-3">
              <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </div>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
