"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { MobileDrawer } from './MobileDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'color' | 'size' | 'rating';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterValues {
  [key: string]: string[] | number[];
}

interface MobileCatalogFiltersProps {
  filters: FilterSection[];
  values: FilterValues;
  onFiltersChange: (values: FilterValues) => void;
  activeFiltersCount: number;
  className?: string;
}

export function MobileCatalogFilters({
  filters,
  values,
  onFiltersChange,
  activeFiltersCount,
  className
}: MobileCatalogFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['price', 'category']);
  const [searchTerm, setSearchTerm] = useState('');
  const [localValues, setLocalValues] = useState<FilterValues>(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const updateFilter = (filterId: string, value: string[] | number[]) => {
    const newValues = { ...localValues, [filterId]: value };
    setLocalValues(newValues);
  };

  const applyFilters = () => {
    onFiltersChange(localValues);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const resetValues: FilterValues = {};
    filters.forEach(filter => {
      if (filter.type === 'range') {
        resetValues[filter.id] = [filter.min || 0, filter.max || 100];
      } else {
        resetValues[filter.id] = [];
      }
    });
    setLocalValues(resetValues);
    onFiltersChange(resetValues);
  };

  const getActiveFiltersForSection = (sectionId: string): number => {
    const sectionValues = localValues[sectionId] || [];
    if (Array.isArray(sectionValues)) {
      return sectionValues.length;
    }
    return 0;
  };

  const filteredOptions = (options: FilterOption[]) => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        className="relative h-9 px-3 gap-2"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">Фільтри</span>
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0 min-w-[1.25rem] h-5">
                {activeFiltersCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Filter Drawer */}
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Фільтри"
        snapPoints={[0.4, 0.7, 0.95]}
        contentClassName="p-0"
      >
        <div className="flex flex-col h-full">
          {/* Search in filters */}
          <div className="p-4 pb-2 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Пошук в фільтрах..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-lg border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>

          {/* Filters List */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {filters.map((filter) => {
                const isExpanded = expandedSections.includes(filter.id);
                const activeCount = getActiveFiltersForSection(filter.id);

                return (
                  <motion.div
                    key={filter.id}
                    layout
                    className="space-y-3"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(filter.id)}
                      className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{filter.title}</h3>
                        {activeCount > 0 && (
                          <Badge className="bg-primary/10 text-primary text-xs px-1.5 py-0">
                            {activeCount}
                          </Badge>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    {/* Section Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-3 space-y-2">
                            {filter.type === 'range' && (
                              <div className="space-y-4 py-2">
                                <div className="px-2">
                                  <Slider
                                    value={localValues[filter.id] as number[] || [filter.min || 0, filter.max || 100]}
                                    onValueChange={(value) => updateFilter(filter.id, value)}
                                    min={filter.min || 0}
                                    max={filter.max || 100}
                                    step={filter.step || 1}
                                    className="w-full"
                                  />
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground px-2">
                                  <span>{(localValues[filter.id] as number[])?.[0] || filter.min}₴</span>
                                  <span>{(localValues[filter.id] as number[])?.[1] || filter.max}₴</span>
                                </div>
                              </div>
                            )}

                            {filter.type === 'checkbox' && filter.options && (
                              <div className="space-y-3">
                                {filteredOptions(filter.options).map((option) => {
                                  const isChecked = (localValues[filter.id] as string[] || []).includes(option.id);
                                  
                                  return (
                                    <div key={option.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/30 transition-colors">
                                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <Checkbox
                                          checked={isChecked}
                                          onCheckedChange={(checked) => {
                                            const currentValues = (localValues[filter.id] as string[]) || [];
                                            const newValues = checked
                                              ? [...currentValues, option.id]
                                              : currentValues.filter(id => id !== option.id);
                                            updateFilter(filter.id, newValues);
                                          }}
                                        />
                                        <span className="text-sm">{option.label}</span>
                                      </label>
                                      {option.count && (
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                          {option.count}
                                        </Badge>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {filter.type === 'color' && filter.options && (
                              <div className="grid grid-cols-8 gap-2 p-2">
                                {filteredOptions(filter.options).map((option) => {
                                  const isSelected = (localValues[filter.id] as string[] || []).includes(option.id);
                                  
                                  return (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        const currentValues = (localValues[filter.id] as string[]) || [];
                                        const newValues = isSelected
                                          ? currentValues.filter(id => id !== option.id)
                                          : [...currentValues, option.id];
                                        updateFilter(filter.id, newValues);
                                      }}
                                      className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-all",
                                        isSelected ? "border-primary shadow-lg scale-110" : "border-border hover:scale-105"
                                      )}
                                      style={{ backgroundColor: option.color }}
                                      title={option.label}
                                    />
                                  );
                                })}
                              </div>
                            )}

                            {filter.type === 'size' && filter.options && (
                              <div className="grid grid-cols-4 gap-2 p-2">
                                {filteredOptions(filter.options).map((option) => {
                                  const isSelected = (localValues[filter.id] as string[] || []).includes(option.id);
                                  
                                  return (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        const currentValues = (localValues[filter.id] as string[]) || [];
                                        const newValues = isSelected
                                          ? currentValues.filter(id => id !== option.id)
                                          : [...currentValues, option.id];
                                        updateFilter(filter.id, newValues);
                                      }}
                                      className={cn(
                                        "px-3 py-2 text-sm font-medium rounded-lg border transition-all",
                                        isSelected 
                                          ? "bg-primary text-primary-foreground border-primary" 
                                          : "bg-background border-border hover:bg-muted/50"
                                      )}
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {filter.type === 'rating' && filter.options && (
                              <div className="space-y-2 p-2">
                                {filteredOptions(filter.options).map((option) => {
                                  const isSelected = (localValues[filter.id] as string[] || []).includes(option.id);
                                  
                                  return (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        const currentValues = (localValues[filter.id] as string[]) || [];
                                        const newValues = isSelected
                                          ? currentValues.filter(id => id !== option.id)
                                          : [...currentValues, option.id];
                                        updateFilter(filter.id, newValues);
                                      }}
                                      className={cn(
                                        "flex items-center gap-2 w-full p-2 rounded-lg transition-colors",
                                        isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"
                                      )}
                                    >
                                      <div className="flex text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <span key={i} className={i < parseInt(option.id) ? "text-yellow-400" : "text-muted"}>
                                            ★
                                          </span>
                                        ))}
                                      </div>
                                      <span className="text-sm">{option.label}</span>
                                      {option.count && (
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-auto">
                                          {option.count}
                                        </Badge>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {filter !== filters[filters.length - 1] && (
                      <Separator className="opacity-30" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="p-4 border-t border-border/50 bg-background">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetFilters}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Скинути
              </Button>
              <Button
                className="flex-1"
                onClick={applyFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Застосувати
              </Button>
            </div>
          </div>
        </div>
      </MobileDrawer>
    </>
  );
}