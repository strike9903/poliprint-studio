"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MobileDrawer } from './MobileDrawer';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  TrendingUp,
  Star,
  DollarSign,
  Calendar,
  Eye,
  Check,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortOption {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  direction?: 'asc' | 'desc';
}

interface MobileCatalogSortProps {
  currentSort: string;
  onSortChange: (sortId: string) => void;
  className?: string;
}

const sortOptions: SortOption[] = [
  {
    id: 'relevance',
    label: 'За релевантністю',
    description: 'Найкращі відповідності',
    icon: TrendingUp
  },
  {
    id: 'price-asc',
    label: 'Ціна: від дешевих',
    description: 'Спочатку найдешевші',
    icon: DollarSign,
    direction: 'asc'
  },
  {
    id: 'price-desc',
    label: 'Ціна: від дорогих',
    description: 'Спочатку найдорожчі',
    icon: DollarSign,
    direction: 'desc'
  },
  {
    id: 'rating',
    label: 'За рейтингом',
    description: 'Найкращі оцінки',
    icon: Star
  },
  {
    id: 'newest',
    label: 'Найновіші',
    description: 'Останні надходження',
    icon: Calendar
  },
  {
    id: 'popular',
    label: 'Популярні',
    description: 'Найчастіше купують',
    icon: Eye
  }
];

export function MobileCatalogSort({
  currentSort,
  onSortChange,
  className
}: MobileCatalogSortProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = sortOptions.find(option => option.id === currentSort);

  const handleSortSelect = (sortId: string) => {
    onSortChange(sortId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        className={cn("h-9 px-3 gap-2", className)}
        onClick={() => setIsOpen(true)}
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden sm:inline">
          {currentOption?.label || 'Сортування'}
        </span>
        <span className="sm:hidden">
          Сортування
        </span>
      </Button>

      {/* Sort Drawer */}
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Сортування"
        snapPoints={[0.5, 0.8]}
        contentClassName="p-0"
      >
        <div className="space-y-2 p-4">
          {sortOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = option.id === currentSort;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSortSelect(option.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm",
                  isSelected 
                    ? "bg-primary/10 border-primary/30 text-primary shadow-sm" 
                    : "bg-card border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-primary/20" : "bg-muted/50"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Direction Indicator */}
                  {option.direction && (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      isSelected ? "bg-primary/20" : "bg-muted/30"
                    )}>
                      {option.direction === 'asc' ? (
                        <ArrowUp className={cn(
                          "h-3 w-3",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )} />
                      ) : (
                        <ArrowDown className={cn(
                          "h-3 w-3",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )} />
                      )}
                    </div>
                  )}

                  {/* Selected Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mx-4 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-xs text-muted-foreground text-center">
            Сортування впливає на порядок відображення товарів у каталозі
          </div>
        </div>
      </MobileDrawer>
    </>
  );
}