"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MobileDrawer } from './MobileDrawer';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Hash,
  Star,
  Package,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'product' | 'category' | 'page';
  title: string;
  description?: string;
  price?: number;
  image?: string;
  href: string;
  category?: string;
  rating?: number;
  isNew?: boolean;
}

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  placeholder?: string;
}

// Mock data for demonstration
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'product',
    title: 'Холст на підрамнику 30×40',
    description: 'Високоякісний друк на художньому холсті',
    price: 350,
    href: '/catalog/canvas/30x40',
    category: 'Холст',
    rating: 4.8,
    isNew: false
  },
  {
    id: '2',
    type: 'product',
    title: 'Акрилове скло 50×70',
    description: 'Сучасний друк на акриловому склі',
    price: 750,
    href: '/catalog/acrylic/50x70',
    category: 'Акрил',
    rating: 4.9,
    isNew: true
  },
  {
    id: '3',
    type: 'category',
    title: 'Візитки',
    description: '15+ варіантів дизайну',
    href: '/catalog/business-cards',
    category: 'Поліграфія'
  },
  {
    id: '4',
    type: 'page',
    title: 'AI Конфігуратор',
    description: 'Створюйте дизайни з штучним інтелектом',
    href: '/configurator'
  }
];

const popularSearches = [
  'холст', 'візитки', 'наклейки', 'футболки', 'акрил', 'листівки'
];

const recentSearches = [
  'холст 40×60', 'візитки преміум', 'наклейки вінілові'
];

export function MobileSearch({
  isOpen,
  onClose,
  locale,
  placeholder = "Пошук товарів, категорій..."
}: MobileSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>(recentSearches);

  const debouncedQuery = useDebounce(query, 300);

  // Simulate search API call
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filteredResults = mockSearchResults.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filteredResults);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() && !recentQueries.includes(searchQuery)) {
      setRecentQueries(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    // Handle search navigation
    onClose();
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentQueries(prev => prev.filter(item => item !== searchToRemove));
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'product': return Package;
      case 'category': return Hash;
      case 'page': return Sparkles;
      default: return Search;
    }
  };

  return (
    <MobileDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Пошук"
      snapPoints={[0.6, 0.9]}
      contentClassName="p-0"
    >
      <div className="flex flex-col h-full">
        {/* Search Input */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={clearQuery}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Search Results */}
            {query && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Результати пошуку</h3>
                  {isLoading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                  )}
                </div>
                
                <AnimatePresence mode="wait">
                  {results.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      {results.map((result, index) => {
                        const Icon = getResultIcon(result.type);
                        
                        return (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={result.href}
                              onClick={() => handleSearch(query)}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                            >
                              <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {result.title}
                                  </h4>
                                  {result.isNew && (
                                    <Badge className="bg-green-500/10 text-green-600 text-xs px-1.5 py-0">
                                      NEW
                                    </Badge>
                                  )}
                                </div>
                                
                                {result.description && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {result.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-2 mt-1">
                                  {result.category && (
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                      {result.category}
                                    </Badge>
                                  )}
                                  {result.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs text-muted-foreground">
                                        {result.rating}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-right flex-shrink-0">
                                {result.price && (
                                  <div className="font-bold text-sm text-primary">
                                    {result.price}₴
                                  </div>
                                )}
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ) : !isLoading && query && (
                    <motion.div
                      key="no-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Нічого не знайдено за запитом "{query}"</p>
                      <p className="text-xs mt-1">Спробуйте змінити ключові слова</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentQueries.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Останні пошуки</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRecentQueries([])}
                    className="text-xs h-auto p-1"
                  >
                    Очистити
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {recentQueries.map((recentQuery) => (
                    <div key={recentQuery} className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="flex-1 justify-start h-auto p-2 text-sm"
                        onClick={() => selectSuggestion(recentQuery)}
                      >
                        <Clock className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                        <span className="truncate">{recentQuery}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 flex-shrink-0"
                        onClick={() => removeRecentSearch(recentQuery)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {!query && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Популярні пошуки</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => selectSuggestion(search)}
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            {!query && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Швидкі посилання</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/catalog"
                    onClick={onClose}
                    className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Каталог</span>
                  </Link>
                  <Link
                    href="/configurator"
                    onClick={onClose}
                    className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">AI Конфігуратор</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </MobileDrawer>
  );
}