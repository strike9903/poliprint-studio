"use client";

import { Search, Filter, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface CatalogFiltersProps {
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    search?: string;
    material?: string;
    size?: string;
    finish?: string;
    urgency?: string;
    printType?: string;
    inStock?: boolean;
    rating?: number;
  };
  onFilterChange: (filters: Partial<CatalogFiltersProps["filters"]>) => void;
}

export function CatalogFilters({ filters, onFilterChange }: CatalogFiltersProps) {
  const categories = [
    { id: 'canvas', name: 'Холст', icon: '🖼️' },
    { id: 'acrylic', name: 'Акрил', icon: '💎' },
    { id: 'business-cards', name: 'Візитки', icon: '💼' },
    { id: 'brochures', name: 'Брошури', icon: '📖' },
    { id: 'stickers', name: 'Наклейки', icon: '🏷️' },
    { id: 'posters', name: 'Постери', icon: '📄' },
    { id: 'apparel', name: 'Одяг', icon: '👕' },
    { id: 'packaging', name: 'Упаковка', icon: '📦' },
    { id: 'flyers', name: 'Листівки', icon: '📋' },
  ];

  const materials = [
    { id: 'canvas', name: 'Холст', icon: '🖼️', description: 'Художній холст' },
    { id: 'acrylic', name: 'Акрил', icon: '💎', description: 'Акрилове скло' },
    { id: 'paper', name: 'Папір', icon: '📄', description: 'Звичайний папір' },
    { id: 'photo-paper', name: 'Фотопапір', icon: '📸', description: 'Глянцевий фотопапір' },
    { id: 'vinyl', name: 'Віниловий', icon: '🏷️', description: 'Водостійкий вініл' },
    { id: 'cotton', name: 'Бавовна', icon: '👕', description: '100% бавовна' },
    { id: 'cardboard', name: 'Картон', icon: '📦', description: 'Щільний картон' },
  ];

  const sizes = [
    { id: 'A0', name: 'A0', description: '84×119 см' },
    { id: 'A1', name: 'A1', description: '59×84 см' },
    { id: 'A2', name: 'A2', description: '42×59 см' },
    { id: 'A3', name: 'A3', description: '30×42 см' },
    { id: 'A4', name: 'A4', description: '21×30 см' },
    { id: 'A5', name: 'A5', description: '15×21 см' },
    { id: '30x40', name: '30×40 см', description: 'Стандартний' },
    { id: '40x60', name: '40×60 см', description: 'Популярний' },
    { id: '50x70', name: '50×70 см', description: 'Великий' },
    { id: '60x90', name: '60×90 см', description: 'XL розмір' },
    { id: '90x50', name: '90×50 мм', description: 'Візитка' },
    { id: 'S-3XL', name: 'S-3XL', description: 'Розміри одягу' },
    { id: 'custom', name: 'Нестандартний', description: 'Індивідуальний розмір' },
  ];

  const finishes = [
    { id: 'none', name: 'Без обробки', icon: '📄', description: 'Стандартна якість' },
    { id: 'lamination', name: 'Ламінація', icon: '✨', description: 'Матова або глянцева' },
    { id: 'foil', name: 'Фольгування', icon: '🌟', description: 'Золота/срібна фольга' },
    { id: 'gloss', name: 'Глянець', icon: '💎', description: 'Глянцеве покриття' },
    { id: 'gallery-wrap', name: 'Галерейна кромка', icon: '🖼️', description: 'Натягування на підрамник' },
    { id: 'face-mount', name: 'Face-mount', icon: '🔳', description: 'Монтаж на акрил' },
    { id: 'dtf', name: 'DTF друк', icon: '👕', description: 'Direct-to-Film' },
    { id: 'glue', name: 'Клеєва обробка', icon: '📚', description: 'Клейове скріплення' },
  ];

  const urgencyOptions = [
    { id: 'standard', name: 'Стандарт', icon: '📅', description: '3-5 днів', color: 'text-green-600' },
    { id: 'fast', name: 'Швидко', icon: '⚡', description: '1-2 дні', color: 'text-orange-600' },
    { id: 'express', name: 'Експрес', icon: '🚀', description: 'До 24 годин', color: 'text-red-600' },
  ];

  const printTypes = [
    { id: 'digital', name: 'Цифровий', icon: '🖨️', description: 'Швидкий цифровий друк' },
    { id: 'offset', name: 'Офсетний', icon: '🎯', description: 'Високоякісний офсетний друк' },
    { id: 'wide-format', name: 'Широкоформатний', icon: '📐', description: 'Великий формат друку' },
    { id: 'dtf', name: 'DTF', icon: '👕', description: 'Direct-to-Film для текстилю' },
  ];

  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      priceMin: value[0],
      priceMax: value[1]
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: undefined,
      priceMin: undefined,
      priceMax: undefined,
      search: undefined,
      material: undefined,
      size: undefined,
      finish: undefined,
      urgency: undefined,
      printType: undefined,
      inStock: undefined,
      rating: undefined
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.search,
    filters.material,
    filters.size,
    filters.finish,
    filters.urgency,
    filters.printType,
    filters.inStock,
    filters.rating
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Modern Header with Glass Effect */}
      <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Фільтри</h2>
              <p className="text-xs text-muted-foreground">Знайдіть ідеальний продукт</p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        {/* Quick Clear Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full border-dashed hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Очистити все ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Smart Search */}
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-xl rounded-2xl border border-blue-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Швидкий пошук</span>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Введіть назву продукту..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
            className="pl-12 h-12 rounded-xl border-0 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg transition-all duration-200"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/60 backdrop-blur-xl rounded-2xl border border-purple-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs">📁</span>
          </div>
          <span className="font-semibold text-purple-900">Категорії</span>
        </div>
        
        <div className="space-y-3">
          <Button
            variant={!filters.category ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange({ category: undefined })}
            className={`w-full justify-start h-11 rounded-xl transition-all duration-200 ${
              !filters.category 
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg' 
                : 'hover:bg-white/80 backdrop-blur-sm'
            }`}
          >
            <span className="mr-3 text-lg">🌟</span>
            Всі категорії
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filters.category === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange({ 
                category: filters.category === category.id ? undefined : category.id 
              })}
              className={`w-full justify-start h-11 rounded-xl transition-all duration-200 ${
                filters.category === category.id
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg' 
                  : 'hover:bg-white/80 backdrop-blur-sm'
              }`}
            >
              <span className="mr-3 text-lg">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range with Modern Slider */}
      <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-xl rounded-2xl border border-green-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white text-xs">💰</span>
          </div>
          <span className="font-semibold text-green-900">Ціновий діапазон</span>
        </div>
        
        <div className="space-y-5">
          <div className="px-3">
            <Slider
              value={[filters.priceMin || 0, filters.priceMax || 1000]}
              min={0}
              max={1000}
              step={50}
              onValueChange={handlePriceChange}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="price-min" className="text-xs font-medium text-green-800">Від</Label>
              <Input
                id="price-min"
                type="number"
                value={filters.priceMin || ""}
                onChange={(e) => onFilterChange({ 
                  priceMin: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="0"
                className="h-10 rounded-lg border-0 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="price-max" className="text-xs font-medium text-green-800">До</Label>
              <Input
                id="price-max"
                type="number"
                value={filters.priceMax || ""}
                onChange={(e) => onFilterChange({ 
                  priceMax: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="1000"
                className="h-10 rounded-lg border-0 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Materials Filter */}
      <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/60 backdrop-blur-xl rounded-2xl border border-blue-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white text-xs">🧱</span>
          </div>
          <span className="font-semibold text-blue-900">Матеріали</span>
        </div>
        
        <div className="space-y-2">
          <Button
            variant={!filters.material ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange({ material: undefined })}
            className={`w-full justify-start h-10 rounded-xl transition-all duration-200 ${
              !filters.material 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                : 'hover:bg-white/80 backdrop-blur-sm'
            }`}
          >
            <span className="mr-3 text-lg">🌈</span>
            Всі матеріали
          </Button>
          
          {materials.map((material) => (
            <Button
              key={material.id}
              variant={filters.material === material.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange({ 
                material: filters.material === material.id ? undefined : material.id 
              })}
              className={`w-full justify-start h-10 rounded-xl transition-all duration-200 ${
                filters.material === material.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                  : 'hover:bg-white/80 backdrop-blur-sm'
              }`}
            >
              <span className="mr-3 text-lg">{material.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{material.name}</span>
                <span className="text-xs opacity-80">{material.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/60 backdrop-blur-xl rounded-2xl border border-indigo-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xs">📏</span>
          </div>
          <span className="font-semibold text-indigo-900">Розміри</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((size) => (
            <Button
              key={size.id}
              variant={filters.size === size.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange({ 
                size: filters.size === size.id ? undefined : size.id 
              })}
              className={`h-12 rounded-xl transition-all duration-200 ${
                filters.size === size.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg border-0' 
                  : 'border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium text-xs">{size.name}</span>
                <span className="text-xs opacity-80">{size.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Finish Types Filter */}
      <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/60 backdrop-blur-xl rounded-2xl border border-rose-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs">✨</span>
          </div>
          <span className="font-semibold text-rose-900">Обробка</span>
        </div>
        
        <div className="space-y-2">
          {finishes.map((finish) => (
            <Button
              key={finish.id}
              variant={filters.finish === finish.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange({ 
                finish: filters.finish === finish.id ? undefined : finish.id 
              })}
              className={`w-full justify-start h-10 rounded-xl transition-all duration-200 ${
                filters.finish === finish.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' 
                  : 'hover:bg-white/80 backdrop-blur-sm'
              }`}
            >
              <span className="mr-3 text-lg">{finish.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{finish.name}</span>
                <span className="text-xs opacity-80">{finish.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Urgency Filter */}
      <div className="bg-gradient-to-br from-red-50/80 to-orange-50/60 backdrop-blur-xl rounded-2xl border border-red-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <span className="text-white text-xs">⏰</span>
          </div>
          <span className="font-semibold text-red-900">Терміни виготовлення</span>
        </div>
        
        <div className="space-y-2">
          {urgencyOptions.map((urgency) => (
            <Button
              key={urgency.id}
              variant={filters.urgency === urgency.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange({ 
                urgency: filters.urgency === urgency.id ? undefined : urgency.id 
              })}
              className={`w-full justify-start h-10 rounded-xl transition-all duration-200 ${
                filters.urgency === urgency.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                  : 'hover:bg-white/80 backdrop-blur-sm'
              }`}
            >
              <span className="mr-3 text-lg">{urgency.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{urgency.name}</span>
                <span className={`text-xs ${urgency.color}`}>{urgency.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Print Types Filter */}
      <div className="bg-gradient-to-br from-slate-50/80 to-gray-50/60 backdrop-blur-xl rounded-2xl border border-slate-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-500 to-gray-500 flex items-center justify-center">
            <span className="text-white text-xs">🖨️</span>
          </div>
          <span className="font-semibold text-slate-900">Тип друку</span>
        </div>
        
        <div className="space-y-2">
          {printTypes.map((printType) => (
            <Button
              key={printType.id}
              variant={filters.printType === printType.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange({ 
                printType: filters.printType === printType.id ? undefined : printType.id 
              })}
              className={`w-full justify-start h-10 rounded-xl transition-all duration-200 ${
                filters.printType === printType.id
                  ? 'bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg' 
                  : 'hover:bg-white/80 backdrop-blur-sm'
              }`}
            >
              <span className="mr-3 text-lg">{printType.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{printType.name}</span>
                <span className="text-xs opacity-80">{printType.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Rating and Stock Filter */}
      <div className="bg-gradient-to-br from-yellow-50/80 to-amber-50/60 backdrop-blur-xl rounded-2xl border border-yellow-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
            <span className="text-white text-xs">⭐</span>
          </div>
          <span className="font-semibold text-yellow-900">Якість та наявність</span>
        </div>
        
        <div className="space-y-3">
          {/* Rating Filter */}
          <div>
            <Label htmlFor="rating-filter" className="text-xs font-medium text-yellow-800 mb-2 block">
              Мінімальний рейтинг
            </Label>
            <Slider
              value={[filters.rating || 0]}
              min={0}
              max={5}
              step={0.1}
              onValueChange={(value) => onFilterChange({ rating: value[0] > 0 ? value[0] : undefined })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-yellow-600 mt-1">
              <span>0⭐</span>
              <span className="font-medium">{filters.rating ? `${filters.rating.toFixed(1)}⭐+` : 'Будь-який'}</span>
              <span>5⭐</span>
            </div>
          </div>

          {/* In Stock Filter */}
          <Button
            variant={filters.inStock ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange({ inStock: filters.inStock ? undefined : true })}
            className={`w-full justify-start h-10 rounded-xl transition-all duration-200 ${
              filters.inStock
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg border-0' 
                : 'border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300'
            }`}
          >
            <CheckCircle className="mr-3 w-4 h-4" />
            Тільки в наявності
          </Button>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="bg-gradient-to-br from-orange-50/80 to-yellow-50/60 backdrop-blur-xl rounded-2xl border border-orange-100/50 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
            <span className="text-white text-xs">⚡</span>
          </div>
          <span className="font-semibold text-orange-900">Швидкі фільтри</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange({ priceMin: 0, priceMax: 200 })}
            className="rounded-full border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
          >
            💸 До 200₴
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange({ urgency: 'express' })}
            className="rounded-full border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
          >
            🚀 Експрес
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange({ inStock: true })}
            className="rounded-full border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
          >
            ✅ В наявності
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange({ rating: 4.5 })}
            className="rounded-full border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
          >
            ⭐ Топ рейтинг
          </Button>
        </div>
      </div>
    </div>
  );
}
