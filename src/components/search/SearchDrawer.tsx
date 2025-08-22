"use client";

import { useState, useEffect, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, Sparkles, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: string;
  href: string;
  image: string;
  type: 'product' | 'page' | 'category';
}

export function SearchDrawer({ isOpen, onClose, children }: SearchDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search data
  const searchData: SearchResult[] = [
    // Products
    { id: '1', title: 'Друк на холсті 60×90', description: 'Високоякісний друк фото на художньому холсті', category: 'Холст', price: 'від 750 ₴', href: '/catalog/canvas', image: '🖼️', type: 'product' },
    { id: '2', title: 'Акрил з підсвіткою 40×60', description: 'Преміум друк на акрилі з LED підсвіткою', category: 'Акрил', price: 'від 650 ₴', href: '/catalog/acrylic', image: '💎', type: 'product' },
    { id: '3', title: 'Візитки преміум', description: 'Візитки з ламінацією та спецефектами', category: 'Візитки', price: 'від 120 ₴', href: '/catalog/business-cards', image: '💼', type: 'product' },
    { id: '4', title: 'DTF друк на футболках', description: 'Якісний друк на футболках новою технологією', category: 'Одяг', price: 'від 150 ₴', href: '/apparel/tshirts', image: '👕', type: 'product' },
    { id: '5', title: 'Листівки та флаєри', description: 'Рекламні матеріали високої якості', category: 'Поліграфія', price: 'від 15 ₴', href: '/catalog/flyers', image: '📄', type: 'product' },
    { id: '6', title: 'Упаковка під замовлення', description: 'Коробки, пакети, етикетки за вашим дизайном', category: 'Упаковка', price: 'від 45 ₴', href: '/catalog/packaging', image: '📦', type: 'product' },
    
    // Pages
    { id: '7', title: 'AI Конфігуратор', description: 'Розумний підбір параметрів друку', category: 'Інструменти', href: '/configurator', image: '🤖', type: 'page' },
    { id: '8', title: 'Портфоліо робіт', description: 'Наші кращі роботи та проекти', category: 'Галерея', href: '/portfolio', image: '🖼️', type: 'page' },
    { id: '9', title: 'Шаблони дизайну', description: 'Готові макети для ваших проектів', category: 'Ресурси', href: '/templates', image: '📋', type: 'page' },
    { id: '10', title: 'Блог та статті', description: 'Корисні поради про друк', category: 'Контент', href: '/blog', image: '📰', type: 'page' },
    
    // Categories
    { id: '11', title: 'Каталог продукції', description: 'Всі наші послуги друку', category: 'Навігація', href: '/catalog', image: '📚', type: 'category' },
  ];

  const popularSearches = [
    'холст', 'візитки', 'акрил', 'футболки', 'листівки', 'упаковка', 'конфігуратор'
  ];

  const trendingSearches = [
    'DTF друк', 'LED підсвітка', 'галерейна кромка', 'тиснення фольгою'
  ];

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return searchData.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results
  }, [searchQuery]);

  // Simulate search delay
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to search history
      const updatedHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      
      // Here you would typically trigger actual search or navigation
      console.log('Searching for:', query);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearch(result.title);
    onClose();
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <>
      {children}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:w-[600px] p-0 flex flex-col">
          <SheetHeader className="space-y-4 p-6 pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-heading flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary-foreground" />
                </div>
                Пошук
              </SheetTitle>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Пошук товарів, послуг, статей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 pb-6">
            {!searchQuery.trim() ? (
              // Default state - show suggestions and history
              <div className="space-y-6">
                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Останні пошуки
                      </h3>
                      <Button variant="ghost" size="sm" onClick={clearHistory}>
                        Очистити
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((query, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => handleQuickSearch(query)}
                        >
                          {query}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Популярні запити
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((query, index) => (
                      <Badge
                        key={index}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => handleQuickSearch(query)}
                      >
                        {query}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Trending */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Популярно зараз
                  </h3>
                  <div className="space-y-2">
                    {trendingSearches.map((query, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => handleQuickSearch(query)}
                      >
                        <span className="text-sm">{query}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Access */}
                <div>
                  <h3 className="font-semibold text-sm mb-3">Швидкий доступ</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/configurator" onClick={onClose}>
                      <Card className="card-elegant cursor-pointer hover:shadow-glow">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">🤖</div>
                          <div className="text-sm font-medium">AI Конфігуратор</div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link href="/catalog" onClick={onClose}>
                      <Card className="card-elegant cursor-pointer hover:shadow-glow">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">📚</div>
                          <div className="text-sm font-medium">Каталог</div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // Search results
              <div className="space-y-4">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Знайдено {searchResults.length} результатів
                      </span>
                    </div>
                    
                    {searchResults.map((result) => (
                      <Card
                        key={result.id}
                        className="card-elegant cursor-pointer hover:shadow-glow"
                        onClick={() => handleResultClick(result)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">{result.image}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm mb-1 line-clamp-1">
                                    {result.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {result.description}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {result.category}
                                    </Badge>
                                    {result.price && (
                                      <span className="text-xs font-medium text-primary">
                                        {result.price}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Нічого не знайдено</h3>
                    <p className="text-sm text-muted-foreground">
                      Спробуйте змінити запит або скористайтеся популярними пошуками
                    </p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Quick Actions Footer */}
          <div className="p-6 pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="/catalog" onClick={onClose}>
                  Каталог
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/configurator" onClick={onClose}>
                  Конфігуратор
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/portfolio" onClick={onClose}>
                  Портфоліо
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
